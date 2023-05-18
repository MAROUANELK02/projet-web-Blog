const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Vérifier le token

const verifyToken = (req, res, next) => {
  const {token} = req.cookies;

  if (token) {

    jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
      if (err) {
        res.status(403).json("Le token n'est pas valide !");
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  } else {
    res.status(401).json("Vous n'êtes pas authentifié !");
  }
};

//Vérifier si c'est un utilisateur ADMIN ou autorisé par id 

  const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req,res,async ()=>{
      const USER = await prisma.utilisateur.findUnique({
        where: {
          id: req.userId,
        },
      });
      if(parseInt(USER.id) === parseInt(req.params.id) || USER.role === "ADMIN") {
          next();
      }else{
          res.status(403).json("You are not allowed to do that !");
      }
  });
  };

  //Vérifier si c'est un utilisateur ADMIN

  const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,async ()=>{
      const USER = await prisma.utilisateur.findUnique({
        where: { 
          id: req.userId,
        },
      });
        if(USER.role === "ADMIN") {
            next();
        }else{
            res.status(403).json("You are not allowed to do that !");
        }
    });
};


module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};