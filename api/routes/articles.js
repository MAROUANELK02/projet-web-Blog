const router = require("express").Router();
const {PrismaClient} = require('@prisma/client');
const { verifyTokenAndAdmin, verifyToken } = require("../verifyToken");
const prisma = new PrismaClient;

//GET ARTICLES

router.get('/', async (req,res) => {
    const take = parseInt(req.query.take) || 10;
    const skip = parseInt(req.query.skip) || 0;

    try{
        const Articles = await prisma.article.findMany({
        take : take,
        skip : skip
    })

        res.status(200).json(Articles);
    }catch(err) {
        res.status(500).json(err);
    }
});

//GET ARTICLE BY ID 

router.get('/:id', async (req,res) => {
    try{
       const Article = await prisma.article.findFirst({
        where:{
            id: parseInt(req.params.id)
        }
        }) 
    res.status(200).json(Article)
    }catch(err) {
        res.status(500).json(err);
    }
});

//POST ARTICLE

router.post('/', async (req,res) => {
    try {

        const Categorie = await prisma.categorie.findFirst({
            where : {
                nom: req.body.nom,
            }
        })

        const Article = await prisma.article.create({
            data: {
              titre : req.body.titre,
              contenu : req.body.contenu,
              image :  req.body.image,
              utilisateurId : parseInt(req.body.utilisateurId),
              published : true,
              categories: {
                create: [
                    {
                    categorie: {
                        connectOrCreate: {
                        where: {
                            id: Categorie.id,
                        },
                        create: {
                            nom: req.body.nom,
                        },
                        },
                    },
                    },
                ],
                },
               }
            }) 
        res.status(200).json(`Article ajouté: ${Article.titre}`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//UPDATE ARTICLE

router.patch('/', async (req,res) => {
    try {
        const Article = await prisma.article.update({
            where : {id : parseInt(req.body.id) },
            data : {
              titre : req.body.titre,
              contenu : req.body.contenu,
              image : req.body.image,
              categories: {
                create: [
                    {
                    categorie: {
                        connectOrCreate: {
                        where: {
                            id: req.body.id,
                        },
                        create: {
                            nom: req.body.nom,
                            id: req.body.id,
                        },
                        },
                    },
                    },
                ],
                },
            }
        })
        res.status(200).json(`Article modifié : ${Article.titre}`);
    }catch(err) {
        res.status(500).json(err);
    }
});

//DELETE ARTICLE

router.delete('/:id', verifyTokenAndAdmin ,async (req,res) => {
    try {
        const Article = await prisma.article.delete({
            where : {
                id : parseInt(req.params.id)
            }
        })
        res.status(200).json(`Article supprimé : ${Article.titre}`);
    }catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;