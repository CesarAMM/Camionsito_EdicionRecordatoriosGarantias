
$('#btn_Buscar').on('click', () => {
    if($('#getpalabraclave').val() || $('#getcalle').val() || $('#getavenida').val() || $('#getkilometro').val() ||
            $('#getdepartamento').val() || $('#getzonamunicipio').val()){
        //Funcion de la condicion
        let calle = 0, avenida = 0, kilometrro = 0
        if($('#getkilometro').val()){
            kilometrro = $('#getkilometro').val()
        }
        if($('#getcalle').val()){
            calle = $('#getcalle').val();
        }
        if($('#getavenida').val()){
            avenida = $('#getavenida').val()
        }
                $.ajax({
                    url: '/get_datasectorizacionedicion',
                    timeout: 15000,
                    method: 'post',
                    data: {
                        palabraclave: $('#getpalabraclave').val(),
                        calle: calle,
                        avenida: avenida,
                        kilometro: parseFloat(kilometrro),
                        departamento: $('#getdepartamento').val(),
                        zonamunicipio: $('#getzonamunicipio').val()
                    },
                    success: (data) => {
                        $('#tbl_body').html(' ')
                        $(data).each((i, e) => {
                            $('#tbl_body').append(`
                            <tr class="" id="${e.Id}" onclick="verdetalledireccion(this.id)">
                                <td class="class_id" style="display: none;">${e.Id}</td>
                                <td class="class_Tienda">${e.Tienda}</td>
                                <td class="class_Departamento">${e.Departamento}</td>
                                <td class="class_zonamunicipio">${e.Zona_Municipio}</td>
                                <td class="class_Rango">${e.Rango}</td>
                                <td class="class_palabraclave" style="display: none;">${e.Palabra_Clave}</td>
                                <td class="class_calleminima" style="display: none;">${e.Calle_Minima}</td>
                                <td class="class_callemaxima" style="display: none;">${e.Calle_Maxima}</td>
                                <td class="class_avenidaminima" style="display: none;">${e.Avenida_Minima}</td>
                                <td class="class_avenidamaxima" style="display: none;">${e.Avenida_Maxima}</td>
                                <td class="class_kilometrominimo" style="display: none;">${e.Kilometro_Minimo}</td>
                                <td class="class_kilometromaximo" style="display: none;">${e.Kilometro_Maximo}</td>
                                <td class="class_minimo">${e.Minimo}</td>
                                <td class="class_garantia">${e.Garantia}</td>
                                <td class="class_tiempo">${e.Tiempo}</td>
                                <td class="class_horalimite">${e.Hora_Limite}</td>
                                <td class="class_comentario">${e.Cometario}</td>
                                <td class="class_serviio" style="display: none;">${e.Sector_Sin_Servicio}</td>
                            </tr>
                            `)
                        });
                    }
                });
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Llene uno de los campos para realizar una buesqueda    ');
    }
});


$('#btn_Buscar').on('click', () => {

})
function verdetalledireccion(id) {
    $('#bodalbody').html(HTML_Edicion)
    $('#exampleModal').modal('show')
    $('#exampleModalLabel').html(`Edicion: ${id}`);
    $('#btnregistraruno').css('display', 'none')
    $('#btncancelarregistraruno').css('display', 'none')
    $('#btnabilitarmodificaciones').css('display', 'block')
    $('#btnguardarmodificaciones').css('display', 'none')
    $('#btndesabilitarmodificacion').css('display', 'none')
    $('#btnguardarmodificaciones').val(id)
    $('#input_tienda').val($('#'+id).find('.class_Tienda').html().replace(/&nbsp;/gi,''))
    $('#input_departamento').val($('#'+id).find('.class_Departamento').html().replace(/&nbsp;/gi,''))
    $('#input_zonamunicipio').val($('#'+id).find('.class_zonamunicipio').html().replace(/&nbsp;/gi,''))
    $('#input_rango').html($('#'+id).find('.class_Rango').html().replace(/&nbsp;/gi,''))
    $('#input_palabraclave').html($('#'+id).find('.class_palabraclave').html().replace(/&nbsp;/gi,''))
    $('#input_calleminima').val($('#'+id).find('.class_calleminima').html())
    $('#input_callemaxima').val($('#'+id).find('.class_callemaxima').html())
    $('#input_avenidaminima').val($('#'+id).find('.class_avenidaminima').html())
    $('#input_avenidamaxima').val($('#'+id).find('.class_avenidamaxima').html())
    $('#input_kilometrominimo').val($('#'+id).find('.class_kilometrominimo').html())
    $('#input_kilometromaximo').val($('#'+id).find('.class_kilometromaximo').html())
    $('#input_minimo').val($('#'+id).find('.class_minimo').html().replace(/&nbsp;/gi,''))
    $('#input_garantia').val($('#'+id).find('.class_garantia').html().replace(/&nbsp;/gi,''))
    $('#input_tiempo').val($('#'+id).find('.class_tiempo').html().replace(/&nbsp;/gi,''))
    $('#intput_horalimite').val($('#'+id).find('.class_horalimite').html().replace(/&nbsp;/gi,''))
    $('#input_comentario').html($('#'+id).find('.class_comentario').html().replace(/&nbsp;/gi,''))
    $('#input_servicio').val($('#'+id).find('.class_serviio').html().replace(/&nbsp;/gi,''))
}

