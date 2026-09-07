export type Idea = {
  id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  done: boolean;
  projectId: string | null;
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string | null;
  prompt: string | null;
  done: boolean;
  createdAt: string;
  ideas: Idea[];
};
