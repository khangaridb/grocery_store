import { CreateUserInput, UpdateUserInput, RegisterUserInput } from "./user.types";
import UserModel, { UserType } from "../models/user";
import mongoose from "mongoose";
import BuildingModel from "../models/building";
import { UserTypes } from "../common/constants";

const { ObjectId } = mongoose.Types;

export class UserService {
  public async registerUser(inputs: RegisterUserInput): Promise<UserType | null> {
    const { email, password, name, role, buildingId } = inputs;

    const user = await UserModel.create({
      email,
      password,
      name,
      role,
      buildingId,
    });

    return await UserModel.findOne(
      { _id: user._id },
      {
        role: 1,
        name: 1,
        email: 1,
      }
    );
  }

  public async createUser(inputs: CreateUserInput): Promise<UserType> {
    const { name, buildingId, role, email } = inputs;
    return await UserModel.create({ name, buildingId, role, email });
  }

  public async updateUser(id: string, inputs: UpdateUserInput): Promise<UserType | null> {
    const userId = new ObjectId(id);

    const { name, buildingId, role, email } = inputs;

    const user = await UserModel.findById(userId);

    if (!user) throw new Error("User not found");

    await UserModel.updateOne(
      { _id: userId },
      {
        $set: {
          name,
          buildingId,
          role,
          email,
        },
      }
    );

    const updatedUser = await UserModel.findOne(
      { _id: userId },
      {
        role: 1,
        name: 1,
        email: 1,
        buildingId: 1,
      }
    );

    return updatedUser;
  }

  public async removeUser(id: string) {
    return await UserModel.findOneAndRemove({ _id: new ObjectId(id) });
  }

  public async findByEmail(email: string): Promise<UserType | null> {
    return await UserModel.findOne({ email });
  }

  public async getUsersByBuildingId(buildingId: string, userTypes: string[], includeDescendant?: boolean) {
    let buildingIdFilter: any = buildingId;

    if (includeDescendant) {
      const result = await BuildingModel.aggregate([
        {
          $match: {
            _id: new ObjectId(buildingId),
          },
        },
        {
          $graphLookup: {
            from: "buildings",
            startWith: "$childBuildingIds",
            connectFromField: "childBuildingIds",
            connectToField: "_id",
            as: "childBuildings",
          },
        },
        {
          $project: {
            _id: 0,
            ids: "$childBuildings._id",
          },
        },
      ]);

      buildingIdFilter = { $in: result[0].ids.concat(buildingId) };
    }

    return await UserModel.find({
      buildingId: buildingIdFilter,
      role: { $in: userTypes },
    });
  }
}

const userService = new UserService();

export default userService;
