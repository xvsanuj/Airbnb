const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapsAsync");
const passport = require("passport");

// Route to display the signup form
router.get("/signup", (req, res) => {
   res.render("users/signup.ejs");
});

// Route to handle signup form submission
router.post("/signup", wrapAsync(async (req, res, next) => {
    const { username, email, password } = req.body;
    try {
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Airbnb");
            res.redirect("/listings");  // Redirect to listings or desired route
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");  // Redirect back to signup page if there's an error
    }
}));

router.get("/login",(req,res)=>{
    res.render(("users/login.ejs"))
});
router.post("/login",passport.authenticate("local", {
    failureRedirect: "/login",failureflash:true
}),async(req,res)=>{
   req.flash("success","Welcome to airbnb! you are logged in!");
   res.redirect("/listings")
})
router.get("/logout",(req,res,next) => {
    req.logout((err) => {
 if(err){
   return  next(err)
 } req.flash("success","you are logged out");
 res.redirect("/listings")
    })
})

module.exports = router;
