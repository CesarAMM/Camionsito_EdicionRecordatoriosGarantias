//Variables Generales
let listadotiendas= []

$(document).ready(()=> {
    $.ajax({
        url: '/get_page_recordatorios',
        method: 'get',
        timeout: 15000,
        success:(data)=> {
            listadotiendas = data.Tiendas;
            $('#id_Tienda').append(`
                    <option value="0">-- Seleccione Una Tienda --</option>
                `);
            $(data.Tiendas).each((i,e)=>{
                $('#id_Tienda').append(`
                    <option value="${e.Codigo_Tienda}">${e.Tienda}</option>
                `);
            })
            $(data.Tiempos).each((i, e)=>{
                $('#id_Tiempos').append(`<option value="${e.Id}">${e.Tiempo}</option>`);
            });
            $(data.Estado).each((i, e)=>{
                $('#POS').append(`<option value="${e.Id}">${e.Estado}</option>`);
            });
        }
    })
});

function VerTiendasBajas(){
    const valor = document.getElementById("chechTiendasBajas").checked;
    $('#id_Tienda').html('');
    $.ajax({
        url: '/getListTiendaforEstado',
        timeout:15000,
        method: 'post',
        data: {
            Valor: valor
        },
        success: (data) => {
            $('#id_Tienda').append(`<option value="0">-- Seleccione Tienda --</option>`);
            $(data).each((i,e) => {
                $('#id_Tienda').append(`<option value="${e.Codig_Tienda}">${e.Tienda}</option>`);
            });
        }
    });
}

/**
 ***************************
 *      Obtener Datos     ** 
 ***************************
 */
let localStore = window.localStorage;
//Obtener Datos de Tiendas Dominos (comentarios, tiempos, horarios y motivos, inventario)
$('#id_Tienda').on('change', () => {
    const codigo_tienda = $('#id_Tienda').val();
    localStore.removeItem('horario')
    $.ajax({
        url: '/getRecordatorios',
        timeout: 15000,
        method: 'post',
        data:{
            codigotienda: codigo_tienda
        },
        success: (data) =>{
            localStore.setItem('horario', JSON.stringify(data.Horarios))
            $('#idTableHistorial').html('');
            $('#id_Tiempos').val(data.Encabezado[0].Tiempos)
            $('#id_MotivoTiempo').val(data.Encabezado[0].Motivo)
            $('#POS').val(data.Encabezado[0].POS)
            $('#id_comentario').val(data.Encabezado[0].Comentario)
            $('#id_impulsar').val(data.Encabezado[0].Impulsar)
            $(data.Bebidas).each((i, e) => {
                if(e.Id_Estado == 1){
                    $('#iditem_'+ e.Id_Item).prop('checked', true)
                }else if (e.Id_Estado == 2){
                    $('#iditem_'+ e.Id_Item).prop('checked', false)
                }
            });
            $(data.Masas).each((i, e) => {
                if(e.Id_Estado == 1){
                    $('#iditem_'+ e.Id_Item).prop('checked', true)
                }else if (e.Id_Estado == 2){
                    $('#iditem_'+ e.Id_Item).prop('checked', false)
                }
            });
            $(data.Ingredientes).each((i, e) => {
                if(e.Id_Estado == 1){
                    $('#iditem_'+ e.Id_Item).prop('checked', true)
                }else if (e.Id_Estado == 2){
                    $('#iditem_'+ e.Id_Item).prop('checked', false)
                }
            });
            $(data.Extras).each((i, e) => {
                if(e.Id_Estado == 1){
                    $('#iditem_'+ e.Id_Item).prop('checked', true)
                }else if (e.Id_Estado == 2){
                    $('#iditem_'+ e.Id_Item).prop('checked', false)
                }
            });
            $(data.Alitas_Costillas).each((i, e) => {
                if(e.Id_Estado == 1){
                    $('#iditem_'+ e.Id_Item).prop('checked', true)
                }else if (e.Id_Estado == 2){
                    $('#iditem_'+ e.Id_Item).prop('checked', false)
                }
            });
            MN_VS_2(`Exito: ${codigo_tienda}`,'bg-success', `Se han cargado los recordatorios`)
        }
    }).fail((e) => {
        MN_VS_2('Error','bg-danger', `Codigo Error: X${e.status}, Error en la conexion a la base de datos`)
    })
})

