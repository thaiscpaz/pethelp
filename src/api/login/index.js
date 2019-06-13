const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const knex = require('../../mysql').default
const utils = require('../utils').default

router.get("/", async (req, res) => {
    if(!utils.verify(req.body, ["email", "senha", "tipo_usuario"])) {
       return res.sendStatus(400)
    }

    try {

        const login = await knex("login")
            .select("*")
            .where("email", '=', req.body.email)
            .first();

        const decrypt = utils.decrypt(login.senha).toString('utf8')
        console.log(decrypt)
        console.log(req.body.senha)

        if(req.body.senha !== decrypt){
            return res.status(401).send("A senha informada está errada")
        }

        let user ;

        if(req.body.tipo_usuario == "CIDADAO"){
            user = await knex("cidadao").select("*").where("idcidadao", login.idusuario)
        }
       
        if(req.body.tipo_usuario == "ORGANIZACAO"){
            user = await knex("organizacao").select("*").where("idorganizacao", login.idusuario)
        }

        return res.json(user);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }
});

module.exports = router;