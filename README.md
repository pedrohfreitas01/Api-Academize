# 📱 GymPass Style App

Aplicação back-end inspirada no modelo do GymPass. Permite que usuários encontrem academias próximas, realizem check-ins e acompanhem sua frequência de treinos. 
Administradores podem cadastrar novas academias e validar check-ins, garantindo maior controle e autenticidade das visitas.

---

## ✅ Funcionalidades

- Cadastro e autenticação de usuários com JWT
- Consulta de perfil e histórico de check-ins
- Busca de academias por nome ou proximidade (geolocalização)
- Realização e validação de check-ins
- Cadastro de academias por administradores

---

## 📋 Regras de Negócio

- O usuário não pode se cadastrar com e-mail duplicado
- Não é possível fazer mais de um check-in por dia
- Check-ins só são válidos se o usuário estiver a menos de 100 metros da academia
- Check-ins só podem ser validados até 20 minutos após sua criação
- Apenas administradores podem validar check-ins e cadastrar academias

---

## 🔐 Requisitos Não-Funcionais

- Senhas são armazenadas de forma criptografada
- Dados persistidos em banco PostgreSQL
- Todas as listagens devem ser paginadas (20 itens por página)
- Autenticação baseada em JSON Web Token (JWT)

---

## 🛠 Tecnologias Utilizadas

- Node.js
- TypeScript
- Fastify
- Zod
- Prisma Orm
- Docker
- Sequelize

---


