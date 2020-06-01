const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/index.html");
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

app.listen(3000,function(){
    console.log("Server is running on port 3000");
    
});

//  API key
//  List Id