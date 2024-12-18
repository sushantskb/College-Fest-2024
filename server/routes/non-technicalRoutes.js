const router = require("express").Router();
const nontechnicalController = require("../controllers/Non-Technical/non-technicalController");
const passport = require("passport");
const { authenticate } = require("../middlewares/isAuthenticated");
const captchaCheck = require("../middlewares/captcha");
require("../middlewares/passport");

router.use(passport.initialize());
router.use(passport.session());

router.get("/", authenticate, nontechnicalController.initPage);
router.get("/:type", authenticate, nontechnicalController.secondPage);
router.get("/:type/:event", authenticate, nontechnicalController.showPage);
router.post(
  "/:type/:event",
  authenticate,
  captchaCheck.validateCaptcha,
  nontechnicalController.registerUser
);

module.exports = router;
