const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');

const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');


const objBusqueda={
    moneda:'',
    criptomoneda:'',
}

//crear un promise
const obtenerCriptomonedas= criptomonedas => new Promise(resolve=>{
    resolve(criptomonedas);
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit',submitFormulario);

    criptomonedasSelect.addEventListener('change',leervalor);
    monedaSelect.addEventListener('change',leervalor);

});

function consultarCriptomonedas() {
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(resp => resp.json())
        .then(resultado=>obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas=>selectCriptomonedas(criptomonedas))

}  

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto=>{
        const {FullName,Name}=cripto.CoinInfo;

        const option=document.createElement('option');
        option.value=Name;
        option.textContent=FullName;

        criptomonedasSelect.appendChild(option);
    });
}

function leervalor(e){
    objBusqueda[e.target.name]=e.target.value;
    console.log(objBusqueda);
}

function submitFormulario(e){
    e.preventDefault();

    //validar 
    const {moneda,criptomoneda}=objBusqueda;
    if (moneda===''|| criptomoneda==='') {
        mostrarAlerta('ambos Campos son Obligatorios');
        return;
    }

    //consultar la API con los resultados
    consultarAPI();

}
function mostrarAlerta(msg){

    const existeError = document.querySelector('.error');
    if (!existeError) {
        const divMensaje=document.createElement('div');
        divMensaje.classList.add('error');

        //mensaje de error
        divMensaje.textContent=msg;

        formulario.appendChild(divMensaje);

        setTimeout(()=>{
            divMensaje.remove();
        },1000)
    }

}

function consultarAPI(){
    const {moneda,criptomoneda}=objBusqueda;

    const url=`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    
    mostrarSpinner();

    fetch(url)
        .then(resp=>resp.json())
        .then(cotizacion=>{
            mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
        })    


}
function mostrarCotizacionHTML(cotizacion){
    limpiarHTML();
    
    const {PRICE,HIGHDAY,LOWDAY,CHANGEPCT24HOUR,LASTUPDATE}=cotizacion;

    const precio=document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML=`EL precio es: <span> ${PRICE} </span>`;

    const precioAlto=document.createElement('p');
    precioAlto.innerHTML=`<p>Precio mas alto del dia <span>${HIGHDAY}</span></p>`;

    const precioBajo=document.createElement('p');
    precioBajo.innerHTML=`<p>Precio mas bajo del dia <span>${LOWDAY}</span></p>`;

    const ultimasHoras=document.createElement('p');
    ultimasHoras.innerHTML=`<p>Variacion ultimas 24 horas <span>${CHANGEPCT24HOUR}%</span></p>`;

    const ultimaActualizacion=document.createElement('p');
    ultimaActualizacion.innerHTML=`<p>Ultima Actuazicacion <span>${LASTUPDATE}</span></p>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

//enlace del spinner
// https://tobiasahlin.com/spinkit/

function mostrarSpinner(){
    limpiarHTML();

    const spinner=document.createElement('div');
    spinner.classList.add('spinner');
    spinner.innerHTML=`
          <div class="rect1"></div>
          <div class="rect2"></div>
          <div class="rect3"></div>
          <div class="rect4"></div>
          <div class="rect5"></div>
    `;

    resultado.appendChild(spinner);
}