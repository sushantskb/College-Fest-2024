const router = require("express").Router();
const passport = require("passport");
require("../middlewares/passport");
const { authenticate } = require("../middlewares/isAuthenticated");

router.use(passport.initialize());
router.use(passport.session());

// routes
const sportsRoutes = require("./sportsRoutes");
const nonTechnicalRoutes = require("./non-technicalRoutes");
const technicalRoutes = require("./technicalRoutes");
const culturalRoutes = require("./culturalRoutes");
const allEvents = require("../controllers/UserData/userDataController");
const userDataController = require("../controllers/UserData/userDataController");
const foodstallRouter = require("./foodStallRoutes");

// Auth
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Auth Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { successRedirect: "/" })
);

// router.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => {
//     console.log(req.originalUrl);
//     const returnTo = req.session.returnTo || "/";
//     delete req.session.returnTo;
//     res.redirect(returnTo);
//   }
// );

router.get("/auth", (req, res) => {
  res.render("auth", {
    loader_title_1: "",
    loader_title_2: "",
    loader_title_3: "Login",
  });
});

router.get("/events/sports", (req, res) => {
  res.render("events", {
    loader_title_1: "Here",
    loader_title_2: "Comes",
    loader_title_3: "Events",
  });
});

router.get("/", (req, res) => {
  let message;
  if (req.user) {
    message = "yes";
  } else {
    message = "no";
  }
  res.render("index", {
    loader_title_1: "Here",
    loader_title_2: "Comes",
    loader_title_3: "Shrujan 2.0",
    message,
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }
    res.redirect("/");
  });
});

router.get("/team", (req, res) => {
  res.render("team", {
    loader_title_1: "Introducing",
    loader_title_2: "Our",
    loader_title_3: "Team",
  });
});

router.get(
  "/myregistrations",
  authenticate,
  userDataController.searchRegisteredEvents
);

// --test route--
router.get("/t-shirt", (req, res) => {
  res.render("t-shirt", {
    loader_title_1: "New",
    loader_title_2: "T-Shirts",
    loader_title_3: "Arrived",
  });
});



// Routes
router.use("/events/sports", sportsRoutes);
router.use("/events/non-technical", nonTechnicalRoutes);
router.use("/events/technical", technicalRoutes);
router.use("/events/cultural", culturalRoutes);
router.use("/events/foodstall", foodstallRouter);
// router.get("/registration", authenticate, userController.getData);


// 404 Error
router.get("*", (req, res) => {
  res.render("error", {
    loader_title_1: "OOPS",
    loader_title_2: "404",
    loader_title_3: "ERROR",
  });
});

module.exports = router;
