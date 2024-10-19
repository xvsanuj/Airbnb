const express = require("express");
const mongoose = require('mongoose');
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const listingsRoutes = require("./routes/listing");
const reviewsRoutes = require("./routes/review");
const userRoutes = require("./routes/user");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const app = express();

// Set EJS as view engine and specify views directory
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse URL-encoded data and JSON data
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // Method override for supporting PUT and DELETE via forms
app.engine("ejs", ejsmate); // Using ejs-mate for EJS layouts
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' folder
app.use(bodyParser.json()); // Parse incoming JSON payloads
app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewsRoutes); // Change to plural "reviews"
app.use("/", userRoutes);

// MongoDB connection setup
const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";

// Connect to MongoDB
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
}



    const sessionOptions = {
        secret: "musuresecretcode",
        resave: false,
        saveUninitialized: true,
        cookie: {
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Use Date object
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        },
    };
    
// Root route to display a basic message
app.get("/", (req, res) => {
    res.send("Hey, I am root");
});
app.use(session(sessionOptions))
app.use(flash())
app.use(passport.initialize()); // Add parentheses to invoke the function
app.use(passport.session()); 
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log("Current User:", req.user); // Debugging line
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser",async (req,res)=>{
//     let fakeUser = new User({
//         email:'abc@gmail.com',
//         username : "delta-student"
//     });
//      let registerUser = await  User.register(fakeUser,"helloworld");
//      res.send(registerUser);
// })


// Use listings and reviews routes
// app.use("/listings", listingsRoutes);
// app.use("/listings/:id/review", reviewsRoutes);
// app.use("/",userRoutes)


// Handle all undefined routes (404 error)
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found")); // Handle 404 errors
});

// Error handling middleware for rendering custom error pages
app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).render("error.ejs", { message, statusCode, error: err }); // Render error page with specific message
});

// Start the server and listen on port 3000
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
