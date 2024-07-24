import { type Request, type Response, type NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import User from "../models/userModel";
import AppError from "../utils/appError";

// Định nghĩa thêm cho decoded JWT payload
interface DecodedToken extends JwtPayload {
  id: string;
}

// Type định nghĩa cho User Document, có thể thay đổi tùy theo User Model của bạn
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

const createToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // 1) check if the token is there
    let token: string | undefined;
    console.log(req.headers.authorization);
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError(
          401,
          "fail",
          "You are not logged in! Please login to continue"
        )
      );
    }

    // 2) Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;

    // 3) check if the user exists (not deleted)
    const user = (await User.findById(decoded.id)) as UserDocument | null;
    if (!user) {
      return next(new AppError(401, "fail", "This user no longer exists"));
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

// Authorization check if the user has rights to do this action
export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "fail", "You are not allowed to perform this action")
      );
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

    // 3) All correct, send jwt to client
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

    const user = User.create({
      email,
      password,
      name,
    });

    const token = createToken((await user).id);

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
