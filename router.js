// Import de modules
const express = require('express');
// Création de l'instance router avec express
const router = express.Router();
// Module de gestion d'image (rename, format, taille, ... )
const sharp = require('sharp');

// FileSystem
const fs = require('fs');
const path = require('path');

// Gestion du format des Date
const format = require('date-format')

// Middleware pour le stockage de nos image
const upload = require('./multer').upload

// les Routes Category
router.route("/category")
    .get((req, res) => {
        // Script SQL pour récupérer tout les éléments de la table "categories"
        let sql = `SELECT * FROM categories`;
        // On demande à notre DB d'éxecuter notre script
        db.query(sql, (error, data, fields) => {
            if (error) throw error;
            // Et on renvoie notre réponse
            res.status(200).render('category', {
                // ici est le tableau category qui nous servira dans la liste de toutes les catégory
                category: data,
                message: "categories lists retrieved successfully"
            })
        })
    })
    .post((req, res) => {
        // Script SQL pour creer un élement dans la table "categories"
        let sql = `INSERT INTO categories (title) values(?)`;
        let values = [req.body.title];

        // On execute le script
        db.query(sql, [values], function (err) {
            if (err) throw err;
            // on renvoie la réponse au status '200' avec un texte
            res.status(200).send("save ok !")
        })
    })

//===========================================//
// Home
router.route("/")
    // Ici le get de notre page home
    .get((req, res) => {
        // Script SQL pour recupéré toute les clef de toutes les caterogies
        const sqlCategory = 'SELECT * FROM categories'
        // Ici on récupère toute les clef de la table product et on creer une jointure grace à cover de product
        // et on viens récupérer la cover ayant une id egale à product.cover
        const sqlProduct = 'SELECT * FROM products p INNER JOIN covers c ON c.id = p.cover'

        // On execture la recherche de nos catégory
        db.query(sqlCategory, (error, category) => {
            if (error) throw error;
            // On execute le script pour récupérer un objet ayant les clef de product et la cover lier
            db.query(sqlProduct, (err, product) => {
                if (err) throw err;
                console.log(product)
                // On renvoit une réponse au status 200 et on rend la page index avec les data suivantes 'Product' & 'Catégory'
                // qui seront les tableaux que nous auront besoin pour incrémenter nos liste en front
                return res.status(200).render("index", {
                    Product: product,
                    Category: category,
                    // On renvoit message dont on ne ce sert pas mais on pourrait très bien l'utiliser en tant que flash
                    message: "categories lists retrieved successfully"
                })
            })
        })
    })
    // Ici notre formulaire post
    // Ici nous avons upload qui est l'import de multer en tant que middleware pour qui récupère notre image envoyer dans len formulaire
    // 'single' pour spécifier que c'est une image seul, et 'cover' qui est le name du input de notre formulaire
    .post(upload.single("cover"), (req, res) => {
        // On attribue la variable file qui est req.file donc le fichier envoyé dans la requète (ici notre image)
        const file = req.file;
        // Ici on stock notre url pour pouvoir la réutiliser à l'identique
        const sharpPathname = '/uploads/web-' + Date.now() + '-' + file.originalname.split('.')[0] + ".webp"

        // Ici on utilise Sharp avec l'image envoyer qui va nous permetre de retravailler notre image 
        sharp(file.path)
            // ici nous redimensionons notre image
            .resize(200)
            // On veux modifier sont format en webp
            .webp({ quality: 80 })
            // On pourrait lui demander d'effectuer un rotation à notre image
            //.rotate(90)
            // Ici on vient sauvegarder notre image en la renomant avec la date pour oins de conflit
            .toFile('public' + sharpPathname, (err, info) => { });

        // Ici on viens stocker les valeurs de notre image que l'on veux inscrire dans la DB
        const cover = [
            file.filename, // Filename
            file.originalname, // Originalname
            file.path.replace("public", ""), // Path
            sharpPathname, // UrlSharp
            format('yyyy-MM-dd', new Date()) // createAt
        ]

        // On execute notre script SQL qui a pour fonction d'inscrire nos data dans la DB 
        // on nomme bien l'ordre des valeurs à recevoir et on demande à values de récuper le query
        // query ici est stocker dans cover
        db.query(`INSERT INTO covers (name, originalname, path, urlSharp, createAt) values(?)`, [cover], function (err, data, next) {
            if (err) throw err;
            // Ici on viens stocker les valeur de Product à inscrire dans la DB grâce à req.body
            const values = [
                req.body.title, // le titre
                req.body.content, // le contenu
                Number(req.body.price), // le prix
                req.body.category, // la catégory (id) envoyer depuis le select de la liste de category
                data.insertId // ici on récupère l'id de la cover créé juste au dessus pour notre futur relation (jointure)
            ]
            // On execute notre script SQL qui va inscrire nos data dans notre DB
            db.query(`INSERT INTO products (title, content, price, category, cover) values(?)`, [values], function (err, data) {
                if (err) throw err;
                // Ici on renvoie notre réponse
                return res.status(200).json("save ok !")
            })
        })

    })
    // Ici la method en relation avec le boutton de suppression de tout nos article 
    // En supprimant bien évidemment les covers
    // Mais aussi les image stocker dans notre architecture
    .delete(async (req, res) => {
        // On definit le dossier contenant toutes nos images
        const directory = path.resolve("public/uploads")

        // fs.readdir nous permet de scan l'intérieur d'un dossier et de voir les fichiers
        // Il resort le résultat dans un tableau
        fs.readdir(directory, (err, files) => {
            if (err) throw err
            // On parcours notre dossier
            for (const file of files) {
                // et fs viens supprimer tout les fichiers
                fs.unlink(path.join(directory, file), (err) => {
                    if (err) throw err
                    return
                })
            }
        })

        // Suppression de tout les élément dans la table 'covers'
        await db.query('DELETE FROM covers')
        // Suppression de tout les élément dans la table 'products'
        await db.query('DELETE FROM products')

        // Et on return la réponse ave cun status 200 et un texte
        return res.status(200).json('Deleted all ok !')

    })

