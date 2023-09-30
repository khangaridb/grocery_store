import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_URL = "" } = process.env;

mongoose.Promise = global.Promise;

mongoose.connection
  .on("connected", () => {
    console.log(`Connected to the database: ${MONGO_URL}`);
  })
  .on("disconnected", () => {
    console.log(`Disconnected from the database: ${MONGO_URL}`);
  })
  .on("error", (error) => {
    console.log(`Database connection error: ${MONGO_URL}`, error);
  });

export const connectDb = (URL?: string) => {
  let dbUrl = URL ?? MONGO_URL;

  return mongoose.connect(dbUrl, { autoIndex: true, autoCreate: true });
};
