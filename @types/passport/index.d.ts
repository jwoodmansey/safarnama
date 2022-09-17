import { Express } from 'express';
import { Passport } from 'passport';

declare global {
  namespace Express {
    interface User {
      _id?: string
    }
  }
}
