const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const axios = require('axios');

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

// part 1d - Submit Data to Express App Using HTML Form
app.post("/", function(req, res) {
    console.log("Data inputted: " + req.body.data_input);    
    res.render("home");
});

// part 1e - Use Node to Make HTTP Requests to the Hunter-to-do-app API
TODO_API_URL = "https://hunter-todo-api.herokuapp.com";

    // creates a new user with username: "jayqiu"
app.get("/new_user", function(req,res) {
    axios.post(TODO_API_URL + '/user', {
        username: 'jayqiu'
    })
    .then(function(response) {
        console.log(response);
    })
    .catch(function(error) {
        console.log(error);
    });

    // data: { token: 'TVRBMk9qRTFPREl3TmpZNU5qRT0=' } }
    // authenticating
    axios.post(TODO_API_URL + '/auth', {
        username: 'jayqiu'
    })
    .then(function(response) {
        console.log(response);
    })
    .catch(function(error) {
        console.log(error);
    });

    // creating new todo item under the currently authenticated user
    // axios.post(TODO_API_URL + '/todo-item', {
    //     content: 'first to-do'
    // })
    // .then(function(response) {
    //     console.log(response);
    // })
    // .catch(function(error) {
    //     console.log(error);
    // });
    
    // get data about all todo items under the currently authorized user
    // axios.get(TODO_API_URL + "/todo-item").then(function(response) {
    //     res.render("user-todo", { list: response.data });
    //   });

});


app.listen(3000);