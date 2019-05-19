const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const knex = require('../../mysql').default
const utils = require('../utils').default

router.post("/", async (req, res) => {
    if(!utils.verify(req.body, ["nome", "data_nascimento", "numero_telefone", "crmv", "email", "senha"])) {
       return res.sendStatus(400)
    }

    try {

        const isEmailInUse = !!await knex("veterinario").select("*").where({
            crmv: req.body.crmv,
            deletado: false
        }).first()

        if(isEmailInUse){
            return res.status(409).send("CRMV já cadastrado")
        }

        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idveterinario: id,
            deletado: false,
            data_criacao: new Date(),
            ...newBody
        }

        await knex("veterinario").insert(newObj); 
        const newVet = await knex("veterinario").select("*").where("idveterinario", id); 

        return res.json(newVet);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }
});

module.exports = router;