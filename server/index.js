import express from "express"
import cors from "cors"
import mongoose from "mongoose"


const app = express()
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

mongoose.connect("mongodb+srv://akash:akash123@mern-apps.dgtsqdb.mongodb.net/Auth?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, () => {
    console.log("DB connected")
})

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const User = new mongoose.model("User", userSchema)

//Routes
app.post("/login", (req, res)=> {
    const { name, email, password} = req.body
    User.findOne({ email: email }, (err, users) => {
        if(users){
            if(password === users.password ) {
                res.send({message: "Login Successfull", user: users})
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })
}) 

app.post("/register", (req, res)=> {
    const { name, email, password} = req.body
    User.findOne({email: email}, (err, users) => {
        if(users){
            res.send({message: "User already registerd"})
        } else {
            const users = new User({
                name,
                email,
                password
            })
            users.save(err => {
                if(err) {
                    res.send(err)
                } else {
                    res.send( { message: "Successfully Registered, Please login now." })
                }
            })
        }
    })
    
}) 

app.listen(5000,() => {
    console.log("BE started at port 5000")
})