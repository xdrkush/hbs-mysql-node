//upload image
const multer = require('multer'),
    path = require('path');

//const { default: algoliasearch } = require('algoliasearch');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },

    filename: function (req, file, cb) {

        const ext = path.extname(file.originalname);
        const date = Date.now();

        cb(null, date + '-' + file.originalname)
        //cb(null, file.originalName + '-' + Date.now() + ext)
    }
})

exports.upload = multer({
    storage: storage,
    limits: {
        fileSize: 1 * 3000 * 3000,
        // pour les dimentions mettre ce que l'on veut
        files: 1
    },
    fileFilter: function (req, file, cb) {
        /* => Pour le filtrage des images*/
        if (
            file.mimetype === "image/png" ||
            file.mimetype === "image/jpeg" ||
            file.mimetype === "image/gif"
        ) {
            cb(null, true)
        } else cb(new Error('Le fichier doit être au format png, jpeg ou gif.'))
    }

})
