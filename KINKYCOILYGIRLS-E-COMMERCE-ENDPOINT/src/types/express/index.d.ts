import { Keyable } from '../../utilities/interface';
declare global {
  namespace Express {
    interface Request {
      user: Record<Keyable>;
    }
  }
}

export {};
