import { Message } from "node-nats-streaming";
import { Subjects, TicketUpdatedEvent, Listener } from "@preeti097/common";

import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.id);
    if (!ticket) {
      throw new Error("Ticket Not Found");
    }
    const { title, price } = data;
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
}
