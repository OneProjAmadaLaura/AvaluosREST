require('./config/config');

const cors = require('cors')

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Permite todos los request
app.use(cors());
app.options('*', cors());
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // Parse application/json
app.use(bodyParser.json())
    // Configuracion global de rutas
app.use(require('./routes/index'));

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto: ', process.env.PORT);
})