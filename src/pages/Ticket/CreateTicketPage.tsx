import { useState, useEffect } from "react";
import Editor from "@components/Editor";
import Input from "@components/Input";
import Select from "@/components/PrioritySelector";
import type { SelectOption } from "@/components/PrioritySelector";
import { usePriorities } from "../../features/ticket/usePriorities";
import { useCreateTicket } from "../../features/ticket/useCreateTicket";

export default function CreateTicketPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  const {
    priorities,
    loading: prioritiesLoading,
    error: prioritiesError,
  } = usePriorities();

  const [priority, setPriority] = useState<SelectOption | undefined>(undefined);

  const {
    createTicket,
    loading: creating,
    error: createError,
    success,
  } = useCreateTicket();

  // Log priorities from API
  console.log("🔥 priorities from API:", priorities);

  // Set default priority when priorities are loaded
  useEffect(() => {
    if (priorities && priorities.length > 0 && !priority) {
      const defaultPriority: SelectOption = {
        id: priorities[0].id as 1 | 2 | 3 | 4,
        label: priorities[0].name,
      };

      console.log("⚡ Setting default priority:", defaultPriority);
      setPriority(defaultPriority);
    }
  }, [priorities, priority]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !priority) return;

    const payload = {
      title,
      body: content,
      priorityId: priority.id,
    };

    console.log("🚀 SUBMIT PAYLOAD:", payload);

    try {
      await createTicket(payload);

      setTitle("");
      setContent("");

      if (priorities.length > 0) {
        const resetPriority: SelectOption = {
          id: priorities[0].id as 1 | 2 | 3 | 4,
          label: priorities[0].name,
        };

        console.log("🔄 Resetting priority:", resetPriority);
        setPriority(resetPriority);
      }

      alert("Ticket submitted!");
    } catch (err) {
      console.log("❌ Submit error:", err);
    }
  };

  // Log selected priority every render
  console.log("🎯 CURRENT SELECTED PRIORITY:", priority);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-3">Create a support ticket</h1>

      <Input
        value={title}
        label="Title"
        placeholder="Enter ticket title"
        className="mb-4"
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Priority
        </label>

        {prioritiesLoading ? (
          <div>Loading priorities...</div>
        ) : prioritiesError ? (
          <div className="text-red-500">{prioritiesError}</div>
        ) : (
          <Select
            className="w-full h-10"
            options={priorities.map((p) => {
              const opt: SelectOption = {
                id: p.id as 1 | 2 | 3 | 4,
                label: p.name,
              };

              console.log("🟦 MAPPED OPTION:", opt);
              return opt;
            })}
            value={priority}
            onChange={(opt) => {
              console.log("🟩 USER SELECTED:", opt);
              setPriority(opt);
            }}
          />
        )}
      </div>

      <Editor
        placeholder="Describe your issue here..."
        content={content}
        setContent={setContent}
      />

      {createError && <div className="text-red-500 mt-2">{createError}</div>}

      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60"
        onClick={handleSubmit}
        disabled={
          creating ||
          prioritiesLoading ||
          !priority ||
          !title.trim() ||
          !content.trim()
        }
      >
        {creating ? "Submitting..." : "Submit the ticket"}
      </button>

      {success && (
        <div className="text-green-600 mt-2">Ticket created successfully!</div>
      )}
    </div>
  );
}
