"use client";

import { useState } from "react";

export function EditForm({
  initialName,
  initialDescription,
  initialPrompt,
  onSave,
  onCancel,
}: {
  initialName: string;
  initialDescription: string | null;
  initialPrompt: string | null;
  onSave: (data: { name: string; description: string; prompt: string }) => Promise<void>;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription ?? "");
  const [prompt, setPrompt] = useState(initialPrompt ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await onSave({ name: name.trim(), description: description.trim(), prompt: prompt.trim() });
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 ef-rise">
      <input
        className="ef-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
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
        <button type="submit" disabled={saving || !name.trim()} className="ef-btn ef-btn-primary">
          {saving ? "Saving..." : "Save"}
        </button>
        <button type="button" className="ef-btn ef-btn-text" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
      </div>
    </form>
  );
}
