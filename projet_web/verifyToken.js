const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const userId = req.user.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        res.status(404).json("User not found!");
        return;
      }
      if (user.id === req.params.id || user.role === "ADMIN") {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

const verifyTokenAndAdmin = async (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const userId = req.user.id;
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!user) {
        res.status(404).json("User not found!");
        return;
      }
      if (user.role === "ADMIN") {
        next();
      } else {
        res.status(403).json("You are not allowed to do that!");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
};
