const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authHeader = req.get("Authorization"); //look for Authorization field in incomming request
  if (!authHeader) {
    req.authenticated = false;
    return next();
  }
  const token = authHeader.split(" ")[1]; // String looks like this "Bearer tokenvalue"
  if (!token || token === "") {
    req.authenticated = false;
    return next();
  }
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "somesupersecretkey"); // Only tokens with the same Privat key/string will be valid
  } catch (err) {
    req.authenticated = false;
    return next();
  }
  if (!decodedToken) {
    req.authenticated = false;
    return next();
  }
  req.authenticated = true;
  req.userId = decodedToken.userId;
  next();
};
