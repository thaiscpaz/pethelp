var express = require('express');
var router = express.Router();
const cidadaoRoutas = require("./cidadao");
const orgRotas = require("./organizacao");
// const veterinarioRotas = require("./veterinario");

router.use("/cidadaos", cidadaoRoutas);
router.use("/organizacoes", orgRotas);
// router.use("/veterinarios", veterinarioRotas);

module.exports = router;