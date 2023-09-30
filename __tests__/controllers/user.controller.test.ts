import app from "../../src";
import userService from "../../src/services/user";
import request from "supertest";
import { UserTypes } from "../../src/common/constants";
import * as permisisonUtils from "../../src/utils/permission";

jest.mock("../../src/services/user", () => ({
  createUser: jest.fn(),
  updateUser: jest.fn(),
  removeUser: jest.fn(),
  getUsersByBuildingId: jest.fn(),
}));

jest.mock("../../src/middlewares/auth", () => jest.fn().mockImplementation((req, res, next) => next()));
jest.mock("../../src/utils/permission", () => ({
  checkIfUserIsManager: jest.fn(),
}));

describe("User Controller tests", () => {
  jest.spyOn(permisisonUtils, "checkIfUserIsManager").mockImplementation(() => true);

  describe("Create user", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it("should not register because missing required parameter", async () => {
      const res = await request(app).post("/api/user/create").send({
        email: "fakeEmail",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Enter a valid email address");
    });

    it("should create a user and call createUser", async () => {
      const res = await request(app).post("/api/user/create").send({
        email: "test@gmail.com",
        role: "Employee",
      });

      expect(res.statusCode).toBe(200);
      expect(userService.createUser).toBeCalledTimes(1);
    });

    it("should throw an error", async () => {
      jest.spyOn(userService, "createUser").mockRejectedValueOnce(new Error(""));
      const res = await request(app).post("/api/user/create").send({
        email: "test@gmail.com",
        role: "Employee",
      });

      expect(res.statusCode).toBe(500);
    });
  });

  describe("Update user", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it("should not update because missing required parameter", async () => {
      const res = await request(app).post("/api/user/update").send({
        userId: null,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("User is required");
    });

    it("should update a user and call updateuser", async () => {
      const res = await request(app).post("/api/user/update").send({
        userId: "123",
        role: "Employee",
      });

      expect(res.statusCode).toBe(200);
      expect(userService.updateUser).toBeCalledTimes(1);
    });

    it("should throw an error", async () => {
      jest.spyOn(userService, "updateUser").mockRejectedValueOnce(new Error(""));
      const res = await request(app).post("/api/user/update").send({
        userId: "123",
        role: "Employee",
      });

      expect(res.statusCode).toBe(500);
    });
  });

  describe("Remove user", () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it("should not remove because missing required parameter", async () => {
      const res = await request(app).post("/api/user/remove").send({
        userId: null,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("User is required");
    });

    it("should remove a user and call removeUser", async () => {
      const res = await request(app).post("/api/user/remove").send({
        userId: "123",
      });

      expect(res.statusCode).toBe(200);
      expect(userService.removeUser).toBeCalledTimes(1);
    });

    it("should throw an error", async () => {
      jest.spyOn(userService, "removeUser").mockRejectedValueOnce(new Error("error occured"));
      const res = await request(app).post("/api/user/remove").send({
        userId: "123",
      });

      expect(res.statusCode).toBe(500);
    });
  });

  describe("Get all employees", () => {
    it("should call getUsersByBuildingId with employee type", async () => {
      await request(app).get("/api/user/getEmplooyees").query({
        buildingId: "buildingId",
        includeDescendant: "false",
      });

      expect(userService.getUsersByBuildingId).toBeCalledWith("buildingId", [UserTypes.EMPLOYEE], "false");
    });

    it("should throw an error", async () => {
      jest.spyOn(userService, "getUsersByBuildingId").mockRejectedValueOnce(new Error("error occured"));

      const res = await request(app).get("/api/user/getEmplooyees").query({
        buildingId: "buildingId",
        includeDescendant: "false",
      });

      expect(res.status).toBe(500);
    });
  });

  describe("Get all managers", () => {
    it("should call getUsersByBuildingId with manager type", async () => {
      await request(app).get("/api/user/getManagers").query({
        buildingId: "buildingId",
        includeDescendant: "true",
      });

      expect(userService.getUsersByBuildingId).toBeCalledWith("buildingId", [UserTypes.EMPLOYEE, UserTypes.MANAGER], "true");
    });

    it("should throw an error", async () => {
      jest.spyOn(userService, "getUsersByBuildingId").mockRejectedValueOnce(new Error(""));

      const res = await request(app).get("/api/user/getManagers").query({
        buildingId: "buildingId",
        includeDescendant: "false",
      });

      expect(res.status).toBe(500);
    });
  });
});
