export enum TaskStatus {
  PENDING = "pending",
  RUNNING = "running",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled"
}

export interface User {
  id: number;
  github_id: string;
  username: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
}

export interface Project {
  id: number;
  owner_id: number;
  name: string;
  description?: string;
  status: TaskStatus;
  task_prompt: string;
  uploaded_files?: string;
  result_summary?: string;
  output_files?: string;
  error_message?: string;
  created_at: string;
  started_at?: string;
  completed_at?: string;
  updated_at: string;
  owner?: User;
}

export interface TaskLog {
  id: number;
  project_id: number;
  message: string;
  log_type: string;
  created_at: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  task_prompt: string;
}

export interface SSEEvent {
  type: "log" | "status" | "complete";
  log_id?: number;
  message?: string;
  log_type?: string;
  timestamp?: string;
  status?: string;
  updated_at?: string;
  result_summary?: string;
  error_message?: string;
}
