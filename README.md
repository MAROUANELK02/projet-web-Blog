Projet Web - Marouane LASMAK - GLSID-1

Pour utiliser cette application web sur votre ordinateur en utilisant, par exemple, VS Code, suivez les étapes ci-dessous :

Dans le dossier "api", exécutez la commande suivante pour installer les dépendances :

    cd api
    npm install

Ouvrez un autre terminal et accédez au dossier "client" en exécutant la commande :

    cd client
    npm install

Assurez-vous de lancer les serveurs Apache et MySQL en utilisant, par exemple, XAMPP.

Pour générer des données, exécutez les commandes suivantes dans le terminal de "api" :

    cd seeds
    node seed.js

Revenez au dossier "api" en exécutant la commande :

    cd ..

Pour lancer l'application web, exécutez la commande suivante dans les deux terminaux (api et client) :

    npm start

Vous serez automatiquement redirigé vers la page d'accueil du blog.