const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const saltround = 10
var enteredText = ""
var regEmail = ""
var regPassword = ""
var userId=""
var userName=""
var uName=""

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname))
app.set("view engine", "ejs")

const notesSchema = new mongoose.Schema({
    text: String,
    user: String
})
const Note = mongoose.model("note", notesSchema)

const logSchema = new mongoose.Schema({
    email: String,
    password: String,
    userName: String
})
const Log = mongoose.model("log", logSchema)

app.get("/", function(req,res){
    res.render("home")
})

app.post("/", function(req,res){
    Log.findOne({email: req.body.lemail}, function(err, foundemail){
        if(err){
            console.log(err)
        }else{
            if(foundemail){
                bcrypt.compare(req.body.lpassword, foundemail.password, function(err, result){
                    if(result==true){
                        userName=foundemail.email
                        userId=foundemail.id
                        res.redirect("/notes")                        
                    }else{
                        res.redirect("/")
                    }
                })
            }else{
                res.redirect("/")
            }
        }
    })
})

app.get("/register", function(req,res){
    res.render("register")
})
app.post("/register", function(req,res){
    bcrypt.hash(req.body.rpassword, saltround, function(err, hash){
        regEmail = req.body.remail
        regPassword = hash 
        uName = req.body.uName      
        const log = new Log({
            email: regEmail,
            password: regPassword,
            userName: uName
        })
        log.save()
        userName=log.email
        userId=log.id
        res.redirect("/notes")
    })
})

app.get("/notes", function(req,res){
    Note.find({}, function(err, textContent){
        res.render("index", {text: textContent, userId: userId, uName: uName})
    })
})
app.post("/notes", function(req,res){
    enteredText = req.body.enteredText
    const note = new Note({
        text: enteredText,
    })
    note.save()
    note.user=userId
    res.redirect("/notes")
})

app.post("/delete", function(req,res){
    const del = req.body.btn
    Note.findByIdAndDelete(del, function(err){
        res.redirect("/notes")
    })
})

mongoose.connect("mongodb+srv://9nimbu9:1234567890@cluster0.fq4ljvz.mongodb.net/keep-notes")
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
 
app.listen(port, function() {
  console.log("Server started succesfully");
});  
