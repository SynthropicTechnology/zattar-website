import { type ZodSchema, type ZodError } from 'zod';

export type ActionResult<T = unknown> =
  | { success: true; data: T; message?: string }
  | { success: false; error: string; errors?: Record<string, string[]>; message: string };

export type PublicActionHandler<TInput, TOutput> = (
  data: TInput
) => Promise<TOutput>;

function formatZodErrors(zodError: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {};
  for (const err of zodError.errors) {
    const key = err.path.join('.');
    if (!errors[key]) errors[key] = [];
    errors[key].push(err.message);
  }
  return errors;
}

function extractInputData<T>(input: FormData | T): T {
  if (!(input instanceof FormData)) return input;

  const data: Record<string, unknown> = {};
  input.forEach((value, key) => {
    if (data[key]) {
      data[key] = Array.isArray(data[key])
        ? [...(data[key] as unknown[]), value]
        : [data[key], value];
    } else if (value === '' || value === 'null' || value === 'undefined') {
      data[key] = undefined;
    } else if (value === 'true') {
      data[key] = true;
    } else if (value === 'false') {
      data[key] = false;
    } else if (typeof value === 'string' && !isNaN(Number(value)) && value.trim() !== '') {
      const num = Number(value);
      data[key] = value === num.toString() || value === num.toFixed(0) ? num : value;
    } else {
      data[key] = value;
    }
  });
  return data as T;
}

export function publicAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: PublicActionHandler<TInput, TOutput>
): (input: FormData | TInput) => Promise<ActionResult<TOutput>> {
  return async (input) => {
    try {
      const rawData = extractInputData(input);
      const validation = schema.safeParse(rawData);
      if (!validation.success) {
        return {
          success: false,
          error: 'Erro de validação',
          errors: formatZodErrors(validation.error),
          message: validation.error.errors[0]?.message || 'Dados inválidos',
        };
      }
      const result = await handler(validation.data);
      return { success: true, data: result, message: 'Operação realizada com sucesso' };
    } catch (error) {
      console.error('[SafeAction] Erro:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro interno do servidor',
        message: error instanceof Error ? error.message : 'Ocorreu um erro inesperado.',
      };
    }
  };
}

export function publicFormAction<TInput, TOutput>(
  schema: ZodSchema<TInput>,
  handler: PublicActionHandler<TInput, TOutput>
): (prevState: ActionResult<TOutput> | null, formData: FormData) => Promise<ActionResult<TOutput>> {
  const action = publicAction(schema, handler);
  return async (_prevState, formData) => action(formData);
}
