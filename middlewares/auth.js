const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
  return (req, res, next) => {
    //console.log("All Cookies:", req.cookies); // <-- ADD THIS
    const tokenCookie = req.cookies[cookieName];
    if (!tokenCookie) {
      return next();
    }
    try {
      const userPayload = validateToken(tokenCookie);
      req.user = userPayload;
    } catch (err) {}
    return next();
  };
}

module.exports = {
  checkForAuthenticationCookie,
};