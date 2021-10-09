
$(document).ready(()=> {
    $.ajax({
        url: '/get_page_recordatorios',
        method: 'get',
        timeout: 15000,
        success:(data)=> {
            switch(Number(data.__error)){
                case 0:
                    localStorage.setItem('Tiendas', JSON.stringify(data.Tiendas));
                    $(data.Tiendas).each((i,e)=>{
                        $('#id_Tienda').append(`<option value="${e.CodigoTienda}">${e.Tienda}</option>`);
                    })
                    $(data.Tiempos).each((i, e)=>{
                        $('#id_Tiempos').append(`<option value="${e.Id_Tiempo}">${e.Tiempo}</option>`);
                    });
                    $(data.Estado).each((i, e)=>{
                        $('#POS').append(`<option value="${e.Id_Estado}">${e.Estado}</option>`);
                    });
                    MN_VS_2('Exito', 'bg-success', 'Datos Cargados')
                    break;
                case 1:
                    MN_VS_2('Error!!', 'bg-danger', 'Problemas al Conectar a la Base de Datos')
                    break;
            }
        }
    })
});

function VerTiendasBajas(){
    const valor = document.getElementById("chechTiendasBajas").checked;
    $('#id_Tienda > option').each((i, e) => {
        if($(e).val() != 0){
            $(e).css('display', 'none')
        }
    })
    if(valor === true){
        $.ajax({
            url: '/getListTiendaforEstado',
            timeout:15000,
            method: 'post',
            data: {
                Valor: valor
            },
            success: (data) => {
                switch(Number(data.__error)){
                    case 0:
                        $(data.Tiendas).each((i,e) => {
                            $('#id_Tienda').find(`option[value="${e.CodigoTienda}"]`).css('display', 'block')
                        });
                        MN_VS_2('Exito', 'bg-success', 'Tiendas de baja')
                        break;
                    case 1:
                        MN_VS_2('Error!!', 'bg-danger', 'Problemas al Conectar a la Base de Datos.')
                        break;
                }
            }
        });
    }else{
        $('#id_Tienda > option').each((i, e) => {
            if($(e).val() != 0){
                $(e).css('display', 'block')
            }
        })
    }
}

/**
 ***************************
 *      Obtener Datos     ** 
 ***************************
 */
//Obtener Datos de Tiendas Dominos (comentarios, tiempos, horarios y motivos, inventario)
$('#id_Tienda').on('change', () => {
    $.ajax({
        url: '/getRecordatorios',
        timeout: 15000,
        method: 'post',
        data:{
            codigotienda: $('#id_Tienda').val()
        },
        success: (data) =>{
            $('#idTableHistorial').html('');
            switch(Number(data.__error)){
                case 0:
                    localStorage.setItem('horarios', JSON.stringify(data.Horarios))
                    $('#id_Tiempos').val(data.Encabezado[0].Tiempo)
                    $('#Id_Motivo').val(data.Encabezado[0].Motivo)
                    $('#POS').val(data.Encabezado[0].POS)
                    $('#Id_Comentario').val(data.Encabezado[0].Comentario)
                    MN_VS_2(`Exito: ${$('#id_Tienda').val()}`,'bg-success', `Se han cargado los recordatorios`)
                    break;
                case 1:
                    MN_VS_2(`Error!!`,'bg-danger', `Problemas de conexion.`)
                    break;
            }
        }
    }).fail((e) => {
        MN_VS_2('Error','bg-danger', `Codigo Error: X${e.status}, Error en la conexion a la base de datos`)
    })
})

