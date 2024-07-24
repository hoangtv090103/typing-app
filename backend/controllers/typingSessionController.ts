import jwt, { type JwtPayload } from "jsonwebtoken";

import base from "./baseController";
import TypingSession from "../models/typingSessionModel";
import type { Request, Response } from "express";

interface DecodedToken extends JwtPayload {
  id: string;
}
interface AuthenticatedRequest extends Request {
  headers: {
    authorization: string;
  };
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

    console.log(req.headers.authorization);
    

    const token = req.headers.authorization.split(" ")[1];
    
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as DecodedToken;
    
    const typingSessions = await TypingSession.find({
      userId: decoded.id,
    }).populate("textSampleId");

    res.status(200).json({ typingSessions });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

export const createTypingSession = base.createOne(TypingSession);

export const getTypingSessionById = base.getOne(TypingSession);
