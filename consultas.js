const { Pool } = require('pg')
require('dotenv').config();
const bcrypt = require('bcryptjs')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '12345',
    database: 'softjobs',
    allowExitOnIdle: true
})

const getUsuario = async (email) => {
    const values = [email]
    const { rows: [usuario], rowCount } = await pool.query("SELECT * FROM usuarios WHERE email = $1", values)
    if (!rowCount) {
        throw { code: 404, message: "No existe usuario con el email ingresado" }
    }
    delete usuario.password
    return usuario
}


const verificarCredenciales = async (email, password) => {
    const values = [email]
    const consulta = "SELECT * FROM usuarios WHERE email = $1"

    // const { rows: [usuario], rowCount } = await pool.query(consulta, values)
    const result = await pool.query(consulta, values)
    console.log("valor de rowcount: ", result.rowCount)
    console.log("valor de rows: ", result.rows)

    if (result.rows.lenght == 0) {
        throw { code: 401, message: "Email no existe" }
    }

    // const { password: passwordEncriptada } = usuario
    const passEncriptada = result.rows[0].password
    console.log("valor de passEncriptada: ", passEncriptada)
    const passwordEsCorrecta = bcrypt.compareSync(password, passEncriptada)

    if (!passwordEsCorrecta)
    throw { code: 401, message: "Constraseña incorrecta" }
}


const registrarUsuario = async (usuario) => {
    let { email, password, rol, lenguaje } = usuario
    const passwordEncriptada = bcrypt.hashSync(password)
    password = passwordEncriptada
    const values = [email, passwordEncriptada, rol, lenguaje]
    const consulta = "INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)"
    await pool.query(consulta, values)
}


module.exports = { getUsuario, verificarCredenciales, registrarUsuario }