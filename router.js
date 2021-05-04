// Import
const express = require('express'),
    router = express.Router(),
    sharp = require('sharp');

// Gestion du format des Date
const format = require('date-format')

// Middleware
const upload = require('./multer').upload

// Category
router.route("/category")
    .get((req, res) => {
        // Variable de récupération de tout les users
        let sql = `SELECT * FROM categories`;
        db.query(sql, (error, data, fields) => {
            if (error) throw error;
            res.render('category', {
                status: 200,
                category: data,
                message: "categories lists retrieved successfully"
            })
        })
    })
    .post((req, res) => {
        let sql = `INSERT INTO categories (title) values(?)`;
        let values = [
            req.body.title
        ];
        db.query(sql, [values], function (err) {
            if (err) throw err;
            res.json("save ok !")
        })
    })

//===========================================//
// Home
router.route("/")
    .get((req, res) => {
        const sqlCategory = 'SELECT * FROM categories'
        const sqlProduct = 'SELECT * FROM products p INNER JOIN covers c ON c.id = p.cover'
        db.query(sqlCategory, (error, category) => {
            if (error) throw error;
            db.query(sqlProduct, (err, product) => {
                if (err) throw err;
                return res.render("index", {
                    status: 200,
                    Product: product,
                    Category: category,
                    message: "categories lists retrieved successfully"
                })
            })
        })
    })
    .post(upload.single("cover"), (req, res) => {
        const file = req.file;

        sharp(file.path)
            .resize(200)
            .webp({
                quality: 80
            })
            //.rotate(90)
            .toFile('./public/uploads/web' + file.originalname.split('-').slice(0, -1).join('-') + ".webp", (err, info) => { });

        const cover = [
            file.filename, // Filename
            file.originalname, // Originalname
            file.path.replace("public", ""), // Path
            `/uploads/web${file.originalname.split('-').slice(0, -1).join('-')}.webp`, // UrlSharp
            format('yyyy-MM-dd', new Date()) // createAt
        ]

        db.query(`INSERT INTO covers (name, originalname, path, urlSharp, createAt) values(?)`, [cover], function (err, data, next) {
            if (err) throw err;
            const values = [
                req.body.title,
                req.body.content,
                Number(req.body.price),
                req.body.category,
                data.insertId
            ]
            db.query(`INSERT INTO products (title, content, price, category, cover) values(?)`, [values], function (err, data) {
                if (err) throw err;
                console.log(data)
                return res.json("save ok !")
            })
        })

    })
    .delete((req, res) => {
        let sql = `DELETE FROM products`;
        db.query(sql, function (err, data, fields) {
            if (err) throw err;
            else res.send('delete ok')
        })
    })

// route édition
// Home /:id
router.route("/:id")
    .get((req, res) => {
        // Variable de récupération de tout les users
        let sql = `SELECT * FROM products WHERE id = '${req.params.id}';`;

        db.query(sql, (error, data) => {
            if (error) throw error;
            return res.render("edition", {
                id: data[0].id,
                title: data[0].title,
                content: data[0].content,
                price: data[0].price
            })
        })
    })
    .put((req, res) => {
        const sql = `UPDATE products SET ? WHERE id = ?;`

        const values = {
            title: req.body.title,
            content: req.body.content,
            price: Number(req.body.price)
        }

        db.query(sql, [values, req.params.id], function (err, edit) {
            if (err) throw err;
            return res.send("update ok !")
        })
    })
    .delete((req, res) => {
        const sql = `DELETE FROM products WHERE id = ?`;
        const values = [
            req.params.id
        ];
        db.query(sql, [values], function (err, del, fields) {
            if (err) throw err;
            return res.send('Product deleted !')
        })
    })

module.exports = router