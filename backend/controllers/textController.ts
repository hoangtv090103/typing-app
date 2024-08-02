import type { Request, Response, NextFunction } from "express";
const { paragraph } = require("txtgen");


const getText = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const text = await paragraph();
    return res.status(200).json({
      status: "success",
        text,

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
