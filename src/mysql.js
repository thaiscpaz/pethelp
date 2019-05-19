var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    database : 'pethelp'
  }
})

exports.default = knex;