import { UserTypes } from "../common/constants";

export type RegisterUserInput = {
  email: String;
  password: String;
  name?: String;
  role?: UserTypes;
  buildingId?: String;
};

export type CreateUserInput = {
  name?: String;
  buildingId?: String;
  role?: String;
  email: String;
};

export type UpdateUserInput = {
  id?: String;
  name?: String;
  buildingId?: String;
  role?: String;
  email?: String;
};
