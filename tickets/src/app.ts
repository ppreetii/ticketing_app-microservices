import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError,currentUser } from "@preeti097/common";
import cookieSession from "cookie-session";

import { createTicketRouter } from "./routes/new";
import {showTicketRouter} from "./routes/show";
import {indexTicketRouter} from "./routes/index";
import {updateTicketRouter} from "./routes/update";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", //make it false if you purchased domain without SSL
  })
);
app.use(currentUser);
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);
app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