$('#id_obtenerhistorial').on('click', () => {
    $('#idTableHistorial').html(' ');
    if($('#id_Tienda').val() && $('#id_date').val()){
        $.ajax({
            url: '/getHistorialRecordatorios',
            timeout: 15000,
            method: 'post',
            data: {
                codigo: $('#id_Tienda').val(),
                fecha: $('#id_date').val()
            },
            success: (data) => {
                $(data).each((i,e) => {
                    $('#idTableHistorial').append(`
                    <tr>
                        <td>${e.Usuario}</td>
                        <td>${VerFechaReal(e.Fecha_Hora)}</td>
                        <td>${e.Modificacion}</td>
                    </tr>
                    `);
                })
            }
        }).fail((e) => {
            MN_VS_2('Error', 'bg-danger', `Error en la conexión a la base de datos.`)
        });
    }else{
        if(!$('#id_Tienda').val()){
            MN_VS_2('Error!!', 'bg-danger', 'Tienes que seleccionar una tienda')
        }else if(!$('#id_date').val()){
            MN_VS_2('Error!!', 'bg-danger', 'Selecciona una fecha.')
        }
    }
})


//Funciones para actualizar Recordatorios de tienda
$('#id_Tiempos').on('change', () => {
    if($('#id_Tienda').val() != 0){
        $.ajax({
            url: '/upd_Tiempos_Recordatorios',
            timeout: 15000,
            method: 'post',
            data:{
                codigotienda: $('#id_Tienda').val(),
                Tiempo: $('#id_Tiempos').val()
            },
            success: (data) => {
                MN_VS_2(`Cambio de Tiempos en: ${data[0].Tienda}`,'bg-success',data[0].User+' has modificado tiempos a: '+ data[0].Tiempo)
            }
        })
    }else {
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para actualizar tiempos')
        $('#id_Tiempos').val(1)
    }
})

$('#btnGuardarmotivotiempo').on('click',()=>{
    if($('#id_Tienda').val() != 0){
        $.ajax({
            url: '/upd_MotivoTiempo_Recordatorios',
            timeout:15000,
            method: 'post',
            data:{
                Tienda: $('#id_Tienda').val(),
                Motivo: $('#id_MotivoTiempo').val(),
                Usuario: $('#usuario').html()
            },
            success: (data) => {
                MN_VS_2(`Cambio de Motivos en: ${data[0].Tienda}`,'bg-success',data[0].User+': '+ data[0].Motivo)
            }
        });
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para actualizar motivo de tiempo')
        $('#id_MotivoTiempo').val('')
    }
})

$('#btnGuardarcomentario').on('click',()=>{
    if($('#id_Tienda').val() != 0){
        $.ajax({
            url: '/upd_Comentario_recordatorios',
            timeout:15000,
            method: 'post',
            data:{
                Tienda: $('#id_Tienda').val(),
                Comentario: $('#id_comentario').val(),
                Usuario: $('#usuario').html()
            },
            success: (data) => {
                MN_VS_2(`Cambio de Comentario en: ${data[0].Tienda}`,'bg-success',data[0].User+': '+ data[0].Motivo)
            }
        });
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para actualizar su comentario')
    }
})

$('#btnImpulsar').on('click',()=>{
    if($('#id_Tienda').val() != 0){
        $.ajax({
            url: '/upd_impulsar_recordatorios',
            timeout:15000,
            method: 'post',
            data:{
                Tienda: $('#id_Tienda').val(),
                Comentario: $('#id_impulsar').val(),
                Usuario: $('#usuario').html()
            },
            success: (data) => {
                MN_VS_2(`Cambio de Impulsar en: ${data.Tienda}`,'bg-success',data.User+': '+ data.Motivo)
            }
        });
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para actualizar su comentario')
    }
});

$('#POS').on('change',()=>{
    if($('#id_Tienda').val() != 0){
        $.ajax({
            url: '/upd_POS_recordatorios',
            timeout:15000,
            method: 'post',
            data:{
                Tienda: $('#id_Tienda').val(),
                POS: $('#POS').val(),
            },
            success: (data) => {
                MN_VS_2(`Cambio de Impulsar en: ${data.Tienda}`,'bg-success',data.User+': '+ data.Motivo)
            }
        });
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para actualizar el POS movil')
    }
});

