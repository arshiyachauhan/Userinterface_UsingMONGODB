//Connect to MongoDb
const express= require('express');
const mongoose= require('mongoose');
const path= require('path');
require('dotenv').config();
const app= express();
const port=4000;
app.use(express.json());
const mongoURI= process.env.MONGO_URI;
//for adding html form/code
app.use(express.static(path.join(__dirname,'public')));
mongoose.connect(mongoURI)
.then(()=>console.log('Connected to MongoDb'))
.catch(err=> console.error('Error connecting to MongoDb: ',err));

//define user schema
const userSchema= new mongoose.Schema({
    name: String,
    email: String,
    password: String
});
const User= mongoose.model('User',userSchema);

//route handlers- empty array
app.get('/users', (req,res) => {
    User.find({})
    .then(users => res.json(users))
    .catch(err => res.status(500).json({ message: err.message}));
});
//on chrome write localhost:4000/users to check output
//initializing route handler to insert data in above created collection users
app.post('/users',(req,res)=>{
    const user= new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    .then(newUser => res.status(201).json(newUser))
    .catch(err => res.status(400).json({message: err.message
    }));
});

//update array
app.put('/users/:id',(req,res)=>{
    const userId = req.params.id;
    const updateData= {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };
    User.findByIdAndUpdate(userId,updateData, {new: true})
    .then(updateUser =>{
        if(!updateUser) {
            return res.status(404).json({message: 'User not found'});
    }
        res.json(updatedUser);
    })
    .catch(err=>res.status(400).json({message: err.message}));
});

//delete
app.delete('/users/:id',(req,res)=>{
    const userId = req.params.id;
    User.findByIdAndDelete(userId)
    .then(deletedUser =>{
        if(!deletedUser){
        return res.status(404).json({message: 'User not found'});
    }
    res.json({message: 'User deleted successfully'});
})
.catch(err=> res.status(400).json({message:err.message}));
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}`);
});
