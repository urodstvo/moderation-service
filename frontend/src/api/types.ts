export type LoginBody = {
  email: string;
  password: string;
};

export type RegisterBody = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

export type GetMeResponse = {
  user: {
    id: number;
    email: string;
    created_at: string;
    updated_at: string;
    role: string;
  };
};

export type GetBlacklistResponse = {
    id: number;
    userId: number;
    phrase: string;
}[];

export type Graph = {
  nodes: Node[];
  edges: Edge[];
};

export type GraphWithId = Graph & {
  request_id: number | string;
};

export type GetStatusResponse = Graph[] | Graph;

export type Node = {
  id: string;
  title: string;
  status: StatusType;
  start?: string;
  end?: string;
  details?: string;
  group?: string;
};

export type Edge = {
  from: string;
  to: string[];
};

export type AnalysisBody = { files: File[] };

export const Status = {
  CREATED: "created",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type StatusType = (typeof Status)[keyof typeof Status];

export type SyncAnalysisFile = {
  file_id: number;
  filename: string;
  content_type: string;
  recognized_text?: string | null;
  classification: Classification;
  nsfw_classification?: NsfwClassification | null;
  words: DeletedWord[];
};

export type SyncAnalysisResponse = {
  request_id: number;
  status: StatusType;
  created_at: string;
  updated_at: string;
  total_files: number;
  files: SyncAnalysisFile[];
};

export type DeletedWord = {
  word: string;
  score: number;
  start: number;
  end: number;
  label: string;
};

export type Classification = {
  toxicity: number;
  severe_toxicity: number;
  obscene: number;
  threat: number;
  insult: number;
  identity_attack: number;
};

export type NsfwClassification = {
  score: number;
  is_nsfw: boolean;
  model: string;
};

export type AsyncAnalysisResponse = {
  request_id: number;
};
