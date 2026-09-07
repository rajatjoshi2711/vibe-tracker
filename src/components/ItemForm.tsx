"use client";

import { useState } from "react";

export function ItemForm({
  placeholder,
  submitLabel,
  onSubmit,
}: {
  placeholder: string;
  submitLabel: string;
  onSubmit: (data: { name: string; description: string; prompt: string }) => Promise<void>;
}) {
  const [expanded, setExpanded] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [prompt, setPrompt] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await onSubmit({ name: name.trim(), description: description.trim(), prompt: prompt.trim() });
    setSubmitting(false);
    setName("");
    setDescription("");
    setPrompt("");
    setExpanded(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        className="ef-input"
        placeholder={placeholder}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onFocus={() => setExpanded(true)}
      />

      {expanded && (
        <div className="flex flex-col gap-2 ef-rise">
          <textarea
            className="ef-textarea ef-small"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <textarea
            className="ef-textarea ef-small font-mono"
            placeholder="Prompt (optional)"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <div className="flex gap-2">
            <button type="submit" disabled={submitting || !name.trim()} className="ef-btn ef-btn-primary">
              {submitting ? "Adding..." : submitLabel}
            </button>
            <button
              type="button"
              className="ef-btn ef-btn-text"
              onClick={() => {
                setExpanded(false);
                setDescription("");
                setPrompt("");
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
