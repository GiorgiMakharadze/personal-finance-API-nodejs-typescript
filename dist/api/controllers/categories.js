"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Categories_delete_category = exports.Categories_change_category = exports.Categories_get_category = exports.Categories_create_category = exports.Categories_get_all = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const categories_1 = __importDefault(require("../models/categories"));
const default_1 = __importDefault(require("../models/default"));
const Categories_get_all = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryQuery = categories_1.default.find().select("name _id");
        const defaultsQuery = default_1.default.find().select("name _id description amount status type");
        const results = yield Promise.all([
            categoryQuery.exec(),
            defaultsQuery.exec(),
        ]);
        const [categories, defaults] = results;
        const response = {
            categories: categories.map((category) => ({
                name: category.name,
                _id: category._id,
            })),
            defaults: defaults.map((defaults) => ({
                name: defaults.name,
                description: defaults.description,
                type: defaults.type,
                amount: defaults.amount,
                status: defaults.status,
                _id: defaults._id,
            })),
        };
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Categories_get_all = Categories_get_all;
const Categories_create_category = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryName = yield categories_1.default.findOne({ name: req.body.name });
        if (Object.keys(req.body).length !== 1 || !req.body.name) {
            return res.status(400).json({
                error: "Please provide only the category name",
            });
        }
        else if (categoryName) {
            return res.status(400).json({
                error: "Category with the same name already exists",
            });
        }
        const category = new categories_1.default({
            _id: new mongoose_1.default.Types.ObjectId(),
            name: req.body.name,
        });
        const result = yield category.save();
        res.status(201).json({
            message: "Created category successfully",
            createdCategory: {
                name: result.name,
                _id: result._id,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Categories_create_category = Categories_create_category;
const Categories_get_category = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.categoriesId;
        const [categoryDoc, defaultDoc] = yield Promise.all([
            categories_1.default.findById(id).select("name _id").exec(),
            default_1.default.findById(id)
                .select("name _id description amount status type")
                .exec(),
        ]);
        const doc = categoryDoc || defaultDoc;
        if (doc) {
            res.status(200).json(doc);
        }
        else {
            res.status(404).json({ error: "No valid entry found for provided ID" });
        }
    }
    catch (error) {
        if (error.name === "CastError") {
            res.status(404).json({ error: "No valid entry found for provided ID" });
        }
        else {
            res.status(500).json({ error });
        }
    }
});
exports.Categories_get_category = Categories_get_category;
const Categories_change_category = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryName = yield categories_1.default.findOne({ name: req.body.name });
        if (Object.keys(req.body).length !== 1 || !req.body.name) {
            return res.status(400).json({
                error: "Please provide only the category name",
            });
        }
        else if (categoryName) {
            return res.status(400).json({
                error: "Your  new category name can't be the same as your old category name ",
            });
        }
        const id = req.params.categoriesId;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "No valid entry found for provided ID",
            });
        }
        const result = yield categories_1.default.updateOne({ _id: id }, { $set: { name: req.body.name } }).exec();
        res.status(200).json({
            message: "Category updated",
        });
    }
    catch (error) {
        res.status(500).json({
            error,
        });
    }
});
exports.Categories_change_category = Categories_change_category;
const Categories_delete_category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.categoriesId;
    try {
        let deletedCategory = yield categories_1.default.findByIdAndRemove({ _id: id })
            .select("name _id")
            .exec();
        if (!deletedCategory) {
            return res
                .status(404)
                .json({ error: "No valid entry found for provided ID" });
        }
        yield default_1.default.create({ name: deletedCategory === null || deletedCategory === void 0 ? void 0 : deletedCategory.name });
        const { name } = deletedCategory;
        const message = `${name} is moved to defaults`;
        res.status(200).json({ message, deletedCategory });
    }
    catch (error) {
        if (error.name === "CastError") {
            return res
                .status(404)
                .json({ error: "No valid entry found for provided ID" });
        }
        res.status(500).json({ error });
    }
});
exports.Categories_delete_category = Categories_delete_category;
