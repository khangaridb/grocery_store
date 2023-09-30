import mongoose from "mongoose";

const schemaName = "User";

export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  buildingId: mongoose.Types.ObjectId;
}

const schema = new mongoose.Schema<UserType>(
  {
    name: { type: String },
    password: { type: String },
    email: { type: String, lowercase: true, trim: true, unique: true },
    role: { type: String },
    buildingId: { type: mongoose.Schema.Types.ObjectId, ref: "Building" },
  },
  {
    timestamps: true,
  }
);

schema.index({ email: 1 });
schema.index({ buildingId: 1 });

const UserModel = mongoose.model<UserType>(schemaName, schema);

export default UserModel;
