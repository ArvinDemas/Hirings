import { ApiError } from "../utils/api-error.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { authService } from "../modules/auth/auth.service.js";

export async function authenticate(req, _res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token is required.");
    }

    const token = authorization.split(" ")[1];
    const payload = verifyAccessToken(token);
    req.user = await authService.findPublicUserById(payload.sub);

    next();
  } catch (error) {
    next(error);
  }
}
