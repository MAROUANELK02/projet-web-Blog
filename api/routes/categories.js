const router = require("express").Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;
const { verifyTokenAndAdmin } = require('../verifyToken.js');

//GET CATEGORIES

router.get('/', async (req,res) => {
    const take = parseInt(req.query.take) || 100;
    const skip = parseInt(req.query.skip) || 0;

    try{
        const Categories = await prisma.categorie.findMany({
        take : take,
        skip : skip
    })

        res.status(200).json(Categories);
    }catch(err) {
        res.status(500).json(err);
    }
});

//GET CATEGORIE BY ID 

router.get('/:id', async (req,res) => {
    try{
       const Categorie = await prisma.categorie.findFirst({
        where:{
            id: parseInt(req.params.id)
        }
        }) 
    res.status(200).json(Categorie);
    }catch(err) {
        res.status(500).json(err);
    }
});

//POST CATEGORIE

router.post('/', verifyTokenAndAdmin, async (req,res) => {
    try {
        const Categorie = await prisma.categorie.create({
            data: {
               nom : req.body.nom,
            }
        })
        res.status(200).json(`Catégorie ajoutée: ${Categorie.nom}`);
    }catch(err) {
        res.status(500).json(err);
    }
});


//UPDATE CATEGORIE

router.patch('/', async (req,res) => {
    try {
        const Categorie = await prisma.categorie.update({
            where : {id : parseInt(req.body.id) },
            data : {
              nom: req.body.nom,
            }
        })
        res.status(200).json(`Article modifié : ${Categorie.nom}`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//DELETE CATEGORIE

router.delete('/:id', async (req,res) => {
    try {
        const Categorie = await prisma.categorie.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })
        res.status(200).json(`Article supprimé : ${Categorie.nom}`);
    }catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;