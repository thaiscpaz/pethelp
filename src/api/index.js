var express = require('express');
var router = express.Router();
const cidadaoRoutas = require("./cidadao");
const orgRotas = require("./organizacao");
const animaisRotas = require("./animal");
const loginRotas = require("./login");

router.use("/cidadaos", cidadaoRoutas);
router.use("/organizacoes", orgRotas);
router.use("/animais", animaisRotas);
router.use("/login", loginRotas);

module.exports = router;