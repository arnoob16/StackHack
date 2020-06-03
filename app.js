const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const bcrypt = require("bcrypt");


const app = express();

const users = [];


app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.set('view-engine','ejs');

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html");
});
app.get("/signup",function(req,res){
    res.sendFile(__dirname + "/signup.html");
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


app.post("/signup", async(req,res) => {

        try{
            const hashedPassword = await bcrypt.hash(req.body.password,10)
            users.push({
                id: Date.now().toString(),
                name: req.body.name,
                email: req.body.email,
                password : req.body.password,
                confirm_password : hashedPassword
            })
            res.redirect("/login");
        }catch{
            res.redirect("/signup");
        }
        console.log(users);
        
    });
        
    
app.post("/login",function(req,res){

});


 
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

app.listen(3000,function(){
    console.log("Server is running on port 3000");
    
});

//  API key
//  List Id