import 'express';
import { verifyTokenData } from 'src/common/guards/auth.guard';
declare module 'express' {
  interface Request {
    user: verifyTokenData;
  }
}
