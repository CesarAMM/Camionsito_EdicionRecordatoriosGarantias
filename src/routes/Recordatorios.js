const express = require('express')
const app = express.Router();
const sql = require('mssql')
const connection = require('../config/config')

app.get('/Recordatorios', (req, res) => {
    if(req.session.user){
        res.render('Recordatorios.html', ({
            user: req.session.user,
            rol: req.session.rol,
            title: 'Edicion Recordatorios',
            page: 'Edicion Recordatorios',
            IdPage: 'Recordatorios'
        }))
    }else {
        res.redirect('/')
    }
});

app.get('/get_page_recordatorios', async (req, res) => {
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request()
            .execute('Sp_Camioncito_Recordatorios');
        await pool.close();
        res.json({ 
            __error: 0, 
            Tiendas: data.recordsets[0],
            Estado: data.recordsets[1], 
            Tiempos: data.recordsets[2]
        })
    } catch (error) {
        res.json({__error: 1})
    }
});

app.post('/getListTiendaforEstado', async (req, res) => {
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request()
            .execute('Sp_Camioncito_Recordatorio_TiendaBaja');
        await pool.close();
        res.json({ __error: 0, Tiendas: data.recordset })
    } catch (error) {
        res.json({ __error: 1 })
    }
})

app.post('/getRecordatorios', async (req, res) => {
    let {codigotienda} = req.body;
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request()
            .input('CodigoTienda', sql.Int, codigotienda)
            .execute('Sp_Camioncito_Sel_Recordatorios_Tienda');
        await pool.close();
        res.json({ __error: 0, Encabezado: data.recordsets[0][0], Horarios: data.recordsets[1] })
    } catch (error) {
        res.json({ __error: 1 })
    }
});

app.post('/getHistorialRecordatorios', async (req, res) => {
    let {codigo, fecha} = req.body;
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request()
            .input('CodigoTienda', sql.Int, codigo)
            .input('Fecha', sql.NVarChar, fecha)
            .execute('Sp_Camioncito_sel_Recordatorios_Histosrial')
        await pool.close();
        res.json({__error: 0, Historial: data.recordset})
    } catch (error) {
        res.json({__error: 1})
    }
});

app.post('/upd_Tiempos_POS_Recordatorios', async (req, res) =>{
    let {codigotienda, dato, columna} = req.body;
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request()
            .input('codigotienda', sql.NVarChar(5), codigotienda)
            .input('dato', sql.NVarChar(2), dato)
            .input('columna', sql.NVarChar, columna)
            .input('usuario', sql.Int, req.session.iduser)
            .execute('Sp_Camioncito_upd_Recordatorios_Tiempo_POS');
        await pool.close();
        res.json({
            __error: 0,
            dato: data.recordsets[0][0]
        })
    } catch (error) {
        res.json({__error: 1})
    }
});

app.post('/upd_MotivoTiempo_Comentarios_Recordatorios', async (req, res) => {
    let {Tienda, dato, columna} = req.body;
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request()
            .input('codigotienda', sql.Int, Tienda)
            .input('dato', sql.NVarChar, dato)
            .input('columna', sql.NVarChar, columna)
            .input('usuario', sql.Int, req.session.iduser)
            .execute('Sp_Camioncito_upd_Recordatorios_MotivoTiempo_Comentarios');
        await pool.close();
        res.json({ __error: 0, dato: data.recordsets[0][0] });
    } catch (error) {
        res.json({__error: 1})
    }
});


app.post('/upd_HorariosTienda', async (req, res)=>{
        let { Tienda, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo} = req.body;
        try {
            let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
            let data = await pool.request()
                .input('CodigoTienda', sql.Int, Tienda)
                .input('Lunes', sql.NVarChar(15), Lunes)
                .input('Martes', sql.NVarChar(15), Martes)
                .input('Miercoles', sql.NVarChar(15), Miercoles)
                .input('Jueves', sql.NVarChar(15), Jueves)
                .input('Viernes', sql.NVarChar(15), Viernes)
                .input('Sabado', sql.NVarChar(15), Sabado)
                .input('Domingo', sql.NVarChar(15), Domingo)
                .input('User', sql.Int, req.session.iduser)
                .execute('Sp_Camioncito_upd_HorariosTiendas');
            await pool.close();
            res.json({
                __error: 0,
                Horario: data.recordsets[0]
            })
        } catch (error) {
            res.json({ __error: 1 })
        }
});

app.get('/set_restaurarrecordatorios', async (req, res) => {
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect()
        let data = await pool.request()
            .input('User', sql.Int, req.session.iduser)
            .execute('Sp_Camioncito_upd_RestauracionRecordatorios');
        await pool.close();
        res.json({ __error: 0 })
    } catch (error) {
        res.json({ __error: 1 })
    }
})

app.get('/get_Recordatorios_Download', async (req, res) => {
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request().execute('Sp_Camioncito_sel_RecordatoriosCamioncito');
        res.json({
            Encabezado: data.recordsets[0],
            __error: 0
        })
    } catch (error) {
        res.json({
            __error: 1
        })
    }
})

app.post('/ins_nuevatienda', async (req, res) => {
    let { NombreTienda, CodigoTienda, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo } = req.body;
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect()
        let data = await pool.request()
            .input('CodigoTienda', sql.NVarChar, CodigoTienda)
            .input('NombreTienda', sql.NVarChar, NombreTienda)
            .input('Lunes', sql.NVarChar, Lunes)
            .input('Martes', sql.NVarChar, Martes)
            .input('Miercoles', sql.NVarChar, Miercoles)
            .input('Jueves', sql.NVarChar, Jueves)
            .input('Viernes', sql.NVarChar, Viernes)
            .input('Sabado', sql.NVarChar, Sabado)
            .input('Domingo', sql.NVarChar, Domingo)
            .execute('Sp_Camioncito_ins_Recordatorios_NuevaTienda');
        await pool.close();
        res.json({ __error: data.recordsets[0][0].CodigoError === 0 ? 0 : 2 })
    } catch (error) {
        res.json({
            __error: 1
        })
    }
});


app.post('/upd_Actalizartiemposgenerales', async (req, res) => {
    let {Tiempo, Motivo} = req.body;
    try {
        let pool = await new sql.ConnectionPool(connection.db_Camioncito).connect();
        let data = await pool.request()
            .input('tiempo', sql.Int, Tiempo)
            .input('motivo', sql.NVarChar, Motivo)
            .input('user', sql.Int, req.session.iduser)
            .execute('Sp_Camioncito_upd_Recordatorios_CambioTiempos');
        await pool.close();
        res.json({ __error: 0});
    } catch (error) {
        res.json({ __error: 1 })
    }
});

module.exports = app;