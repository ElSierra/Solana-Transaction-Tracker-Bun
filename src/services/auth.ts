import jwt from "jsonwebtoken";
export type IUser = {
  email: string;
  id: string;
};
export const createAccessToken = ({ email, id }: IUser) => {
  const token = jwt.sign(
    { email: email, id: id },

    process.env.ACCESS_TOKEN_SECRET as string
  );

  return token;
};
