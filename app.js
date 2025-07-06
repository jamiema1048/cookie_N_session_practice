require("dotenv").config();
//console.log(process.env) // remove this after you've confirmed it is working
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const Student = require("./models/student");
const bcrypt = require("bcrypt");
const saltRounds = 14;

mongoose
  .connect("mongodb://localhost:27017/exampleDB")
  .then(() => {
    console.log("Connected to MongoDB.....");
  })
  .catch((e) => {
    console.log(e);
  });

app.use(cookieParser(process.env.MYCOOKIESECRETKEY));
app.use(
  session({
    secret: process.env.MYSESSIONSECRETKEY,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // localhost沒有https，secure:false才能使用session
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const verifyUser = (req, res, next) => {
  if (req.session.isVerified) {
    next();
  } else {
    return res.send("Login 1st^^");
  }
};

app.get("/students", async (req, res) => {
  let foundStudent = await Student.find({}).exec();
  return res.send(foundStudent);
});

app.post("/students", async (req, res) => {
  try {
    let { username, password } = req.body;
    let hashValue = await bcrypt.hash(password, saltRounds);
    let newStudent = new Student({ username, password: hashValue });
    let savedStudent = await newStudent.save();
    return res.send({ message: "Saved student data", savedStudent });
  } catch (e) {
    return res.status(400).send(e);
  }
});

app.post("/students/login", async (req, res) => {
  try {
    let { username, password } = req.body;
    let foundStudent = await Student.findOne({ username }).exec();
    console.log(foundStudent);
    if (!foundStudent) {
      res.send("Wrong Username");
    } else {
      let result = await bcrypt.compare(password, foundStudent.password);
      if (result) {
        req.session.isVerified = true;
        res.send("Login successfully.....");
      } else {
        res.send("Fail to login.....");
      }
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

app.post("/students/logout", async (req, res) => {
  req.session.isVerified = false;
  return res.send("U had logout^^");
});

app.get("/secret", verifyUser, (req, res) => {
  return res.send("Thanx 4 U to notice this meaningless secret");
});

app.listen(3920, () => {
  console.log("Server running on port 3920.....");
});
