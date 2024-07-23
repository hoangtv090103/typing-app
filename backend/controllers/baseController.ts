const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures");
import { type NextFunction, type Request, type Response } from "express";

interface Model {
  findByIdAndDelete: (id: string) => Promise<any>;
  findByIdAndUpdate: (id: string, data: any, options: any) => Promise<any>;
  create: (data: any) => Promise<any>;
  findById: (id: string) => Promise<any>;
  find: () => Promise<any>;
}

exports.deleteOne =
  (Model: Model) =>
  async (req: Request & { params: any }, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(
          new AppError(404, "fail", "No document found with that id")
        );
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

exports.updateOne =
  (Model: Model) =>
  async (req: Request & { params: any }, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });

      if (!doc) {
        return next(
          new AppError(404, "fail", "No document found with that id")
        );
      }

      res.status(200).json({
        status: "success",
        data: {
          doc,
        },
      });
    } catch (error) {
      next(error);
    }
  };

exports.createOne =
  (Model: Model) =>
  async (req: Request & { params: any }, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          doc,
        },
      });
    } catch (error) {
      next(error);
    }
  };

exports.getOne =
  (Model: Model) =>
  async (req: Request & { params: any }, res: Response, next: NextFunction) => {
    try {
      const doc = await Model.findById(req.params.id);

      if (!doc) {
        return next(
          new AppError(404, "fail", "No document found with that id")
        );
      }

      res.status(200).json({
        status: "success",
        data: {
          doc,
        },
      });
    } catch (error) {
      next(error);
    }
  };

exports.getAll =
  (Model: Model) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const features = new APIFeatures(Model.find(), req.query)
        .sort()
        .paginate();

      const doc = await features.query;

      res.status(200).json({
        status: "success",
        results: doc.length,
        data: {
          data: doc,
        },
      });
    } catch (error) {
      next(error);
    }
  };
