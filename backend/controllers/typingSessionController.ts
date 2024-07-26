import { decode, type JwtPayload } from "jsonwebtoken";

const base = require("./baseController");
import TypingSession from "../models/typingSessionModel";
import type { NextFunction, Request, Response } from "express";
const {
  calculateAccuracy,
  calculateMistakes,
  calculateWPM,
} = require("../utils/typing");
import { decodeJWT } from "../utils/jwt";
import AppError from "../utils/appError";
interface SessionRequest extends AuthenticatedRequest {
  body: {
    originalText: string;
    typedText: string;
    duration: number;
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
    }).populate("textSampleId");

    res.status(200).json({ typingSessions });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const createTypingSession = async (
  req: SessionRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const wpm = calculateWPM(req.body);
    const accuracy = calculateAccuracy(req.body);
    const mistakes = calculateMistakes(req.body);

    const token = req.headers.authorization;
    const decoded = decodeJWT(token);

    if (!decoded) {
      return next(
        new AppError(401, "fail", "Invalid token. Please login again")
      );
    }

    const userId = decoded?.id;

    const session = await TypingSession.create({
      ...req.body,
      userId,
      wpm,
      accuracy,
      mistakes,
    });

    res.status(201).json({
      message: "Typing Sessions created successfully",
      data: session,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const getTypingSessionById = base.getOne(TypingSession);
