const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const { getUsuario, verificarCredenciales, registrarUsuario } = require('./consultas')
const { chequearCredenciales, verificarToken } = require('./middleware')
const { secretKey } = require('./secretKey')

app.listen(3001, console.log("SERVER ON"))

app.use(cors())
app.use(express.json())


app.get("/usuarios", verificarToken, async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        const { email } = jwt.decode(token)
        const usuario = await getUsuario(email)
        res.json(usuario)
    } catch (error) {
        res.status(error.code || 500).send(error.message)
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, secretKey)
        res.send(token)
        console.log(token)
    } catch (error) {
        console.log(error.message)
        res.status(error.code || 500).send(error.message)
    }
})

app.post("/usuarios", chequearCredenciales, async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).send(error)
    }
})