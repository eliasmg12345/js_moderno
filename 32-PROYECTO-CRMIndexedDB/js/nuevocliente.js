//para mantener nuestros archivos locales qui usamos el IFFIE
(function () {
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        //nos conectamos a la base de datos ya creada
        conectarDB();
        formulario.addEventListener('submit', validarCliente);
    });

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('hubo un error');
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }


    function validarCliente(e) {
        e.preventDefault();

        //leet todos los inputs
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('Todos los campos son obligatorios', 'error');

            return;
        }

        //crear un objeto con la informacion
        const cliente = {
            nombre,
            email,
            telefono,
            empresa,

        };
        cliente.id = Date.now();  //una forma de sellar el id

        crearNuevoCliente(cliente);

    }

    function crearNuevoCliente(cliente) {
        const transaction = DB.transaction(['crm'], 'readwrite');

        const objectStore = transaction.objectStore('crm'); //el objectStore es el que hace las acciones

        objectStore.add(cliente);

        transaction.onerror = function () {
            imprimirAlerta('hubo un error', 'error');
        };

        transaction.oncomplete = function () {
            console.log('cliente agregado');

            imprimirAlerta('El cliente se agregò correctamente');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        };
    }


})();