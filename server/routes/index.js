const express = require('express');
const app = express();


app.use(require('./login'))
app.use(require('./filtroAvaluos'))
app.use(require('./avaluo'))
app.use(require('./visita'))
app.use(require('./domicilio'))
app.use(require('./solicitante'))
app.use(require('./propietario'))
app.use(require('./inmueble'))
app.use(require('./caracteristicasUrbanas'))
app.use(require('./serviciosPublicos'))
app.use(require('./equipamientoUrbano'))
app.use(require('./terreno'))
app.use(require('./descGralInmueble'))
app.use(require('./descGralInmTablaConserva'))
app.use(require('./descGralInmCalcMatriz'))
app.use(require('./descGralInmuebleDet'))
app.use(require('./descGralInmuebleComplemento'))
app.use(require('./comunicados'))
app.use(require('./reporte'))
app.use(require('./elementosConstruccion'))

module.exports = app;