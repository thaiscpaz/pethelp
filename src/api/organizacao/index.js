const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const knex = require('../../mysql').default
const utils = require('../utils').default

router.post("/", async (req, res) => {
    if(!utils.verify(req.body, ["nome", "cnpj", "email", "logradouro",
     "numero", "bairro", "cidade", "estado", "telefone", "imagem", "senha"])) {
        return res.sendStatus(400)
    }

    try {

        const isCnpjInUse = !!await knex("organizacao").select("*").where({
            cnpj: req.body.cnpj,
            deletado: false
        }).first()

        if(isCnpjInUse){
            return res.status(409).send("CNPJ já cadastrado")
        }

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

router.get("/", async (req, res) => {
    try{
        const allOrg = await knex("organizacao").select("*"); 

        return res.json(allOrg);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }
});

router.post("/:id/veterinarios/candidatar", async (req, res) => {
if(!utils.verify(req.body, ["id"])) {
        return res.sendStatus(400)
    }

    try {
        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idveterinario_organizacao: id,
            idorganizacao: req.params.id,
            idveterinario: req.body.id,
            status_solicitacao: "CANDIDATADO"
        }

        await knex("veterinario_organizacao").insert(newObj); 
        const newCandidate = await knex("veterinario_organizacao").select("*").where("idveterinario_organizacao", id); 

        return res.json(newCandidate);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }

});

router.post("/:id/veterinarios/aceitar", async (req, res) => {
    if(!utils.verify(req.body, ["id", "aceito"])) {
            return res.sendStatus(400)
        }
    
        try {
            const newBody = req.body;
            const newObj = {
                idveterinario: req.body.id,
                status_solicitacao: req.body.aceito ? "ACEITO" : "NEGADO"
            }
    
            await knex("veterinario_organizacao")
                .where('idveterinario', '=', newObj.idveterinario)
                .update({ status_solicitacao: newObj.status_solicitacao }) ;

            const newCandidate = await knex("veterinario_organizacao").select("*").where("idveterinario", newObj.idveterinario); 
    
            return res.json(newCandidate);
        } catch (err) {
            console.error(err)
            return res.sendStatus(500);
        }
    
    });

module.exports = router;