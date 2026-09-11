import {
    registerUser,
    loginUser,
  } from "../services/auth.service.js";
  import { sendSuccess } from "../utils/apiResponse.js";
  import { createAuthToken } from "../utils/token.js";
  import {
    AUTH_COOKIE_NAME,
    getAuthCookieOptions,
    getClearAuthCookieOptions,
  } from "../config/auth.js";

  const setAuthCookie = (res, user) => {
    const token = createAuthToken(user);
  
    res.cookie(
      AUTH_COOKIE_NAME,
      token,
      getAuthCookieOptions(),
    );
  };

  export const register = async (req, res) => {
    const user = await registerUser(req.body);
  
    setAuthCookie(res, user);
  
    res.set("Cache-Control", "no-store");
  
    return sendSuccess(res, {
      statusCode: 201,
      message: "Usuario registrado correctamente",
      data: {
        user,
      },
    });
  };

  export const login = async (req, res) => {
    const user = await loginUser(req.body);
  
    setAuthCookie(res, user);
  
    res.set("Cache-Control", "no-store");
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Inicio de sesión correcto",
      data: {
        user,
      },
    });
  };

  export const logout = (req, res) => {
    res.clearCookie(
      AUTH_COOKIE_NAME,
      getClearAuthCookieOptions(),
    );
  
    res.set("Cache-Control", "no-store");
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Sesión cerrada correctamente",
      data: null,
    });
  };

  export const getMe = (req, res) => {
    res.set("Cache-Control", "no-store");
  
    return sendSuccess(res, {
      statusCode: 200,
      message: "Usuario autenticado",
      data: {
        user: req.user,
      },
    });
  };