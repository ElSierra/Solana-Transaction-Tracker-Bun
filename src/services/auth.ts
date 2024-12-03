import jwt from "jsonwebtoken";
type accessToken = {
  email: string;
  id: string;
};
export const createAccessToken = ({ email, id }: accessToken) => {
  const token = jwt.sign(
    { email: email, id: id },

    process.env.ACCESS_TOKEN_SECRET as string
  );

  return token;
};
