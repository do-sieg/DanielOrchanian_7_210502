# Créer un réseau social d’entreprise (NodeJS/ReactJS)

## Description

Le projet vise à créer un réseau social interne pour les employés de l'entreprise Groupomania. Ce réseau doit faciliter les interactions entre collègues en leur permettant de partager du texte, des gifs, des liens...

## Contraintes

- Utilisation d'une base de données relationnelle SQL pour stocker les données.
- Connection de l'utilisateur et conservation/persistance de sa session durant son temps de connection.
- Projet codé en JavaScript.

## Technologie

Le projet a été développé avec HTML, CSS, ReactJS (client), NodeJS (serveur), et MySQL (base de données).


## Compétences évaluées

- Authentifier un utilisateur et maintenir sa session
- Personnaliser le contenu envoyé à un client web
- Gérer un stockage de données à l'aide de SQL
- Implémenter un stockage de données sécurisé en utilisant SQL

---

## Installation

1. Créer une base de données MySQL (avec **WampServer** par exemple, https://www.wampserver.com/#wampserver-64-bits-php-5-6-25-php-7).
2. Créer un fichier `.env` dans le dossier `backend`. Son contenu devra ressembler à ceci, mais avec les identifiants de **votre base de données** :
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=groupomania
DB_CONNECTIONLIMIT=20
JWT_SECRET_KEY=123456
```
> - DB_HOST: adresse de la base de données  
> - DB_USER: utilisateur de la base de données  
> - DB_PASSWORD: Mot de passe de connection de la base de données  
> - DB_DATABASE: Nom de la base de données  
> - DB_CONNECTIONLIMIT: Nombre de connections concurrentes  

3. Créer un fichier `.env` dans le dossier `frontend`. Son contenu devra ressembler à ceci :
```
JWT_SECRET_KEY=123456
```
> La valeur de `JWT_SECRET_KEY` doit être la même dans les deux fichiers `.env` (frontend et backend).
4. Grâce à un terminal, à partir du dossier `backend`, lancer la commande `npm install`.
5. Faire de même à partir du dossier `frontend`.


## Démarrage

1. Grâce à un terminal, à partir du dossier `backend`, lancez la commande `npm run dev`. L'application serveur tournera sur le port **5000** de localhost.
2. À partir du dossier `frontend`, lancez la commande `npm start`. L'application client s'ouvrira dans le navigateur sur le port **3000** de localhost.

> Le projet créera automatiquement les tables nécessaires dans la base de données lors du premier lancement.


## Autres informations

Pour nommer un administrateur, ouvrez la table `users` dans la base de données, sélectionnez un utilisateur enregistré et changez le champ de `user_role` pour `1`.