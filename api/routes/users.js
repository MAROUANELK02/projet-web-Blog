const router = require("express").Router();
const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');
const {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken.js');
const prisma = new PrismaClient;

//GET USERS

router.get('/',async (req,res) => {
    const take = parseInt(req.query.take) || 100;
    const skip = parseInt(req.query.skip) || 0;

    try{
        const Users = await prisma.utilisateur.findMany({
        take : take,
        skip : skip
    })

        const filtredUsers = Users.map(({password,...others}) => others);
        res.status(200).json(filtredUsers);

    }catch(err) {
        res.status(500).json(err);
    }
});

//GET USER BY ID 

router.get("/:id", verifyTokenAndAuthorization , async (req,res) => {
    try{
       const User = await prisma.utilisateur.findUnique({
        where:{
            id: parseInt(req.params.id),
        }
        }) 
    res.status(200).json(User);
    }catch(err) {
        res.status(500).send(err);
    }
});

//POST USER

router.post('/',verifyTokenAndAdmin, async (req,res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const User = await prisma.utilisateur.create({
            data: {
                nom : req.body.nom,
                email : req.body.email,
                password : hashedPassword,
                role : req.body.role
            }
        })
        res.status(200).json(`Utilisateur ajouté: ${User.nom}`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//UPDATE USER

router.patch('/',verifyToken, async (req,res) => {
    try {
        if(req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const User = await prisma.utilisateur.update({
                where : {id : req.userId},
                data : {
                    nom : req.body.nom,
                    email : req.body.email,
                    password : hashedPassword,
                },
            });
            res.status(200).json(`Utilisateur modifié : ${User.nom}`);
        }
        const User = await prisma.utilisateur.update({
            where : {id : req.userId},
            data : {
                nom : req.body.nom,
                email : req.body.email,
            }
        });
        res.status(200).json(`Utilisateur modifié : ${User.nom}`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//DELETE USER 

router.delete('/:id', verifyTokenAndAuthorization ,async (req,res) => {
    try {
        const User = await prisma.utilisateur.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })
        res.status(200).json(`Utilisateur supprimé : ${User.nom}`);
    }catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;