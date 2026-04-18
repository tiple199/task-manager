import jwt from "jsonwebtoken";
import "dotenv/config";

const isTodayOrFuture = (date: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const inputDate = new Date(date);
  inputDate.setHours(0, 0, 0, 0);

  return inputDate >= today;
};

const generateToken = (payload:  {userId: number,email: string}) => {
  const secretKey: string = process.env.JWT_SECRET!;
  const expiresIn: any = process.env.JWT_EXPIRES_IN;
  return jwt.sign(payload,secretKey,{expiresIn: expiresIn});
};

export { isTodayOrFuture,generateToken };