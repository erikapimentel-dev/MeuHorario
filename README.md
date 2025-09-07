# Passos para execução local

1. Clonar o repositório e navegar até o diretório do projeto

# Clonar o repositório principal

git clone https://github.com/erikapimentel-dev/MeuHorario.git

# Entrar na pasta do exercício Prática Back/academia-api

´´´
cd "MeuHorario/meuHorarioAPI"
´´´

2. Criar o banco de dados
   Atenção: crie apenas o banco de dados, sem tabelas ou esquemas adicionais.

No terminal do PostgreSQL (psql) ou via cliente gráfico:

CREATE DATABASE nome_do_banco;

3. Configurar variáveis de ambiente

Crie o arquivo .env e configure a URL de conexão:

DATABASE_URL="postgresql://<usuario>:<senha>@localhost:5432/<nome_do_banco>?schema=public"

Ajuste outras variáveis se necessário.

4. Instalar dependências
   npm install

5. Gerar o cliente Prisma
   npx prisma generate

6. Executar migrações
   Esse comando criará as tabelas conforme o schema Prisma:

npx prisma migrate dev --name init

npx prisma db seed

7. Configurar scripts no package.json
   Verifique se a seção scripts está assim:

{
"scripts": {
"dev": "nodemon src/server.js",
"start": "node src/server.js",
"prisma": "prisma"
}
}
npm run dev — inicia o servidor em modo de desenvolvimento (watch).
npm start — inicia o servidor em modo de produção.
npm run prisma — atalho para comandos do Prisma CLI.

8. Iniciar a aplicação
   Desenvolvimento:

npm run dev
Produção:

npm start
A API estará disponível em http://localhost:3001 por padrão.
