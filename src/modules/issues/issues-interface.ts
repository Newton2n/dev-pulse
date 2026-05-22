export type IIssue = {
  title: string;
  description: string;
  type: string;
};

export type IUserTokenPayload = {
  id: number;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
};
