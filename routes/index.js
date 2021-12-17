const router = require("express").Router();


const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model');

const AuthMiddleware = (req,res,next)=>{
  if(req.session.loggedIn){
    next();
  }
  else
    res.redirect('')
}

/* GET home page */

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req,res,next)=>{
  res.render("auth/login");
})
router.post("/login", async (req,res,next)=>{
  /* const salt = await bcryptjs.genSalt(saltRounds);
  const hashed = await bcryptjs.hash(req.body.password,salt);
 */
  const user= await User.findOne({username:req.body.username}).exec();


  console.log(user);
  if(user){
    bcryptjs.compare(password,user.password,(err,res)=>{
      
    })
    req.session.loggedIn= true;
    req.session.user;
    console.log(user);
    res.redirect("/");
  }
  else{
    res.redirect("/login");
  }
})
// GET route ==> to display the signup form to users
router.get('/signup', (req, res) => res.render('auth/signup'));

// POST route ==> to process form data
router.post('/signup', (req, res, next) => {
    console.log('The form data: ', req.body);

    const { username, password } = req.body;
 
  bcryptjs
    .genSalt(saltRounds)
    .then(salt => bcryptjs.hash(password, salt))
    .then(hashedPassword => {
        return User.create({
            username,
            password: hashedPassword,
        });
      console.log(`Password hash: ${hashedPassword}`);
    })
    .then(userFromDB => {
        console.log('Newly created user is: ', userFromDB);
    })
    .catch(error => next(error));
});

module.exports = router;
