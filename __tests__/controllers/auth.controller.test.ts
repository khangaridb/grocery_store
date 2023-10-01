import app from "../../src";
import userService from "../../src/services/user";
import request from "supertest";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../../src/services/user", () => ({
  findByEmail: jest.fn(),
  registerUser: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("Auth Controller tests", () => {
  describe("Register user", () => {
    it("should not register because missing required parameter", async () => {
      const res = await request(app).post("/api/auth/register").send({});

      expect(res.statusCode).toBe(400);
    });

    it("should not register because of a bad email format", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "123",
        password: "password",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Enter a valid email address");
    });

    it("should not register because of password length", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@gmail.com",
        password: "1",
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Password must be at least 6 chars long");
    });

    it("should register a user and call registerUser", async () => {
      const res = await request(app).post("/api/auth/register").send({
        email: "test@gmail.com",
        password: "jqqtjiw",
      });

      expect(res.statusCode).toBe(201);
      expect(userService.registerUser).toBeCalled();
    });
  });

  describe("Login", () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    const findByEmailSpy = jest.spyOn(userService, "findByEmail");
    const compareSpy = jest.spyOn(bcrypt, "compare");
    const mockUser = {
      _id: new mongoose.Types.ObjectId(),
      email: "test@gmail.com",
      password: "password",
      role: "Employee",
      buildingId: new mongoose.Types.ObjectId(),
      name: "test",
    };

    it("should not login because user does not exist", async () => {
      findByEmailSpy.mockResolvedValueOnce(null);

      const res = await request(app).post("/api/auth/login").send({
        email: "test@gmail.com",
        password: mockUser.password,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid username or password");
    });

    it("should not login because password does not match", async () => {
      findByEmailSpy.mockResolvedValueOnce(mockUser);
      compareSpy.mockImplementation(() => Promise.resolve(false));

      const res = await request(app).post("/api/auth/login").send({
        email: "test@gmail.com",
        password: mockUser.password,
      });

      expect(compareSpy).toBeCalledTimes(1);
      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Invalid username or password");
    });

    it("should successfully login and retrieve token", async () => {
      findByEmailSpy.mockResolvedValueOnce(mockUser);
      compareSpy.mockImplementation(() => Promise.resolve(true));

      const res = await request(app).post("/api/auth/login").send({
        email: "test@gmail.com",
        password: mockUser.password,
      });

      expect(res.statusCode).toBe(200);
      expect(compareSpy).toBeCalledTimes(1);
      expect(jwt.sign).toBeCalledTimes(1);
      expect(res.body.message).toBe("Logged in successfully");
    });
  });
});
