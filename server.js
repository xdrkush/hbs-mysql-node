const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');

//express
const port = process.env.PORT || 7777;
const app = express();

//express static
app.use(express.static("public"))

//methode-override => pour la mise à jour.
app.use(methodOverride("_method"));

//Handlebars
app.engine('hbs', exphbs({
    defaultLayout: 'main',
    extname: 'hbs'
}));
app.set('view engine', 'hbs')

//BodyParser
app.use(bodyParser.urlencoded({
    /*=> "urlencoded", on passe les données dans l'url*/
    extended: true
}));

//MongoDB
mongoose.connect("mongodb://localhost:27017/boutiqueGame", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const ROUTER  = require('./router')
app.use('/', ROUTER)

app.listen(port, function () {
    console.log(`écoute le port ${port}, lancé à : ${new Date().toLocaleString()}`);
})