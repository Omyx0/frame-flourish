/**
 * Consistent JSON response helpers.
 */
export function success(res, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, data });
}

export function paginated(res, data, pagination) {
  return res.status(200).json({ success: true, data, pagination });
}

export function fail(res, message, statusCode = 400) {
  return res.status(statusCode).json({ success: false, message });
}

export function serverError(res, error) {
  console.error(error);
  return res.status(500).json({ success: false, message: "Internal server error" });
}
