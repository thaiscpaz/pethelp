var express = require('express');
var router = express.Router();
var uuid = require('uuid');
var knex = require('../../mysql').default

function verify(body, requiredProperties) {
    const keys = Object.keys(body);

    for (const property of requiredProperties) {
        if (!keys.includes(property)) {
            return false;
        }
    }

    for (const property of keys){
        if(!requiredProperties.includes(property)){
            return false;
        }
    }

    return true;
}

router.post("/", async (req, res) => {
    if(!verify(req.body, ["nome", "data_nascimento", "numero_telefone", "email", "senha"])) {
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