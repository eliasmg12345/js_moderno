//============VARIABLES================
const btnEnviar = document.querySelector('#enviar');
const btnReset = document.querySelector('#resetBtn');
const formulario = document.querySelector('#enviar-mail');
//variables para campos
const email = document.querySelector('#email');
const er = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const asunto = document.querySelector('#asunto');
const mensaje = document.querySelector('#mensaje');




eventListener();
function eventListener() {
    //cuando la pp arranca
    document.addEventListener('DOMContentLoaded', iniciarApp);

    //campos del formulario
    email.addEventListener('blur', validarFormulario);
    asunto.addEventListener('blur', validarFormulario);
    mensaje.addEventListener('blur', validarFormulario);

    //reinicia el formulario
    btnReset.addEventListener('click', resetarFormulario);

    //enviar email
    formulario.addEventListener('submit', enviarEmail);
}






//============FUNCIONES================
function iniciarApp() {
    btnEnviar.disabled = true;
    btnEnviar.classList.add('cursor-not-allowed', 'opacity-50');
}

// valdia el formualario
function validarFormulario(e) {

    if (e.target.value.length > 0) {
        //elimina los errores
        const error = document.querySelector('p.error');
        if (error) {
            error.remove();
        }


        e.target.classList.remove('border', 'border-red-500');
        e.target.classList.add('border', 'border-green-500');
    } else {
        e.target.classList.remove('border', 'border-green-500');
        e.target.classList.add('border', 'border-red-500');
        mostrarError('todos los campos son obligatorios');
    }

    if (e.target.type === 'email') {


        if (er.test(e.target.value)) {
            //elimina los errores
            const error = document.querySelector('p.error');
            if (error) {
                error.remove();
            }

            e.target.classList.remove('border', 'border-red-500');
            e.target.classList.add('border', 'border-green-500');
        } else {
            e.target.classList.remove('border', 'border-green-500');
            e.target.classList.add('border', 'border-red-500');
            mostrarError('email no valido');
        }
    }


    if (er.test(email.value) && asunto.value !== '' && mensaje.value !== '') {

        btnEnviar.disabled = false;
        btnEnviar.classList.remove('cursor-not-allowed', 'opacity-50');
    }
}

function mostrarError(mensaje) {
    const mensajeError = document.createElement('p');
    mensajeError.textContent = mensaje;
    mensajeError.classList.add('border', 'border-red-500', 'background-red-100', 'text-red-500', 'p-3', 'mt-5', 'text-center',
        'error');

    const errores = document.querySelectorAll('.error');
    if (errores.length === 0) {
        formulario.appendChild(mensajeError);

    }


}


//envia el email
function enviarEmail(e) {
    e.preventDefault();

    //mostrar el spiner
    const spinner = document.querySelector('#spinner');
    spinner.style.display = 'flex';


    //mensaje de fconfirmacion
    const parrafo = document.createElement('p');
    parrafo.textContent = 'el mensaje se envio correctamente';
    parrafo.classList.add('text-center', 'my-10', 'p-2', 'bg-green-500', 'text-white', 'font-bold', 'uppercase')



    //despues de tres ssegundo oculatar el spinner y mostar el mensaje
    setTimeout(() => {
        spinner.style.display = 'none';

        //inserta el parrafo antes del spinner
        //document.querySelector('#loaders').appendChild(parrafo);
        formulario.insertBefore(parrafo, spinner);
        iniciarApp();
        setTimeout(() => {
            parrafo.remove(); //elñiminar el mensaje de exito

            formulario.reset();

        }, 5000);
    }, 3000);
}

//funcion que resetea el formulariop

function resetarFormulario(e) {
    formulario.reset();
    e.preventDefault();
}