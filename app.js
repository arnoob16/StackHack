if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const bcrypt = require("bcrypt");
const passport = require("passport");
const flash = require("express-flash");
const session = require("express-session");
const methodOverride = require('method-override')



const app = express();

const intializePassport = require('./passport-config');
intializePassport(
    passport,
    email => users.find(user => user.email === email),
     id => users.find(user => user.id === id)   
    )


const users = [];

app.set('view engine', 'ejs');


app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:false}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(flash());
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get("/",function(req,res){
    res.render("index.ejs");
});

app.get("/login",(req,res)=>{
    res.render("login.ejs");
});

app.post('/login',passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
  }));
app.get("/signup",(req,res)=>{
    res.render("signup.ejs");
}); 
app.post("/signup",async(req,res) => {

    try{
        const hashedPassword = await bcrypt.hash(req.body.password,10)
        users.push({
            id: Date.now().toString(),
            name: req.body.name,
            email: req.body.email,
            password : hashedPassword,
            confirm_password : hashedPassword
        })
        res.redirect("/login");
    }catch{
        res.redirect("/signup");
    }
    console.log(users);
    
});

app.post("/",function(req,res){
    const email = req.body.email;

    const data={
        members:[
            {
                email_address: email,
                status: "subscribed"
            }
        ]
    };


    const jsonData = JSON.stringify(data);
    const url = "https://us19.api.mailchimp.com/3.0/lists/a86b6611d6"
    const options ={
        method: "POST",
        auth:"sonu:6d0d84618941115a34518fe74e99568b-us19"
    }

  const request =  https.request(url,options,function(response){

    if(res.statusCode == 200){
        res.sendFile(__dirname + "/success.html")
    }else{
        res.sendFile(__dirname + "/failure.html")
    }
       response.on("data",function(data){
           console.log(JSON.parse(data));
           
       })
        
    })
    request.write(jsonData);
    request.end();

});

app.delete('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/login');
})

// function checkAuthenticated(req,res,next){
//     if(req.isAuthenticated()){
//         return next();
//     }

//     res.redirect('/login');
// }

// function checkNotAuthenticated(req,res,next){
//     if(req.isAuthenticated()){
//        return res.redirect('/')
//     }
//     next();
// }

app.listen(3000,function(){
    console.log("Server is running on port 3000");
    
});

//  API key
//  List Id