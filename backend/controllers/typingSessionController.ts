import type { Request, Response } from "express";
const TypingSession = require("../models/typingSessionModel");
const base = require("./baseController");

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

// Lấy danh sách phiên luyện tập của người dùng
export const getUserTypingSessions = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const typingSessions = await TypingSession.find({
      userId: req.user.id,
    }).populate("textSampleId");
    res.status(200).json({ typingSessions });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

exports.createTypingSession = base.createOne(TypingSession);

exports.getTypingSessionById = base.getOne(TypingSession);
