const router = require("express").Router();
const culturalController = require("../controllers/Cultural-Events/culturalController");
const passport = require("passport");
const { authenticate } = require("../middlewares/isAuthenticated");
const captchaCheck = require("../middlewares/captcha");
require("../middlewares/captcha");

router.use(passport.initialize());
router.use(passport.session());

router.get("/", authenticate, culturalController.initPage);
router.get("/:type", authenticate, culturalController.secondPage);
router.get("/:type/:event", authenticate, culturalController.showPage);
router.post(
  "/:type/:event",
  authenticate,
  captchaCheck.validateCaptcha,
  culturalController.registerUser
);

module.exports = router;
