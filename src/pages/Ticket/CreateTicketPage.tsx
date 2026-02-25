import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@components/Editor";
import Input from "@components/Input";
import { PrioritySelector } from "@/components/PrioritySelector";
import { useCreateTicket } from "../../features/ticket/useCreateTicket";
import { useToast } from "@/components/ToastContainer";

export default function CreateTicketPage() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [priorityId, setPriorityId] = useState<number | undefined>(undefined);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    createTicket,
    loading: creating,
    error: createError,
  } = useCreateTicket();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !priorityId) return;

    const payload = {
      title,
      body: content,
      priorityId,
    };

    try {
      await createTicket(payload);
      toast.success("Ticket created successfully!");
      setTimeout(() => {
        navigate("/ticket-list");
      }, 500);
    } catch (err) {
      console.log("❌ Submit error:", err);
    }
  };

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

      <div className="mb-4 w-1/2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Priority
        </label>
        <PrioritySelector priorityId={priorityId} onChange={setPriorityId} />
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
          !priorityId ||
          !title.trim() ||  
          !content.trim()
        }
      >
        {creating ? "Submitting..." : "Submit the ticket"}
      </button>
    </div>
  );
}
