const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();

// these 2 lines of code configure express to use handlebars library as the view engine for the app
app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");

var data = fs.readFileSync(path.join(__dirname, '/data.json'));
var jsondata = JSON.parse(data);
console.log(jsondata);
// for (var index in jsondata) {
//     console.log(jsondata[index].name);
// }

app.use(express.static(path.join(__dirname, 'views')));

app.get('/', function(req, res) {
    // res.sendFile(path.join(__dirname + '/public/index.html'));
    res.render("home", {datajson: jsondata})
});

app.listen(3000);