$('#btnabilitarmodificaciones').on('click',() => {
    $('#btnguardarmodificaciones').css('display', 'block');
    $('#btndesabilitarmodificacion').css('display', 'block');
    $('#btnabilitarmodificaciones').css('display', 'none');
    $('#input_tienda').prop('disabled', false);
    $('#input_departamento').prop('disabled', false);
    $('#input_zonamunicipio').prop('disabled', false);
    $('#input_palabraclave').prop('disabled', false);
    $('#input_calleminima').prop('disabled', false);
    $('#input_callemaxima').prop('disabled', false);
    $('#input_avenidaminima').prop('disabled', false);
    $('#input_avenidamaxima').prop('disabled', false);
    $('#input_kilometrominimo').prop('disabled', false);
    $('#input_kilometromaximo').prop('disabled', false);
    $('#input_minimo').prop('disabled', false);
    $('#input_garantia').prop('disabled', false);
    $('#intput_horalimite').prop('disabled', false);
    $('#input_comentario').prop('disabled', false);
    $('#input_servicio').prop('disabled', false);
    $('#input_tiempo').prop('disabled', false);
    $('#input_rango').prop('disabled', false);
})

$('#btndesabilitarmodificacion').on('click', ()  => {
    $('#input_tienda').removeClass('border-danger')
    $('#input_departamento').removeClass('border-danger')
    $('#input_zonamunicipio').removeClass('border-danger')
    $('#input_palabraclave').removeClass('border-danger')
    $('#input_minimo').removeClass('border-danger')
    $('#input_garantia').removeClass('border-danger')
    $('#input_tiempo').removeClass('border-danger')
    $('#btnguardarmodificaciones').css('display', 'none');
    $('#btndesabilitarmodificacion').css('display', 'none');
    $('#btnabilitarmodificaciones').css('display', 'block');
    $('#input_tienda').prop('disabled', true);
    $('#input_departamento').prop('disabled', true);
    $('#input_zonamunicipio').prop('disabled', true);
    $('#input_palabraclave').prop('disabled', true);
    $('#input_calleminima').prop('disabled', true);
    $('#input_callemaxima').prop('disabled', true);
    $('#input_avenidaminima').prop('disabled', true);
    $('#input_avenidamaxima').prop('disabled', true);
    $('#input_kilometrominimo').prop('disabled', true);
    $('#input_kilometromaximo').prop('disabled', true);
    $('#input_minimo').prop('disabled', true);
    $('#input_garantia').prop('disabled', true);
    $('#intput_horalimite').prop('disabled', true);
    $('#input_comentario').prop('disabled', true);
    $('#input_servicio').prop('disabled', true);
    $('#input_tiempo').prop('disabled', true);
    $('#input_rango').prop('disabled', true);
});

$('#btnguardarmodificaciones').on('click', () => {
    $('#input_tienda').removeClass('border-danger')
    $('#input_departamento').removeClass('border-danger')
    $('#input_zonamunicipio').removeClass('border-danger')
    $('#input_palabraclave').removeClass('border-danger')
    if($('#input_tienda').val() && $('#input_departamento').val() && $('#input_zonamunicipio').val() &&
        $('#input_palabraclave').val() && $('#input_rango').val()){
            $.ajax({
                url: '/upd_sectorizacion_modificacion',
                timeout: 15000,
                method: 'post',
                data: {
                    Id: $('#btnguardarmodificaciones').val(),
                    tienda: $('#input_tienda').val(),
                    departamento: $('#input_departamento').val(),
                    zonamunicipio: $('#input_zonamunicipio').val(),
                    palabraclave: $('#input_palabraclave').val(),
                    rango: $('#input_rango').val(),
                    calleminima: $('#input_calleminima').val(),
                    callemaxima: $('#input_callemaxima').val(),
                    avenidaminima: $('#input_avenidaminima').val(),
                    avenidamaxima: $('#input_avenidamaxima').val(),
                    kilometrominimo: $('#input_kilometrominimo').val(),
                    kilometromaximo: $('#input_kilometromaximo').val(),
                    minimo: $('#input_minimo').val(),
                    garantia: $('#input_garantia').val(),
                    horalimite: $('#intput_horalimite').val(),
                    tiempo: $('#input_tiempo').val(),
                    comentario: $('#input_comentario').val(),
                    servicio: $('#input_servicio').val()
                },
                success: (data) => {
                    $('#exampleModal').modal('hide')
                    switch(Number(data.__error)){
                        case 1:
                            MN_VS_2('Error!!', 'bg-danger', 'Error al conectarse a la base de datos')
                            break;
                        case 2:
                            MN_VS_2('Error!!', 'bg-warning', 'No se encontro el ID de la sectorización a modificar')
                            break;
                        case 0:
                            MN_VS_2('Actualizado', 'bg-success', `Se actualizo la sectorización: ${$('#btnguardarmodificaciones').val()}`)
                            break;
                    }
                }
            });
    }else{
        if(!$('#input_tienda').val()){
            $('#input_tienda').addClass('border-danger')
        }
        if(!$('#input_departamento').val()){
            $('#input_departamento').addClass('border-danger')
        }
        if(!$('#input_zonamunicipio').val()){
            $('#input_zonamunicipio').addClass('border-danger')
        }
        if(!$('#input_palabraclave').val()){
            $('#input_palabraclave').addClass('border-danger')
        }
        if(!$('#input_rango').val()){
            $('#input_rango').addClass('border-danger')
        }
        MN_VS_2('Error!!', 'bg-danger', 'Llena los campos que son obligatorios')
    }
});

