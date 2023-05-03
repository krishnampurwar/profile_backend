
const Employee = require('../models/employee');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

const secretkey = 'secretkey';
module.exports.signup = (req,res) => {
    const { name, email, password } = req.body;


    console.log(name);
 console.log(email);
 console.log(password);

    if(!name || !email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }

    Employee.findOne({email})
    .then(user => {
        if(user) return res.status(400).json({msg: 'User already exists'});

        const newUser = new Employee({ name, email, password });

        // Create salt and hash
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                    .then(user => {
                        jwt.sign(
                            { id: user._id },
                            secretkey ,
                            { expiresIn: 3600 },
                            (err, token) => {
                                if(err) throw err;
                                res.json({
                                    token,
                                    user: {
                                        id: user._id,
                                        name: user.username,
                                        email: user.email
                                    }
                                });
                            }
                        )
                    });
            })
        })
    })
}

module.exports.login = async (req,res) => {
  const { email , password } = req.body;

    if(!email || !password){
        res.status(400).json({msg: 'Please enter all fields'});
    }
    Employee.findOne({email})
        .then(user => {
            if(!user) return res.status(400).json({msg: 'User does not exist'});

            // Validate password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(!isMatch) return res.status(400).json({ msg: 'Invalid credentials'});

                    jwt.sign(
                        { id: user._id },
                        secretkey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user._id,
                                    name: user.username,
                                    email: user.email
                                }
                            });
                        }
                    )
                })
        })
}

module.exports.get_User = async (req,res)=>{

    try{
      const user = await Employee.findById(req.user.id).select('-password');
      res.json(user);
    }catch(err){
      console.error(err.message);
      res.status(500).json({msg:'error'});
    }
  
  }
