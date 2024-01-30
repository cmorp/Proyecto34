const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken')

const { getUsuario, verificarCredenciales, registrarUsuario } = require('./consultas')
const { chequearCredenciales, verificarToken } = require('./middleware')
const { secretKey } = require('./secretKey')

app.use(cors(
    {
        origin: 'http://localhost:3000',
    }
));
app.use(express.json())

const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Server is running in port: ${PORT}`)
})


/* GET Usuarios con JWT */
app.get("/usuarios", verificarToken, async (req, res) => {
    try {
        const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        const { email } = jwt.decode(token)
        const usuario = await getUsuario(email)
        res.json(usuario)
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", errorMessage: error.message })
    }
})

/* GET Login */
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const isValidCredentials = await verificarCredenciales(req.body)
        if (isValidCredentials) {
            const token = jwt.sign({ email }, secretKey, { expiresIn: 300 })
            res.status(200).json({ token });
        } else {
            res.status(401).json({ error: "Unauthorized", message: "Credenciales inválidas" })
        }
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", errorMessage: error.message })
    }
})

/* POST Usuarios */
app.post("/usuarios", chequearCredenciales, async (req, res) => {
    try {
        const usuario = req.body
        await registrarUsuario(usuario)
        res.send("Usuario creado con éxito")
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", errorMessage: error.message })
        res.status(500).send("Internal Server Error: " + error.message)
    }
})