var express = require('express');
var path = require('path');
var fs = require('fs');

var app = express();

var data = fs.readFileSync(path.join(__dirname, '/data.json'));
var jsondata = JSON.parse(data);

for (var index in jsondata) {
    console.log(jsondata[index].name);
}

app.use(express.static(path.join(__dirname, 'public')));

// var datafile = path.join(__dirname, './data.json')

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    
});

app.listen(3000);