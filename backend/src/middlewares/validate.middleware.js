// ============================================================================
// The Center — Middleware de Validación
// Valida datos de entrada usando esquemas Zod
// ============================================================================

/**
 * Middleware genérico de validación con Zod
 * @param {import('zod').ZodSchema} schema - Esquema Zod para validar
 * @param {'body'|'query'|'params'} source - Fuente de datos a validar
 */
export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req[source]);
      if (!result.success) {
        const errors = result.error.errors.map(e => ({
          campo: e.path.join('.'),
          mensaje: e.message
        }));
        return res.status(400).json({ error: 'Datos inválidos', detalles: errors });
      }
      req[source] = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};
