import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
type T="body" | "query" | "params"
const validate =(schema: ZodType<any>, type: T) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req[type]);
      if (!result.success) {
        return res.status(400).json({
          errors: result.error.issues.map(err => ({
            field: err.path[0],
            message: err.message,
          })),
        });
      }
      // override req[type] with validated data
      (req[type] as any) = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };

export default validate;;