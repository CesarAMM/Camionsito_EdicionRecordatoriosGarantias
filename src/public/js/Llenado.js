$(document).ready(()=>{
    const tiendas = JSON.parse(localStorage.getItem('Tiendas'))
    $(tiendas).each((i, e) => {
        $('#getTienda').append(`
            <option value='${e.CodigoTienda}'>${e.CodigoTienda} ${e.Tienda}</option>
        `);
    })
})

//! Carga de archivo: Tomar en cuenta que solo puede hacer un archivo con el formato xlsx
//TODO: Toma la hoja de excel y separa los datos para poderlos motrar en una tabla HTML
$('#my_file_input').on('change',(e) => {
    let htmltabla ='';
    var reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    reader.onload = async (e) => {
        var data = new Uint8Array(reader.result);
        var wbArray = XLSX.read(data, {
            type: 'array',
            cellStyles: true
        });
        var informacion = [];
        var nombreHoja = wbArray.SheetNames[0];
        var hoja = wbArray.Sheets[nombreHoja];
        var range = XLSX.utils.decode_range(hoja['!ref'])
        var column, row, temp = [];
        for (row = range.s.r + 1; row <= range.e.r; ++row) {
            temp = [];
            for (column = range.s.c; column <= range.e.c; ++column) {
                var cell = hoja[XLSX.utils.encode_cell({ c: column, r: row})]
                var hdr = '';
                if (cell && cell.t) {
                    hdr = XLSX.utils.format_cell(cell);
                }
                temp.push(hdr);
            }
            informacion.push(temp);
        }
        $(informacion).each((index, elemento) => {
            htmltabla += `
            <tr>
                <td class='classId'>${elemento[0]}</td>
                <td class="classTienda">${elemento[1]}</td>
                <td class="classDepartamento">${elemento[2]}</td>
                <td class="classZonaMunicipio">${elemento[3]}</td>
                <td class="classRango">${elemento[4]}</td>
                <td class="classPalabraClave">${elemento[5]}</td>
                <td class="classCalleMinima">${elemento[6]}</td>
                <td class='classCalleMaxima'>${elemento[7]}</td>
                <td class="classAvenidaMinima">${elemento[8]}</td>
                <td class="classAvenidaMaxima">${elemento[9]}</td>
                <td class="classKilometroMinimo">${elemento[10]}</td>
                <td class="classKilometroMaximo">${elemento[11]}</td>
                <td class="classMinimo">${elemento[12]}</td>
                <td class="classGarantia">${elemento[13]}</td>
                <td class="classTiempo">${elemento[14]}</td>
                <td class="classHoraLimite">${elemento[15]}</td>
                <td class="classComentarios">${elemento[16]}</td>
                <td class="classServicio">${elemento[17]}</td>
            </tr>
            `
        })
        $('#tablebodygarantias').html(htmltabla)
        $('#btnPreSave').prop('disabled', false)
    }
});


$('#btnPreSave').on('click', async () => {
    let dataset = await [];
    $('#tablebodygarantias > tr').each((i, e) => {
        dataset.push({
            Id: $(e).find('.classId').html() === '' ? 0 : Number($(e).find('.classId').html()),
            Tienda: $(e).find('.classTienda').html(),
            Departamento: $(e).find('.classDepartamento').html(),
            Zona_Municipio: $(e).find('.classZonaMunicipio').html(),
            Rango: $(e).find('.classRango').html(),
            Palabra_Clave: $(e).find('.classPalabraClave').html(),
            Calle_Minima: $(e).find('.classCalleMinima').html() === '' ? 0 : Number($(e).find('.classCalleMinima').html()),
            Calle_Maxima: $(e).find('.classCalleMaxima').html() === '' ? 0 : Number($(e).find('.classCalleMaxima').html()),
            Avenida_Minima: $(e).find('.classAvenidaMinima').html() === '' ? 0 : Number($(e).find('.classAvenidaMinima').html()),
            Avenida_Maxima: $(e).find('.classAvenidaMaxima').html() === '' ? 0 : Number($(e).find('.classAvenidaMaxima').html()),
            Kilometro_Minimo: $(e).find('.classKilometroMinimo').html() === '' ? 0 : parseFloat($(e).find('.classKilometroMinimo').html()),
            Kilometro_Maximo: $(e).find('.classKilometroMaximo').html() === '' ? 0 : parseFloat($(e).find('.classKilometroMaximo').html()),
            Minimo: $(e).find('.classMinimo').html(),
            Garantia: $(e).find('.classGarantia').html(),
            Tiempo: $(e).find('.classTiempo').html(),
            Hora_Limite: $(e).find('.classHoraLimite').html(),
            Comentario: $(e).find('.classComentarios').html(),
            Servicio: $(e).find('.classServicio').html()
        })
    })
    $.ajax({
        url: '/CargaSectorizacionCamioncito',
        timeout: 15000,
        method: 'POST',
        data: {DataSet: dataset},
        success: (data) => {
            switch(Number(data.__error)){
                case 0:
                    $('#tablebodygarantias').html('')
                    MN_VS_2('Carga con Exito!', 'bg-success', `Se crearon: ${data.Nuevo} y se Actualizaron: ${data.Actualizacion}`)
                    break;
                case 1:
                    MN_VS_2('Error!!', 'bg-danger', `Problema en la carga. Verifique si se cargaron los datos`)
                    break;
            }
        }
    })
})

$('#getTienda').on('change', () => {
    $('#tablebodygarantias').html('')
    console.log($('#getTienda').val());
    if($('#getTienda').val != 0){
        $.ajax({
            url: '/ObtenerSectorizacionPortienda',
            timeout: 15000,
            method: 'post',
            data: {
                Tienda: $('#getTienda').val()
            },
            success: (data) => {
                $(data.Datos).each((i, e) => {
                    $('#tablebodygarantias').append(`
                        <tr>
                            <td>${e.Id}</td>
                            <td>${e.Tienda}</td>
                            <td>${e.Departamento}</td>
                            <td>${e.Zona_Municipio}</td>
                            <td>${e.Rango}</td>
                            <td>${e.Palabra_Clave}</td>
                            <td>${e.Calle_Minima}</td>
                            <td>${e.Calle_Maxima}</td>
                            <td>${e.Avenida_Minima}</td>
                            <td>${e.Avenida_Maxima}</td>
                            <td>${e.Kilometro_Minimo}</td>
                            <td>${e.Kilometro_Maximo}</td>
                            <td>${e.Minimo}</td>
                            <td>${e.Garantia}</td>
                            <td>${e.Tiempo}</td>
                            <td>${e.Hora_Limite}</td>
                            <td>${e.Cometario}</td>
                            <td>${e.Sector_Sin_Servicio}</td>
                        </tr>
                    `);
                })
                MN_VS_2('Listo', 'bg-success', 'Un total de: '+data.Datos.length +' resultados')
            }
        });
    }else {
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para la descarga')
    }
})

$('#btnDescarga').on('click', ()=> {
    if($('#getTienda').val()){
        let data = document.getElementById('TablaGeneral');
        let Datos = ConvertTableToXLSX(data, 'Reporte', 'Reporte_2', 'Reporte_3');
        DescargarXLSX('Sectorizacion', Datos)
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda')
    }
});