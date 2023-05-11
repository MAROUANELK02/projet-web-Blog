const router = require("express").Router();
const {PrismaClient} = require('@prisma/client');
const bcrypt = require('bcrypt');
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../verifyToken');
const prisma = new PrismaClient;

//GET USERS

router.get('/', verifyTokenAndAdmin ,async (req,res) => {
    const take = parseInt(req.query.take) || 10;
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
    const {password,...others} = User;
    res.status(200).json(others);
    }catch(err) {
        res.status(500).send(err);
    }
});

//POST USER

router.post('/', async (req,res) => {
    try {
        const User = await prisma.utilisateur.create({
            data: {
                nom : req.body.nom,
                email : req.body.email,
                password : bcrypt.hash(req.body.password,10),
                role : req.body.role
            }
        })
        res.status(200).json(`Utilisateur ajouté: ${User.nom}`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//UPDATE USER

router.patch('/', async (req,res) => {
    try {
        const User = await prisma.utilisateur.update({
            where : {id : parseInt(req.body.id) },
            data : {
                nom : req.body.nom,
                email : req.body.email,
                password : bcrypt.hash(req.body.password,10),
            }
        })
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