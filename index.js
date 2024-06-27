const express = require("express"); //Express is a node js web application framework
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); // adds MongoDB support to your Express application
const dotenv = require("dotenv"); // Dotenv is a popular npm package used to manage environment variables

const app = express ();
dotenv.config();

const port = process.env.PORT || 3000;  // to access anything from .env file use "process.env.variableName"; 

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.6daoaqk.mongodb.net/registrationFormDB`, {
    useNewUrlParser : true,
    useUnifiedTopology : true
});

// registration schema
const registrationSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String
});

// model of registration schema
const Registration = mongoose.model("Registration", registrationSchema);

app.use(bodyParser.urlencoded ({ extended: true }));
app.use(bodyParser.json());
// to allow bachground image index.js
app.use(express.static(__dirname));

app.get("/", (req, res)=>{  
    res.sendFile(__dirname + "/pages/index.html");
})

app.post("/register", async (req, res)=>{ // if we use "await" we need to make it "async"
    try{
        // store data from client into variable
        const {name, email, password} = req.body;

        // to check if the user already exists
        const existingUser = await Registration.findOne({email: email});
        if(!existingUser){
            // to save data collected into mongodb
            const registrationData = new Registration({
                name, email, password
            });

            await registrationData.save(); // if we use "await" we need to make it "async"; await keyword will wait until its run completely 
            res.redirect("/success"); // redirecting to success route
        }
        else{
            console.log("User already exists");
            res.redirect("/existingUser");
        }
    }
    catch(error){
        console.log(error);
        res.redirect("error");
    }
})

app.get("/success", (req,res)=>{
    res.sendFile(__dirname + "/pages/success.html");
})
app.get("/error", (req,res)=>{
    res.sendFile(__dirname + "/pages/error.html");
})
app.get("/existingUser", (req,res)=>{
    res.sendFile(__dirname + "/pages/existingUser.html");
})

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`); // when variables are used like "${varName}", we should use `` these quotes
})