import mongoose from "mongoose";

import { app } from "./app";
import { natsWrapper } from "./nats-wrapper";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined.");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined.");
  }
  try {
    await natsWrapper.connect('ticketing', 'abc', 'http://nats-srv:4222');
    natsWrapper.client.on('close', ()=>{
      console.log("NATS Connection Closed.");
      process.exit();
    });

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to database: ", process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000!!!!!!!!");
  });
};

start();
