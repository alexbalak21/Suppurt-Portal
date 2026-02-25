import { useState } from "react";
import { Button, Input } from "../components";

// Deleted file
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
