const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchUser');

const JWT_SECRET = "Gautam@123";

//Route 1: Post handler for "/api/auth/creatuser" , No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  let success = false;

  //if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  //check whether the user with the email exists already
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      success = true;
      return res.status(400).json({ success,error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    })
    // then(user => res.json(user))
    //   .catch(err => {
    //     console.log(err);
    //     res.json({ error: 'Please enter a unique value for email', message: err.message });
    //   });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);

    // res.json(user)
    res.json({ success,authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Some Error Occured");
  }
});


// Route 2: Authenticate a user handler for "/api/auth/login" , No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be Empty').exists()
], async (req, res) => {
  let success=false;
  //if there are errors, return bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success,errors: errors.array() });
  }
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });

    if (!user) {
      
      return res.status(400).json({ error: "Please Try to login with correct credential" });
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      success = false;
      return res.status(400).json({ success, error: "Please Try to login with correct credential" });
    }
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);
    success = true;
    // res.json(user)
    res.json({ success, authtoken })
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error Occured");
  }

});


// Route 3: Get logged in User Details using POST "/api/auth/getuser" , login required
router.post('/getuser', fetchuser , async (req, res) => {

  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error Occured");
  }
});

module.exports = router;