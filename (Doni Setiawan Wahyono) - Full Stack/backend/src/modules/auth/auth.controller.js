import { authService } from "./auth.service.js";

export async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({
      message: "Registration successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await authService.login(req.body);
    res.status(200).json({
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  res.status(200).json({
    message: "Authenticated user fetched successfully.",
    data: {
      user: req.user,
    },
  });
}
