import { useState, useEffect } from "react";
import Input from "./Input";
import { PencilIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface EditableFieldProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void> | void;
}

export default function EditableField({ label, value, onSave }: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleSave = async () => {
    try {
      await onSave(draft);
      setEditing(false);
      setError(undefined);
      setSaved(true);
      setTimeout(() => setSaved(false), 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Update failed";
      setError(message);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-4 items-start">
        <strong className="w-28 text-gray-700">{label}:</strong>
        {editing ? (
          <div className="flex items-start gap-2 flex-1">
            <Input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1"
              error={error}
            />
            <div className="flex flex-row gap-1 items-start mt-2">
              <button
                onClick={handleSave}
                className="p-1 rounded-md hover:bg-green-100"
              >
                <CheckIcon className="h-5 w-5 text-green-600" />
              </button>
              <button
                onClick={() => {
                  setDraft(value);
                  setEditing(false);
                  setError(undefined);
                }}
                className="p-1 rounded-md hover:bg-red-100"
              >
                <XMarkIcon className="h-5 w-5 text-red-600" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between flex-1">
            <span className="text-gray-900">{value}</span>
            {saved ? (
              <CheckIcon className="h-5 w-5 text-green-600" />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <PencilIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