$('.class-item').on('change', (elemento) => {
        if($('#id_Tienda').val() != 0){
            const estado = $($(elemento)[0].target)[0].checked
            const item = $($(elemento)[0].target).attr("value")
            let intestado = 1;
            if(estado == false){
                intestado = 2
            }
            $.ajax({
                url: '/upd_funcionGenarelizada',
                timeout: 15000,
                method: 'post',
                data: {
                    codigotienda: $('#id_Tienda').val(),
                    id_item: item,
                    id_estado: intestado
                },
                success: (data) => {
                    MN_VS_2(`Cambio de Impulsar en: ${data.Tienda}`,'bg-success',data.User+': '+ data.Motivo)
                }
            })
        }else{
            MN_VS_2('Error', 'bg-danger', 'Selecciona una tienda antes de actualizar.')
        }
})

/**
 ***************************
 *      Obtener Modal     ** 
 ***************************
 */

//Modal para Crear una tienda

$('#btn_CrearTienda').on('click', ()=>{
    $('#Modal_Principal').modal('show')
    $('#tileModal').html(`Nueva tienda Domino´s`)
    $('#ModalBody').html(HTML_CrearTienda);
    $('#idcrearnuevatienda').css('display', 'block');
    $('#alertamensaje').css('display', 'block')
    $('#idrestaurarrecordatorios').css('display', 'none');
    $('#ideditarhorarios').css('display', 'none');
    $('#idguardarcambioshorarios').css('display', 'none');
    $('#idcancelaredicionhorarios').css('display', 'none');
    $('#idaplicarmodificaciones').css('display', 'none');
});

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

$('#btn_HorarioTiendas').on('click',() => {
    const HorariosTiendas = JSON.parse(localStore.getItem('horario'))
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
        $('#inputaperturalunes').val(HorariosTiendas[0].Monday.split('A')[0].trim())
        $('#inputcierrelunes').val(HorariosTiendas[0].Monday.split('A')[1].trim())
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
 *****************************
 *      Codigo de Modal     ** 
 *****************************
 */
//Guardar las modificaciones de horario de tienda
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
                localStore.setItem('horario', JSON.stringify(data.Horario))
                $('#Modal_Principal').modal('hide')
                MN_VS_2(`Actializacion de Horarios: ${data.data.Tienda}`, 'bg-success', data.data.User +': ' + data.data.Motivo)
        }
    });
});

$('#idrestaurarrecordatorios').on('click', () => {
    $.ajax({
        url: '/set_restaurarrecordatorios',
        method: 'get',
        timeout: 15000,
        success: (data) => {
            $('#Modal_Principal').modal('hide')
            MN_VS_2('Se restauro en todas las tiendasx', 'bg-success', data.User +': '+ data.Motivo)
        }
    })
});

$('#btn_DescargaBitacora').on('click', () => {
    $.ajax({
        url: '/get_Recordatorios_Download',
        method: 'get',
        timeout: 1500,
        success: (data) => {
            let htmltablebodyencabezado= ''
            let htmltablebodyfaltante = ''
            $(data.Encabezado).each((i,e) => {
                htmltablebodyencabezado += `
                <tr>
                        <td>${e.Tienda}</td>
                        <td>${e.Tiempo}</td>
                        <td>${e.Motivo}</td>
                        <td>${e.POS}</td>
                        <td>${e.Comentario}</td>
                        <td>${e.Impulsar}</td>
                    </tr>
                `
            });
            $(data.Faltante).each((i,e) => {
                htmltablebodyfaltante += `
                <tr>
                    <td>${e.Tienda}</td>
                    <td>${e.Categoria}</td>
                    <td>${e.Item}</td>
                    <td>${e.Estado}</td>
                </tr>
                `
            });

            $('#tbody_encabezado').html(htmltablebodyencabezado)
            $('#tbody_faltante').html(htmltablebodyfaltante)

            let encabezado = document.getElementById('tbl_encabezado_tienda')
            let faltante = document.getElementById('tbl_Faltante_tienda')

            let Datos = ConvertTableToXLSX_vs_2(encabezado, faltante, 'Recordatorios Dominos', 'Recordatorios Dominos');

            DescargarXLSX('Recordatorios', Datos)
        }
    })
});

