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
            page: 'Edicion Recordatorios'
        }))
    }else {
        res.redirect('/')
    }
});

app.get('/get_page_recordatorios', async (req, res) => {
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request()
        .execute('Sp_sel_Iniciar_page_Recordatorios');
    await pool.close();
    res.json({
        Tiendas: data.recordsets[0],
        Tiempos: data.recordsets[2],
        Estado: data.recordsets[1]
    })
});

app.post('/getListTiendaforEstado', async (req, res) => {
    let {Valor} = req.body;
    let estado = 1
    if(Valor.indexOf('true')){
        estado = 0;
    }
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request()
        .input('estado', sql.Int, estado)
        .execute('Sp_sel_Recordatorios_Tienda_baja');
    await pool.close();
    res.json(data.recordset)
})



app.post('/getRecordatorios', async (req, res) => {
    let {codigotienda} = req.body;
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request()
        .input('codigo_tienda', sql.NVarChar, codigotienda)
        .execute('Sp_sel_Recordatorios_Tienda');
    await pool.close();
    res.json({
        Encabezado: data.recordsets[0],
        Horarios: data.recordsets[1],
        Bebidas: data.recordsets[2],
        Masas: data.recordsets[3],
        Ingredientes: data.recordsets[4],
        Alitas_Costillas: data.recordsets[5],
        Extras: data.recordsets[6]
    })
});

app.post('/getHistorialRecordatorios', async (req, res) => {
    let {codigo, fecha} = req.body;
    console.log(req.body)
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request()
        .input('codigotiena', sql.Int, codigo)
        .input('fecha', sql.NVarChar, fecha)
        .execute('Sp_sel_Recordatorios_Histosrial')
        console.log(data);
    await pool.close();
    res.json(data.recordset)
});

app.post('/upd_HorariosTienda', async (req, res)=>{
        let {
            Tienda, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo, Usuario
        } = req.body;
        let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
        let data = await pool.request()
            .input('codigotienda', sql.Int, Tienda)
            .input('lunes', sql.NVarChar, Lunes)
            .input('martes', sql.NVarChar, Martes)
            .input('miercoles', sql.NVarChar, Miercoles)
            .input('jueves', sql.NVarChar, Jueves)
            .input('viernes', sql.NVarChar, Viernes)
            .input('sabado', sql.NVarChar, Sabado)
            .input('domingo', sql.NVarChar, Domingo)
            .input('usuario', sql.Int, req.session.iduser)
            .execute('Sp_upd_Recordatorios_HorarioTiendas');
        await pool.close();
        res.json({
            data: data.recordsets[1][0],
            Horario: data.recordsets[0]
        })
});

app.get('/set_restaurarrecordatorios', async (req, res) => {
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request().
        input('usuario', sql.Int, req.session.iduser)
        .execute('Sp_upd_Recordatorios_Restablecer');
    await pool.close();
    res.json(data.recordsets[0][0])
})

app.get('/get_Recordatorios_Download', async (req, res) => {
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request().execute('Sp_sel_Recordatorios');
    res.json({
        Encabezado: data.recordsets[0],
        Faltante: data.recordsets[1]
    })
})

app.post('/ins_nuevatienda', async (req, res) => {
    let {
        Tienda, Lunes, Martes, Miercoles, Jueves, Viernes, Sabado, Domingo
    } = req.body;
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect()
    let data = await pool.request()
        .input('tienda', sql.NVarChar, Tienda)
        .input('lunes', sql.NVarChar, Lunes)
        .input('martes', sql.NVarChar, Martes)
        .input('miercoles', sql.NVarChar, Miercoles)
        .input('jueves', sql.NVarChar, Jueves)
        .input('viernes', sql.NVarChar, Viernes)
        .input('sabado', sql.NVarChar, Sabado)
        .input('domingo', sql.NVarChar, Domingo)
        .execute('Sp_ins_Recordatorios_Nueva_Tienda');
    await pool.close();
    res.json(data.recordsets[0][0])
});

app.post('/upd_Tiempos_Recordatorios', async (req, res) =>{
        let {codigotienda, Tiempo} = req.body;
        let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
        let data = await pool.request()
            .input('codigotiena', sql.Int, codigotienda)
            .input('tiempo', sql.Int, Tiempo)
            .input('usuario', sql.Int, req.session.iduser)
            .execute('Sp_upd_Recordatorios_Tiempos');
        await pool.close();
        res.json(data.recordsets[0])
});

app.post('/upd_MotivoTiempo_Recordatorios', async (req, res) => {
        let {Tienda, Motivo} = req.body;
        let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
        let data = await pool.request()
            .input('codigotiena', sql.Int, Tienda)
            .input('motivo', sql.NVarChar, Motivo)
            .input('usuario', sql.Int, req.session.iduser)
            .execute('Sp_upd_Recordatorios_MotivoTiempo');
        await pool.close();
        res.json(data.recordsets[0]);
});

app.post('/upd_Comentario_recordatorios', async (req, res) => {
        let { Tienda, Comentario} = req.body;
        let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
        let data = await pool.request()
            .input('codigotiena', sql.Int, Tienda)
            .input('comentario', sql.NVarChar, Comentario)
            .input('usuario', sql.Int, req.session.iduser)
            .execute('Sp_upd_Recordatorios_Comentario');
        await pool.close();
        res.json(data.recordsets[0]);
});

app.post('/upd_impulsar_recordatorios', async (req, res) => {
        let { Tienda, Comentario} = req.body;
        let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
        let data = await pool.request()
            .input('codigotiena', sql.Int, Tienda)
            .input('impulsar', sql.NVarChar, Comentario)
            .input('usuario', sql.Int, req.session.iduser)
            .execute('Sp_upd_Recordatorios_Impulsar');
        await pool.close();
        res.json(data.recordsets[0][0]);
});

app.post('/upd_POS_recordatorios', async (req, res) => {
    let { Tienda, POS} = req.body;
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request()
        .input('codigotiena', sql.Int, Tienda)
        .input('POS', sql.Int, POS)
        .input('usuario', sql.Int, req.session.iduser)
        .execute('Sp_upd_Recordatorios_POS');
    await pool.close();
    res.json(data.recordsets[0][0]);
});

app.post('/upd_funcionGenarelizada', async (req, res) => {
    let { codigotienda, id_item, id_estado } = req.body;
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request()
        .input('codigotienda', sql.Int, codigotienda)
        .input('id_item', sql.Int, id_item)
        .input('id_estado', sql.Int, id_estado)
        .input('usuario', sql.Int, req.session.iduser)
        .execute('Sp_upd_Recordatorios_General');
    await pool.close();
    res.json(data.recordsets[0][0]);
});

app.post('/upd_Actalizartiemposgenerales', async (req, res) => {
    let {Tiempo, Motivo} = req.body;
    let pool = await new sql.ConnectionPool(connection.db_Dominos).connect();
    let data = await pool.request()
        .input('tiempo', sql.Int, Tiempo)
        .input('motivo', sql.NVarChar, Motivo)
        .input('user', sql.Int, req.session.iduser)
        .execute('Sp_upd_Recordatorios_ModificacionTiempos');
    await pool.close();
    res.json(data.recordsets[0][0]);
});

module.exports = app;