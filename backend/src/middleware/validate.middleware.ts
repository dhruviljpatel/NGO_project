import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';
import { AppError } from '../utils/AppError';

export const validate =
  (schema: ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as any;
        const errorMessage = zodError.errors.map((e: any) => e.message).join(', ');
        return next(new AppError(`Validation Error: ${errorMessage}`, 400));
      }
      return next(error);
    }
  };
