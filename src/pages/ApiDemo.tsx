import { useState } from "react";
import { Button, Input } from "../components";

export default function ApiDemo() {
  const [input, setInput] = useState("");
  const [responseText, setResponseText] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!input.trim()) {
      setResponseText("Enter a message before sending");
      return;
    }

    setLoading(true);
    setResponseText(null);
    
    // Simulate API call with mock data
    setTimeout(() => {
      setResponseText(JSON.stringify({
        success: true,
        message: `Mock response for: "${input}"`,
        timestamp: new Date().toISOString(),
        data: { received: input }
      }, null, 2));
      setInput("");
      setLoading(false);
    }, 800);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">API Demo</h1>
      <p className="text-gray-600 mb-4">This demo uses mock data. Enter a message to see a simulated API response.</p>
      <div className="flex gap-3 items-center mb-4">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button
          onClick={handlePost}
          disabled={loading}
          loading={loading}
        >
          {loading ? "Sending..." : "Send"}
        </Button>
      </div>
      {responseText && (
        <pre className="bg-gray-50 p-4 rounded-md font-mono text-sm whitespace-pre-wrap">
          <span>Response:<br /><br /></span>
          {responseText}
        </pre>
      )}
    </div>
  );
}
