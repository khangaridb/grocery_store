import { connectDb } from "./src/mongoose";
import BuildingModel from "./src/models/building";
import UserModel from "./src/models/user";
import dotenv from "dotenv";

dotenv.config();

const initDb = async () => {
  const connection = await connectDb();

  const dbName = connection.connection.db.databaseName;
  console.log(`drop and create database: ${dbName}`);

  await connection.connection.dropDatabase();

  const datas = require("./datas.json");

  const buildings: Record<string, string> = {};

  const users = [];

  let buildingCount = 0;

  for (const data of datas) {
    let childBuildingIds = [];

    if (data.childBuildingNames) {
      for (const name of data.childBuildingNames) {
        childBuildingIds.push(buildings[name]);
      }
    }

    const building = await BuildingModel.create({
      name: data.name,
      type: data.type,
      childBuildingIds,
    });

    users.push({
      name: `Test employee ${buildingCount}`,
      role: "Employee",
      email: `employee${buildingCount}@gmail.com`,
      buildingId: building._id.toString(),
    });

    users.push({
      name: `Test manager ${buildingCount}`,
      role: "Manager",
      email: `manager${buildingCount}@gmail.com`,
      buildingId: building._id.toString(),
    });

    buildings[building.name] = building._id.toString();
    buildingCount++;
  }

  await UserModel.insertMany(users);

  process.exit();
};

initDb();

export { initDb };
