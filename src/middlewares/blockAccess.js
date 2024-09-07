function blockAccess(req, res, next) {
  const { authorization } = req.headers;
  if (authorization) return res.status(401).json({ error: "Access denied" });

  return next();
}

export default blockAccess;
