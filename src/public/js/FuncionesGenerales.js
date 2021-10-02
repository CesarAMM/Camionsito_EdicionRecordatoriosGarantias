function ConvertJsonToXLSX(json, Nombre_Hoja, Title, Subject) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title,
        Subject
    }
    wb.SheetNames.push(Nombre_Hoja);
    var ws = XLSX.utils.json_to_sheet(json);
    wb.Sheets[Nombre_Hoja] = ws;

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'binary'
    });

    return wbout;
}

//Tabla a XLSX
function ConvertTableToXLSX(Table, Nombre_Hoja, Title, Subject) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title,
        Subject
    }
    wb.SheetNames.push(Nombre_Hoja);
    var ws = XLSX.utils.table_to_sheet(Table);
    wb.Sheets[Nombre_Hoja] = ws;

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'binary'
    });

    return wbout;
}

function ConvertTableToXLSX_vs_2(encabezado, faltantes, Title, Subject) {
    var wb = XLSX.utils.book_new();
    wb.Props = {
        Title,
        Subject
    }
    wb.SheetNames.push('Recordatorios Encabezado');
    var ws = XLSX.utils.table_to_sheet(encabezado);
    wb.Sheets['Recordatorios Encabezado'] = ws;

    wb.SheetNames.push('Recordatorios Faltantes');
    var ws2 = XLSX.utils.table_to_sheet(faltantes);
    wb.Sheets['Recordatorios Faltantes'] = ws2;

    var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        type: 'binary'
    });

    return wbout;
}

//Funcion para descargar
function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
    return buf;
}

function DescargarXLSX(TituloHoja, datos) {
    saveAs(new Blob([s2ab(datos)], {
        type: "application/octet-stream"
    }), TituloHoja + '.xlsx');
}


function VerFechaReal(fecha_Hora) {
    var tempFecha = new Date(fecha_Hora);
    tempFecha = tempFecha.setSeconds(21600)
    tempFecha = new Date(tempFecha);
    var dia, mes, año, minute;
    dia = tempFecha.getDate();
    mes = tempFecha.getMonth() + 1;
    año = tempFecha.getFullYear();
    minute = tempFecha.getMinutes();
    if (dia < 10) {
        dia = '0' + dia;
    }
    if (mes < 10) {
        mes = '0' + mes;
    }
    if (minute < 10) {
        minute = '0' + minute
    }
    return dia + '-' + mes + '-' + año + ' ' + tempFecha.getHours() + ':' + minute;
}


//Mostrar Notificaciones nueva version 2
async function MN_VS_2(title, color, commit){
    await $('#NotificacionesRecordatorios').html(`
    <div role="alert" aria-live="polite" aria-atomic="true" class="toast" id="notificacion" data-bs-delay="3000">
        <div class="toast-header text-light ${color}">
            <strong class="me-auto">${title}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body bg-white">
            ${commit}
        </div>
    </div>
    `);
    await $('.toast').toast('show');
}
