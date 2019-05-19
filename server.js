const app = require("./src/app").default

app.get('/ping', (req, res) => {
    res.send('pong').status(200);
});

app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