$('#id_obtenerhistorial').on('click', () => {
    if($('#id_Tienda').val() != 0 && $('#id_date').val()){
        $.ajax({
            url: '/getHistorialRecordatorios',
            timeout: 15000,
            method: 'post',
            data: {
                codigo: $('#id_Tienda').val(),
                fecha: $('#id_date').val()
            },
            success: (data) => {
                switch(Number(data.__error)){
                    case 1:
                        MN_VS_2('Error', 'bg-danger', `Error en la conexión a la base de datos.`)
                        break;
                    case 0:
                        let htmlTable = '';
                        $(data.Historial).each((i,e) => {
                            htmlTable += `
                            <tr>
                                <td>${VerFechaReal(e.Fecha_Hora)}</td>
                                <td>${e.Usuario}</td>
                                <td>${e.Bitacora}</td>
                            </tr>
                            `;
                        })
                        $('#idTableHistorial').html(htmlTable)
                        break;
                }
            }
        }).fail((e) => {
            MN_VS_2('Error', 'bg-danger', `Error en la conexión a la base de datos.`)
        });
    }else{
        if(!($('#id_Tienda').val() != 0)){
            MN_VS_2('Error!!', 'bg-danger', 'Tienes que seleccionar una tienda')
        }else if(!$('#id_date').val()){
            MN_VS_2('Error!!', 'bg-danger', 'Selecciona una fecha.')
        }
    }
})


//Funciones para actualizar Recordatorios de tienda
$('#id_Tiempos, #POS').on('change', (e) => {
    if($('#id_Tienda').val() != 0){
        $.ajax({
            url: '/upd_Tiempos_POS_Recordatorios',
            timeout: 15000,
            method: 'post',
            data:{
                codigotienda: $('#id_Tienda').val(),
                dato: $('#'+ $($(e)[0].target).attr('id')).val(),
                columna: $($(e)[0].target).attr('name')
            },
            success: (data) => {
                switch(Number(data.__error)){
                    case 0:
                        MN_VS_2(`Actualizacion de ${data.dato.Tipo}`, 'bg-success', `Has actualizado a '${data.dato.dato}'`)
                        break;
                    case 1:
                        MN_VS_2('Error!!', 'bg-danger', 'Error en la conexión a la base de datos')
                        break;
                }
            }
        })
    }else {
        MN_VS_2('Error!!', 'bg-danger', `Seleccione una tienda para actualizar ${$($(e)[0].target).attr('name') === 'Id_Posmovil' ?'POS' : 'Tiempos'}`)
        $('#'+$($(e)[0].target).attr('id')).val(1)
    }
})


$('#btn_Motivo, #btn_Comentarios').on('click',(elemento)=>{
    if($('#id_Tienda').val() != 0){
        $.ajax({
            url: '/upd_MotivoTiempo_Comentarios_Recordatorios',
            timeout:15000,
            method: 'post',
            data:{
                Tienda: $('#id_Tienda').val(),
                dato: $('#Id_'+$($(elemento)[0].target).attr('name')).val(),
                columna: $($(elemento)[0].target).attr('name')
            },
            success: (data) => {
                switch(Number(data.__error)){
                    case 1: 
                    MN_VS_2(`Error!!`,'bg-danger', 'Error en la conexion a la base de datos.')
                    break;
                    case 0:
                        MN_VS_2(`Cambio de ${data.dato.Tipo} en: ${$('#id_Tienda').val()}`,'bg-success', 'Actualizado') 
                    break;
                }
            }
        });
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para actualizar motivo de tiempo')
        $('#id_MotivoTiempo').val('')
    }
})

/**
 ***************************
 *      Obtener Modal     ** 
 ***************************
 */


//! boton para poder activar modal y crear una nueva tienda
$('#btn_CrearTienda').on('click', ()=>{
    $('#Modal_Principal').modal('show')
    $('#tileModal').html(`Nueva tienda Camioncito`)
    $('#ModalBody').html(HTML_CrearTienda);
    $('#idcrearnuevatienda').css('display', 'block');
    $('#alertamensaje').css('display', 'block')
    $('#idrestaurarrecordatorios').css('display', 'none');
    $('#ideditarhorarios').css('display', 'none');
    $('#idguardarcambioshorarios').css('display', 'none');
    $('#idcancelaredicionhorarios').css('display', 'none');
    $('#idaplicarmodificaciones').css('display', 'none');
});


