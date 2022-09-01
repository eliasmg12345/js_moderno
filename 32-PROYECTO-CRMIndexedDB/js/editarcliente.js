(function () {
    let DB;
    let idCliente;
    const nombreInput = document.querySelector('#nombre');
    const emailInput = document.querySelector('#email');
    const telefonoInput = document.querySelector('#telefono');
    const empresaInput = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');


    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();

        //actualiza el registro
        formulario.addEventListener('submit', actualizarCliente);

        //verificar el id de la URL
        const parametrosURL = new URLSearchParams(window.location.search);
        idCliente = parametrosURL.get('id');

        if (idCliente) {

            setTimeout(() => {

                obteneCliente(idCliente);

            }, 100);
        }
    });

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombreInput.value === '' || emailInput.value === '' || telefonoInput.value === '' || empresaInput.value === '') {
            imprimirAlerta('Todos los campos osn obligatorios','error');
            return;
        }

        //actualizar cliente
        const clienteActualizado={
            nombre:nombreInput.value,
            email:emailInput.value,
            telefono:telefonoInput.value,
            empresa:empresaInput.value,
            nombre:nombreInput.value,
            id:Number(idCliente),  //necesario convertir a nmumero para que encuentre en el KEYPATH
        };
        
        const transaction=DB.transaction(['crm'],'readwrite');
        const objectStore=transaction.objectStore('crm');

        objectStore.put(clienteActualizado); //va a encontrar el idCliente del objeto ClienteActualiado que esta en el keyPath como son iguales  lo va actualizar con los nuevos datos

        transaction.oncomplete=function () {
            imprimirAlerta('editado correctamente');

            setTimeout(() => {
                window.location.href='index.html';
            }, 2000);
        };

        transaction.onerror=function (error) {
            console.log(error);
            imprimirAlerta('HUBO UN ERROR','error');
        }

    }

    function obteneCliente(id) {
        const transaction = DB.transaction('crm', 'readonly');
        const objectStore = transaction.objectStore('crm');

        const cliente = objectStore.openCursor();
        cliente.onsuccess = function (e) {
            const cursor = e.target.result;

            if (cursor) {
                if (cursor.value.id === Number(id)) {
                    llenarFomulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFomulario(datosCliente) {
        const { nombre, email, telefono, empresa } = datosCliente;

        nombreInput.value = nombre;
        empresaInput.value = empresa;
        telefonoInput.value = telefono;
        emailInput.value = email;

    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function () {
            console.log('hubo un error');
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result;
        }
    }
})();