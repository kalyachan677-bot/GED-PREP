// ============================================================================
// GED Prep Platform — Response Helpers
// ============================================================================
// Consistent JSON response shape for all API endpoints.
//
// Success:  { success: true, data: ..., meta: ... }
// Error:    { success: false, error: { message, code, details } }
// Paginated:{ success: true, data: [...], meta: { page, perPage, total, totalPages } }
// ============================================================================

/**
 * Send a success response.
 * @param {import('express').Response} res
 * @param {*} data - Response payload
 * @param {number} [statusCode=200]
 * @param {object} [meta] - Optional metadata (e.g. pagination info)
 */
function success(res, data, statusCode = 200, meta = null) {
  const body = { success: true, data };
  if (meta) body.meta = meta;
  return res.status(statusCode).json(body);
}

/**
 * Send a success response for paginated lists.
 * @param {import('express').Response} res
 * @param {Array} items - Array of items for the current page
 * @param {number} page - Current page (1-indexed)
 * @param {number} perPage - Items per page
 * @param {number} total - Total items across all pages
 */
function paginated(res, items, page, perPage, total) {
  const totalPages = Math.ceil(total / perPage);
  return res.status(200).json({
    success: true,
    data: items,
    meta: {
      page,
      perPage,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
}

/**
 * Send an error response (used by the global error handler, but also
 * available for manual use in route handlers if needed).
 * @param {import('express').Response} res
 * @param {string} message
 * @param {number} statusCode
 * @param {*} [details]
 */
function error(res, message, statusCode = 500, details = null) {
  const body = {
    success: false,
    error: {
      message,
      code: statusCode,
    },
  };
  if (details) body.error.details = details;
  return res.status(statusCode).json(body);
}

module.exports = { success, paginated, error };