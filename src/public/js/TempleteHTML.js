//Variables con html
const HTML_CrearTienda = `
<div class="row">
<div class="col-12">
    <p>
        Para poder crear una nueva tienda primero debes de cargar la sectorización de la tienda,
        de lo contrario no vas a encontrar la tienda en el listado
    </p>
</div>
</div>
<hr>
<div class="row">
<div class="col-12">
    <small>Selecciona la Tienda</small>
    <input type="text" class="form-control form-control-sm" id="idtiendanueva">
</div>
</div>
<div class="row">
<div class="col-12">
    <p>Recuerda que tiene que ir en formato de 24hrs.</p>
</div>
<div class="col-12">
    <small>Lunes</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control form-control-sm" id="inputaperturalunes">
        <div class="input-group-prepend">
            <small class="input-group-text">A</small>
        </div>
        <input type="text" placeholder="Cierre" class="form-control form-control-sm" id="inputcierrelunes">
    </div>
</div>
<div class="col-12">
    <small>Martes</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control form-control-sm" id="inputaperturamartes">
        <div class="input-group-prepend">
            <small class="input-group-text">A</small>
        </div>
        <input type="text" placeholder="Cierre" class="form-control form-control-sm" id="inputcierremartes">
    </div>
</div>
<div class="col-12">
    <small>Miercoles</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control form-control-sm" id="inputaperturamiercoles">
        <div class="input-group-prepend">
            <small class="input-group-text">A</small>
        </div>
        <input type="text" placeholder="Cierre" class="form-control form-control-sm" id="inputcierremiercoles">
    </div>
</div>
<div class="col-12">
    <small>Jueves</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control form-control-sm" id="inputaperturajueves">
        <div class="input-group-prepend">
            <small class="input-group-text">A</small>
        </div>
        <input type="text" placeholder="Cierre" class="form-control form-control-sm" id="inputcierrejueves">
    </div>
</div>
<div class="col-12">
    <small>Viernes</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control form-control-sm" id="inputaperturaviernes">
        <div class="input-group-prepend">
            <small class="input-group-text">A</small>
        </div>
        <input type="text" placeholder="Cierre" class="form-control form-control-sm" id="inputcierreviernes">
    </div>
</div>
<div class="col-12">
    <small>Sabado</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control form-control-sm" id="inputaperturasabado">
        <div class="input-group-prepend">
            <small class="input-group-text">A</small>
        </div>
        <input type="text" placeholder="Cierre" class="form-control form-control-sm" id="inputcierresabado">
    </div>
</div>
<div class="col-12">
    <small>Domingp</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control form-control-sm" id="inputaperturadomingo">
        <div class="input-group-prepend">
            <small class="input-group-text">A</small>
        </div>
        <input type="text" placeholder="Cierre" class="form-control form-control-sm" id="inputcierredomingo">
    </div>
</div>
</div>
</div>
`
const HTML_Restauacion =`
<div class="row">
<div class="col-12">
    <p>
        ¿Seguro que quieres restaurar los recordatorios?
    </p>
</div>
`
const HTML_HorariosTienda = `
<div class="row">
<div class="col-12">
    <small>Lunes</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control" id="inputaperturalunes" disabled>
        <div class="input-group-prepend">
            <span class="input-group-text">A</span>
        </div>
        <input type="text" placeholder="Cierre" class="form-control" id="inputcierrelunes" disabled>
    </div>
</div>
<div class="col-12">
    <small>Martes</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control" id="inputaperturamartes" disabled>
        <div class="input-group-prepend">
            <span class="input-group-text">A</span>
        </div>
        <input type="text" placeholder="Cierre" class="form-control" id="inputcierremartes" disabled>
    </div>
</div>
<div class="col-12">
    <small>Miercoles</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control" id="inputaperturamiercoles" disabled>
        <div class="input-group-prepend">
            <span class="input-group-text">A</span>
        </div>
        <input type="text" placeholder="Cierre" class="form-control" id="inputcierremiercoles" disabled>
    </div>
</div>
<div class="col-12">
    <small>Jueves</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control" id="inputaperturajueves" disabled>
        <div class="input-group-prepend">
            <span class="input-group-text">A</span>
        </div>
        <input type="text" placeholder="Cierre" class="form-control" id="inputcierrejueves" disabled>
    </div>
</div>
<div class="col-12">
    <small>Viernes</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control" id="inputaperturaviernes" disabled>
        <div class="input-group-prepend">
            <span class="input-group-text">A</span>
        </div>
        <input type="text" placeholder="Cierre" class="form-control" id="inputcierreviernes" disabled>
    </div>
</div>
<div class="col-12">
    <small>Sabado</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control" id="inputaperturasabado" disabled>
        <div class="input-group-prepend">
            <span class="input-group-text">A</span>
        </div>
        <input type="text" placeholder="Cierre" class="form-control" id="inputcierresabado" disabled>
    </div>
</div>
<div class="col-12">
    <small>Domingp</small>
    <div class="input-group mb-3">
        <input type="text" placeholder="Apertura" class="form-control" id="inputaperturadomingo" disabled>
        <div class="input-group-prepend">
            <span class="input-group-text">A</span>
        </div>
        <input type="text" placeholder="Cierre" class="form-control" id="inputcierredomingo" disabled>
    </div>
</div>
</div>
`

