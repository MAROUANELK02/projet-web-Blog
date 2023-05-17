const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const {verifyToken} = require('../verifyToken');

const prisma = new PrismaClient;

router.post("/register", async (req, res) => {
  const { nom, email, password } = req.body;
  const user = await prisma.utilisateur.findFirst({
    where: {
      email : email,
    }
  });
  try {
  if(!user) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        password: hashedPassword,
      },
    });

    res.status(200).json(newUser);
  }else{
    res.json("Utilisateur existant !");
  }
}catch(err){
  res.status(500).json(err)
}
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.utilisateur.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect." });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SEC, { expiresIn: "1h" });

    res.cookie('token', token);
    res.json({
     id:user.id,
     nom:user.nom,
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/profile", verifyToken, async (req,res) => {
    const info = await prisma.utilisateur.findUnique({
      where : {
        id : req.userId,
      },
    });
    res.json(info);
} 
);

router.post('/logout', (req,res) => {
  res.cookie('token', '');
  res.json('ok');
});


module.exports = router;