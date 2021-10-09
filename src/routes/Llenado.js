const express = require('express');
const app = express.Router();
const sql = require('mssql')
const config = require('../config/config')

app.get('/Llenado', (req, res) => {
    if(req.session.user){
        res.render('Llenado.html', {
            title: 'Llenado - Dominos',
            page: 'Llenado',
            IdPage: 'Llenado',
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


app.post('/CargaSectorizacionCamioncito', async (req, res) => {
    let {DataSet} = req.body
    try {
        let auxNew = 0, auxUpd = 0;
        let pool = await new sql.ConnectionPool(config.db_Camioncito).connect();
        for (let index = 0; index < DataSet.length; index++) {
            const elemento = DataSet[index];
            Number(elemento.Id) === 0 ? auxNew++ : auxUpd++;
            let data = await pool.request()
                .input('Id', sql.Int, elemento.Id)
                .input('Tienda', sql.NVarChar, elemento.Tienda)
                .input('Departamento', sql.NVarChar, elemento.Departamento)
                .input('Zona_Municipio', sql.NVarChar, elemento.Zona_Municipio)
                .input('Rango', sql.NVarChar, elemento.Rango)
                .input('Palabra_Clave', sql.NVarChar, elemento.Palabra_Clave)
                .input('Calle_Minima', sql.Int, elemento.Calle_Minima)
                .input('Calle_Maxima', sql.Int, elemento.Calle_Maxima)
                .input('Avenida_Minima', sql.Int, elemento.Avenida_Minima)
                .input('Avenida_Maxima', sql.Int, elemento.Avenida_Maxima)
                .input('Kilometro_Minimo', sql.Decimal, elemento.Kilometro_Minimo)
                .input('Kilometro_Maximo', sql.Decimal, elemento.Kilometro_Maximo)
                .input('Minimo', sql.NVarChar, elemento.Minimo)
                .input('Garantia', sql.NVarChar, elemento.Garantia)
                .input('Tiempo', sql.NVarChar, elemento.Tiempo)
                .input('Hora_Limite', sql.NVarChar, elemento.Hora_Limite)
                .input('Comentario', sql.NVarChar, elemento.Comentario)
                .input('Servicio', sql.NVarChar, elemento.Servicio)
                .execute('Sp_Camioncito_ins_upd_Sectorizacion') 
        }
        await pool.close();
        res.json({ __error: 0, Nuevo: auxNew, Actualizacion: auxUpd })
    } catch (error) {
        res.json({ __error: 1, msgError: error })
    }
})

app.post('/ObtenerSectorizacionPortienda', async (req, res) => {
    let {Tienda} = req.body;
    try {
        let pool = await new sql.ConnectionPool(config.db_Camioncito).connect();
        let data = await pool.request()
            .input('tienda', sql.NVarChar, Tienda)
            .execute('Sp_Camioncito_sel_Sectorizacion_Tienda')
        await pool.close();
        res.json({__error: 0, Datos: data.recordset})
    } catch (error) {
        res.json({__error: 1})
    }
})


module.exports = app;