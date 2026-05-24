export function notFoundMiddleware(req, res) {
  res.status(404).json({
    message: 'Route not found.',
  });
}

export function errorMiddleware(error, req, res, next) {
  const statusCode = error.statusCode || error.status || 500;

  if (error.code === 'P2002') {
    return res.status(409).json({
      message: 'Unique constraint failed.',
      fields: error.meta?.target || [],
    });
  }

  if (error.code === 'P2003') {
    return res.status(409).json({
      message: 'Related record constraint failed. Check referenced ids before retrying.',
      field: error.meta?.field_name,
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      message: 'Record not found.',
    });
  }

  return res.status(statusCode).json({
    message: error.message || 'Internal server error.',
  });
}
