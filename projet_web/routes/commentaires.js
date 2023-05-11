const router = require("express").Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;

//GET COMMENTAIRES

router.get('/', async (req,res) => {
    const take = parseInt(req.query.take) || 10;
    const skip = parseInt(req.query.skip) || 0;

    try{
        const Commentaires = await prisma.commentaire.findMany({
        take : take,
        skip : skip
    })

        res.status(200).json(Commentaires);
    }catch(err) {
        res.status(500).json(err);
    }
});

//GET COMMENTAIRE BY ID 

router.get('/:id', async (req,res) => {
    try{
       const Commentaire = await prisma.commentaire.findFirst({
        where:{
            id: parseInt(req.params.id)
        }
        }) 
    res.status(200).json(Commentaire);
    }catch(err) {
        res.status(500).json(err);
    }
});

//POST COMMENTAIRE

router.post('/', async (req,res) => {
    try {
        const Commentaire = await prisma.commentaire.create({
            data: {
               email: req.body.email,
               contenu: req.body.contenu,
               articleId: parseInt(req.body.articleId),
            },
        })
        res.status(200).json(`Commentaire ajouté avec succès`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//UPDATE COMMENTAIRE

router.patch('/', async (req,res) => {
    try {
        const Commentaire = await prisma.commentaire.update({
            where : {id : parseInt(req.body.id) },
            data : {
                email: req.body.email,
                contenu: req.body.contenu,
                articleId: parseInt(req.body.articleId),
            }
        })
        res.status(200).json(`Commentaire modifié avec succès`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//DELETE COMMENTAIRE

router.delete('/:id', async (req,res) => {
    try {
        const Commentaire = await prisma.commentaire.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })
        res.status(200).json(`Commentaire supprimé avec succès`);
    }catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;