const express = require('express');
const router = express.Router();
const sql = require('mssql');
const connect = require('../config/config')

router.get('/', (req, res) => {
    res.render('index.html', {
        title: 'Edicion Dominos'
    })
});

router.post('/login', async (req, res) => {
    let {usuario, contrasena} = req.body;
    let pool = await new sql.ConnectionPool(connect.db_suit).connect();
    let data = await pool.request()
        .input('user', sql.NVarChar, usuario)
        .input('pass', sql.NVarChar, contrasena)
        .execute('SP_SuitCreC_Validacion');
    await pool.close();
    if(data.rowsAffected[0] > 0){
        if(data.recordset[0].Rol >= 4){
            req.session.user = usuario.toLowerCase();
            req.session.rol = data.recordset[0].Rol;
            req.session.iduser = data.recordset[0].ID;
            res.send('2')
        }else{
            res.send('1')
        }
    }else{
        res.send('0')
    }
})



module.exports = router