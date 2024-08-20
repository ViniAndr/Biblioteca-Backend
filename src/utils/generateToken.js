import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRATION,
  });
};

export default generateToken;
