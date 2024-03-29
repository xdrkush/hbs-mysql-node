// Import de module
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

// Express
const port = process.env.PORT || 7777;
const app = express();

// Module .env (variable d'environement)
require('dotenv').config()

// express static
app.use(express.static("public"))

// methode-override => pour la mise à jour.
app.use(methodOverride("_method"));

// Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs')

// BodyParser
app.use(bodyParser.urlencoded({
    /*=> "urlencoded", on passe les données dans l'url*/
    extended: true
}));

// Mysql Connection
db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Check connexion MySql
db.connect((err) => {
    if (err) throw err
    console.log('connected as id ' + db.threadId);
});

// import de nos routes
const ROUTER  = require('./router')
// On demande à express (app) d'utiliser notre router
app.use('/', ROUTER)


// Ici on lance notre application
app.listen(port, function () {
    console.log(`écoute le port ${port}, lancé à : ${new Date().toLocaleString()}`);
})