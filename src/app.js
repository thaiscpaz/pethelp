const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("./mysql");

const apiRotas = require("./api");

app.use(bodyParser.json());
app.use("/api", apiRotas);

exports.default = app;
