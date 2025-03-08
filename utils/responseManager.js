class ResponseManager {
  // Success response
  static successResponse(res, data, message, statusCode = 200) {
    return res.status(statusCode).json({
      status: "success",
      message: message,
      data: data,
    });
  }

  // Error response
  static errorResponse(res, error, message, statusCode = 500) {
    return res.status(statusCode).json({
      status: "error",
      message: message,
      error: error.message || error,
    });
  }

  // Not Found response
  static notFoundResponse(res, message) {
    return res.status(404).json({
      status: "error",
      message: message,
    });
  }
}

module.exports = ResponseManager;
