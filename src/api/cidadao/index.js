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

        req.body.senha = utils.encrypt(req.body.senha);

        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idcidadao: id,
            deletado: false,
            data_criacao: new Date(),
            nome: req.body.nome,
            data_nascimento: req.body.data_nascimento,
            numero_telefone: req.body.numero_telefone
        }

        const idLogin = uuid.v4(); 
        const newLogin = {
            idlogin: idLogin,
            idusuario: newObj.idcidadao,
            tipo_usuario: "CIDADAO",
            email: req.body.email,
            senha: req.body.senha
        }

        await knex("login").insert(newLogin);
        await knex("cidadao").insert(newObj); 
        const newCidadao = await knex("cidadao").select("*").where("idcidadao", id); 

        return res.json(newCidadao);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }
});

module.exports = router;