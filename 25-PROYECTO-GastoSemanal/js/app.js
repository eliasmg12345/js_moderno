//VARIALBES Y SELECTORES

const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


//eventos
eventListenners();
function eventListenners() {
    document.addEventListener('DOMContentLoaded', perguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}


//classes
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado=this.gastos.reduce((total,gasto)=>total+gasto.cantidad,0);
        this.restante=this.presupuesto-gastado;
    }
    eliminarGasto(id){
        this.gastos=this.gastos.filter(gasto=>gasto.id!==id);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        //extrayendo el valor 
        const { presupuesto, restante } = cantidad;

        //agregando al html 
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        //crear el div 
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        //mensaje de error
        divMensaje.textContent = mensaje;

        //insertar en elhtml
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        //quitar del html
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGastos(gastos) {

        this.limpiarHTML();   //elimina elhtml previo

        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const { cantidad, nombre, id } = gasto;

            //crear un LI
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;   //estanmos añadiendo "data-id=id" al li en el html
            

            //agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary basge-pill"> $ ${cantidad}</span>`;
            
            //boton para borrar el gasto
            const btnBorrar=document.createElement('button');
            btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
            btnBorrar.innerHTML='Borrar &times';
            btnBorrar.onclick=()=>{
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            //agregar al html
            gastoListado.appendChild(nuevoGasto);
        });
    }

    limpiarHTML(){
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante}=presupuestoObj;

        const restanteDiv=document.querySelector('.restante');

        //comprobar 25%
        if ( (presupuesto/4)>restante ) {
            restanteDiv.classList.remove('alert-success','alert-warning');
            restanteDiv.classList.add('alert-danger');
        }else if ((presupuesto/2)>restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else{
            restanteDiv.classList.remove('alert-danger','alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        //si el total es 0 o menor
        if (restante<=0) {
            ui.imprimirAlerta('El presupuesto se ha agotado','error');
            formulario.querySelector('button[type="submit"]').disabled=true;
        }else{
            formulario.querySelector('button[type="submit"]').disabled=false;
        }
    }
}

//Instanciar
const ui = new UI();
let presupuesto;

//funciones
function perguntarPresupuesto() {
    const presupuestousuario = prompt('¿cual es tu presupeuto');

    //console.log(Number(presupuestousuario));
    if (presupuestousuario === '' || presupuestousuario === null || isNaN(presupuestousuario) || presupuestousuario < 0) {
        window.location.reload();
    }
    //Presupuesto Valido
    presupuesto = new Presupuesto(presupuestousuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

function agregarGasto(e) {
    e.preventDefault();

    //leerlos datos del ofrmilario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //validar
    if (nombre === '' || cantidad === '') {
        console.log('ambosson aolbig');
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad No Valida', 'error')

        return;
    }
    //Generar un objeto con elgasto
    const gasto = { nombre, cantidad, id: Date.now() };

    //añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    //mensaje de todo bien
    ui.imprimirAlerta('Gasto Agregado Correctamente');

    //imprimir los gastos
    const { gastos , restante} = presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reinicia el formulario
    formulario.reset();

}

function eliminarGasto(id) {
    //elimina del objeto
    presupuesto.eliminarGasto(id);

    //elimina de la clase
    const {gastos, restante}=presupuesto;
    ui.mostrarGastos(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}