//! Boton que activa el modal para poder restaurar los recordatosios
$('#btn_RestauracionRecordatorios').on('click',() => {
    $('#idaplicarmodificaciones').css('display', 'none');
    $('#Modal_Principal').modal('show')
    $('#alertamensaje').css('display', 'none')
    $('#idrestaurarrecordatorios').css('display', 'block')
    $('#tileModal').html(`Restauración Recordatorios`)
    $('#ModalBody').html(HTML_Restauacion)
    $('#ideditarhorarios').css('display', 'none');
    $('#idguardarcambioshorarios').css('display', 'none');
    $('#idcancelaredicionhorarios').css('display', 'none');
    $('#idcrearnuevatienda').css('display', 'none');
});

//! Boton para poder actival el modal y porder actualizar horarios
$('#btn_HorarioTiendas').on('click',() => {
    const HorariosTiendas = JSON.parse(localStorage.getItem('horarios'))
    if($('#id_Tienda').val() != 0&& HorariosTiendas){
        $('#alertamensaje').css('display', 'none')
        $('#idrestaurarrecordatorios').css('display', 'none')
        $('#idcrearnuevatienda').css('display', 'none');
        $('#ideditarhorarios').css('display', 'block');
        $('#idaplicarmodificaciones').css('display', 'none');
        $('#idguardarcambioshorarios').css('display', 'none');
        $('#idcancelaredicionhorarios').css('display', 'none');
        $('#ModalBody').html(HTML_HorariosTienda)
        $('#tileModal').html(`Horario de Tienda: ${HorariosTiendas[0].Codigo_Tienda}`)
        $('#inputaperturalunes').val(HorariosTiendas[0].Mondey.split('A')[0].trim())
        $('#inputcierrelunes').val(HorariosTiendas[0].Mondey.split('A')[1].trim())
        $('#inputaperturamartes').val(HorariosTiendas[0].Tuesday.split('A')[0].trim())
        $('#inputcierremartes').val(HorariosTiendas[0].Tuesday.split('A')[1].trim())
        $('#inputaperturamiercoles').val(HorariosTiendas[0].Wednesday.split('A')[0].trim())
        $('#inputcierremiercoles').val(HorariosTiendas[0].Wednesday.split('A')[1].trim())
        $('#inputaperturajueves').val(HorariosTiendas[0].Thursday.split('A')[0].trim())
        $('#inputcierrejueves').val(HorariosTiendas[0].Thursday.split('A')[1].trim())
        $('#inputaperturaviernes').val(HorariosTiendas[0].Friday.split('A')[0].trim())
        $('#inputcierreviernes').val(HorariosTiendas[0].Friday.split('A')[1].trim())
        $('#inputaperturasabado').val(HorariosTiendas[0].Saturday.split('A')[0].trim())
        $('#inputcierresabado').val(HorariosTiendas[0].Saturday.split('A')[1].trim())
        $('#inputaperturadomingo').val(HorariosTiendas[0].Sunday.split('A')[0].trim())
        $('#inputcierredomingo').val(HorariosTiendas[0].Sunday.split('A')[1].trim())
        $('#Modal_Principal').modal('show')
    }else{
        MN_VS_2('Error!!', 'bg-danger','Seleccione una tienda');
    }
});

//! Boton que activa el modal para poder actualizar tiempos en forma general
$('#btn_ModificacionDeTiempos').on('click', () => {
    $('#ModalBody').html(HTML_ModificacionTiempos);
    $('#Modal_Principal').modal('show')
    $('#tileModal').html('Modificación de Tiempos Dominos');
    $('#idaplicarmodificaciones').css('display', 'block');
    $('#idcrearnuevatienda').css('display', 'none');
    $('#idrestaurarrecordatorios').css('display', 'none');
    $('#ideditarhorarios').css('display', 'none');
    $('#idguardarcambioshorarios').css('display', 'none');
    $('#idcancelaredicionhorarios').css('display', 'none');
})

