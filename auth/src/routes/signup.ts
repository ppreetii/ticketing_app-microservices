import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from 'jsonwebtoken';
import {BadRequestError,validateRequest} from "@preeti097/common";

import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password must be between 4 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    try {     
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("Email in use")
      }

      const user = User.build({ email, password });
      await user.save();
      const userJwt = jwt.sign({
        id: user._id,
        email: user.email
      },
      process.env.JWT_KEY!);

      req.session = {
        jwt : userJwt
      }
      res.status(201).send(user);
    } catch (error) {
      throw error;
    }
  }
);

export { router as signupRouter };
