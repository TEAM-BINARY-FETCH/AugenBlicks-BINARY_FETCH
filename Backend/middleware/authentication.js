import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  // console.log('c');
  const authHeader = req.headers.authorization;
  // console.log('Headers', req.headers);
  // console.log('Auth', req.headers.authorization);

  if (!authHeader) {
    return res.status(401).json({ error: "Token not provided" });
  }
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  // console.log('Token', token);
  const { userId } = jwt.decode(token);
  console.log(userId);
  req.user = { userId };
  next();
};
