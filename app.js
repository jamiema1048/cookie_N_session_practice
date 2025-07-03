require("dotenv").config();
//console.log(process.env) // remove this after you've confirmed it is working
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");

app.use(cookieParser(process.env.MYCOOKIESECRETKEY));
app.use(
  session({
    secret: process.env.MYSESSIONSECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // localhost沒有https，secure:false才能使用session
  })
);
app.use(flash());

const checkUser = (req, res, next) => {
  if (!req.session.isVerified) {
    return res.send("Login first^^");
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  req.flash("message", "Welcome to web");
  return res.send(req.flash("message") + "Home.......");
});

app.get("/setCookie", (req, res) => {
  // res.cookie("urCookie", "Oreo");
  res.cookie("urCookie", "Oreo", { signed: true });
  return res.send("Cookie set.......");
});

app.get("/seeCookie", (req, res) => {
  console.log(req.signedCookies);
  return res.send("See the set Cookies " + req.signedCookies.urCookie);
});

app.get("/setSessionData", (req, res) => {
  console.log(req.session);
  req.session.example = "Somethin' not important........";
  return res.send(
    "Setting data at server,setting signed session ID on browser"
  );
});

app.get("/seeSessionData", (req, res) => {
  console.log(req.session);
  // connect.sid => session id
  return res.send("See the set Session Data ");
});

app.get("/verifyUser", (req, res) => {
  req.session.isVerified = true;
  return res.send("Verified^^");
});

app.get("/logout", (req, res) => {
  req.session.isVerified = false;
  return res.send("U had logout^^");
});

app.get("/secret", checkUser, (req, res) => {
  return res.send("U saw the secret^^");
});
app.get("/secret2", checkUser, (req, res) => {
  return res.send("U saw another secret^^");
});

app.listen(3920, () => {
  console.log("Server running on port 3920.....");
});
