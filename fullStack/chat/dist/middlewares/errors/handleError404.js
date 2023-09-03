"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError404 = void 0;
const handleError404 = (req, res) => {
    res.status(404).send("Page not found!");
};
exports.handleError404 = handleError404;
