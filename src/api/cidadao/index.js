const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const knex = require('../../mysql').default
const utils = require('../utils').default

router.post("/", async (req, res) => {
    if(!utils.verify(req.body, ["nome", "data_nascimento", "numero_telefone", "email", "senha"])) {
       return res.sendStatus(400)
    }

    try {

        const isEmailInUse = !!await knex("cidadao").select("*").where({
            email: req.body.email,
            deletado: false
        }).first()

        if(isEmailInUse){
            return res.status(409).send("Email já cadastrado")
        }

        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idcidadao: id,
            deletado: false,
            data_criacao: new Date(),
            ...newBody
        }

        await knex("cidadao").insert(newObj); 
        const newCidadao = await knex("cidadao").select("*").where("idcidadao", id); 

        return res.json(newCidadao);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }
});


router.post("/animal", async (req, res) => {
    if(!verify(req.body, ["sexo", "porte", "imagem", "ferida_exposta", "observacao", "latitude", "longitude"])) {
        return res.sendStatus(400)
    }

    try {

        const isEmailInUse = !!await knex("cidadao").select("*").where({
            email: req.body.email,
            deletado: false
        }).first()

        if(isEmailInUse){
            return res.status(409).send("Email já cadastrado")
        }

        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idcidadao: id,
            deletado: false,
            data_criacao: new Date(),
            ...newBody
        }

        await knex("cidadao").insert(newObj); 
        const newCidadao = await knex("cidadao").select("*").where("idcidadao", id); 

        return res.json(newCidadao);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }

});


module.exports = router;