import { useState, useEffect } from "react";
import Editor from "../../components/Editor";
import { Input } from "../../components";
import Select from "../../components/Select";
import type { SelectOption } from "../../components/Select";
import { usePriorities } from "../../features/ticket/usePriorities";
import { useCreateTicket } from "../../features/ticket/useCreateTicket";



export default function CreateTicketPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const { priorities, loading: prioritiesLoading, error: prioritiesError } = usePriorities();
  const [priority, setPriority] = useState<SelectOption | undefined>(undefined);
  const { createTicket, loading: creating, error: createError, success } = useCreateTicket();

  // Set default priority when priorities are loaded
  useEffect(() => {
    if (priorities && priorities.length > 0 && !priority) {
      setPriority({ id: priorities[0].id, label: priorities[0].name });
    }
  }, [priorities, priority]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !priority) return;
    try {
      await createTicket({
        title,
        body: content,
        priorityId: priority.id,
      });
      // Optionally reset form or show a message
      setTitle("");
      setContent("");
      setPriority(priorities.length > 0 ? { id: priorities[0].id, label: priorities[0].name } : undefined);
      alert("Ticket submitted!");
    } catch {}
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-3">Create a support ticket</h1>
      <Input value={title} label="Title" placeholder="Enter ticket title" className="mb-4" onChange={e => setTitle(e.target.value)} />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
        <div >
          {prioritiesLoading ? (
            <div>Loading priorities...</div>
          ) : prioritiesError ? (
            <div className="text-red-500">{prioritiesError}</div>
          ) : (
            <Select
              className="w-full"
              options={priorities.map(p => ({ id: p.id, label: p.name }))}
              value={priority}
              onChange={setPriority}
            />
          )}
        </div>
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
        disabled={creating || prioritiesLoading || !priority || !title.trim() || !content.trim()}
      >
        {creating ? "Submitting..." : "Submit the ticket"}
      </button>
      {success && <div className="text-green-600 mt-2">Ticket created successfully!</div>}
    </div>
  );
}