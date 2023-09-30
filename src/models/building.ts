import mongoose from "mongoose";

const schemaName = "Building";

export interface BuildingType {
  name: string;
  type: string;
  childBuildingIds: mongoose.Types.ObjectId[];
}

const schema = new mongoose.Schema<BuildingType>(
  {
    name: { type: String },
    type: { type: String },
    childBuildingIds: { type: [mongoose.Schema.Types.ObjectId], Ref: "Building" },
  },
  {
    timestamps: true,
  }
);

const BuildingModel = mongoose.model<BuildingType>(schemaName, schema);

export default BuildingModel;
