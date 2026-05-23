import type { IUserTokenPayload } from "../modules/issues/issues-interface";

declare global {
  namespace Express {
    interface Request {
      userDetails?: IUserTokenPayload;
    }
  }
}
