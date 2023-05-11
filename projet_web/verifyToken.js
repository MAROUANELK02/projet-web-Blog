const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyToken = (req, res, next) => {
  const token = req.headers.token;
  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Invalid token' });
    }
    req.userId = decoded.id;
    next();
  });
};

const verifyTokenAndAuthorization = async (req, res, next) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user.role !== 'ADMIN' && user.id !== req.params.userId) {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

const verifyTokenAndAdmin = async (req, res, next) => {
  try {
    const user = await prisma.utilisateur.findUnique({
      where: { id: req.userId },
      select: { role: true },
    });

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).send({ message: 'Unauthorized' });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: 'Internal server error' });
  }
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
