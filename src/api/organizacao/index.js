const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const knex = require('../../mysql').default
const utils = require('../utils').default

router.post("/", async (req, res) => {
    if(!utils.verify(req.body, ["nome", "cnpj", "email", "logradouro",
     "numero", "bairro", "cidade", "estado", "telefone", "imagem"])) {
        return res.sendStatus(400)
    }

    try {

        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idorganizacao: id,
            data_criacao: new Date(),
            deletado: false,
            ...newBody
        }

        await knex("organizacao").insert(newObj); 
        const newOrg = await knex("organizacao").select("*").where("idorganizacao", id); 

        return res.json(newOrg);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }

});


module.exports = router;