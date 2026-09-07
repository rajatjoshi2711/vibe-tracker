"use client";

import { useState } from "react";
import type { Project } from "@/lib/types";
import { EditForm } from "@/components/EditForm";
import { ItemForm } from "@/components/ItemForm";
import { ItemRow } from "@/components/ItemRow";

export function ProjectCard({
  project,
  onToggleProject,
  onDeleteProject,
  onEditProject,
  onAddIdea,
  onToggleIdea,
  onDeleteIdea,
  onEditIdea,
}: {
  project: Project;
  onToggleProject: (id: string, done: boolean) => Promise<void>;
  onDeleteProject: (id: string) => Promise<void>;
  onEditProject: (
    id: string,
    data: { name: string; description: string; prompt: string }
  ) => Promise<void>;
  onAddIdea: (
    projectId: string,
    data: { name: string; description: string; prompt: string }
  ) => Promise<void>;
  onToggleIdea: (id: string, done: boolean) => Promise<void>;
  onDeleteIdea: (id: string) => Promise<void>;
  onEditIdea: (
    id: string,
    data: { name: string; description: string; prompt: string }
  ) => Promise<void>;
}) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const hasDetails = Boolean(project.description || project.prompt);
  const openCount = project.ideas.filter((i) => !i.done).length;

  return (
    <div className="ef-card ef-rise">
      {editing ? (
        <EditForm
          initialName={project.name}
          initialDescription={project.description}
          initialPrompt={project.prompt}
          onCancel={() => setEditing(false)}
          onSave={async (data) => {
            await onEditProject(project.id, data);
            setEditing(false);
          }}
        />
      ) : (
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={project.done}
            onChange={() => onToggleProject(project.id, !project.done)}
            className="mt-1.5 h-4 w-4 accent-[var(--blue-500)] shrink-0 cursor-pointer"
          />
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => hasDetails && setDetailsOpen((v) => !v)}
              className={`ef-h3 text-left ${project.done ? "line-through text-neutral-400" : ""}`}
            >
              {project.name}
            </button>
            {detailsOpen && hasDetails && (
              <div className="mt-2 flex flex-col gap-2 ef-rise">
                {project.description && (
                  <p className="ef-small text-neutral-600 whitespace-pre-wrap">{project.description}</p>
                )}
                {project.prompt && (
                  <pre className="ef-caption font-mono bg-neutral-50 border border-[color:var(--border-subtle)] rounded-[10px] p-3 whitespace-pre-wrap break-words">
                    {project.prompt}
                  </pre>
                )}
              </div>
            )}
            {!detailsOpen && (
              <span className="ef-badge ef-badge-info mt-2">
                {openCount} open idea{openCount === 1 ? "" : "s"}
              </span>
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
              onClick={() => onDeleteProject(project.id)}
              className="ef-caption text-neutral-400 hover:text-[color:var(--danger)]"
            >
              Remove
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 pl-7">
        {project.ideas.map((idea) => (
          <ItemRow
            key={idea.id}
            name={idea.name}
            description={idea.description}
            prompt={idea.prompt}
            done={idea.done}
            onToggle={() => onToggleIdea(idea.id, !idea.done)}
            onDelete={() => onDeleteIdea(idea.id)}
            onEdit={(data) => onEditIdea(idea.id, data)}
          />
        ))}

        <div className="pt-3">
          <ItemForm
            placeholder="New feature idea..."
            submitLabel="Add feature idea"
            onSubmit={(data) => onAddIdea(project.id, data)}
          />
        </div>
      </div>
    </div>
  );
}
