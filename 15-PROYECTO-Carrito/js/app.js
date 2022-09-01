//variables

const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
//creando variable para el carrito de compras
let articulosCarrito = [];


cargarEventListeners();

//fucnion para registrar todos los event listener
function cargarEventListeners() {
    //cuando agregas un curso presionando "Agregar al carrito"  
    listaCursos.addEventListener('click', agregarCurso);    //cuando hagamos click vamos a agregar un nuevo curso

    //elimina cursos del carrito
    carrito.addEventListener('click', eliminarCurso);

    //VACIAR EL CARITO
    vaciarCarritoBtn.addEventListener('click', ()=>{
        articulosCarrito=[]; //reseteamos el arreglo

        limpiarHTML(); //eliminamos todo el html
    });
}

//=============FUNCIONES===================

function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const cursoSeleccionado = e.target.parentElement.parentElement

        leerDatosCurso(cursoSeleccionado);
    }
}


//Elimina un curso del carrito
function eliminarCurso(e) {

    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');

        //eliminar del arreglo de articulosCarrito por el data-id
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);

        console.log(articulosCarrito);
        carritoHTML(); //iterar sobre el carrito y mostrar su HTML

    }
}



//leendo el contenido del html al que le dimos click y extrae la informacion del curso
function leerDatosCurso(curso) {
    console.log(curso);
    //Crear un objeto con el contenido deñ curso actual
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    //revisa si un elemento ya existe en el carrito
    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        //actualizamos la cantidad
        const cursos = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
                return curso; // retorna el objeto actualziado
            } else {
                return curso; //retorna los objetos que no son los duplicados
            }
        });
        articulosCarrito = [...cursos];
    } else {
        //agregar elementos al arrgelo de carrito
        articulosCarrito = [...articulosCarrito, infoCurso];
    }


    console.log(articulosCarrito);

    carritoHTML();
}

//muestra el carrito de compras en el html
//Esta funcion se va encargar de generar htmlbasado en el carrito de compras
function carritoHTML() {

    //limpiar el html
    limpiarHTML();

    //recorre el carrito y genera el html
    articulosCarrito.forEach(curso => {
        const { imagen, titulo, precio, cantidad, id } = curso;
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>
                    <img src="${imagen}" width="100" height="">
                </td>
                <td>${titulo}</td>
                <td>${precio}</td>
                <td>${cantidad}</td>
                <td>
                    <a href="#" class="borrar-curso" data-id="${id}"> X </a>
                </td>
            `;

        //agrega el  html de carrtio en el tbody
        contenedorCarrito.appendChild(row);
    });
}

//elimina los cursos del tTBODY
function limpiarHTML() {
    //formA LENTA
    //contenedorCarrito.innerHTML ='';

    //se recomienda
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

