import { userService } from "../../src/services";
import UserModel from "../../src/models/user";
import BuildingModel from "../../src/models/building";
import { UserTypes } from "../../src/common/constants";
import mongoose from "mongoose";

jest.mock("../../src/models/user", () => ({
  create: jest.fn(),
  updateOne: jest.fn(),
  findById: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneAndRemove: jest.fn(),
}));

jest.mock("../../src/models/building", () => ({
  aggregate: jest.fn(),
}));

describe("User service", () => {
  const mockUser = {
    _id: new mongoose.Types.ObjectId(),
    email: "test@gmail.com",
    password: "password",
    role: "Employee",
    buildingId: new mongoose.Types.ObjectId(),
    name: "test",
  };

  it("should call create with correct inputs", async () => {
    const createSpy = jest.spyOn(UserModel, "create");

    const input = {
      name: "test",
      role: "role",
      buildingId: "123",
    };

    await userService.createUser({
      ...input,
    });

    expect(createSpy).toBeCalledWith(input);
  });

  it("should call findOne with email", async () => {
    const findOneSpy = jest.spyOn(UserModel, "findOne");

    await userService.findByEmail(mockUser.email);

    expect(findOneSpy).toBeCalledWith({ email: mockUser.email });
  });

  it("should call register with correct inputs", async () => {
    jest.spyOn(UserModel, "findOne").mockResolvedValueOnce(mockUser);
    const createSpy = jest.spyOn(UserModel, "create").mockResolvedValueOnce(mockUser as any);

    const input = {
      email: "test",
      password: "test",
    };

    await userService.registerUser({
      ...input,
    });

    expect(createSpy).toBeCalledWith(input);
  });

  it("should call remove user with id", async () => {
    const findOneAndRemoveSpy = jest.spyOn(UserModel, "findOneAndRemove");

    await userService.removeUser(mockUser._id.toString());

    expect(findOneAndRemoveSpy).toBeCalledWith({ _id: mockUser._id });
  });

  describe("Update user", () => {
    it("should return an error, because user not found", async () => {
      expect.assertions(1);

      jest.spyOn(UserModel, "findById").mockResolvedValueOnce(null);

      try {
        await userService.updateUser(new mongoose.Types.ObjectId().toString(), { role: UserTypes.MANAGER });
      } catch (e: any) {
        expect(e.message).toBe("User not found");
      }
    });

    it("should call update with correct inputs", async () => {
      jest.spyOn(UserModel, "findById").mockResolvedValueOnce(mockUser);

      await userService.updateUser(mockUser._id.toString(), { role: UserTypes.MANAGER });

      expect(UserModel.updateOne).toBeCalledWith(
        {
          _id: mockUser._id,
        },
        {
          $set: {
            role: UserTypes.MANAGER,
          },
        }
      );
    });
  });

  describe("Get users by building id", () => {
    const buildingId = new mongoose.Types.ObjectId().toString();
    const userType = UserTypes.EMPLOYEE;

    it("should only get users from a single building", async () => {
      await userService.getUsersByBuildingId(buildingId, userType, false);

      expect(UserModel.find).toBeCalledWith({
        buildingId,
        role: userType,
      });
    });

    it("should call aggregate to retrieve child building ids", async () => {
      jest.spyOn(BuildingModel, "aggregate").mockResolvedValueOnce([{ ids: [] }]);

      await userService.getUsersByBuildingId(buildingId, userType, true);

      expect(BuildingModel.aggregate).toBeCalledWith([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(buildingId),
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
    });
  });
});
