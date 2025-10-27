import { Request, Response, NextFunction, RequestHandler } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";
const JWT_EXPIRES_IN = "30d";

// Extend Express Request type
export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

// Auth middleware
export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Tizimga kirish talab qilinadi" 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Foydalanuvchi topilmadi" 
      });
    }

    req.user = user;
    req.userId = user._id.toString();
    next();
  } catch (error: any) {
    res.status(401).json({ 
      success: false,
      message: "Token yaroqsiz",
      error: error.message 
    });
  }
};

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */
export const signup: RequestHandler = async (req, res) => {
  try {
    const { name, phone, password, email } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Ism, telefon raqam va parol majburiy" 
      });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: "Bu telefon raqam allaqachon ro'yxatdan o'tgan" 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      phone,
      password: hashedPassword,
      email: email || undefined
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).json({
      success: true,
      message: "Ro'yxatdan o'tish muvaffaqiyatli",
      token,
      user: user.toJSON()
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    res.status(500).json({ 
      success: false,
      message: "Serverda xatolik yuz berdi",
      error: error.message 
    });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - password
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Telefon raqam va parol majburiy" 
      });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Telefon raqam yoki parol noto'g'ri" 
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Telefon raqam yoki parol noto'g'ri" 
      });
    }

    const token = jwt.sign(
      { userId: user._id, phone: user.phone },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: "Tizimga kirish muvaffaqiyatli",
      token,
      user: user.toJSON()
    });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Serverda xatolik yuz berdi",
      error: error.message 
    });
  }
};

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Unauthorized
 */
export const getMe: RequestHandler = async (req: AuthRequest, res) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Token topilmadi" 
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Foydalanuvchi topilmadi" 
      });
    }

    res.json({
      success: true,
      user: user.toJSON()
    });
  } catch (error: any) {
    res.status(401).json({ 
      success: false,
      message: "Token yaroqsiz",
      error: error.message 
    });
  }
};

/**
 * @swagger
 * /api/auth/update-profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       401:
 *         description: Unauthorized
 */
export const updateProfile: RequestHandler = async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ 
        success: false,
        message: "Tizimga kirish talab qilinadi" 
      });
    }

    const { name, email } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "Foydalanuvchi topilmadi" 
      });
    }

    res.json({
      success: true,
      message: "Profil yangilandi",
      user: user.toJSON()
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: "Serverda xatolik yuz berdi",
      error: error.message 
    });
  }
};