//! Boton para poder desactivar el disabled de los elementos para editar horarios
$('#ideditarhorarios').on('click', () => {
    $('#ideditarhorarios').css('display', 'none');
    $('#alertamensaje').css('display', 'none')
    $('#idguardarcambioshorarios').css('display', 'block');
    $('#idcancelaredicionhorarios').css('display', 'block');
    $('#inputaperturalunes').prop('disabled', false)
    $('#inputcierrelunes').prop('disabled', false)
    $('#inputaperturamartes').prop('disabled', false)
    $('#inputcierremartes').prop('disabled', false)
    $('#inputaperturamiercoles').prop('disabled', false)
    $('#inputcierremiercoles').prop('disabled', false)
    $('#inputaperturajueves').prop('disabled', false)
    $('#inputcierrejueves').prop('disabled', false)
    $('#inputaperturaviernes').prop('disabled', false)
    $('#inputcierreviernes').prop('disabled', false)
    $('#inputaperturasabado').prop('disabled', false)
    $('#inputcierresabado').prop('disabled', false)
    $('#inputaperturadomingo').prop('disabled', false)
    $('#inputcierredomingo').prop('disabled', false)
})

//! Boton para poder cancelar la actualizacion de los horaios de la tienda.
$('#idcancelaredicionhorarios').on('click', () => {
    $('#ideditarhorarios').css('display', 'block');
    $('#idguardarcambioshorarios').css('display', 'none');
    $('#idcancelaredicionhorarios').css('display', 'none');
    $('#inputaperturalunes').prop('disabled', true)
    $('#inputcierrelunes').prop('disabled', true)
    $('#inputaperturamartes').prop('disabled', true)
    $('#inputcierremartes').prop('disabled', true)
    $('#inputaperturamiercoles').prop('disabled', true)
    $('#inputcierremiercoles').prop('disabled', true)
    $('#inputaperturajueves').prop('disabled', true)
    $('#inputcierrejueves').prop('disabled', true)
    $('#inputaperturaviernes').prop('disabled', true)
    $('#inputcierreviernes').prop('disabled', true)
    $('#inputaperturasabado').prop('disabled', true)
    $('#inputcierresabado').prop('disabled', true)
    $('#inputaperturadomingo').prop('disabled', true)
    $('#inputcierredomingo').prop('disabled', true)
})

/**
 ** ****************************
 **      Codigo de Modal     ** 
 ** ****************************
 */
//! Guardar las modificaciones de horario de tienda
$('#idguardarcambioshorarios').on('click', ()=> {
    $.ajax({
        url: '/upd_HorariosTienda',
        method: 'post',
        timeout: 15000,
        data: {
            Tienda: $('#id_Tienda').val(),
            Lunes: $('#inputaperturalunes').val() + ' A ' + $('#inputcierrelunes').val(),
            Martes: $('#inputaperturamartes').val() + ' A ' + $('#inputcierremartes').val(),
            Miercoles: $('#inputaperturamiercoles').val() + ' A ' + $('#inputcierremiercoles').val(),
            Jueves: $('#inputaperturajueves').val() + ' A ' + $('#inputcierrejueves').val(),
            Viernes: $('#inputaperturaviernes').val() + ' A ' + $('#inputcierreviernes').val(),
            Sabado: $('#inputaperturasabado').val() + ' A ' + $('#inputcierresabado').val(),
            Domingo: $('#inputaperturadomingo').val() + ' A ' + $('#inputcierredomingo').val(),
            Usuario: $('#usuario').html()
        },
        success: (data)=>{
            $('#Modal_Principal').modal('hide')
            switch(Number(data.__error)){
                case 0:
                    localStorage.setItem('horarios', JSON.stringify(data.Horario))
                    MN_VS_2(`Actializacion de Horarios: ${$('#id_Tienda').val()}`, 'bg-success', 'Se han guardado los cambios')
                break;
                case 1:
                    MN_VS_2(`Error!!`, 'bg-danger', 'Error al conectarse a la base de datos')
                break;
            }
        }
    });
});

//! Restaura los valores de Tiempos a "Tiempos Normales" y el Motivo a vaciarlo
$('#idrestaurarrecordatorios').on('click', () => {
    $.ajax({
        url: '/set_restaurarrecordatorios',
        method: 'get',
        timeout: 15000,
        success: (data) => {
            $('#Modal_Principal').modal('hide')
            switch(Number(data.__error)){
                case 1:
                    MN_VS_2('Error!!', 'bg-danger','Error al conectarse la base de datos') 
                break;
                case 0:
                    MN_VS_2('Exito', 'bg-success','Se ha actualizado los recordatorios') 
                break;
            }
        }
    })
});

