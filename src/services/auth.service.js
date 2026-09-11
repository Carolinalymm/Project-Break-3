import bcrypt from "bcryptjs";

import supabase from "../config/database.js";
import AppError from "../utils/appError.js";
import mapUser from "../utils/userMapper.js";

const PUBLIC_USER_COLUMNS =
  "id, name, email, role, created_at, updated_at";

const LOGIN_USER_COLUMNS =
  `${PUBLIC_USER_COLUMNS}, password`;

const SALT_ROUNDS = 12;

const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

const isValidEmail = (email) => {
  const emailExpression =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return emailExpression.test(email);
};

const validateRegisterData = ({
  name,
  email,
  password,
}) => {
  if (
    typeof name !== "string" ||
    name.trim().length < 2
  ) {
    throw new AppError(
      "El nombre debe tener al menos 2 caracteres",
      400,
    );
  }

  if (
    typeof email !== "string" ||
    !isValidEmail(normalizeEmail(email))
  ) {
    throw new AppError(
      "El correo electrónico no es válido",
      400,
    );
  }

  if (
    typeof password !== "string" ||
    password.length < 8
  ) {
    throw new AppError(
      "La contraseña debe tener al menos 8 caracteres",
      400,
    );
  }

  if (password.length > 72) {
    throw new AppError(
      "La contraseña no puede superar los 72 caracteres",
      400,
    );
  }
};

const validateLoginData = ({
  email,
  password,
}) => {
  if (
    typeof email !== "string" ||
    !isValidEmail(normalizeEmail(email))
  ) {
    throw new AppError(
      "El correo electrónico no es válido",
      400,
    );
  }

  if (
    typeof password !== "string" ||
    password.length === 0
  ) {
    throw new AppError(
      "La contraseña es obligatoria",
      400,
    );
  }
};

export const registerUser = async ({
  name,
  email,
  password,
}) => {

  validateRegisterData({
    name,
    email,
    password,
  });

  const normalizedEmail =
    normalizeEmail(email);

  const {
    data: existingUser,
    error: existingUserError,
  } = await supabase
    .from("users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (existingUserError) {
    throw new AppError(
      "No se pudo comprobar el usuario",
      500,
    );
  }

  if (existingUser) {
    throw new AppError(
      "Ya existe un usuario con ese correo electrónico",
      409,
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      SALT_ROUNDS,
    );

  const {
    data: createdUser,
    error,
  } = await supabase
    .from("users")
    .insert({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "USER",
    })
    .select(PUBLIC_USER_COLUMNS)
    .single();

  if (error) {

    if (error.code === "23505") {
      throw new AppError(
        "Ya existe un usuario con ese correo electrónico",
        409,
      );
    }

    throw new AppError(
      "No se pudo registrar el usuario",
      500,
    );
  }

  return mapUser(createdUser);
};

export const loginUser = async ({
  email,
  password,
}) => {
  validateLoginData({
    email,
    password,
  });

  const normalizedEmail =
    normalizeEmail(email);

  const {
    data: user,
    error,
  } = await supabase
    .from("users")
    .select(LOGIN_USER_COLUMNS)
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    throw new AppError(
      "No se pudo comprobar el usuario",
      500,
    );
  }

  if (!user) {
    throw new AppError(
      "Correo electrónico o contraseña incorrectos",
      401,
    );
  }

  const passwordIsCorrect =
    await bcrypt.compare(
      password,
      user.password,
    );

  if (!passwordIsCorrect) {
    throw new AppError(
      "Correo electrónico o contraseña incorrectos",
      401,
    );
  }

  return mapUser(user);
};

export const findUserById = async (
  userId,
) => {
  const {
    data: user,
    error,
  } = await supabase
    .from("users")
    .select(PUBLIC_USER_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError(
      "No se pudo consultar el usuario",
      500,
    );
  }

  return mapUser(user);
};