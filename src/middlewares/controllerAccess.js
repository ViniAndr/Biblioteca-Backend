function controllerAccess(requiredRole = "funcionario") {
  return async (req, res, next) => {
    const userRole = req.userRole;

    if (userRole === requiredRole || userRole === "admin") {
      return next(); // Permite acesso
    }

    // Proíbe o acesso
    return res.status(403).json({ message: "Access denied" });
  };
}

export default controllerAccess;