//! Boton para descargar la bitacora en formato XLSX
$('#btn_DescargaBitacora').on('click', () => {
    $.ajax({
        url: '/get_Recordatorios_Download',
        method: 'get',
        timeout: 1500,
        success: (data) => {
            switch(Number(data.__error)) {
                case 0:
                    let htmltablebodyencabezado= ''
                    $(data.Encabezado).each((i,e) => {
                        htmltablebodyencabezado += `
                        <tr>
                            <td>${e.Tienda}</td>
                            <td>${e.Tiempo}</td>
                            <td>${e.Motivo}</td>
                            <td>${e.POS}</td>
                            <td>${e.Comentario}</td>
                        </tr>
                        `
                    });
                    $('#tbody_encabezado').html(htmltablebodyencabezado)
                    let encabezado = document.getElementById('tbl_encabezado_tienda')
                    let Datos = ConvertTableToXLSX(encabezado, 'Recordatorios Camioncito', 'Recordatorios Camioncito', 'Recordatorios Camioncito');
                    DescargarXLSX('Recordatorios', Datos)
                break;
                case 1:
                   MN_VS_2('Error!!', 'bg-danger', 'Error en la conexion en la base de datos')  
                break;
            }
        }
    })
});

$('#idcrearnuevatienda').on('click', () => {
    if($('#inp_CodigoTienda').val() && $('#inp_NombreTienda').val() && $('#inputaperturalunes').val() && $('#inputcierrelunes').val()  && $('#inputaperturamartes').val() && $('#inputcierremartes').val() && $('#inputaperturamiercoles').val()
        && $('#inputcierremiercoles').val() && $('#inputaperturajueves').val() && $('#inputcierrejueves').val()  && $('#inputaperturaviernes').val() && $('#inputcierreviernes').val() && $('#inputaperturasabado').val() 
        && $('#inputcierresabado').val() && $('#inputaperturadomingo').val() && $('#inputcierredomingo').val()){
            $.ajax({
                url: '/ins_nuevatienda',
                timeout: 15000,
                method: 'post',
                data: {
                    NombreTienda: $('#inp_NombreTienda').val().trim(),
                    CodigoTienda: $('#inp_CodigoTienda').val().trim(),
                    Lunes: $('#inputaperturalunes').val().trim() + ' A ' + $('#inputcierrelunes').val().trim(),
                    Martes: $('#inputaperturamartes').val().trim() + ' A ' + $('#inputcierremartes').val().trim(),
                    Miercoles: $('#inputaperturamiercoles').val().trim() + ' A ' + $('#inputcierremiercoles').val().trim(),
                    Jueves: $('#inputaperturajueves').val().trim() + ' A ' + $('#inputcierrejueves').val().trim(),
                    Viernes: $('#inputaperturaviernes').val().trim() + ' A ' + $('#inputcierreviernes').val().trim(),
                    Sabado: $('#inputaperturasabado').val().trim() + ' A ' + $('#inputcierresabado').val().trim(),
                    Domingo: $('#inputaperturadomingo').val().trim() + ' A ' + $('#inputcierredomingo').val().trim()
                },
                success: (data) => {
                    switch(Number(data.__error)){
                        case 0:
                             MN_VS_2('Nueva tienda', 'bg-success', 'Se a creado una nueva tienda');
                             $('#Modal_Principal').modal('hide')
                        break;
                        case 1:
                            MN_VS_2('Error!!', 'bg-danger', 'Problemas con la conexion a la base datos'); 
                        break;
                        case 2: 
                            MN_VS_2('Problema!!', 'bg-warning', 'El codigo de tienda ya existe');
                            $('#inp_CodigoTienda').addClass('border-danger');
                            setTimeout(() => {
                                $('#inp_CodigoTienda').removeClass('border-danger')
                            }, 3000);
                        break;
                    }
                }
            });
    }else{
        $('#alertamensaje').html('Aun tienes campos pendientes de llenar!!')
        $('#inp_CodigoTienda').addClass($('#inp_CodigoTienda').val() === '' ? 'border-danger': '' );
        $('#inp_NombreTienda').addClass($('#inp_NombreTienda').val() === '' ? 'border-danger': '' );
        $('#inputaperturalunes').addClass($('#inputaperturalunes').val() === '' ? 'border-danger': '' );
        $('#inputcierrelunes').addClass($('#inputcierrelunes').val() === '' ? 'border-danger': '' );
        $('#inputaperturamartes').addClass($('#inputaperturamartes').val() === '' ? 'border-danger': '' );
        $('#inputcierremartes').addClass($('#inputcierremartes').val() === '' ? 'border-danger': '' );
        $('#inputaperturamiercoles').addClass($('#inputaperturamiercoles').val() === '' ? 'border-danger': '' );
        $('#inputcierremiercoles').addClass($('#inputcierremiercoles').val() === '' ? 'border-danger': '' );
        $('#inputaperturajueves').addClass($('#inputaperturajueves').val() === '' ? 'border-danger': '' );
        $('#inputcierrejueves').addClass($('#inputcierrejueves').val() === '' ? 'border-danger': '' );
        $('#inputaperturaviernes').addClass($('#inputaperturaviernes').val() === '' ? 'border-danger': '' );
        $('#inputcierreviernes').addClass($('#inputcierreviernes').val() === '' ? 'border-danger': '' );
        $('#inputaperturasabado').addClass($('#inputaperturasabado').val() === '' ? 'border-danger': '' );
        $('#inputcierresabado').addClass($('#inputcierresabado').val() === '' ? 'border-danger': '' );
        $('#inputaperturadomingo').addClass($('#inputaperturadomingo').val() === '' ? 'border-danger': '' );
        $('#inputcierredomingo').addClass($('#inputcierredomingo').val() === '' ? 'border-danger': '' );
        setTimeout(() => {
            $('#alertamensaje').html('')
            $('#inp_CodigoTienda').removeClass('border-danger');
            $('#inp_NombreTienda').removeClass('border-danger');
            $('#inputaperturalunes').removeClass('border-danger');
            $('#inputcierrelunes').removeClass('border-danger');
            $('#inputaperturamartes').removeClass('border-danger');
            $('#inputcierremartes').removeClass('border-danger');
            $('#inputaperturamiercoles').removeClass('border-danger');
            $('#inputcierremiercoles').removeClass('border-danger');
            $('#inputaperturajueves').removeClass('border-danger');
            $('#inputcierrejueves').removeClass('border-danger');
            $('#inputaperturaviernes').removeClass('border-danger');
            $('#inputcierreviernes').removeClass('border-danger');
            $('#inputaperturasabado').removeClass('border-danger');
            $('#inputcierresabado').removeClass('border-danger');
            $('#inputaperturadomingo').removeClass('border-danger');
            $('#inputcierredomingo').removeClass('border-danger');
        }, 3000);
    }
});

//Actualizar los tiempos de forma general
$('#idaplicarmodificaciones').on('click', () => {
    if($('#input_Modificaciontiempos').val() != 0){
        $.ajax({
            url: '/upd_Actalizartiemposgenerales',
            timeout: 15000,
            method: 'post',
            data: {
                Tiempo: $('#input_Modificaciontiempos').val(),
                Motivo: $('#input_modificacionmotivotiempos').val()
            },
            success: (data) => {
                $('#Modal_Principal').modal('hide')
                switch(Number(data.__error)){
                    case 0:
                        MN_VS_2('Exito', 'bg-success', 'Se han Actualizado los tiempos y motivos de las tiendas') 
                    break;
                    case 1: 
                        MN_VS_2('Error!!', 'bg-danger', 'Error al conectarse a la base de datos.')
                    break;
                }
            }
        }).fail((err) =>{
            $('#Modal_Principal').modal('hide')
            MN_VS_2('Error de Conexion', 'bg-danger', 'Error de conexion a la base de datos')
        });
    }else{
        $('#Modal_Principal').modal('hide')
        MN_VS_2('Error', 'bg-danger', 'Selecciona algun tiempo.')
    }
});