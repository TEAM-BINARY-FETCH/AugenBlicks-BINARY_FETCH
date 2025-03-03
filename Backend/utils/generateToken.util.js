import jwt from "jsonwebtoken";

const generateTokenAndSetCookie = (userId, res) => {
  return jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{expiresIn: '15d'});
}

export default generateTokenAndSetCookie;