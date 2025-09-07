const dotenv = require('dotenv');
dotenv.config();
const app = require('./app');
const prisma = require('./prisma');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

