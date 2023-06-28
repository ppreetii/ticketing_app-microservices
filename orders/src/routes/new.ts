import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { requireAuth, validateRequest, NotFoundError, BadRequestError, OrderStatus } from "@preeti097/common";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const EXPIRATION_SEC = 2 * 60;

const router = express.Router();

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("Invalid TicketId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {ticketId} = req.body;
    const ticket = await Ticket.findById(ticketId);
    if(!ticket){
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if(isReserved){
      throw new BadRequestError("Ticket is already reserved");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SEC);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    });
    await order.save();
    //TODO: Work on Publish events
    res.status(201).send(order);
  }
);

export { router as newOrderRouter };