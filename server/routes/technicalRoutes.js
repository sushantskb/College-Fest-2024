const router = require("express").Router();
const technicalController = require("../controllers/Technical-Events/technicalController");
const passport = require("passport");
const { authenticate } = require("../middlewares/isAuthenticated");
const captchaCheck = require("../middlewares/captcha");
require("../middlewares/captcha");

router.use(passport.initialize());
router.use(passport.session());

router.get("/", authenticate, technicalController.initPage);
router.get("/:type", authenticate, technicalController.secondPage);
router.get("/:type/:event", authenticate, technicalController.showPage);
router.post(
  "/:type/:event",
  authenticate,
  captchaCheck.validateCaptcha,
  technicalController.registerUser
);

module.exports = router;
