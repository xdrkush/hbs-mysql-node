# hbs-mysql-node

Tutoriel pour comprendre les bases de handlebars avec une base de donnée MySql et un serveur web NodeJS.

## exemple:
![](https://github.com/xdrkush/hbs-mysql-node/blob/main/home_hbs_mysql.png)

## Pre requis
  - Node JS V 12.0.0 (ou +)
  - NPM 7.x.x (ou +)
  - MySQL V 8

Tuto réaliser sur la base de celui de ```Philippe Yim``` sur Handlebars Node JS et MongoDB qui à été refais par ``` xdrkush ``` en Handlebars Node JS, MySQL.

## Pour commencer

Importer le projet sur votre machine:
  - (sois en téléchargeant en zip, ou avec git, ici nous allons utiliser git)
(attention le lien peu changer suivant la source d'ou vous récupéré ce tuto, récupéré bien le liens https)

(Attention à ne pas importer le dossier n'importe ou) Se que je vous conseils c'est de creer un dossier 'Dev' et un dossier 'gh' (github) à l'intérieur pour que votre architecture de votre machine reste propre
(utils si vous ne savez pas de quoi je veux parler, les autres ce reconnaitrons ;) )
```
mkdir ~/Dev && mkdir ~/Dev/gh && cd ~/Dev/gh
```

Ensuite on peux importer le projet:
```
git clone https://github.com/xdrkush/hbs-mysql-node.git
cd hbs-mysql-node
npm i
```

Voila notre projet est installer (mais pas encore fonctionel)

## Crée notre DB
Assurez-vous d'avoir un user de creer dans votre MySQL sinon vous pouvez vous documentez ici:
  - https://www.hostinger.fr/tutoriels/creer-un-utilisateur-mysql
  - https://www.digitalocean.com/community/tutorials/how-to-create-a-new-user-and-grant-permissions-in-mysql-fr

Sinon vous pouvez executer le script SQL préparer pour vous ! (create_admin_db.sql)
ATTENTION  le script est un peu barbare c'est à dire qu'il va creer un USER ayant l'accès à toutes les bases de données  MySQL de votre machine, cela peux vous dépanner dans un premiers temps mais je vous conseils de faire de la veille par la suite sur la gestion des droits et des users pour une administrations propres de vos users avec MySQL.
(vous pourrez supprimé l'user creer par la suite quand vous en aurez plus besoin !)

Executer le script de barbare:
```
cd hbs-mysql-node
sudo mysql
```
Ensuite dans votre terminal mysql:
```
source db/create_admin_db.sql
```

Voila vous avez un user 'tuto'@'localhost' avec mot de passe 'password$' (la sécurité avant tout lol)

* Donc Maintenant Nous reprennons pour tout le monde !

Nous allons executer notre script de création d'architecture de notre DB
  - Création de la DB
  - Création des tables

```
cd hbs-mysql-node
sudo mysql
```
ensuite dans votre terminal mysql:
```
source db/create_db.sql
```

Voila notre architecture de DB est maintenant creer !

## Creer nos Variable d'environement

Le fichier .env est ce qu'on appel un fichier de variable d'environnement cela va nous etre utils afin de stocker nos variables dites sensible (Clef privée, url de connexion, Mot de passe, ...)

```
cd hbs-mysql-node
nano .env
```
et coller ceci à l'intérieur (biensur éditer le si vous avez vos propres variable de connexion à MySQL)
```
DB_HOST="localhost"
DB_USER="tuto"
DB_PASSWORD="password$"
DB_DATABASE="hbs_mysql"
```

Pour quitter nano:
  - ctrl + x (pour sauvegarder)
  - y (confirmer le chemin de sauvegarde)
  - entréé (confirmer)

## Démarrer le projet

```
cd hbs-mysql-node
npm run dev
```


Et voila J'espère que cela va pouvoir vous aidez, en cas de problèmes n'hésitez pas à me contactez.

xdrkush