import type { IUserTokenPayload } from "../modules/issues/issues-interface";

//Extend Global Request object 
declare global {
  namespace Express {
    interface Request {
      userDetails?: IUserTokenPayload;
    }
  }
}
