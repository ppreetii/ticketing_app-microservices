import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
  var signin: () => string[];
}

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = "secret";
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

global.signin = () => {
  const token = jwt.sign(
    {
      id: new mongoose.Types.ObjectId().toHexString(),
      email: "test@test.com",
    },
    process.env.JWT_KEY!
  );

  const sessionJSON = JSON.stringify({
    jwt: token,
  });

  const base64 = Buffer.from(sessionJSON).toString("base64");
  return [`session=${base64}`];
};