$('#idcrearnuevatienda').on('click', () => {
    $('#alertamensaje').html(' ')
    $('#idtiendanueva').removeClass('border-danger');
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
    $('#inputcierredomingo').removeClass('border-danger');
    $('#inputaperturadomingo').removeClass('border-danger');
    if($('#idtiendanueva').val() != 0 && $('#inputaperturalunes').val() && $('#inputcierrelunes').val() 
        && $('#inputaperturamartes').val() && $('#inputcierremartes').val() && $('#inputaperturamiercoles').val()
        && $('#inputcierremiercoles').val() && $('#inputaperturajueves').val() && $('#inputcierrejueves').val() 
        && $('#inputaperturaviernes').val() && $('#inputcierreviernes').val() && $('#inputaperturasabado').val() 
        && $('#inputcierresabado').val() && $('#inputaperturadomingo').val() && $('#inputcierredomingo').val()){
            $.ajax({
                url: '/ins_nuevatienda',
                timeout: 15000,
                method: 'post',
                data: {
                    Tienda: $('#idtiendanueva').val(),
                    Lunes: $('#inputaperturalunes').val() + ' A ' + $('#inputcierrelunes').val(),
                    Martes: $('#inputaperturamartes').val() + ' A ' + $('#inputcierremartes').val(),
                    Miercoles: $('#inputaperturamiercoles').val() + ' A ' + $('#inputcierremiercoles').val(),
                    Jueves: $('#inputaperturajueves').val() + ' A ' + $('#inputcierrejueves').val(),
                    Viernes: $('#inputaperturaviernes').val() + ' A ' + $('#inputcierreviernes').val(),
                    Sabado: $('#inputaperturasabado').val() + ' A ' + $('#inputcierresabado').val(),
                    Domingo: $('#inputaperturadomingo').val() + ' A ' + $('#inputcierredomingo').val()
                },
                success: (data) => {
                    $('#Modal_Principal').modal('hide')
                    MN_VS_2(`Nueva Tienda ${data.Codigo_Tienda}`, 'bg-success', `Nueva tienda agregada: ${data.Tienda}`)
                }
            });
    }else{
        $('#alertamensaje').html('Aun tienes campos pendientes a llenar!!')
        if($('#idtiendanueva').val() == 0){
            $('#idtiendanueva').addClass('border-danger');
        }
        if(!$('#inputaperturalunes').val()){
            $('#inputaperturalunes').addClass('border-danger');
        }
        if(!$('#inputaperturamartes').val()){
            $('#inputaperturamartes').addClass('border-danger');
        }
        if(!$('#inputcierremartes').val()){
            $('#inputcierremartes').addClass('border-danger');
        }
        if(!$('#inputaperturamiercoles').val()){
            $('#inputaperturamiercoles').addClass('border-danger');
        }
        if(!$('#inputcierremiercoles').val()){
            $('#inputcierremiercoles').addClass('border-danger');
        }
        if(!$('#inputaperturajueves').val()){
            $('#inputaperturajueves').addClass('border-danger');
        }
        if(!$('#inputcierrejueves').val()){
            $('#inputcierrejueves').addClass('border-danger');
        }
        if(!$('#inputaperturaviernes').val()){
            $('#inputaperturaviernes').addClass('border-danger');
        }
        if(!$('#inputcierreviernes').val()){
            $('#inputcierreviernes').addClass('border-danger');
        }
        if(!$('#inputaperturasabado').val()){
            $('#inputaperturasabado').addClass('border-danger');
        }
        if(!$('#inputcierresabado').val()){
            $('#inputcierresabado').addClass('border-danger');
        }
        if(!$('#inputaperturadomingo').val()){
            $('#inputaperturadomingo').addClass('border-danger');
        }
        if(!$('#inputcierredomingo').val()){
            $('#inputcierredomingo').addClass('border-danger');
        }
        if(!$('#inputcierrelunes').val()){
            $('#inputcierrelunes').addClass('border-danger');
        }
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
                MN_VS_2(`Has modificado Tiempos y Motivos`, 'bg-success', `${data.Usuario} has cambiado tiempo: ${data.Tiempo} y Motivo: ${data.Motivo}`)
            }
        }).fail((err) =>{
            console.log(err);
            $('#Modal_Principal').modal('hide')
            MN_VS_2('Error de Conexion', 'bg-danger', 'Error de conexion a la base de datos')
        });
    }else{
        $('#Modal_Principal').modal('hide')
        MN_VS_2('Error', 'bg-danger', 'Selecciona algun tiempo.')
    }
});