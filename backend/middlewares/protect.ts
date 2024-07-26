import { type Request, type Response, type NextFunction } from "express";

const User = require("../models/userModel");
const { decodeJWT } = require("../utils/jwt");

interface UserDocument {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
  correctPassword: (
    candidatePassword: string,
    userPassword: string
  ) => Promise<boolean>;
}

interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) check if the token is there
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "You're not logged in" });
    }

    // 2) Verify token
    const decoded = decodeJWT(token);

    // 3) check if the user exists (not deleted)
    const user = (await User.findById(decoded?.id)) as UserDocument | null;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = protect;
