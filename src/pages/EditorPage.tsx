import { useState } from "react";
import Editor, {
  Toolbar,
  BtnBold,
  BtnItalic,
  BtnUnderline,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  BtnUndo,
  BtnRedo,
} from "react-simple-wysiwyg";
import type { ContentEditableEvent } from "react-simple-wysiwyg";

export default function EditorPage() {
  const [html, setHtml] = useState("my <b>HTML</b>");

  function onChange(e: ContentEditableEvent) {
    setHtml(e.target.value);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-2xl font-semibold mb-3">Editor</h1>

      <Editor
        value={html}
        onChange={onChange}
        containerProps={{
          className: "border border-neutral-700 rounded-md shadow-sm",
        }}
      >
        <Toolbar
          style={{
            background: "#f9f9f9",
            borderBottom: "1px solid lightgray",
          }}
        >
          <BtnBold />
          <BtnItalic />
          <BtnUnderline />
          <BtnNumberedList />
          <BtnBulletList />
          <BtnLink />
          <BtnUndo />
          <BtnRedo />
        </Toolbar>
      </Editor>

      {/* Preview (optional) */}
      <div className="mt-6 p-4 border border-neutral-700 rounded-md">
        <h2 className="font-semibold mb-2">Preview</h2>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
