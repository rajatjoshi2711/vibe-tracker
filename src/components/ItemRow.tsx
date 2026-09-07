"use client";

import { useState } from "react";
import { EditForm } from "@/components/EditForm";

export function ItemRow({
  name,
  description,
  prompt,
  done,
  onToggle,
  onDelete,
  onEdit,
}: {
  name: string;
  description: string | null;
  prompt: string | null;
  done: boolean;
  onToggle: () => Promise<void>;
  onDelete: () => Promise<void>;
  onEdit: (data: { name: string; description: string; prompt: string }) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const hasDetails = Boolean(description || prompt);

  if (editing) {
    return (
      <div className="border-b border-[color:var(--border-subtle)] last:border-b-0 py-3 pl-7">
        <EditForm
          initialName={name}
          initialDescription={description}
          initialPrompt={prompt}
          onCancel={() => setEditing(false)}
          onSave={async (data) => {
            await onEdit(data);
            setEditing(false);
          }}
        />
      </div>
    );
  }

  return (
    <div className="border-b border-[color:var(--border-subtle)] last:border-b-0 py-3">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={done}
          onChange={() => onToggle()}
          className="mt-1 h-4 w-4 accent-[var(--blue-500)] shrink-0 cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => hasDetails && setOpen((v) => !v)}
            className={`ef-body text-left w-full ${done ? "line-through text-neutral-400" : ""}`}
          >
            {name}
          </button>
          {open && hasDetails && (
            <div className="mt-2 flex flex-col gap-2 ef-rise">
              {description && <p className="ef-small text-neutral-600 whitespace-pre-wrap">{description}</p>}
              {prompt && (
                <pre className="ef-caption font-mono bg-neutral-50 border border-[color:var(--border-subtle)] rounded-[10px] p-3 whitespace-pre-wrap break-words">
                  {prompt}
                </pre>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="ef-caption text-neutral-400 hover:text-[color:var(--blue-500)]"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete()}
            aria-label="Delete"
            className="ef-caption text-neutral-400 hover:text-[color:var(--danger)]"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