const HTML_ModificacionTiempos = `
    <div class="row">
        <div class="col-6">
            <small>Seleccione Tiempo</small>
            <select class="form-control" id="input_Modificaciontiempos">
            <option value="0">-- Seleccione --</option>
                <option value="1">Tiempos Normales</option>
                <option value="2">40 Minutos</option>
                <option value="3">45 Minutos</option>
                <option value="4">50 Minutos</option>
                <option value="5">1 Hora</option>
                <option value="6">1 Hora y 15 Minutos</option>
                <option value="7">1 Hora y 30 Minutos</option>
                <option value="8">Baja</option>
            </select>
        </div>
        <div class="col-6">
            <small>Indique el Motivo de los Tiempos</small>
            <input class="form-control" id="input_modificacionmotivotiempos">
        </div>
    </div>
`
const HTML_Edicion = `
<main>
    <div class="row">
        <div class="col-xl-4">
            <small>Tienda</small>
            <input type="text" class="form-control form-control-sm" id="input_tienda" disabled>
        </div>
        <div class="col-xl-4">
            <small>Departamento</small>
            <input type="text" class="form-control form-control-sm" id="input_departamento"  disabled>
        </div>
        <div class="col-xl-4">
            <small>Zona o Municipio</small>
            <input type="text" class="form-control form-control-sm" id="input_zonamunicipio"  disabled>
        </div>
    </div>
    <div class="row">
        <div class="col-xl-6">
            <small>Rango</small>
            <textarea id="input_rango" cols="30" rows="3" class="form-control"  disabled></textarea>
        </div>
        <div class="col-xl-6">
            <small>Palabra Clave</small>
            <textarea id="input_palabraclave" cols="30" rows="3" class="form-control" disabled></textarea>
        </div>
    </div>
    <div class="row">
        <div class="col-2">
            <small>Calle Minima</small>
            <input type="number" class="form-control form-control-sm" id="input_calleminima" disabled>
        </div>
        <div class="col-2">
            <small>Calle Maxima</small>
            <input type="number" class="form-control form-control-sm" id="input_callemaxima" disabled>
        </div>
        <div class="col-2">
            <small>Avenida Minima</small>
            <input type="number" class="form-control form-control-sm" id="input_avenidaminima" disabled>
        </div>
        <div class="col-2">
            <small>Avenida Maxima</small>
            <input type="number" class="form-control form-control-sm" id="input_avenidamaxima" disabled>
        </div>
        <div class="col-2">
            <small>Kilometro Minimo</small>
            <input type="number" class="form-control form-control-sm" id="input_kilometrominimo" disabled>
        </div>
        <div class="col-2">
            <small>kilometro Maximo</small>
            <input type="number" class="form-control form-control-sm" id="input_kilometromaximo" disabled>
        </div>
    </div>
    <div class="row">
        <div class="col-8">
            <small>Comentario</small>
            <textarea class="form-control" id="input_comentario" cols="30" rows="3" disabled></textarea>
        </div>
        <div class="col-xl-4">
            <div class="row">
                <div class="col-xl-4">
                    <small>Minimo</small>
                    <input type="text" class="form-control form-control-sm" id="input_minimo" disabled>
                </div>
                <div class="col-xl-4">
                    <small>Garantia</small>
                    <input type="text" class="form-control form-control-sm" id="input_garantia" disabled>
                </div>
                <div class="col-xl-4">
                    <small>Tiempo</small>
                    <input type="text" class="form-control form-control-sm" id="input_tiempo" disabled>
                </div>
            </div>
            <div class="row">
                <div class="col-xl-6">
                    <small>Hora Limite</small>
                    <input type="text" class="form-control form-control-sm" id="intput_horalimite" disabled>
                </div>
                <div class="col-xl-6">
                    <small>Sector sin Serviio</small>
                    <input type="text" class="form-control form-control-sm" id="input_servicio" disabled>
                </div>
            </div>
        </div>
    </div>
</main>
`

