import jwt from "jsonwebtoken";

export default async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) return res.status(401).json({ error: "Access denied" });

  try {
    const [bearer, token] = authorization.split(" ");

    // aqui decodificamos o token
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    // Deixamos esses dados disponíveis para as rotas
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.userRole = decoded.role;

    return next();
  } catch (error) {
    console.log(error.message);
    return res.status(401).json("Authorization required");
  }
};
