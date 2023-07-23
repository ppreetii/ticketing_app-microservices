import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler, NotFoundError,currentUser } from "@preeti097/common";
import cookieSession from "cookie-session";

import { newOrderRouter } from "./routes/new";
import {showOrderRouter} from "./routes/show";
import {indexOrderRouter} from "./routes/index";
import {deleteOrderRouter} from "./routes/delete";

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
app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(indexOrderRouter);
app.use(deleteOrderRouter);
app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
