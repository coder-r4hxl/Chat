import { z } from 'zod';

export function validateBody({ schema }) {
  if (!schema || !(schema instanceof z.ZodType)) {
    throw new Error('validateBody requires a zod schema');
  }

  return (req, _res, next) => {
    try {
      req.body = schema.parse(req.body);
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

export function validateQuery({ schema }) {
  if (!schema || !(schema instanceof z.ZodType)) {
    throw new Error('validateQuery requires a zod schema');
  }

  return (req, _res, next) => {
    try {
      req.query = schema.parse(req.query);
      return next();
    } catch (err) {
      return next(err);
    }
  };
}

