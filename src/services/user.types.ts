import { UserTypes } from "../common/constants";

export type RegisterUserInput = {
  email: string;
  password: string;
  name?: string;
  role?: UserTypes;
  buildingId?: string;
};

export type CreateUserInput = {
  name?: string;
  buildingId?: string;
  role?: string;
  email: string;
};

export type UpdateUserInput = {
  id?: string;
  name?: string;
  buildingId?: string;
  role?: string;
  email?: string;
};
