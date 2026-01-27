import {
  EditorProvider,
  Editor as WysiwygEditor,
  Toolbar,
  BtnUndo,
  BtnRedo,
  BtnBold,
  BtnClearFormatting,
  BtnItalic,
  BtnUnderline,
  BtnStrikeThrough,
  BtnNumberedList,
  BtnBulletList,
  BtnLink,
  Separator,
  HtmlButton,
  BtnStyles,
} from "react-simple-wysiwyg"
import type { ContentEditableEvent } from "react-simple-wysiwyg"

interface EditorProps {
  html: string,
  setHtml: (value: string) => void
}

/**
 * Editor.tsx
 *
 * A React component that provides a WYSIWYG HTML editor using react-simple-wysiwyg.
 *
 * Props:
 *   - html: string - The HTML content to display and edit.
 *   - setHtml: (value: string) => void - Callback to update the HTML content.
 *
 * Features:
 *   - Rich text editing with formatting toolbar (bold, italic, underline, lists, links, etc.)
 *   - Undo/redo, clear formatting, and HTML view support.
 *   - Scrollable editor area with max height.
 *   - Built-in light/dark mode styling and responsive design.
 *   - Toolbar and editor area are styled for modern UI out of the box.
 */

export default function Editor({ html, setHtml }: EditorProps) {
  function onChange(e: ContentEditableEvent) {
    setHtml(e.target.value)
  }

  return (
    <EditorProvider>
      <div className="overflow-y-auto max-h-96">
        <WysiwygEditor
          value={html}
          onChange={onChange}
          className="
          w-full h-64 p-2 bg-white shadow-sm
          dark:bg-gray-700 dark:text-gray-100
          border border-gray-200 rounded-b-sm dark:border-gray-500
          focus-within:border-gray-300
          dark:focus-within:border-gray-400
          "
        >
          <Toolbar className="flex bg-white dark:bg-gray-500 border rounded-t-sm border-gray-200 dark:border-gray-500">
            <BtnUndo />
            <BtnRedo />
            <Separator className="border border-gray-300 dark:border-gray-600" />
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator className="border border-gray-300 dark:border-gray-600 me-1" />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator className="border border-gray-300 dark:border-gray-600" />
            <BtnLink />
            <Separator className="border border-gray-300 dark:border-gray-600" />
            <BtnStyles className="bg-white dark:bg-gray-500" />
            <Separator className="border border-gray-300 dark:border-gray-600" />
            <BtnClearFormatting />
            <HtmlButton />
          </Toolbar>
        </WysiwygEditor>
      </div>
    </EditorProvider>
  )
}
