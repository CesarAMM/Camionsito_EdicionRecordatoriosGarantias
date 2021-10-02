$('#formLogin').on('submit', (e) => {
    e.preventDefault();
    $('#status').html('');
    $.ajax({
        url: '/login',
        method: 'POST',
        timeout: 10000,
        data: {
            usuario: $('#txt_usuario').val(),
            contrasena: $('#txt_password').val()
        },
        success: (status) => {
            if (status == 0) {
                $('#status').prepend(`<h6 class="text-danger">Usuario y contraseña incorrectos</h6>`);
                $('#txt_usuario').addClass('border-danger');
                $('#txt_password').addClass('border-danger');
            } else if (status == 2) {
                this.location.href = '/Recordatorios'
            }else if(status == 1){
                $('#status').prepend(`<h6 class="text-danger">No cuentas con permiso para ingresar</h6>`);
            }
        }
    }).fail((Descripcion) => {
        $('#status').prepend(`<h6 class="text-danger">Hubo un problema con la conexion, intenta de nuevo</h6>`);
    });
});