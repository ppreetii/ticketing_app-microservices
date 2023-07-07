import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotAuthorizedError,
  NotFoundError,
} from "@preeti097/common";
import { body } from "express-validator";

import { Ticket } from "../models/ticket";
import { TicketUpdatedPublisher } from "../events/publishers/tickets-updated-publisher";
import { natsWrapper } from "../nats-wrapper";
import { param } from "express-validator";
import mongoose from "mongoose";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuth,
  [
    body("title").not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0."),
    param("id")
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid TicketId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    ticket.set({
      title,
      price,
    });

    await ticket.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version
    });

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
