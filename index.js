const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const axios = require("axios");
const csrf = require("csurf");
const bodyParser = require("body-parser");

require("dotenv").config();
require("./server/config/db").conndb();

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("layout", "./layouts/main");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(csrf({ cookie: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);

app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: false,
    cookie: {
      expires: 86400000,
      maxAge: 86400000,
    },
  })
);

app.use(flash());

const routes = require("./server/routes/surjanRouter");
app.use("/", routes);

app.get("/health", (req, res) => {
  res.send("<h1>App is healthy</h1>");
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
})

const hitapi = async(req, res) =>{
  try{
    const res = await axios.get("https://srujan-2-0-zfxx.onrender.com/health")
    console.log(res.data)
  } catch(error){
    console.log(error)
  }
}

setInterval(hitapi, 30000)