$('#btn_Vaciar').on('click',() => {
    $('#getpalabraclave').val('')
    $('#getcalle').val('')
    $('#getavenida').val('')
    $('#getkilometro').val('')
    $('#getdepartamento').val('')
    $('#getzonamunicipio').val('')
    $('#tbl_body').html('')
})

$('#btn_registrar_1').on('click', () => {
    $('#exampleModal').modal('show')
    $('#btnregistraruno').css('display', 'block')
    $('#btncancelarregistraruno').css('display', 'block')
    $('#btndesabilitarmodificacion').css('display', 'none')
    $('#btnabilitarmodificaciones').css('display', 'none')
    $('#btnguardarmodificaciones').css('display', 'none')
    $('#exampleModalLabel').html(`Registrar una nueva sectorización`)
    $('#bodalbody').html(HTML_Registrar_1)
    $('#selectTienda').append(`<option value="0">-- Seleccione una Tienda --</option> `);
    $(JSON.parse(localStorage.getItem('Tiendas'))).each((i,e)=>{
        $('#selectTienda').append(`<option value="${e.CodigoTienda}">${e.CodigoTienda} ${e.Tienda}</option>`);
    })
});

$('#btnregistraruno').on('click', () => {
    $('#input_tienda').removeClass('border-danger')
    $('#input_departamento').removeClass('border-danger')
    $('#input_zonamunicipio').removeClass('border-danger')
    $('#input_palabraclave').removeClass('border-danger')
    if($('#selectTienda').val() != 0 && $('#input_departamento').val() && $('#input_zonamunicipio').val() &&
        $('#input_palabraclave').val() && $('#input_rango').val()){
            $.ajax({
                url: '/ins_nuevasectorizacion_uno',
                timeout: 15000,
                method: 'POST',
                data: {
                    tienda: $('#selectTienda').find(`option[value="${$('#selectTienda').val()}"]`).html(),
                    departamento: $('#input_departamento').val(),
                    zonamunicipio: $('#input_zonamunicipio').val(),
                    palabraclave: $('#input_palabraclave').val(),
                    rango: $('#input_rango').val(),
                    calleminima: $('#input_calleminima').val(),
                    callemaxima: $('#input_callemaxima').val(),
                    avenidaminima: $('#input_avenidaminima').val(),
                    avenidamaxima: $('#input_avenidamaxima').val(),
                    kilometrominimo: $('#input_kilometrominimo').val(),
                    kilometromaximo: $('#input_kilometromaximo').val(),
                    minimo: $('#input_minimo').val(),
                    garantia: $('#input_garantia').val(),
                    horalimite: $('#intput_horalimite').val(),
                    tiempo: $('#input_tiempo').val(),
                    comentario: $('#input_comentario').val(),
                    servicio: $('#input_servicio').val()
                },
                success: (data) => {
                    $('#exampleModal').modal('hide')
                    switch(Number(data.__error)){
                        case 1:
                            MN_VS_2('Error!', 'bg-danger', 'Error en la conexion a la base de datos') 
                        break;
                        case 2: 
                            MN_VS_2('Problemas', 'bg-warning', 'No se pudo registrar la dirrecion')
                        break;
                        case 0: 
                            MN_VS_2('Exito!!', 'bg-success', `Se registro la sectorizacion con id: ${data.datos.Id}`)
                        break;
                    }
                }
            });
    }else{
        if(!$('#input_tienda').val()){
            $('#input_tienda').addClass('border-danger')
        }
        if(!$('#input_departamento').val()){
            $('#input_departamento').addClass('border-danger')
        }
        if(!$('#input_zonamunicipio').val()){
            $('#input_zonamunicipio').addClass('border-danger')
        }
        if(!$('#input_palabraclave').val()){
            $('#input_palabraclave').addClass('border-danger')
        }
        if(!$('#input_rango').val()){
            $('#input_rango').addClass('border-danger')
        }
        MN_VS_2('Error!!', 'bg-danger', 'Llena los campos que son obligatorios')
    }
});