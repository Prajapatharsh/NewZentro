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
exports.ProductController = void 0;
const asyncHandler_1 = __importDefault(require("@/shared/utils/asyncHandler"));
const sendResponse_1 = __importDefault(require("@/shared/utils/sendResponse"));
const slugify_1 = __importDefault(require("@/shared/utils/slugify"));
const logs_factory_1 = require("../logs/logs.factory");
const uploadToCloudinary_1 = require("@/shared/utils/uploadToCloudinary");
const AppError_1 = __importDefault(require("@/shared/errors/AppError"));
class ProductController {
    constructor(productService) {
        this.productService = productService;
        this.logsService = (0, logs_factory_1.makeLogsService)();
        this.getAllProducts = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { products, totalResults, totalPages, currentPage, resultsPerPage, } = yield this.productService.getAllProducts(req.query);
            (0, sendResponse_1.default)(res, 200, {
                data: {
                    products,
                    totalResults,
                    totalPages,
                    currentPage,
                    resultsPerPage,
                },
                message: "Products fetched successfully",
            });
        }));
        this.getProductById = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: productId } = req.params;
            const product = yield this.productService.getProductById(productId);
            (0, sendResponse_1.default)(res, 200, {
                data: product,
                message: "Product fetched successfully",
            });
        }));
        this.getProductBySlug = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { slug: productSlug } = req.params;
            const product = yield this.productService.getProductBySlug(productSlug);
            (0, sendResponse_1.default)(res, 200, {
                data: product,
                message: "Product fetched successfully",
            });
        }));
        this.createProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { name, description, isNew, isTrending, isBestSeller, isFeatured, categoryId, } = req.body;
            // Parse variants from req.body
            let variants = req.body.variants;
            if (typeof variants === "string") {
                try {
                    variants = JSON.parse(variants);
                }
                catch (error) {
                    // If parsing fails, it might be the FormData format, so we'll try that next
                }
            }
            if (!Array.isArray(variants)) {
                // Try parsing from variants[0][sku] etc. (FormData format)
                let parsedVariants = [];
                for (const key in req.body) {
                    const match = key.match(/^variants\[(\d+)\]\[(\w+)\]$/);
                    if (match) {
                        const index = parseInt(match[1]);
                        const field = match[2];
                        if (!parsedVariants[index]) {
                            parsedVariants[index] = {};
                        }
                        parsedVariants[index][field] = req.body[key];
                    }
                }
                variants = parsedVariants.filter(Boolean);
            }
            // Log for debugging
            console.log("Processed variants count:", variants.length, "req.files count:", ((_a = req.files) === null || _a === void 0 ? void 0 : _a.length) || 0);
            if (variants.length === 0) {
                throw new AppError_1.default(400, "At least one variant is required");
            }
            // Upload images to Cloudinary
            const files = req.files || [];
            let imageResults = [];
            if (files.length > 0) {
                try {
                    imageResults = yield (0, uploadToCloudinary_1.uploadToCloudinary)(files);
                    if (imageResults.length === 0) {
                        throw new AppError_1.default(400, "Failed to upload images to Cloudinary");
                    }
                }
                catch (error) {
                    console.error("Cloudinary upload error:", error);
                    throw new AppError_1.default(400, "Failed to upload images to Cloudinary");
                }
            }
            // Process variants
            const processedVariants = variants.map((variant, index) => {
                // Parse JSON fields
                let attributes = [];
                let imageIndexes = [];
                try {
                    attributes = JSON.parse(variant.attributes || "[]");
                    imageIndexes = JSON.parse(variant.imageIndexes || "[]");
                }
                catch (error) {
                    console.error(`Error parsing JSON for variant ${index}:`, error);
                    throw new AppError_1.default(400, `Invalid JSON format in variant ${index}`);
                }
                // Map image URLs based on imageIndexes
                const imageUrls = imageIndexes
                    .map((idx) => {
                    if (idx >= 0 && idx < imageResults.length) {
                        return imageResults[idx].url;
                    }
                    console.warn(`Invalid image index ${idx} for variant ${index}`);
                    return null;
                })
                    .filter((url) => url !== null);
                return Object.assign(Object.assign({}, variant), { price: parseFloat(variant.price), stock: parseInt(variant.stock, 10), lowStockThreshold: parseInt(variant.lowStockThreshold || "10", 10), attributes, images: imageUrls });
            });
            // Create product
            const product = yield this.productService.createProduct({
                name,
                description,
                isNew: isNew === "true",
                isTrending: isTrending === "true",
                isBestSeller: isBestSeller === "true",
                isFeatured: isFeatured === "true",
                categoryId,
                variants: processedVariants,
            });
            // Send response
            res.status(201).json({
                status: "success",
                data: { product },
                message: "Product created successfully",
            });
        }));
        this.updateProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id: productId } = req.params;
            const { name, description, categoryId, isNew, isFeatured, isTrending, isBestSeller, } = req.body;
            console.log("req.body:", req.body, "req.files:", req.files);
            // Parse variants from req.body
            let parsedVariants = [];
            if (req.body.variants) {
                if (typeof req.body.variants === "string") {
                    try {
                        parsedVariants = JSON.parse(req.body.variants);
                    }
                    catch (error) {
                        // Might be FormData format
                    }
                }
                else if (Array.isArray(req.body.variants)) {
                    parsedVariants = req.body.variants;
                }
            }
            if (parsedVariants.length === 0) {
                for (const key in req.body) {
                    if (key.startsWith("variants[")) {
                        const match = key.match(/^variants\[(\d+)\]\[(\w+)\]$/);
                        if (match) {
                            const index = parseInt(match[1]);
                            const field = match[2];
                            if (!parsedVariants[index]) {
                                parsedVariants[index] = {};
                            }
                            parsedVariants[index][field] = req.body[key];
                        }
                    }
                }
            }
            parsedVariants = parsedVariants.filter(Boolean);
            // Process files for each variant
            const files = req.files || [];
            const processedVariants = parsedVariants.length
                ? yield Promise.all(parsedVariants.map((variant, index) => __awaiter(this, void 0, void 0, function* () {
                    // Try to get files from imageIndexes or variants[${index}][images][${fileIndex}]
                    let variantFiles = [];
                    let imageIndexes = [];
                    try {
                        imageIndexes = variant.imageIndexes
                            ? JSON.parse(variant.imageIndexes)
                            : [];
                        if (Array.isArray(imageIndexes)) {
                            variantFiles = imageIndexes
                                .map((idx) => files.find((f) => f.fieldname === `images` && files.indexOf(f) === idx))
                                .filter(Boolean);
                        }
                    }
                    catch (_a) {
                        // Fallback to old format
                        variantFiles = files.filter((f) => f.fieldname.startsWith(`variants[${index}][images][`));
                    }
                    // Upload files to Cloudinary
                    let imageUrls = [];
                    if (variantFiles.length > 0) {
                        const uploadedImages = yield (0, uploadToCloudinary_1.uploadToCloudinary)(variantFiles);
                        imageUrls = uploadedImages
                            .map((img) => img.url)
                            .filter(Boolean);
                    }
                    // Validate images from req.body
                    let bodyImages = variant.images || [];
                    if (typeof bodyImages === "string") {
                        try {
                            bodyImages = JSON.parse(bodyImages);
                        }
                        catch (_b) {
                            throw new AppError_1.default(400, `Invalid images format at variant index ${index}`);
                        }
                    }
                    if (!Array.isArray(bodyImages) ||
                        bodyImages.some((img) => img && typeof img !== "string")) {
                        throw new AppError_1.default(400, `Images at variant index ${index} must be an array of strings or empty`);
                    }
                    // Combine uploaded images with body images
                    imageUrls = [
                        ...imageUrls,
                        ...bodyImages.filter((img) => img),
                    ];
                    // Parse numeric fields
                    const price = parseFloat(variant.price);
                    const stock = parseInt(variant.stock, 10);
                    // Validate numeric fields
                    if (!variant.sku || isNaN(price) || isNaN(stock)) {
                        throw new AppError_1.default(400, `Variant at index ${index} must have sku, price, and stock`);
                    }
                    // Parse and validate attributes
                    let parsedAttributes = variant.attributes || [];
                    if (typeof parsedAttributes === "string") {
                        try {
                            parsedAttributes = JSON.parse(parsedAttributes);
                        }
                        catch (_c) {
                            throw new AppError_1.default(400, `Invalid attributes format at index ${index}`);
                        }
                    }
                    if (!Array.isArray(parsedAttributes)) {
                        throw new AppError_1.default(400, `Attributes at index ${index} must be an array`);
                    }
                    return {
                        sku: variant.sku,
                        price,
                        stock,
                        lowStockThreshold: variant.lowStockThreshold
                            ? parseInt(variant.lowStockThreshold, 10)
                            : 10,
                        barcode: variant.barcode,
                        warehouseLocation: variant.warehouseLocation,
                        attributes: parsedAttributes,
                        images: imageUrls,
                    };
                })))
                : undefined;
            if (processedVariants) {
                // Check for duplicate SKUs
                const skuKeys = processedVariants.map((variant) => variant.sku);
                if (new Set(skuKeys).size !== skuKeys.length) {
                    throw new AppError_1.default(400, "Duplicate SKUs detected");
                }
                // Check for duplicate attribute combinations
                const comboKeys = processedVariants.map((variant) => variant.attributes
                    .map((attr) => `${attr.attributeId}:${attr.valueId}`)
                    .sort()
                    .join("|"));
                if (new Set(comboKeys).size !== comboKeys.length) {
                    throw new AppError_1.default(400, "Duplicate attribute combinations detected");
                }
            }
            const updatedData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (name && { name, slug: (0, slugify_1.default)(name) })), (description && { description })), (isNew !== undefined && { isNew: isNew === "true" })), (isFeatured !== undefined && { isFeatured: isFeatured === "true" })), (isTrending !== undefined && { isTrending: isTrending === "true" })), (isBestSeller !== undefined && {
                isBestSeller: isBestSeller === "true",
            })), (categoryId && { categoryId })), (processedVariants && { variants: processedVariants }));
            const product = yield this.productService.updateProduct(productId, updatedData);
            (0, sendResponse_1.default)(res, 200, {
                data: { product },
                message: "Product updated successfully",
            });
            this.logsService.info("Product updated", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
            });
        }));
        this.bulkCreateProducts = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const file = req.file;
            const result = yield this.productService.bulkCreateProducts(file);
            (0, sendResponse_1.default)(res, 201, {
                data: { count: result.count },
                message: `${result.count} products created successfully`,
            });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Bulk Products created", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
        this.deleteProduct = (0, asyncHandler_1.default)((req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { id: productId } = req.params;
            yield this.productService.deleteProduct(productId);
            (0, sendResponse_1.default)(res, 200, { message: "Product deleted successfully" });
            const start = Date.now();
            const end = Date.now();
            this.logsService.info("Product deleted", {
                userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
                sessionId: req.session.id,
                timePeriod: end - start,
            });
        }));
    }
}
exports.ProductController = ProductController;
