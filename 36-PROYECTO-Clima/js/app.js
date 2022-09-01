const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', () => {
    formulario.addEventListener('submit', buscarClima);
});

function buscarClima(e) {
    e.preventDefault();

    //validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;

    if (ciudad === '' || pais === '') {
        //hubo un error
        mosrtarError('Ambos campos son obligatorios');

        return
    }

    console.log(ciudad, pais);


    //Consultar la API
    consularAPI(ciudad, pais);

}


function mosrtarError(mensaje) {
    const alerta = document.querySelector('.bg-red-100');

    if (!alerta) {

        //crear una alerta
        const alerta = document.createElement('div');

        alerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');

        alerta.innerHTML = `
            <strong class="font-bold">Error</strong>
            <span class="block">${mensaje}</span>
        `;

        container.appendChild(alerta);

        //se elimine la alerta despues de 5 seg
        setTimeout(() => {
            alerta.remove();
        }, 2000);
    }

}
// 863fe975137cec337d7980b3fe2cb0eb

function consularAPI(ciudad, pais) {

    const appId = '863fe975137cec337d7980b3fe2cb0eb';

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`;

    Spinner(); //muestra un spinner de carga -----https://tobiasahlin.com/spinkit/

    fetch(url)
        .then(resp => resp.json())
        .then(datos => {
            limpiarHTML(); //limpiar el html previo

            if (datos.cod === '404') {
                mosrtarError('Ciudad No encontrada');
                return;
            }
            //imprijme la respeusta en un HTML
            mostrarClima(datos);
        })
}

function mostrarClima(datos) {
    const { name, main: { temp, temp_max, temp_min } } = datos;

    const centigrados = KelvinACentigrados(temp);
    const max = KelvinACentigrados(temp_max);
    const min = KelvinACentigrados(temp_min);

    const nombreCiudad = document.createElement('p');
    nombreCiudad.textContent = `Clima en ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl');

    const actual = document.createElement('p');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('p');
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('p');
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl');

    const resultadoDiv = document.createElement('div');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(nombreCiudad);
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);

    resultado.appendChild(resultadoDiv);

}

const KelvinACentigrados = grados => parseInt(grados - 273.15);


function limpiarHTML() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}

function Spinner() {
    limpiarHTML();

    const divSpinner = document.createElement('div');
    divSpinner.classList.add('spinner');

    divSpinner.innerHTML = `
        <div class="double-bounce1"></div>
        <div class="double-bounce2"></div>
    `;
    resultado.appendChild(divSpinner);

}