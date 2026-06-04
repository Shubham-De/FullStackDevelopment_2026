"use client";

import { marked } from "marked";
import { useMemo, useRef, useState } from "react";
import { MarkdownEditor } from "./MarkdownEditor";
import type { AdminPost } from "../utils/posts";

type EditorMode = "create" | "update";

type PostEditorFormValues = {
  title: string;
  category: string;
  description: string;
  content: string;
  imageUrl: string;
  tags: string;
  active: boolean;
};

type ValidationErrors = {
  title?: string;
  description?: string;
  content?: string;
  imageUrl?: string;
  tags?: string;
};

function createInitialValues(initialPost?: AdminPost): PostEditorFormValues {
  return {
    title: initialPost?.title ?? "",
    category: initialPost?.category ?? "",
    description: initialPost?.description ?? "",
    content: initialPost?.content ?? "",
    imageUrl: initialPost?.imageUrl ?? "",
    tags: initialPost?.tags ?? "",
    active: initialPost?.active ?? true,
  };
}

function validateValues(values: PostEditorFormValues) {
  const errors: ValidationErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required";
  } else if (values.description.length > 200) {
    errors.description = "Description is too long. Maximum is 200 characters";
  }

  if (!values.content.trim()) {
    errors.content = "Content is required";
  }

  if (!values.imageUrl.trim()) {
    errors.imageUrl = "Image URL is required";
  } else {
    try {
      new URL(values.imageUrl);
    } catch {
      errors.imageUrl = "This is not a valid URL";
    }
  }

  const tags = values.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
  if (tags.length === 0) {
    errors.tags = "At least one tag is required";
  }

  return errors;
}

export function PostEditorForm({
  mode,
  initialPost,
}: {
  mode: EditorMode;
  initialPost?: AdminPost;
}) {
  const [values, setValues] = useState<PostEditorFormValues>(
    createInitialValues(initialPost),
  );
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [errorMessage, setErrorMessage] = useState("");
  const [saveMessage, setSaveMessage] = useState("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const contentInputRef = useRef<HTMLTextAreaElement | null>(null);
  const cursorPositionRef = useRef<{ start: number; end: number } | null>(null);

  const previewHtml = useMemo(() => {
    const parsed = marked.parse(values.content);
    return typeof parsed === "string" ? parsed : "";
  }, [values.content]);

  function setFieldValue<K extends keyof PostEditorFormValues>(
    field: K,
    value: PostEditorFormValues[K],
  ) {
    setValues((previousValues) => ({
      ...previousValues,
      [field]: value,
    }));
  }

  function togglePreview() {
    if (!isPreviewOpen) {
      const textArea = contentInputRef.current;
      if (textArea) {
        // Save cursor before hiding textarea.
        cursorPositionRef.current = {
          start: textArea.selectionStart,
          end: textArea.selectionEnd,
        };
      }
      setIsPreviewOpen(true);
      return;
    }

    setIsPreviewOpen(false);
    requestAnimationFrame(() => {
      const textArea = contentInputRef.current;
      const cursor = cursorPositionRef.current;
      if (!textArea || !cursor) {
        return;
      }

      textArea.focus();
      textArea.setSelectionRange(cursor.start, cursor.end);
    });
  }

  async function handleSave() {
    const nextErrors = validateValues(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setErrorMessage("Please fix the errors before saving");
      setSaveMessage("");
      return;
    }

    setErrorMessage("");

    const requestOptions = {
      method: mode === "create" ? "POST" : "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    };

    const requestUrl =
      mode === "create" ? "/api/posts" : `/api/posts/${initialPost?.urlId ?? ""}`;
    const response = await fetch(requestUrl, requestOptions);

    if (!response.ok) {
      setErrorMessage("Please fix the errors before saving");
      setSaveMessage("");
      return;
    }

    setSaveMessage("Post updated successfully");
  }

  return (
    <section className="mx-auto max-w-3xl space-y-4 rounded-xl border border-gray-200 p-5 dark:border-gray-700">
      <div>
        <label htmlFor="title" className="mb-1 block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          value={values.title}
          onChange={(event) => setFieldValue("title", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        {errors.title ? <p className="mt-1 text-sm text-red-600">{errors.title}</p> : null}
      </div>

      <div>
        <label htmlFor="category" className="mb-1 block text-sm font-medium">
          Category
        </label>
        <input
          id="category"
          value={values.category}
          onChange={(event) => setFieldValue("category", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
      </div>

      <div>
        <label htmlFor="description" className="mb-1 block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={values.description}
          onChange={(event) => setFieldValue("description", event.target.value)}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        {errors.description ? (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="content" className="text-sm font-medium">
            Content
          </label>
          <button
            type="button"
            onClick={togglePreview}
            className="rounded-md border border-gray-300 px-3 py-1 text-sm dark:border-gray-700"
          >
            {isPreviewOpen ? "Close Preview" : "Preview"}
          </button>
        </div>

        {isPreviewOpen ? (
          <div
            data-test-id="content-preview"
            className="prose max-w-none rounded-md border border-gray-300 p-3 dark:prose-invert dark:border-gray-700"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          /* Rich text markdown editor - has toolbar for bold, italic, headings, etc. */
          <MarkdownEditor
            value={values.content}
            onChange={(newValue) => setFieldValue("content", newValue)}
          />
        )}

        {errors.content ? <p className="text-sm text-red-600">{errors.content}</p> : null}
      </div>

      <div>
        <label htmlFor="image-url" className="mb-1 block text-sm font-medium">
          Image URL
        </label>
        <input
          id="image-url"
          value={values.imageUrl}
          onChange={(event) => setFieldValue("imageUrl", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        {errors.imageUrl ? <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p> : null}

        {/* Image upload - pick a file from your computer */}
        <div className="mt-3 flex items-center gap-3">
          <label className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">
            {isUploading ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={async (event) => {
                // Get the file the user picked
                const file = event.target.files?.[0];
                if (!file) return;

                setIsUploading(true);
                setUploadMessage("");

                // Send the file to our upload API
                const formData = new FormData();
                formData.append("file", file);

                try {
                  const response = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                  });

                  if (!response.ok) {
                    setUploadMessage("Upload failed. Please try again.");
                    return;
                  }

                  const data = (await response.json()) as { url: string };
                  // Put the uploaded URL into the Image URL field
                  setFieldValue("imageUrl", data.url);
                  setUploadMessage("Image uploaded!");
                } catch {
                  setUploadMessage("Upload failed. Please try again.");
                } finally {
                  setIsUploading(false);
                }
              }}
            />
          </label>
          {uploadMessage ? (
            <span className="text-sm text-secondary">{uploadMessage}</span>
          ) : null}
        </div>

        {/* Image preview */}
        <img
          data-test-id="image-preview"
          src={values.imageUrl}
          alt="Image preview"
          className="mt-3 h-48 w-full rounded-md object-cover"
        />
      </div>

      <div>
        <label htmlFor="tags" className="mb-1 block text-sm font-medium">
          Tags
        </label>
        <input
          id="tags"
          value={values.tags}
          onChange={(event) => setFieldValue("tags", event.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900"
        />
        {errors.tags ? <p className="mt-1 text-sm text-red-600">{errors.tags}</p> : null}
      </div>

      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      {saveMessage ? <p className="text-sm text-green-600">{saveMessage}</p> : null}

      <button
        type="button"
        onClick={handleSave}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-300"
      >
        Save
      </button>
    </section>
  );
}
