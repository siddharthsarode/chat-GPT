const getRegisterController = (req, res) => {
  res.render("./auth/register", { title: "Register" });
};

// login controller
const getLoginController = (req, res) => {
  res.render("./auth/login", { title: "Login" });
};

module.exports = { getRegisterController, getLoginController };
