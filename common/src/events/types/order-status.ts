export enum OrderStatus {
  //order is created, but ticket is not yet reserved
  Created = "created",
  //ticket is reserved already, or user cancelled the order, or order expired before payment
  Cancelled = "cancelled",
  //order successfully reserved the ticket
  AwaitingPayment = "awaiting:payment",
  //order has reserved the ticket and user has provided payment successfully
  Complete = "complete",
}
