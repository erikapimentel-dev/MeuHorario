const express = require('express');
const app = express();
const cors = require('cors');
const professorRoutes = require('./routes/professorRoutes');
const disponibilidadeRoutes = require('./routes/disponibilidadeRoutes');
const turmaRoutes = require('./routes/turmaRoutes');
const disciplinaRoutes = require('./routes/disciplinaRoutes');
const periodoRoutes = require('./routes/periodoRoutes');
const horarioRoutes = require('./routes/horarioRoutes');


app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173', // Permite requisições do frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
}));

app.get('/', (req, res) => {
    res.send('API Meu Horário funcionando!');
});


app.use('/api/professores', professorRoutes);
app.use('/api/disponibilidades', disponibilidadeRoutes);
app.use('/api/turmas', turmaRoutes);
app.use('/api/disciplinas', disciplinaRoutes);
app.use('/api/periodos', periodoRoutes);
app.use('/api/horarios', horarioRoutes);


module.exports = app;