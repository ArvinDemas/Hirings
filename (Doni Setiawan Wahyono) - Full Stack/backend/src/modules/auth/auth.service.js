import { ApiError } from "../../utils/api-error.js";
import { signAccessToken } from "../../utils/jwt.js";
import { comparePassword, hashPassword } from "../../utils/password.js";
import { authRepository } from "./auth.repository.js";

async function register(payload) {
  const email = payload.email.toLowerCase();
  const existingUser = await authRepository.findByEmail(email);

  if (existingUser) {
    throw new ApiError(409, "Email is already registered.");
  }

  const passwordHash = await hashPassword(payload.password);
  const user = await authRepository.create({
    fullName: payload.fullName,
    email,
    passwordHash,
  });

  const token = signAccessToken({ sub: user.id, email: user.email, role: user.role });

  return { user, token };
}

async function login(payload) {
  const email = payload.email.toLowerCase();
  const userWithPassword = await authRepository.findByEmail(email);

  if (!userWithPassword) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await comparePassword(payload.password, userWithPassword.passwordHash);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const user = authRepository.toPublicUser(userWithPassword);
  const token = signAccessToken({ sub: user.id, email: user.email, role: user.role });

  return { user, token };
}

async function findPublicUserById(id) {
  const user = await authRepository.findById(id);

  if (!user) {
    throw new ApiError(401, "Authenticated user no longer exists.");
  }

  return user;
}

export const authService = {
  register,
  login,
  findPublicUserById,
};
