const express = require('express');
const app = express.Router();
const sql = require('mssql')
const config = require('../config/config')

app.get('/Edicion', (req, res) => {
    if(req.session.user){
        res.render('Edicion.html', {
            title: 'Edicion - Dominos',
                page: 'Modificación',
                IdPage: 'Modificacion',
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
        SELECT * FROM [TB_Camioncito_Garantias_BaseMatriz] WHERE 
        Palabra_Clave  in (SELECT Palabra_Clave FROM [TB_Camioncito_Garantias_BaseMatriz] WHERE Palabra_Clave LIKE '%'+'${palabraclave}'+'%') and
        Departamento in (SELECT Departamento FROM [TB_Camioncito_Garantias_BaseMatriz] WHERE Departamento LIKE '%'+'${departamento}'+'%') and
        Zona_Municipio IN (SELECT Zona_Municipio FROM [TB_Camioncito_Garantias_BaseMatriz] WHERE Zona_Municipio LIKE '%'+'${zonamunicipio}'+'%')
        ${sqlcalle}
        ${sqlave}
        ${sqlkilometro}
    `
    let pool = await new sql.ConnectionPool(config.db_Camioncito).connect();
    let data = await pool.request()
        .query(tex_sql)
    await pool.close();
    res.json(data.recordset)
});

app.post('/upd_sectorizacion_modificacion', async (req, res) => {
    let {  Id, tienda, departamento, zonamunicipio, palabraclave, rango, calleminima, callemaxima, avenidaminima,
        avenidamaxima, kilometrominimo, kilometromaximo, minimo, garantia, horalimite, tiempo, comentario, servicio } = req.body;
    try {
        let pool = await new sql.ConnectionPool(config.db_Camioncito).connect()
        let data = await pool.request()
            .input('id', sql.Int, Id)
            .input('tienda', sql.NVarChar, tienda)
            .input('departamento', sql.NVarChar, departamento)
            .input('zona_municipio', sql.NVarChar, zonamunicipio)
            .input('palabra_clave', sql.NVarChar, palabraclave)
            .input('rango', sql.NVarChar, rango)
            .input('calle_minima', sql.Int, calleminima ? calleminima : 0)
            .input('calle_maxima', sql.Int, callemaxima ? callemaxima : 0)
            .input('avenida_minima', sql.Int, avenidaminima ? avenidaminima : 0)
            .input('avenida_maxima', sql.Int, avenidamaxima ? avenidamaxima : 0)
            .input('kilometro_minimo', sql.Decimal(5,2), kilometrominimo ? kilometrominimo.replace(",", ".") : 0)
            .input('kilometro_maximo', sql.Decimal(5,2), kilometromaximo ? kilometromaximo.replace(",", ".") : 0)
            .input('minimo', sql.NVarChar, minimo)
            .input('garantia', sql.NVarChar, garantia)
            .input('hora_limite', sql.NVarChar, horalimite)
            .input('tiempo', sql.NVarChar, tiempo)
            .input('comentarios', sql.NVarChar, comentario)
            .input('servicio', sql.NVarChar, servicio)
            .execute('Sp_Camioncito_upd_Sectorizacion');
        await pool.close();
        res.json({
            __error: data.rowsAffected[0] === 0 ? 2 : 0,
            data: data.recordsets[0][0]
        })
    } catch (error) {
        console.log(error);
        res.json({ __error: 1 })
    }
})

app.post('/ins_nuevasectorizacion_uno', async (req, res) => {
    let {tienda, departamento, zonamunicipio, palabraclave, rango, calleminima, callemaxima, avenidaminima,
        avenidamaxima, kilometrominimo, kilometromaximo, minimo, garantia, horalimite, tiempo, comentario, servicio} = req.body
    try {
        let pool = await new sql.ConnectionPool(config.db_Camioncito).connect()
        let data = await pool.request()
            .input('tienda', sql.NVarChar, tienda)
            .input('departamento', sql.NVarChar, departamento)
            .input('zona_municipio', sql.NVarChar, zonamunicipio)
            .input('palabra_clave', sql.NVarChar, palabraclave)
            .input('rango', sql.NVarChar, rango)
            .input('calle_minima', sql.Int, calleminima ? calleminima : 0)
            .input('calle_maxima', sql.Int, callemaxima ? callemaxima : 0)
            .input('avenida_Minima', sql.Int, avenidaminima ? avenidaminima: 0)
            .input('avenida_Maxima', sql.Int, avenidamaxima ? avenidamaxima: 0)
            .input('kilometro_Minimo', sql.Decimal(5,2), kilometrominimo ? kilometrominimo.replace(",", ".") : 0)
            .input('kilometro_Maximo', sql.Decimal(5,2), kilometromaximo ? kilometromaximo.replace(",", ".") : 0)
            .input('minimo', sql.NVarChar, minimo)
            .input('garantia', sql.NVarChar, garantia)
            .input('hora_Limite', sql.NVarChar, horalimite)
            .input('tiempo', sql.NVarChar, tiempo)
            .input('comentarios', sql.NVarChar, comentario)
            .input('Servicio', sql.NVarChar, servicio)
            .execute('Sp_Camioncito_ins_NuevaSectorizacion');
        await pool.close();
        res.json({ 
            __error: data.rowsAffected[0] === 1 ? 0 : 2,
            datos: data.rowsAffected[0] === 1 ? data.recordsets[0][0] : 0
         })
    } catch (error) {
        res.json({ __error: 1 })
    }    
})

module.exports = app;