export interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}

export interface IReporter {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
}

export interface IIssueAndReporter extends IIssue {
  id: number;
  status: "open" | "in_progress" | "resolved";
  reporter: IReporter;
  created_at: string;
  updated_at: string;
}

export interface IUserTokenPayload {
  id: number;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}
