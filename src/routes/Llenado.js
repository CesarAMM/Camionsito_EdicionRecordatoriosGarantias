const express = require('express');
const app = express.Router();
const sql = require('mssql')
const config = require('../config/config')

app.get('/Llenado', (req, res) => {
    if(req.session.user){
        res.render('Llenado.html', {
            title: 'Llenado - Dominos',
            page: 'Llenado',
            user: req.session.user,
            rol: req.session.rol
        });
    }else{
        res.redirect('/')
    }
});

app.get('/getTiendas', async (req, res) => {
    let pool = await new sql.ConnectionPool(config.db_CreC).connect();
    let data = await pool.request()
        .execute('SP_Dominos_Tiendas');
    await pool.close();
    res.json(data.recordset)
})


app.post('/CargaDatos_Step_1', async (req, res) => {
    let {Base} = req.body
    let not_id = 0, yes_id =0;
    let pool = await new sql.ConnectionPool(config.db_CreC).connect();
    let data;
    for(let i = 0; i < Base.length; i++){
        if(Base[i].Id != ''){
            data = await pool.request()
                .input('id', sql.Int, Base[i].Id)
                .input('tienda', sql.NVarChar, Base[i].Tienda)
                .input('departamento', sql.NVarChar, Base[i].Departamento)
                .input('zonamunicipio', sql.NVarChar, Base[i].ZonaMunicipio)
                .input('rango', sql.NVarChar, Base[i].Rango)
                .input('palabraclave', sql.NVarChar, Base[i].PalabraClave)
                .input('calleminima', sql.Int, Base[i].CalleMinima)
                .input('callemaxima', sql.Int, Base[i].CalleMaxima)
                .input('avenidaminima', sql.Int, Base[i].AvenidaMinima)
                .input('avenidamaxima', sql.Int, Base[i].AvenidaMaxima)
                .input('kilometrominimo', sql.Float, parseFloat(Base[i].KilometroMinimo))
                .input('kilometromaximo', sql.Float, parseFloat(Base[i].KilometroMaximo))
                .input('minimo', sql.NVarChar, Base[i].Minimo)
                .input('garantia', sql.NVarChar, Base[i].Garantia)
                .input('tiempo', sql.NVarChar, Base[i].Tiempo)
                .input('horalimite', sql.NVarChar, Base[i].HoraLimite)
                .input('comentario', sql.NVarChar, Base[i].Comentarios)
                .input('servicio', sql.NVarChar, Base[i].Servicio)
                .execute('SP_Dominos_UPD_Garantias')
            yes_id++;
        }else{
            data = await pool.request()
                .input('tienda', sql.NVarChar, Base[i].Tienda)
                .input('departamento', sql.NVarChar, Base[i].Departamento)
                .input('zonamunicipio', sql.NVarChar, Base[i].ZonaMunicipio)
                .input('rango', sql.NVarChar, Base[i].Rango)
                .input('palabraclave', sql.NVarChar, Base[i].PalabraClave)
                .input('calleminima', sql.Int, Base[i].CalleMinima)
                .input('callemaxima', sql.Int, Base[i].CalleMaxima)
                .input('avenidaminima', sql.Int, Base[i].AvenidaMinima)
                .input('avenidamaxima', sql.Int, Base[i].AvenidaMaxima)
                .input('kilometrominimo', sql.Float, parseFloat(Base[i].KilometroMinimo))
                .input('kilomeromaximo', sql.Float, parseFloat(Base[i].KilometroMaximo))
                .input('minimo', sql.NVarChar, Base[i].Minimo)
                .input('garantia', sql.NVarChar, Base[i].Garantia)
                .input('tiempo', sql.NVarChar, Base[i].Tiempo)
                .input('horalimite', sql.NVarChar, Base[i].HoraLimite)
                .input('comentario', sql.NVarChar, Base[i].Comentarios)
                .input('servicio', sql.NVarChar, Base[i].Servicio)
                .execute('SP_Dominos_INS_Garantias')
            not_id++;
        }
    }
    await pool.close();
    res.json({
        yes: yes_id,
        not: not_id
    })
});

app.post('/ObtenerSectorizacionPortienda', async (req, res) => {
    let {Tienda} = req.body;
    let pool = await new sql.ConnectionPool(config.db_CreC).connect();
    let data = await pool.request()
        .input('tienda', sql.NVarChar, Tienda)
        .execute('SP_Dominos_SEL_Sectorizacion')
    await pool.close();
    res.json(data.recordset)
})


module.exports = app;