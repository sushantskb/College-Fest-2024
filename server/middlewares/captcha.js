const { promisify } = require("util");
const request = promisify(require("request"));

exports.validateCaptcha = async (req, res, next) => {
  // console.log(req.originalUrl);
  const response_key = req.body["g-recaptcha-response"];
  const secret_key = "6LcPLU4pAAAAANKTYPRPJZcZTEjv5-oJUKROe-zE";
  const options = {
    url: `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      json: true,
    },
  };
  try {
    const re = await request(options);
    if (!JSON.parse(re.body)["success"]) {
      // return res.send({ response: "Failed" });
      req.flash('infoErrors','Captcha Failed!');
      return res.redirect(req.originalUrl);
    }
    next();
  } catch (error) {
    // return res.send({ response: "Failed" });
    req.flash('infoErrors','Captcha Failed!');
    return res.redirect(req.originalUrl);
  }
};