// route édition
// Home /:id
router.route("/:id")
    .get((req, res) => {
        // Script SQL pour allez chercher les produits en relation avec l'id passer en parametre de l'url
        let sql = `SELECT * FROM products WHERE id = '${req.params.id}';`;

        // On execute notre script
        db.query(sql, (error, data) => {
            if (error) throw error;
            // On renvoie la réponse
            return res.status(200).render("edition", {
                // On viens selectioner notre premières élement du tableaux 
                // pour travailler avec notre objet en front
                product: data[0]
            })
        })
    })
    .put((req, res) => {
        // Script SQL pour allez chercher les produits en relation avec l'id passer en parametre de l'url
        const sql = `UPDATE products SET ? WHERE id = ?;`

        // Voici la nouvelle valeur de notre object que l'on va envoyer dans notre script SQL
        const values = {
            title: req.body.title,
            content: req.body.content,
            price: Number(req.body.price)
        }

        // On execute notre script
        db.query(sql, [values, req.params.id], function (err, edit) {
            if (err) throw err;
            // On renvoie la réponse
            return res.status(200).send("update ok !")
        })
    })
    .delete(async (req, res) => {
        // Script SQL pour allez chercher les produits en relation avec l'id passer en parametre de l'url
        const sqlProduct = `SELECT * FROM products WHERE id = '${req.params.id}'`

        // On execute notre script
        await db.query(sqlProduct, [req.params.id], async (err, product) => {
            if (err) throw err;

            if (product[0].cover) {
                // Script SQL pour allez chercher les covers en relation avec la cover du produit (callback)
                const sqlCover = `SELECT * FROM covers WHERE id = '${product[0].cover}'`

                // On execute le script
                db.query(sqlCover, [product[0].cover], (err, data) => {
                    // Ici on viens supprimer l'image (png) dans l'architecture
                    fs.unlink(path.resolve('public/' + data[0].path), (err) => {
                        if (err) console.log(err)
                    })
                    // Ici on viens supprimer l'image (webp) dans l'architecture
                    fs.unlink(path.resolve('public/' + data[0].urlSharp), (err) => {
                        if (err) console.log(err)
                    })
                    // cela n'a aucune utilité de garder les 2 images dans notre architecture
                    // Cela à été fait consciament pour le tuto afin de vous montrer comment
                    // fonctionne sharp et multer mais vous pouvez très bien vous passer de sharp
                    // Il est pratique car le webp est un format beaucoup plus leger. 
                })
            }

            // Ici on execute un script SQL asynchrone pour supprimer notre produit
            await db.query(`DELETE FROM products WHERE id = ?`, [product[0].id])
            // Ici on execute un script SQL asynchrone pour supprimer notre cover en relation avec le produit
            await db.query(`DELETE FROM covers WHERE id = ?`, [product[0].cover])

            // Et on renvoie notre réponse
            return res.status(200).json('Element bien supprimer !')

        })
    })

module.exports = router