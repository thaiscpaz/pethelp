const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const knex = require('../../mysql').default
const utils = require('../utils').default

router.post("/", async (req, res) => {
    if(!utils.verify(req.body, ["nome", "cnpj", "email", "cep", "senha"])) {
        return res.sendStatus(400)
    }

    try {

        const isCnpjInUse = !!await knex("organizacao").select("*").where({
            cnpj: req.body.cnpj,
        }).first()

        if(isCnpjInUse){
            return res.status(409).send("CNPJ já cadastrado")
        }

        req.body.senha = utils.encrypt(req.body.senha);

        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idorganizacao: id,
            nome: req.body.nome,
            cnpj: req.body.cnpj, 
            cep: req.body.cep
        }

        const idLogin = uuid.v4(); 
        const newLogin = {
            idlogin: idLogin,
            idusuario: newObj.idorganizacao,
            tipo_usuario: "ORGANIZACAO",
            email: req.body.email,
            senha: req.body.senha
        }
        
        await knex("login").insert(newLogin);
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

router.post("/:id/evento", async (req, res) => {
   
    try {
        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idfeira: id,
            idorganizacao: req.params.id,
            nome: req.body.nome,
            logradouro: req.body.logradouro,
            numero: req.body.numero,
            bairro: req.body.bairro,
            cidade: req.body.cidade,
            estado: req.body.estado,
            data: req.body.data,
            hora: req.body.hora,
            imagem: req.body.imagem
        }

        await knex("feira").insert(newObj);

        for (const animal of req.body.animais){
            const id = uuid.v4(); 
            const newAnimal = {
                idfeira_animais: id,
                imagem: animal.imagem
            }
            try{
                await knex("feira_animais").insert(newAnimal);
            } catch(err){
                console.error(err)
                return res.sendStatus(500);
            }

        };

        const newAdoptionFair = await knex("feira").select("*").where("idfeira", id); 

        return res.json(newAdoptionFair);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }
    
});

module.exports = router;