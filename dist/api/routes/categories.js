"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const categories_1 = __importDefault(require("../models/categories"));
const router = (0, express_1.Router)();
router.get("/", (req, res, next) => {
    res.status(200).json({
        message: "Handling GET reques to /categories",
    });
});
router.post("/", (req, res, next) => {
    const category = new categories_1.default({
        _id: new mongoose_1.default.Types.ObjectId(),
        name: req.body.name,
    });
    category
        .save()
        .then((result) => {
        console.log(result);
        res.status(201).json({
            message: "Handling POST reques to /categories",
            createdCategory: result,
        });
    })
        .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err,
        });
    });
});
router.get("/:categoriesId", (req, res, next) => {
    const id = req.params.categoriesId;
    categories_1.default.findById(id)
        .exec()
        .then((doc) => {
        console.log("from database", doc);
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
        }
    })
        .catch((err) => {
        if (err.name === "CastError") {
            res
                .status(404)
                .json({ message: "No valid entry found for provided ID" });
        }
        else {
            console.log(err);
            res.status(500).json({ error: err });
        }
    });
});
router.patch("/:categoriesId", (req, res, next) => {
    res.status(200).json({
        message: "upated category",
    });
});
router.delete("/:categoriesId", (req, res, next) => {
    res.status(200).json({
        message: "deleted category",
    });
});
exports.default = router;
