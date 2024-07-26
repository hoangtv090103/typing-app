import jwt from "jsonwebtoken";

export const createToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

export const decodeJWT = (token: string): any => {
  const decode = jwt.verify(token, process.env.JWT_SECRET as string);

  return decode;
};
