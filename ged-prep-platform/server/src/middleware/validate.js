// ============================================================================
// GED Prep Platform — Request Validator Middleware
// ============================================================================
// Validates request body against a schema object.
//   - Required fields must be present and non-empty-string
//   - Optional fields may be absent
//   - Type checking: 'string', 'number', 'boolean', 'object', 'array'
//   - Custom validator functions supported
//
// Usage:
//   router.post('/users', validate({
//     body: { email: { type: 'string', required: true }, age: { type: 'number' } },
//     params: { id: { type: 'string', required: true } },
//     query: { page: { type: 'number' } },
//   }), handler);
// ============================================================================

const { ValidationError } = require('../utils/errors');

function validate(schema) {
  return (req, res, next) => {
    const errors = {};

    function checkObject(obj, location) {
      if (!schema[location]) return;
      const rules = schema[location];

      for (const [field, rule] of Object.entries(rules)) {
        const value = obj[field];

        // Required check
        if (rule.required && (value === undefined || value === null || value === '')) {
          errors[field] = `${field} is required`;
          continue;
        }

        // Skip type check if value is absent (and not required)
        if (value === undefined || value === null) continue;

        // Type check
        if (rule.type) {
          const actualType = Array.isArray(value) ? 'array' : typeof value;
          if (actualType !== rule.type) {
            errors[field] = `${field} must be of type ${rule.type}, got ${actualType}`;
            continue;
          }
        }

        // Custom validator
        if (rule.validate && typeof rule.validate === 'function') {
          const customError = rule.validate(value, obj);
          if (customError) {
            errors[field] = customError;
          }
        }
      }
    }

    checkObject(req.body, 'body');
    checkObject(req.params, 'params');
    checkObject(req.query, 'query');

    if (Object.keys(errors).length > 0) {
      return next(new ValidationError(errors));
    }

    next();
  };
}

module.exports = validate;