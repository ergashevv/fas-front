import { RequestHandler } from "express";
import { Category } from "../models/Category";

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
export const getCategories: RequestHandler = async (_req, res) => {
  try {
    const categories = await Category.find().sort({ title: 1 }).lean();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /api/categories/{slug}:
 *   get:
 *     summary: Get a single category by slug
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: Category slug
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 */
export const getCategoryBySlug: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *           example:
 *             slug: "new-category"
 *             title: "New Category"
 *             icon: "🏷️"
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Invalid input
 */
export const createCategory: RequestHandler = async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Invalid input" });
  }
};

/**
 * @swagger
 * /api/categories/{slug}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated
 *       404:
 *         description: Category not found
 */
export const updateCategory: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndUpdate({ slug }, req.body, { new: true }).lean();
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error: any) {
    res.status(400).json({ message: error.message || "Server error" });
  }
};

/**
 * @swagger
 * /api/categories/{slug}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 */
export const deleteCategory: RequestHandler = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOneAndDelete({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

