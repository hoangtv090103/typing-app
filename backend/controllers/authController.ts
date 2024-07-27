import { type Request, type Response, type NextFunction } from "express";

const User = require("../models/userModel");
import AppError from "../utils/appError";
import { createToken } from "../utils/jwt";

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

// Authorization check if the user has rights to do this action
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json("You are not allowed to perform this action");
    }
    next();
  };
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // All correct, send jwt to client
    const token = createToken(user.id);

    // Remove the password from the output
    res.status(200).json({
      status: "success",
      token,
      data: {
        user: {
          name: user.name,
          email: user.email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({
      email,
      password,
      name,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    next(err);
  }
};

// Sử dụng export để xuất các hàm, không cần dùng module.exports trong TypeScript
export default {
  login,
  signup,
};
