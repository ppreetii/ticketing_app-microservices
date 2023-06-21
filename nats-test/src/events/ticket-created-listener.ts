import { Message } from "node-nats-streaming";

import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    readonly subject: Subjects.TicketCreated  = Subjects.TicketCreated;
    queueGroupName: string = "payments-service";

    onMessage(data: any, msg: Message): void {
        console.log("Ticket Created Event data:", data);
        msg.ack();
    }
}