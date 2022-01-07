const router = require("express").Router();

const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const User = require("../models/User.model");
const AuthMiddleware = require("../middlewares");


/* GET home page */

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username }).exec();
    console.log(user);
    if (user) {
      bcryptjs.compare(password, user.password, (err, res2) => {
        req.session.loggedIn = true;
        req.session.user = user;
        console.log(user);
        res.redirect("/");
      }); 
    } else {
      res.redirect("/login");
    } 
  } catch (ex) {
    console.error(ex);
  }
});
// GET route ==> to display the signup form to users
router.get("/signup", (req, res) => res.render("auth/signup"));
router.get("/logout",(req,res)=>{
  req.session.destroy();
  res.redirect("/login");
})

// POST route ==> to process form data
router.post("/signup", (req, res, next) => {
  console.log("The form data: ", req.body);

  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'All fields are mandatory. Please provide your username and password.' });
    return;
  }

  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res
      .status(500)
      .render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
    return;
  }
  
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      console.log(`Password hash: ${hashedPassword}`);
      return User.create({
        username,
        password: hashedPassword,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
    })
    .catch((error) => next(error));
});

router.get("/private",AuthMiddleware,(req,res,next)=>{
  res.render("private");
});

router.get("/main",AuthMiddleware,(req,res,next)=>{
  res.render("main");
});

module.exports = router;

