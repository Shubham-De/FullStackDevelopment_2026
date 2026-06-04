"use client";

// We use dynamic import because the markdown editor uses browser-only APIs
// that don't work during server-side rendering in Next.js
import dynamic from "next/dynamic";
import { commands } from "@uiw/react-md-editor";

// Load the editor only on the client side (not on the server)
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false, // this tells Next.js to skip rendering this on the server
  loading: () => <p className="text-sm text-secondary">Loading editor...</p>,
});

type MarkdownEditorProps = {
  value: string;
  onChange: (newValue: string) => void;
};

// Only show the simple formatting buttons
const simpleToolbar = [
  commands.bold,       // **bold**
  commands.italic,     // *italic*
  commands.heading,    // # heading
  commands.unorderedListCommand, // - list item
  commands.link,       // [text](url)
];

// Simple wrapper around the markdown editor
export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(newValue) => onChange(newValue || "")}
        height={300}
        preview="edit"
        commands={simpleToolbar}
        extraCommands={[]}  
      />
    </div>
  );
}
