import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { ILogin, ISignUp } from "../interfaces/auth.interface";
import UserModel from "../models/user.model";
import config from "../config";
import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from "../exceptions";

export async function signup(userDetails: ISignUp) {
  const user = await UserModel.getUserByEmail(userDetails.email);

  if (user) {
    throw new ConflictException("User already exists");
  }

  const hashedPassword = await bcrypt.hash(
    userDetails.password,
    config.saltRounds
  );

  await UserModel.createUser({
    ...userDetails,
    password: hashedPassword,
  });

  return {
    message: "User signed up successfully",
  };
}

export async function login(body: ILogin) {
  const userDetail = await UserModel.getUserByEmail(body.email);
  console.log("by email", userDetail);
  console.log("by id", await UserModel.getUserById(userDetail.id));

  if (!userDetail) {
    throw new NotFoundException("User Not Found");
  }

  const passwordMatch = await bcrypt.compare(
    body.password,
    userDetail.password
  );

  if (!passwordMatch) {
    throw new UnauthorizedException("Username and password do not match");
  }

  const user = {
    id: userDetail.id,
    username: userDetail.username,
    email: userDetail.email,
  };

  const accessToken = jwt.sign(user, config.jwt.accessTokenSecret!, {
    expiresIn: config.jwt.accessTokenExpiry,
  });

  const refreshToken = jwt.sign(user, config.jwt.refreshTokenSecret!, {
    expiresIn: config.jwt.refreshTokenExpiry,
  });

  return {
    accessToken,
    refreshToken,
  };
}
