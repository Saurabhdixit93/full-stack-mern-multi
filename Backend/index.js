const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { connectDB } = require("./config/Database");
const cors = require("cors");
const helmet = require("helmet");
const PORT = process.env.PORT || 5000;
const app = express();
/* MIDDLEWARES */
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
  origin: 'https://multidownloadweb.netlify.app'
}));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

/* Routes aand Error handler*/
app.use("/", require("./routers"));
app.use("*", (req, res) => {
  return res.json({
    success: false,
    message: "Page Not found ...",
  });
});

/* Server And DB*/
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server Running Successfully in PORT : ${PORT}`);
  });
});

