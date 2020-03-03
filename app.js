const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const axios = require('axios');
const cookieParser = require('cookie-parser');

const app = express();

// these 2 lines of code configure express to use handlebars library as the view engine for the app
app.engine("handlebars",exphbs());
app.set("view engine", "handlebars");

// reads in data.json
var data = fs.readFileSync(path.join(__dirname, '/data.json'));
var jsondata = JSON.parse(data);
    // console.log(jsondata);

app.use(express.static(path.join(__dirname, 'views')));
app.use(bodyParser.urlencoded({ extended: true })); // bodyParser allows for req.body.(...);
app.use(cookieParser("secret")); // w/o this = Error: cookieParser("secret") required for signed cookies
app.use(cookieParser()); // import cookie-parser middleware

app.get('/', function(req, res) {
    // res.sendFile(path.join(__dirname + '/public/index.html'));
    res.render("home");
});

// part 1d - Submit Data to Express App Using HTML Form
// app.post("/", function(req, res) {
//     console.log("Data inputted: " + req.body.data_input);    
//     res.render("home");
// });

// part 1e - Use Node to Make HTTP Requests to the Hunter-to-do-app API
TODO_API_URL = "https://hunter-todo-api.herokuapp.com";

app.get("/register", function(req,res) {
    res.render("register");
});

app.post("/register", function(req, res) {   
    axios.post(TODO_API_URL + '/user', {
        username: req.body.username_input
    })
    .then(function(response) {
        console.log(response);
    })
    .catch(function(error) {
        console.log(error);
    });

    res.render("home");
});

app.get("/login", function(req,res) {
    res.render("login");
});

app.post("/login", async (req,res) => {
    // authenticatinG
    try {
        const response = await axios.post(TODO_API_URL + '/auth', { username: req.body.username_input});
        res.cookie('Authentication', response.data.token, {
            signed: true,
            httpOnly: true
        });
        res.cookie('Username', req.body.username_input, {
            signed: true,
            httpOnly: true
        });
        res.redirect('/user');
    } catch(err) {
        if (err.response.status === 400) {
            res.render("error", {
                message: "User does not exist",
                error: {status:400}
            })
        }
        console.log(err);
    }

    app.get('/hi', (req,res) => {
        res.send(req.signedCookies);
    })


    // var token = (await axios.post(TODO_API_URL + '/auth', {username: req.body.username_input, headers: {'content-type': application/json}}));
    // res.cookie("Authentication", token);
    // var todo = (await axios.get(TODO_API_URL + '/todo-item', {headers: {'Authorization': token} })).data;
    // res.render('user', {username: req.body.username_input, list: todo}); 
    // axios.post(TODO_API_URL + '/auth', {
    //     username: req.body.username_input 
    // })
    // .then(function(response) {
    //     // console.log(response);
    //     var token = response.data;
    //     // res.cookie('Username', req.body.username_input, {
    //     //     signed: true,
    //     //     httpOnly: true
    //     // });
    //     res.cookie('Authentication', token, {
    //         signed: true,
    //         httpOnly: true
    //     });
    //     // res.render("user", {username:req.body.username_input});
    //     // res.setHeader('Authentication', token);
    //     res.render('user');
    // })
    // .catch(function(error) {
    //     console.log(error);
    // });
});

app.get('/user', async (req,res) => {
    // get data about all todo items under the currently authorized user
    try {
        if (req.signedCookies.Authentication === undefined) {
            res.render('error', {
                message: "User not authenticated",
                error: {status:401}
            })
        }
        else {
            const response = await axios.get(TODO_API_URL + '/todo-item', {
                headers: {
                    Cookie: `token=${req.signedCookies.Authentication}`
                }   
            })
            res.render('user', {username: req.body.username_input, list: response.data})
        }
    } catch(err) {
        if (err.response.status === 400) {
			res.render("error", {
				message: "User doesn't exist",
				error: {status: 400}
			})
		}
        console.log(err);
    }
    // get data about all todo items under the currently authorized user
    // var token = req.signedCookies.Authentication;
    // axios.get(TODO_API_URL + "/todo-item", {
    //     headers: {
    //         'Authorization': token
    //     }
    // }).then(function(response) {
    //     const todo = response.data;
    //     res.render("user", { list: response.data });
    // }).catch(function(error) {
    //     console.log(error);
    // });

    // creating new todo item under the currently authenticated user
    // axios.get(TODO_API_URL + '/todo-item', {
    //     content: 'first to-do'
    // })
    // .then(function(response) {
    //     console.log(response);
    //     // res.render('user');
    // })
    // .catch(function(error) {
    //     console.log(error);
    // });

    // res.render('user');
});

app.get('/logout', async (req,res)=> {
    try {
        res.clearCookie('Authentication');
        res.clearCookie('Username');
        res.redirect('/');
        console.log("Successfully logged out")
    } catch(err) {
        console.log(err);
    }
});



app.listen(3000);