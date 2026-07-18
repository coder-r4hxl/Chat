import { ZodError } from 'zod';

export function errorHandler(err, _req, res, _next) {
  const status = Number(err?.statusCode ?? err?.status ?? 500) || 500;

  const isZod = err instanceof ZodError;

  // Log full error server-side, but do not leak stack traces to client.
  console.error('[error]', {
    status,
    name: err?.name,
    message: err?.message,
    stack: err?.stack,
    // For zod, log issues to debug.
    zodIssues: isZod ? err.issues : undefined
  });

  // Never expose stack traces.
  const clientMessage =
    status >= 500
      ? 'Internal server error'
      : isZod
        ? 'Invalid request'
        : err?.message ?? 'Request failed';

  const payload = {
    ok: false,
    error: clientMessage
  };

  if (status < 500 && isZod) {
    payload.details = {
      // Keep details minimal.
      path: err.issues?.[0]?.path ?? null,
      code: err.issues?.[0]?.code ?? 'BAD_REQUEST'
    };
  }

  return res.status(status).json(payload);
}



