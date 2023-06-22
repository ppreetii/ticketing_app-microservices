import { Publisher,Subjects,TicketCreatedEvent } from "@preeti097/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated;
}