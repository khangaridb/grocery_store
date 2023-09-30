import { PassportStatic } from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import mongoose from "mongoose";

import UserModel from "./models/user";

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const init = (passport: PassportStatic) => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      UserModel.findById(new mongoose.Types.ObjectId(jwt_payload.id))
        .then((user) => {
          if (user) return done(null, { _id: user._id.toString(), role: user.role });

          return done(null, false);
        })
        .catch((err: Error) => {
          return done(err, false, { message: "Server Error" });
        });
    })
  );
};

export default init;
