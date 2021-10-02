const express = require('express');
const app = express.Router();
const sql = require('mssql')
const config = require('../config/config')

app.get('/Edicion', (req, res) => {
    if(req.session.user){
        res.render('Edicion.html', {
            title: 'Edicion - Dominos',
                page: 'Modificación',
                user: req.session.user,
                rol: req.session.rol
        });
    }else{
        res.redirect('/')
    }
})

app.post('/get_datasectorizacionedicion', async (req, res) => {
    let {
        palabraclave, calle, avenida, kilometro, departamento, zonamunicipio
    } = req.body;
    let sqlcalle , sqlave, sqlkilometro
    if(calle != 0){
        sqlcalle = `and ${calle} >= Calle_Minima and ${calle} <= Calle_Maxima`
    }else {
        sqlcalle = ``
    }
    if(avenida != 0){
        sqlave = `and ${avenida} >= Avenida_Minima and ${avenida} <= Avenida_Maxima`
    }else {
        sqlave = ``
    }
    if(kilometro != 0){
        sqlkilometro = `and ${kilometro} >= Kilometro_Minimo and ${kilometro} <= Kilometro_Maximo`
    }else{
        sqlkilometro = ``
    }
    let tex_sql=`
        SELECT * FROM [TB.Dominos.Garantias.BaseMatriz] WHERE 
        Palabra_Clave  in (SELECT Palabra_Clave FROM [TB.Dominos.Garantias.BaseMatriz] WHERE Palabra_Clave LIKE '%'+'${palabraclave}'+'%') and
        Departamento in (SELECT Departamento FROM [TB.Dominos.Garantias.BaseMatriz] WHERE Departamento LIKE '%'+'${departamento}'+'%') and
        Zona_Municipio IN (SELECT Zona_Municipio FROM [TB.Dominos.Garantias.BaseMatriz] WHERE Zona_Municipio LIKE '%'+'${zonamunicipio}'+'%')
        ${sqlcalle}
        ${sqlave}
        ${sqlkilometro}
    `
    let pool = await new sql.ConnectionPool(config.db_CreC).connect();
    let data = await pool.request()
        .query(tex_sql)
    await pool.close();
    res.json(data.recordset)
});

app.post('/upd_sectorizacion_modificacion', async (req, res) => {
    let { 
        Id, tienda, departamento, zonamunicipio, palabraclave, rango, calleminima, callemaxima, avenidaminima,
        avenidamaxima, kilometrominimo, kilometromaximo, minimo, garantia, horalimite, tiempo, comentario, servicio
    } = req.body;
    console.log(req.body)
    let pool = await new sql.ConnectionPool(config.db_CreC).connect()
    let data = await pool.request()
        .input('id', sql.Int, Id)
        .input('tienda', sql.NVarChar, tienda)
        .input('departamento', sql.NVarChar, departamento)
        .input('zona_municipio', sql.NVarChar, zonamunicipio)
        .input('palabra_clave', sql.NVarChar, palabraclave)
        .input('rango', sql.NVarChar, rango)
        .input('calle_minima', sql.Int, calleminima)
        .input('calle_maxima', sql.Int, callemaxima)
        .input('avenida_Minima', sql.Int, avenidaminima)
        .input('avenida_Maxima', sql.Int, avenidamaxima)
        .input('kilometro_Minimo', sql.Float, kilometrominimo)
        .input('kilometro_Maximo', sql.Float, kilometromaximo)
        .input('minimo', sql.NVarChar, minimo)
        .input('garantia', sql.NVarChar, garantia)
        .input('hora_Limite', sql.NVarChar, horalimite)
        .input('tiempo', sql.NVarChar, tiempo)
        .input('comentarios', sql.NVarChar, comentario)
        .input('Servicio', sql.NVarChar, servicio)
        .execute('SP_INS_Dominos_Garantias_Alterar');
    await pool.close();
    if(data.rowsAffected > 0){
        res.json({
            Titulo: 'Exito!!',
            color: 'bg-success',
            msj: `${req.session.user} has modificado id: ${Id} Tienda: ${tienda}`
        })
    }else{
        res.json({
            Titulo: 'Error!!',
            color: 'bg-danger',
            msj: `${req.session.user} no se a logrado hacer la modificacion`
        })
    }
})

app.post('/ins_nuevasectorizacion_uno', async (req, res) => {
    let {
        tienda, departamento, zonamunicipio, palabraclave, rango, calleminima, callemaxima, avenidaminima,
        avenidamaxima, kilometrominimo, kilometromaximo, minimo, garantia, horalimite, tiempo, comentario, servicio
    } = req.body
    console.log(req.body)
    let pool = await new sql.ConnectionPool(config.db_CreC).connect()
    let data = await pool.request()
        .input('tienda', sql.NVarChar, tienda)
        .input('departamento', sql.NVarChar, departamento)
        .input('zona_municipio', sql.NVarChar, zonamunicipio)
        .input('palabra_clave', sql.NVarChar, palabraclave)
        .input('rango', sql.NVarChar, rango)
        .input('calle_minima', sql.Int, calleminima)
        .input('calle_maxima', sql.Int, callemaxima)
        .input('avenida_Minima', sql.Int, avenidaminima)
        .input('avenida_Maxima', sql.Int, avenidamaxima)
        .input('kilometro_Minimo', sql.Float, kilometrominimo)
        .input('kilometro_Maximo', sql.Float, kilometromaximo)
        .input('minimo', sql.NVarChar, minimo)
        .input('garantia', sql.NVarChar, garantia)
        .input('hora_Limite', sql.NVarChar, horalimite)
        .input('tiempo', sql.NVarChar, tiempo)
        .input('comentarios', sql.NVarChar, comentario)
        .input('Servicio', sql.NVarChar, servicio)
        .execute('SP_Dominos_INS_Nueva_Sectorizacion');
    await pool.close();
    res.json({
        Titulo: 'Registro con exito',
        color: 'bg-success',
        msj: `${req.session.user} has registrado una nueva sectorización con Id: ${data.recordset[0].id} en tienda: ${data.recordset[0].tienda}`
    })    
})

module.exports = app;