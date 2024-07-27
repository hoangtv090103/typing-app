import type { Request, Response, NextFunction } from "express";
const gemini = require("../config/gemini");

const getText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let text = await gemini.run("Please generate random words for typing practice.");

    if (!text) {
      text = "The quick brown fox jumps over the lazy dog.";
    }

    console.log(text);

    return res.status(200).json({
      status: "success",
      data: {
        text,
      },
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

module.exports = {
  getText,
};
