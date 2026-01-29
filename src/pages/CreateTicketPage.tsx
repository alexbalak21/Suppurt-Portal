import { useState } from "react";
import Editor from "../components/Editor";
import { Input } from "../components";
import Select from "../components/Select";
import type {SelectOption }from "../components/Select";  


export default function CreateTicketPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");

  // Mock priorities
  const priorities: SelectOption[] = [
    { id: 1, label: "Low" },
    { id: 2, label: "Medium" },
    { id: 3, label: "High" },
    { id: 4, label: "Critical" },
  ];

  // Add missing state for priority
  const [priority, setPriority] = useState<SelectOption>(priorities[0]);

  // Placeholder for submit handler
  const handleSubmit = () => {
    // TODO: Implement ticket submission logic
    alert("Ticket submitted!");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-3">Create a support ticket</h1>
      <Input value={title} label="Title" placeholder="Enter ticket title" className="mb-4" onChange={e => setTitle(e.target.value)} />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
        <div className="max-w-xs">
          <Select
            options={priorities}
            value={priority}
            onChange={setPriority}
          />
        </div>
      </div>
      <Editor
      placeholder="Describe your issue here..."
        content={content}
        setContent={setContent}
      />
      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        onClick={handleSubmit}
      >
        Submit the ticket
      </button>
    </div>
  );
}
