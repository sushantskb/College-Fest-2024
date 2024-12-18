const authenticate = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      // console.log(req.originalUrl);
      // req.session.returnTo = req.originalUrl;
      // res.redirect("/auth");
      return res.render("auth", {
        loader_title_1: "You",
        loader_title_2: "haven't",
        loader_title_3: "Signed In",
        message: "You are not authorized",
      });
    } else {
      next();
    }
  } catch (error) {
    return res.render("index", {
      loader_title_1: "User",
      loader_title_2: "doesn't",
      loader_title_3: "Exist",
      message: "User doesn't exists",
    });
  }
};

module.exports = { authenticate };
