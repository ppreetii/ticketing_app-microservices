import express, { Request, Response } from "express";
import { requireAuth,validateRequest } from "@preeti097/common";
import { body } from "express-validator";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {}
);

export { router as createTicketRouter };
