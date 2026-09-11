export const sendSuccess = (
    res,
    {
      statusCode = 200,
      message = "Operación realizada correctamente",
      data = null,
    } = {},
  ) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  export const sendError = (
    res,
    {
      statusCode = 500,
      error = "Error interno del servidor",
    } = {},
  ) => {
    return res.status(statusCode).json({
      success: false,
      error,
    });
  };