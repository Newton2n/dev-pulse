export interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}

export interface IIssueAndUser extends IIssue {
  id: number;
  status: "open" | "in_progress" | "resolved";
  reporter: {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
  };
  created_at: string;
  updated_at: string;
}

export type IUserTokenPayload = {
  id: number;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
};
