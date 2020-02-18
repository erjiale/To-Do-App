const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

// these 2 lines of code configure express to use handlebars library as the view engine for the app
app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");

var data = fs.readFileSync(path.join(__dirname, '/data.json'));
var jsondata = JSON.parse(data);
// console.log(jsondata);

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true })); // bodyParser allows for req.body.(...);

app.get('/', function(req, res) {
    // res.sendFile(path.join(__dirname + '/public/index.html'));
    res.render("home", {datajson: jsondata})
});

app.post("/", function(req, res) {
    console.log("Data inputted: " + req.body.data_input);    
    res.render("home");
});

app.listen(3000);