require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

// Sincroniza com o Banco e sobe o servidor
sequelize.sync().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
  });
});