const HTML_Registrar_1 = `
<main>
    <div class="row">
        <div class="col-12">
            <main>
                <div class="row">
                    <div class="col-xl-4">
                        <small>Tienda</small>
                        <select class="form-control fomr-control-sm" id="selectTienda"></select>
                    </div>
                    <div class="col-xl-4">
                        <small>Departamento</small>
                        <input type="text" class="form-control form-control-sm" id="input_departamento" >
                    </div>
                    <div class="col-xl-4">
                        <small>Zona o Municipio</small>
                        <input type="text" class="form-control form-control-sm" id="input_zonamunicipio" >
                    </div>
                </div>
                <div class="row">
                    <div class="col-xl-6">
                        <small>Rango</small>
                        <textarea id="input_rango" cols="30" rows="3" class="form-control"></textarea>
                    </div>
                    <div class="col-xl-6">
                        <small>Palabra Clave</small>
                        <textarea id="input_palabraclave" cols="30" rows="3" class="form-control"></textarea>
                    </div>
                </div>
                <div class="row">
                    <div class="col-2">
                        <small>Calle Minima</small>
                        <input type="number" class="form-control form-control-sm" id="input_calleminima">
                    </div>
                    <div class="col-2">
                        <small>Calle Maxima</small>
                        <input type="number" class="form-control form-control-sm" id="input_callemaxima" >
                    </div>
                    <div class="col-2">
                        <small>Avenida Minima</small>
                        <input type="number" class="form-control form-control-sm" id="input_avenidaminima" >
                    </div>
                    <div class="col-2">
                        <small>Avenida Maxima</small>
                        <input type="number" class="form-control form-control-sm" id="input_avenidamaxima" >
                    </div>
                    <div class="col-2">
                        <small>Kilometro Minimo</small>
                        <input type="number" class="form-control form-control-sm" id="input_kilometrominimo" >
                    </div>
                    <div class="col-2">
                        <small>kilometro Maximo</small>
                        <input type="number" class="form-control form-control-sm" id="input_kilometromaximo" >
                    </div>
                </div>
                <div class="row">
                    <div class="col-8">
                        <small>Comentario</small>
                        <textarea class="form-control" id="input_comentario" cols="30" rows="3" ></textarea>
                    </div>
                    <div class="col-xl-4">
                        <div class="row">
                            <div class="col-xl-4">
                                <small>Minimo</small>
                                <input type="text" class="form-control form-control-sm" id="input_minimo" >
                            </div>
                            <div class="col-xl-4">
                                <small>Garantia</small>
                                <input type="text" class="form-control form-control-sm" id="input_garantia" >
                            </div>
                            <div class="col-xl-4">
                                <small>Tiempo</small>
                                <input type="text" class="form-control form-control-sm" id="input_tiempo" >
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6">
                                <small>Hora Limite</small>
                                <input type="text" class="form-control form-control-sm" id="intput_horalimite" >
                            </div>
                            <div class="col-xl-6">
                                <small>Sector sin Serviio</small>
                                <input type="text" class="form-control form-control-sm" id="input_servicio" >
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    </div>
</main>
`