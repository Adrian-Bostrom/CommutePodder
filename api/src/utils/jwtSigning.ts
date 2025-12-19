import { Response } from "express";
import jwt from "jsonwebtoken";
import { addAbortSignal } from "stream";
/*
This is code taken from https://medium.com/@rinkitadhana/jwt-authentication-apis-with-typescript-node-js-and-mongodb-b05a8a3cb062
*/ 
const JWT_SECRET = process.env.JWT_SECRET || "secret";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h";

const generateJWT = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 3600000, // 1 hour in milliseconds
    path: "/",
  });
};

const clearJWT = (res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  });
};

export { generateJWT, clearJWT };