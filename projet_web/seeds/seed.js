const { faker } = require('@faker-js/faker');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient;

//Fonction pour supprimer les données de la DB
async function clearDatabase() {
    const transaction = await prisma.$transaction([
        prisma.categoriesOnArticle.deleteMany(),
        prisma.commentaire.deleteMany(),
        prisma.categorie.deleteMany(),
        prisma.article.deleteMany(),
        prisma.utilisateur.deleteMany(),
    ]);
    console.log('Les données sont supprimées avec succès!');
}

//Fonction pour créer les utilisateurs AUTHORS
async function createAuthorUsers() {
    for(let i=0;i<10;i++) {
        await prisma.utilisateur.create({
        data: {
            nom: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'AUTHOR'
        },
        });
    }
    console.log('Les utilisateurs de role AUTHOR sont créés avec succès!');
}

//Fonction pour créer l'utilisateur ADMIN
async function createAdminUser() {
    await prisma.utilisateur.create({
        data:{
            nom: faker.name.firstName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: 'ADMIN'
        }
    })
    console.log("L'utilisateur de role ADMIN est créé avec succès!");
}

//Fonction pour créer les catégories
async function createCategories() {
    for(let i=0;i<10;i++) {
        await prisma.categorie.create({
            data:{
                nom: faker.lorem.word(),
            }
        });
    };
    console.log("Les catégories sont créées avec succès!");
};


// Fonction pour récupérer les identifiants des utilisateurs ayant le rôle "AUTHOR"
async function getAuthorIds() {
    const authors = await prisma.utilisateur.findMany({
      where: {
        role: 'AUTHOR',
      },
      select: {
        id: true,
      },
    });
  
    return authors.map((author) => author.id);
  }

//Fonction pour récupérer les identifiants des catégories
async function getCategoriesIds() {
    const categories = await prisma.categorie.findMany();
    return categories.map((category) => category.id);
  }

// Fonction pour sélectionner de manière aléatoire un ID parmi un tableau d'identifiants
function getRandomId(ObjectIds) {
    const randomIndex = Math.floor(Math.random() * ObjectIds.length);
    return ObjectIds[randomIndex];
  }


//Fonction pour créer les 100 articles 
async function createArticles() {

    for(let i=0;i<100;i++) {

        const authorIds = await getAuthorIds();
        const randomAuthorId = getRandomId(authorIds);

        const Article = await prisma.article.create({
            data:{
                titre: faker.lorem.sentence(),
                contenu: faker.lorem.paragraphs(),
                image: faker.image.imageUrl(),
                published: true,
                utilisateurId: randomAuthorId,
            },
        });

        const randomLoopCount = Math.floor(Math.random() * 4) + 1;
        const categoryIds = await getCategoriesIds();
        

        for(let i=0 ; i<randomLoopCount ; i++) {

        const randomCategoryId = getRandomId(categoryIds);
        const existingRelation = await prisma.categoriesOnArticle.findUnique({
            where: {
                articleId_categorieId: {
                    articleId: Article.id,
                    categorieId: randomCategoryId,
                },
            }
        });

        if (!existingRelation) {
            await prisma.categoriesOnArticle.create({
              data: {
                article: { connect: { id: Article.id } },
                categorie: { connect: { id: randomCategoryId } },
              },
            });
          }
        }
    }
    console.log("Les articles sont créés avec succès!");
}

//Fonction pour récupérer les identifiants des articles
async function getArticlesIds() {
    const articles = await prisma.article.findMany();
    return articles.map((article) => article.id);
}

//Fonction pour créer de 0 à 20 commentaires pour chaque article
async function createCommentaires() {
    const articlesIds = await getArticlesIds();

    for (const articleID of articlesIds) {
        const randomLoopCount = Math.floor(Math.random() * 20);

        for(let i=0 ; i<randomLoopCount ; i++) {
            await prisma.commentaire.create({
                data : {
                    email : faker.internet.email(),
                    contenu : faker.lorem.sentence(),
                    articleId : articleID,
                }
            })
        }
    };
    console.log("Les commentaires sont créés avec succès!");
} 


async function resetIdCounters() {
    try {
        await prisma.$transaction([
            prisma.$queryRaw`ALTER TABLE utilisateur AUTO_INCREMENT = 1;`,
            prisma.$queryRaw`ALTER TABLE categorie AUTO_INCREMENT = 1;`,
            prisma.$queryRaw`ALTER TABLE article AUTO_INCREMENT = 1;`,
            prisma.$queryRaw`ALTER TABLE commentaire AUTO_INCREMENT = 1;`,

        ])
      console.log("Les compteurs d'identifiants ont été réinitialisés avec succès !");
    } catch (error) {
      console.error("Une erreur s'est produite lors de la réinitialisation des compteurs d'identifiants :", error);
    }
  }
  
  
clearDatabase()
    .then(() => resetIdCounters() )
    .then(() => createAuthorUsers())
    .then(() => createAdminUser())
    .then(() => createCategories())
    .then(() => createArticles())
    .then(() => createCommentaires())
    .catch((error) => {
      console.error("Une erreur s'est produite :", error);
});




