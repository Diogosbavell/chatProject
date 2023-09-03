import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";

export const handleError: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof MulterError) {
    res.json({ err: err.code });
    next();
  } else {
    if (err.status) {
      res.status(err.status);
    } else {
      res.status(400);
    }
    if (err.message) {
      res.json({ err: err.message });
    } else {
      res.json({ err: "Aconteceu algum erro!" });
    }
  }
};
