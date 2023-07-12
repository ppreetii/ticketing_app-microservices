import { Subjects, Publisher, ExpirationCompleteEvent } from "@preeti097/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}