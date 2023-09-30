# Grocery store in

Walkthrough video

https://www.loom.com/share/1c41d23bf0084e04a28a8f2e343eea62?sid=7091fbe6-04e3-4ed1-b21e-dde553562edd

## To run the application

- Copy `.env.sample` and rename it `.env`
- Edit `JWT_SECRET` environment variable with random string
- Run `npm install`
- Run `npm run initDb` to initialize the db
- Run `npm run dev` to start service locally

## Unit tests

- Unit tests are inside `__tests__` folder
- To run the unit tests run `npm run test`

## Postman collection

- https://drive.google.com/file/d/14dEM9LbFQjZcFmDn10vKM7BO8gh0D08t/view?usp=sharing

## Endpoint list

- POST: `/api/auth/register`
  - Registers user with `email` and `password`
- POST: `/api/auth/login`
  - Returns authorization token upon signing in with `email` and `password`
- POST: `/api/user/create`
  - Creates user with params like `name`, `email`, `role`, `buildingId`
- POST: `/api/user/update`
  - Updates user with `userId` and parameters like `name`, `email`, `role`, `buildingId`
- POST: `/api/user/remove`
  - Removes user with `userId`
- GET: `/api/user/getAllEmployees`
  - Retreives all employees from building when `buildingId` included
  - Retrieves all employees and its descendant employees when called with `buildingId` and `includeDescentdant=true`
- GET: `/api/user/getAllManagers`
  - Retreives all managers from building when `buildingId` included
  - Retrieves all managers and its descendant employee and managers when called with `buildingId` and `includeDescentdant=true`
