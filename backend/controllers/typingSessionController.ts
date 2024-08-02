import { decode, type JwtPayload } from "jsonwebtoken";

const base = require("./baseController");
import TypingSession from "../models/typingSessionModel";
import type { NextFunction, Request, Response } from "express";

import { decodeJWT } from "../utils/jwt";
import AppError from "../utils/appError";
interface SessionRequest extends AuthenticatedRequest {
  body: {
    wpm: number;
    mistakes: number;
    originalText: string;
    typedText: string;
    duration: number;
    accuracy: number;
  };
}

interface AuthenticatedRequest extends Request {
  headers: {
    authorization: string;
  };
  body: any;
}

// Lấy danh sách phiên luyện tập của người dùng
export const getUserTypingSessions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const decoded = decode(token) as JwtPayload;

    const typingSessions = await TypingSession.find({
      userId: decoded.id,
    });

    res.status(200).json({
      message: "Typing sessions retrieved successfully",
      sessions: typingSessions,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const createTypingSession = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token: string = "";
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    const decoded = decodeJWT(token);

    if (!decoded) {
      return next(
        new AppError(401, "fail", "Invalid token. Please login again")
      );
    }

    const userId = decoded?.id;

    const { wpm, mistakes, originalText, typedText, duration, accuracy } =
      req.body;

    const session = await TypingSession.create({
      userId,
      wpm,
      accuracy,
      mistakes,
      originalText,
      typedText,
      duration,
    });

    res.status(201).json({
      message: "Typing Sessions created successfully",
      data: session,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

export const getTypingSessionById = base.getOne(TypingSession);
