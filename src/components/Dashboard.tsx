"use client";

import { useEffect, useState } from "react";
import type { Idea, Project } from "@/lib/types";
import { ItemForm } from "@/components/ItemForm";
import { ItemRow } from "@/components/ItemRow";
import { ProjectCard } from "@/components/ProjectCard";

async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

export function Dashboard() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [ideas, setIdeas] = useState<Idea[]>([]);

  useEffect(() => {
    api<{ projects: Project[] }>("/api/projects").then(({ projects }) => setProjects(projects));
    api<{ ideas: Idea[] }>("/api/ideas").then(({ ideas }) => setIdeas(ideas));
  }, []);

  if (!projects) {
    return <p className="ef-small text-neutral-600">Loading...</p>;
  }

  async function addProject(data: { name: string; description: string; prompt: string }) {
    const { project } = await api<{ project: Project }>("/api/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    setProjects((prev) => [{ ...project, ideas: [] }, ...(prev ?? [])]);
  }

  async function toggleProject(id: string, done: boolean) {
    await api(`/api/projects/${id}`, { method: "PATCH", body: JSON.stringify({ done }) });
    setProjects((prev) => prev!.map((p) => (p.id === id ? { ...p, done } : p)));
  }

  async function deleteProject(id: string) {
    await api(`/api/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev!.filter((p) => p.id !== id));
  }

  async function addIdea(
    projectId: string | undefined,
    data: { name: string; description: string; prompt: string }
  ) {
    const { idea } = await api<{ idea: Idea }>("/api/ideas", {
      method: "POST",
      body: JSON.stringify({ ...data, projectId }),
    });
    if (projectId) {
      setProjects((prev) =>
        prev!.map((p) => (p.id === projectId ? { ...p, ideas: [...p.ideas, idea] } : p))
      );
    } else {
      setIdeas((prev) => [...prev, idea]);
    }
  }

  async function toggleIdea(id: string, done: boolean) {
    await api(`/api/ideas/${id}`, { method: "PATCH", body: JSON.stringify({ done }) });
    setProjects((prev) =>
      prev!.map((p) => ({ ...p, ideas: p.ideas.map((i) => (i.id === id ? { ...i, done } : i)) }))
    );
    setIdeas((prev) => prev.map((i) => (i.id === id ? { ...i, done } : i)));
  }

  async function deleteIdea(id: string) {
    await api(`/api/ideas/${id}`, { method: "DELETE" });
    setProjects((prev) => prev!.map((p) => ({ ...p, ideas: p.ideas.filter((i) => i.id !== id) })));
    setIdeas((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="ef-page">Projects</h2>
        </div>
        <div className="ef-card mb-6">
          <ItemForm placeholder="New project name..." submitLabel="Add project" onSubmit={addProject} />
        </div>
        <div className="flex flex-col gap-4">
          {projects.length === 0 && (
            <p className="ef-small text-neutral-600">No projects yet. Add your first one above.</p>
          )}
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onToggleProject={toggleProject}
              onDeleteProject={deleteProject}
              onAddIdea={(projectId, data) => addIdea(projectId, data)}
              onToggleIdea={toggleIdea}
              onDeleteIdea={deleteIdea}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="ef-page mb-3">New project ideas</h2>
        <div className="ef-card">
          <ItemForm
            placeholder="New project idea..."
            submitLabel="Add idea"
            onSubmit={(data) => addIdea(undefined, data)}
          />
          {ideas.length > 0 && (
            <div className="mt-4">
              {ideas.map((idea) => (
                <ItemRow
                  key={idea.id}
                  name={idea.name}
                  description={idea.description}
                  prompt={idea.prompt}
                  done={idea.done}
                  onToggle={() => toggleIdea(idea.id, !idea.done)}
                  onDelete={() => deleteIdea(idea.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
