$(document).ready(()=>{
    $.ajax({
        url: '/getTiendas',
        timeout: 15000,
        method: 'get',
        success: (data) => {
            $(data).each((i, e) => {
                $('#getTienda').append(`
                    <option value='${e.Codigo}'>${e.Tienda}</option>
                `);
            })
        }
    })
})

let basematriz = [];
$('#my_file_input').change((e) => {
    $('#tablebodygarantias').html('')
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
                var cell = hoja[XLSX.utils.encode_cell({
                    c: column,
                    r: row
                })]
                var hdr = '';
                if (cell && cell.t) {
                    hdr = XLSX.utils.format_cell(cell);
                }
                temp.push(hdr);
            }
            informacion.push(temp);
        }
        $(informacion).each((i, e) => {
            basematriz.push({
                Id: e[0],
                Tienda: e[1],
                Departamento: e[2],
                ZonaMunicipio: e[3],
                Rango: e[4],
                PalabraClave: e[5],
                CalleMinima: e[6],
                CalleMaxima: e[7],
                AvenidaMinima: e[8],
                AvenidaMaxima: e[9],
                KilometroMinimo: e[10],
                KilometroMaximo: e[11],
                Minimo: e[12],
                Garantia: e[13],
                Tiempo: e[14],
                HoraLimite: e[15],
                Comentarios: e[16],
                Servicio: e[17]
            })
        })
        $(basematriz).each((i,e) => {
            $('#tablebodygarantias').append(`
                <tr>
                    <td class='classId'>${e.Id}</td>
                    <td class="classTienda">${e.Tienda}</td>
                    <td class="classDepartamento">${e.Departamento}</td>
                    <td class="classZonaMunicipio">${e.ZonaMunicipio}</td>
                    <td class="classRango">${e.Rango}</td>
                    <td class="classPalabraClave">${e.PalabraClave}</td>
                    <td class="classCalleMinima">${e.CalleMinima}</td>
                    <td class='classCalleMaxima'>${e.CalleMaxima}</td>
                    <td class="classAvenidaMinima">${e.AvenidaMinima}</td>
                    <td class="classAvenidaMaxima">${e.AvenidaMaxima}</td>
                    <td class="classKilometroMinimo">${e.KilometroMinimo}</td>
                    <td class="classKilometroMaximo">${e.KilometroMaximo}</td>
                    <td class="classMinimo">${e.Minimo}</td>
                    <td class="classGarantia">${e.Garantia}</td>
                    <td class="classTiempo">${e.Tiempo}</td>
                    <td class="classHoraLimite">${e.HoraLimite}</td>
                    <td class="classComentarios">${e.Comentarios}</td>
                    <td class="classServicio">${e.Servicio}</td>
                </tr>`)
        })
        $('#btnPreSave').prop('disabled', false)
    }
});


function VerBaseDatosMatriz(){
    $('#tablebodygarantias').html('')
    if($('#getTienda').val != 0){
        $.ajax({
            url: '/ObtenerSectorizacionPortienda',
            timeout: 15000,
            method: 'post',
            data: {
                Tienda: $('#getTienda').val()
            },
            success: (data) => {
                $('#btnDescarga').val(data[0].Tienda)
                $(data).each((i, e) => {
                    $('#tablebodygarantias').append(`
                        <tr>
                            <td>${e.ID}</td>
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
                            <td>${e.Comentarios}</td>
                            <td>${e.Sector_Sin_Servicio}</td>
                        </tr>
                    `);
                })
                MN_VS_2('Listo', 'bg-success', 'Un total de: '+data.length +' resultados')
            }
        });
    }else {
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda para la descarga')
    }
}


$('#btnPreSave').on('click', () => {
    $.ajax({
        url: '/CargaDatos_Step_1',
        method: 'post',
        timeout: 15000,
        data: {
            Base: basematriz
        },
        success: (data) => {
            console.log(data.yes)
            console.log(data.not)
            let msj = 'Se actualizaron: '+ data.yes+', se crearon: '+data.not;
            MN_VS_2('Carga Exitosa', 'bg-success', msj)
            $('#tablebodygarantias').html('')
        }
    })
})

$('#btnDescarga').on('click', ()=> {
    if($('#getTienda').val()){
        let data = document.getElementById('VistaTabla');
        let Datos = ConvertTableToXLSX(data, 'Reporte', 'Reporte_2', 'Reporte_3');
        DescargarXLSX($('#btnDescarga').val(), Datos)
    }else{
        MN_VS_2('Error!!', 'bg-danger', 'Seleccione una tienda')
    }
});