export type RegisterUserInput = {
  email: String;
  password: String;
};

export type CreateUserInput = {
  name: String;
  buildingId: String;
  role: String;
};

export type UpdateUserInput = {
  id?: String;
  name?: String;
  buildingId?: String;
  role?: String;
};
