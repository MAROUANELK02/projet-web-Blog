const router = require("express").Router();
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' })
const fs = require('fs');

//GET ARTICLES

router.get('/', async (req, res) => {
    const take = parseInt(req.query.take) || 20;
    const skip = parseInt(req.query.skip) || 95;
  
    try {
      const articles = await prisma.article.findMany({
        take: take,
        skip: skip,
        include: {
          Utilisateur: true,
        },
      });
  
      const articlesWithUserNames = articles.map((article) => {
        const { nom } = article.Utilisateur || {}; // Utilisez la déstructuration pour extraire la propriété 'nom' de l'objet 'Utilisateur'
        const author = nom ? nom : "Auteur inconnu";
        return {
          id: article.id,
          titre: article.titre,
          contenu: article.contenu,
          image: article.image,
          createdAt: article.createdAt,
          author: author,
        };
      });
  
      res.status(200).json(articlesWithUserNames);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//GET ARTICLE BY ID 

router.get('/:id', async (req,res) => {
    try{
       const Article = await prisma.article.findFirst({
        where:{
            id: parseInt(req.params.id),
        },
        });
      
        const author = await prisma.utilisateur.findFirst({
          where: {
            id: parseInt(Article.utilisateurId),
          },
        });
          
          const articleWithUserName = {
            id: Article.id,
            titre: Article.titre,
            contenu: Article.contenu,
            image: Article.image,
            createdAt: Article.createdAt,
            updatedAt: Article.updatedAt,
            author: author.nom,
            utilisateurId: Article.utilisateurId,
          };

    res.status(200).json(articleWithUserName);
    }catch(err) {
        res.status(500).json(err);
    }
});

//GET Categories by articles : 

router.get("/categories/:articleId", async (req, res) => {
    const articleId = parseInt(req.params.articleId, 10);
  
    try {
      // Récupérer l'article avec les catégories associées en utilisant Prisma
      const article = await prisma.article.findUnique({
        where: { id: articleId },
        include: { categories: true },
      });
  
      const categoryIds = article.categories.map((category) => parseInt(category.categorieId));
  
      const categories = await prisma.categorie.findMany({
        where: {
          id: { in: categoryIds },
        },
      });
  
      res.json(categories);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories :", error);
      res.status(500).json({ message: "Erreur lors de la récupération des catégories" });
    }
  });
  

//Post Article

router.post("/", uploadMiddleware.single('image'), async (req, res) => {
    
    const { titre, contenu, userId, categorieId} = req.body;

    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newPath = path + '.' + ext;
    fs.renameSync(path, newPath);
  
    try {
      const post = await prisma.article.create({
        data: {
          titre: titre,
          contenu: contenu,
          image: newPath,
          published: true,
          utilisateurId: parseInt(userId),
         categories: {
                create: [
                    {
                    categorie: {
                        connectOrCreate: {
                        where: {
                            id: parseInt(categorieId),
                        },
                        create: {
                            nom: " ",
                        },
                        },
                    },
                    },
                ],
                },
       }
    });
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json(err);
    }
  });

//UPDATE ARTICLE

router.patch('/',uploadMiddleware.single('image'), async (req,res) => {
  let newPath = null;
  const post = await prisma.article.findFirst({
    where: {id: parseInt(req.body.id)},
  });
  if(req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    newPath = path + '.' + ext;
    fs.renameSync(path, newPath);  
  }else{
    newPath = post.image;
  }
  
  try {
        if(parseInt(req.body.userId) === parseInt(post.utilisateurId)) {
        const Article = await prisma.article.update({
            where : {id : parseInt(req.body.id) },
            data : {
              titre : req.body.titre,
              contenu : req.body.contenu,
              image : newPath,
            },
        });
        res.status(200).json(`Article modifié : ${Article.titre}`);
      }else{
        res.status(400).json('You are not authorized !');
      }
    }catch(err) {
        res.status(500).json(err);
    }
});

//DELETE ARTICLE

router.delete('/:id',async (req,res) => {
  const post = await prisma.article.findFirst({
    where: {id: parseInt(req.params.id)},
  });  
  try {
    if(parseInt(req.body.userId) === parseInt(post.utilisateurId)) {
      await prisma.categoriesOnArticle.deleteMany({
        where: {
          articleId:parseInt(req.params.id),
        },
      });
      const Article = await prisma.article.delete({
            where : {
                id : parseInt(req.params.id),
            }
        });
        res.status(200).json(`Article supprimé : ${Article.titre}`);
      }else{
        res.status(400).json('Problème lors de suppression !');
      };
    }catch(err) {
        res.status(500).json(err);
    }
});


module.exports = router;