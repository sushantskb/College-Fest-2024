const router = require("express").Router()
const { authenticate } = require("../middlewares/isAuthenticated");
const foodStallController = require("../controllers/Food-Stall/foodStallController")
const passport = require("passport");
require("../middlewares/passport");

const captchaCheck = require("../middlewares/captcha");

router.use(passport.initialize());
router.use(passport.session());

router.get("/",authenticate, foodStallController.showPage);
router.post("/",authenticate,captchaCheck.validateCaptcha,foodStallController.registerUser)


module.exports = router