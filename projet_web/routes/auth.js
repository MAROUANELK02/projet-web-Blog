const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

router.post("/register", async (req, res) => {
  const { nom, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.utilisateur.create({
      data: {
        nom,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json(err);
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

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
