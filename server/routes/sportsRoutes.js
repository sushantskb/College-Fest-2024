const router = require("express").Router();
const { authenticate } = require("../middlewares/isAuthenticated");
const singleController = require("../controllers/Sports-Events/singleEventController");
const doubleController = require("../controllers/Sports-Events/doubleEventController");
const teamcontroller = require("../controllers/Sports-Events/teamEventController");
const categoryController = require("../controllers/Sports-Events/categoryEventController");
const passport = require("passport");
require("../middlewares/passport");

const captchaCheck = require("../middlewares/captcha");

router.use(passport.initialize());
router.use(passport.session());

router.get("/singles", authenticate, (req, res) => {
  const eventMessage = req.flash("eventMessage")[0];
  res.render("singleSports", {
    loader_title_1: "Events",
    loader_title_2: "Sports",
    loader_title_3: "Singles",
    eventMessage,
  });
});
router.get("/doubles", authenticate, (req, res) => {
  res.render("doubleSports", {
    loader_title_1: "Events",
    loader_title_2: "Sports",
    loader_title_3: "Doubles",
  });
});
router.get("/teams", authenticate, (req, res) => {
  const eventMessage = req.flash("eventMessage")[0];
  res.render("teamSports", {
    loader_title_1: "Events",
    loader_title_2: "Sports",
    loader_title_3: "Teams",
    eventMessage,
  });
});
router.get("/category", authenticate, categoryController.initPage);
router.get("/singles/:event", authenticate, singleController.showPage);
router.post(
  "/singles/:event",
  authenticate,
  captchaCheck.validateCaptcha,
  singleController.registerUser
);
router.get("/doubles/:event", authenticate, doubleController.showPage);
router.post(
  "/doubles/:event",
  authenticate,
  captchaCheck.validateCaptcha,
  doubleController.registerUsers
);
router.get("/teams/:event", authenticate, teamcontroller.showPage);
router.post(
  "/teams/:event",
  authenticate,
  captchaCheck.validateCaptcha,
  teamcontroller.registerUsers
);

router.get(
  "/category/powerlifting",
  authenticate,
  categoryController.showPagePower
);
router.get("/category/swimming", authenticate, categoryController.secondPage);
router.get(
  "/category/swimming/:event",
  authenticate,
  categoryController.showPageSwim
);
router.post(
  "/category/swimming/:event",
  authenticate,
  captchaCheck.validateCaptcha,
  categoryController.registerUserSwim
);
router.post(
  "/category/powerlifting",
  authenticate,
  captchaCheck.validateCaptcha,
  categoryController.registerUserPower
);

module.exports = router;
