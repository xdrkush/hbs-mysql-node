// Import
const express = require('express'),
      router = express.Router(),
      sharp = require('sharp');

// Middleware
const upload = require('./multer').upload

// Models
const Product = require('./Product-model'),
      Category = require('./Category-model');

// Category
router.route("/category")
    .get((req, res) => {
        Category.find()
            .lean()
            .exec((err, category) => {
                if (err) throw new Error(err)
                else res.render("category", { categorie: category })
            })
    })
    .post((req, res) => {
        const newCategory = new Category({
            title: req.body.title
        })

        newCategory.save((err) => {
            if (err) throw new Error(err)
            else res.send("save ok !")
        })
    })

//===========================================//
// Home
router.route("/")
    .get((req, res) => {
        Product
            .find()
            .populate("category")
            .lean()
            .exec((err, produit) => {
                console.log(produit)
                if (err) throw new Error(err)
                else {
                    Category.find()
                        .lean()
                        .exec((err, category) => {
                            if (err) throw new Error(err)
                            return res.render("index", {
                                Product: produit,
                                Category: category
                            })
                        })
                }
            })
    })
    .post(upload.single("cover"), (req, res) => {
        const file = req.file;

        sharp(file.path)
            .resize(200)
            .webp({
                quality: 80
            }) // => "webp", format google
            //.rotate(90)
            .toFile('./public/uploads/web' + file.originalname.split('-').slice(0, -1).join('-') + ".webp", (err, info) => { });

        const newProduct = new Product({
            title: req.body.title,
            content: req.body.content,
            price: req.body.price,
            category: req.body.category

        });

        if (file) {
            newProduct.cover = {
                name: file.filename,
                originalname: file.originalname,
                //path:"uploads/" + filename
                path: file.path.replace("public", ""),
                urlSharp: '/uploads/web' + file.originalname.split('-').slice(0, -1).join('-') + ".webp",
                createAt: Date.now()
            }
        }

        newProduct.save(function (err) {
            if (err) throw new Error(err)
            else res.send('save ok')
        })
    })
    .delete((req, res) => {
        /*pour supprimer toutes les variables*/
        Product.deleteMany(function (err) {
            if (err) throw new Error(err)
            else res.send('delete ok')
        })
    })

// route édition
// Home /:id
router.route("/:id")
    .get((req, res) => {
        Product.findById(req.params.id)
            .lean()
            .exec((err, produit) => {
                if (err) throw err
                else {
                    console.log(produit)
                    res.render("edition", {
                        id: produit._id,
                        title: produit.title,
                        content: produit.content,
                        price: produit.price
                    })
                }
            })
    })
    .put((req, res) => {
        Product.findByIdAndUpdate(
            //condition
            { _id: req.params.id },
            //update
            {
                title: req.body.title,
                content: req.body.content,
                price: req.body.price
            },
            //option
            // { multi: true }, /*pour faire plusieurs modif en même temps*/
            //executer la fonction
            (err) => {
                if (err) throw new Error(err)
                else res.send("update ok !")
            }
        )
    })
    .delete((req, res) => {
        /*pour supprimer 1 seule variable, en fonction de son id*/
        Product.deleteOne({
            _id: req.params.id
        }, (err) => {
            if (err) throw new Error(err)
            else res.send("product delete")
        })
    })

module.exports = router