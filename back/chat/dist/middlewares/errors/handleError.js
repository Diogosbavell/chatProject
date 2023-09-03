"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const multer_1 = require("multer");
const handleError = (err, req, res, next) => {
    if (err instanceof multer_1.MulterError) {
        res.json({ err: err.code });
        next();
    }
    else {
        if (err.status) {
            res.status(err.status);
        }
        else {
            res.status(400);
        }
        if (err.message) {
            res.json({ err: err.message });
        }
        else {
            res.json({ err: "Aconteceu algum erro!" });
        }
    }
};
exports.handleError = handleError;
