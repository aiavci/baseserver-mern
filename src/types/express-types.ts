import { Request, Response } from 'express';

export interface IExpressRequest extends Request {
  context: {
    models: any,
  };
}
