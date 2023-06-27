import express, { Request, Response } from "express";
import { NotFoundError, validateRequest } from "@preeti097/common";
import { param } from "express-validator";
import mongoose from "mongoose";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  [
    param("id")
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid TicketId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
   const ticket = await Ticket.findById(req.params.id);

   if(!ticket){
    throw new NotFoundError();
   }

   res.send(ticket);
  }
);

export { router as showTicketRouter };
