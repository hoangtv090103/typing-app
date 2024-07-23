const base = require("./baseController");
const User = require("../models/userModel");
import { type Request, type Response, type NextFunction } from "express";

exports.deleteMe = async (
  req: Request & { user: { id: string } },
  res: Response,
  next: NextFunction
) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      active: false,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = base.getAll(User);
exports.getUser = base.getOne(User);

exports.updateUser = base.updateOne(User);
exports.deleteUser = base.deleteOne(User);
