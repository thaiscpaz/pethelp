const express = require('express');
const router = express.Router();
const uuid = require('uuid');
const knex = require('../../mysql').default
const utils = require('../utils').default

router.post("/", async (req, res) => {
    if(!utils.verify(req.body, ["imagem", "latitude", "longitude"])) {
        return res.sendStatus(400)
    }

    try {

        const newBody = req.body;
        const id = uuid.v4(); 
        const newObj = {
            idanimal: id,
            ...newBody
        }

        await knex("animal").insert(newObj); 
        const newAnimal = await knex("animal").select("*").where("idanimal", id); 

        return res.json(newAnimal);
    } catch (err) {
        console.error(err)
        return res.sendStatus(500);
    }

});

module.exports = router;