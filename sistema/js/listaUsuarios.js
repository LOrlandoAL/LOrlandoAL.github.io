/*var arreglo=[];
arreglo[0]=3;
arreglo[5]="Hola";
arreglo.push("Mundo");
var usuario={nombre:"Uriel Perez",
            correo:"uriel@gmail.com",
            telefono:'1234567890'};
usuario.password="123";
var usuario2={};
usuario2.nombre="Karina";
arreglo.push(usuario);
arreglo.push(usuario2);
console.log(arreglo);
*/
//JSON (JavaScript Object Notation)
//{atributo1:valor,atributo2:valor}
/*sessionStorage (tiempo de vida limitado al cierre del navegador)
localStorage (tiempo de vida dependiente de que el usuario borre)*/

document.addEventListener("DOMContentLoaded", () => {
    inicializarDatos();
    cargarTabla();

    const tablaUsuarios = document.getElementById("tblUsuarios");
    tablaUsuarios.addEventListener("click", verificarClic);
    let operacion;
    let usuarioEd;

    // Funcion para verificar los clics en los botones
    function verificarClic(e){
        if(e.target.matches(".eliminarFila")){
            const tbIndex = e.target.parentNode.parentNode.rowIndex;
            const correoAEliminar = e.target.value;
            const nombreUsuarioAEliminar = e.target.parentNode.parentNode.firstElementChild.innerText;

            document.getElementById('usuarioEliminarNombre').innerText = nombreUsuarioAEliminar;
            const modalConfirmacionEliminar = new bootstrap.Modal(document.getElementById('modalConfirmacionEliminar'));
            modalConfirmacionEliminar.show();

            // Manejar la eliminación si se confirma
            document.getElementById('btnConfirmarEliminar').addEventListener('click', () => {
                tablaUsuarios.deleteRow(tbIndex);

                // Eliminar el usuario del arreglo localStorage
                let usuarios = JSON.parse(localStorage.getItem("usuarios"));
                usuarios = usuarios.filter(usuario => usuario.correo !== correoAEliminar);
                localStorage.setItem("usuarios", JSON.stringify(usuarios));

                // Cerrar el modal
                modalConfirmacionEliminar.hide();
            });
        }
    }


    document.getElementById("txtNombre").onkeyup = e => revisarControl(e, 2, 60);
    document.getElementById("txtTelefono").onkeyup = e => {
        if (e.target.value.trim().length > 0)
            revisarControl(e, 10, 10);
    }
    document.getElementById("txtPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }
    document.getElementById("txtConfirmarPassword").onkeyup = e => {
        revisarControl(e, 6, 20);
    }

    document.getElementById("btnLimpiar").addEventListener("click", e => {
        e.target.form.classList.remove("validado");
        //Iterar todos los controles del form
        //debugger;
        let controles = e.target.form.querySelectorAll("input,select");
        controles.forEach(control => {
            control.classList.remove("valido");
            control.classList.remove("novalido");
        });
        //console.log(controles);
    });
    document.getElementById("btnAceptar").addEventListener("click", e => {
        e.preventDefault(); // Evitar que el formulario se envíe automáticamente

        let txtNombre = document.getElementById("txtNombre");
        let txtContrasenia = document.getElementById("txtPassword");
        let txtContrasenia2 = document.getElementById("txtConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let txtTel = document.getElementById("txtTelefono");
        
        // Limpiar mensajes de error previos
        let alert = e.target.parentElement.querySelector(".alert");
        if (alert) {
            alert.remove();
        }

        // Validar los campos del formulario
        txtNombre.setCustomValidity("");
        txtContrasenia.setCustomValidity("");
        txtContrasenia2.setCustomValidity("");
        txtEmail.setCustomValidity("");
        txtTel.setCustomValidity("");

        if(document.querySelector("#mdlRegistro .modal-title").innerText !== 'Cambiar Contraseña'){
            if (txtNombre.value.trim().length < 2 || txtNombre.value.trim().length > 60) {
                txtNombre.setCustomValidity("El nombre es obligatorio (entre 2 y 60 caracteres)");
                txtNombre.reportValidity(); // Mostrar mensaje de error
                return;
            }
    
            if (txtTel.value.trim().length > 0 && txtTel.value.trim().length !== 10) {
                txtTel.setCustomValidity("El teléfono debe tener 10 dígitos");
                txtTel.reportValidity(); // Mostrar mensaje de error
                return;
            }
        }

        // Validar contraseña solo si se está registrando un nuevo usuario
        if (document.querySelector("#mdlRegistro .modal-title").innerText === 'Agregar' || document.querySelector("#mdlRegistro .modal-title").innerText === 'Cambiar Contraseña') {
            if (txtContrasenia.value.trim().length < 6 || txtContrasenia.value.trim().length > 20) {
                txtContrasenia.setCustomValidity("La contraseña es obligatoria (entre 6 y 20 caracteres)");
                txtContrasenia.reportValidity(); // Mostrar mensaje de error
                return;
            }

            if (txtContrasenia.value !== txtContrasenia2.value) {
                txtContrasenia2.setCustomValidity("Las contraseñas no coinciden");
                txtContrasenia2.reportValidity(); // Mostrar mensaje de error
                return;
            }
        }

        // Obtener los datos del formulario
        let nombre = txtNombre.value.trim();
        let correo = txtEmail.value.trim();
        let telefono = txtTel.value.trim();
        let password = txtContrasenia.value.trim();

        // Obtener la lista de usuarios del localStorage
        let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

        if (document.querySelector("#mdlRegistro .modal-title").innerText === 'Agregar') {
            const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correoRegex.test(correo)) {
                mostrarMensajeError("El formato del correo electrónico no es válido");
                return;
            }


            // Verificar si el correo ya está registrado
            if (usuarios.some(usuario => usuario.correo === correo)) {
                mostrarMensajeError("Este correo ya se encuentra registrado, favor de usar otro");
                return;
            }

            // Agregar un nuevo usuario a la lista
            usuarios.push({ nombre, correo, password, telefono });
            localStorage.setItem("usuarios", JSON.stringify(usuarios));
        } else if(document.querySelector("#mdlRegistro .modal-title").innerText === 'Editar') {

            const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!correoRegex.test(correo)) {
                mostrarMensajeError("El formato del correo electrónico no es válido");
                return;
            }

            // Verificar si el correo ya está registrado
            if (usuarios.some(usuario => usuario.correo === correo) && correo !== usuarioEd.correo) {
                mostrarMensajeError("Este correo ya se encuentra registrado, favor de usar otro");
                return;
            }

            // Edición de usuario
            let indiceEdicion = usuarios.findIndex(usuario => usuario.correo === usuarioEd.correo);
            if (indiceEdicion !== -1) {
                // Actualizar los datos del usuario en la lista
                usuarios[indiceEdicion].nombre = nombre;
                usuarios[indiceEdicion].correo = correo;
                usuarios[indiceEdicion].telefono = telefono;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
            }
        }else{
            // Edición de usuario
            let indiceEdicion = usuarios.findIndex(usuario => usuario.correo === usuarioEd.correo);
            if (indiceEdicion !== -1) {
                // Actualizar los datos del usuario en la lista
                usuarios[indiceEdicion].password = password;
                localStorage.setItem("usuarios", JSON.stringify(usuarios));
            }
        }

        // Limpiar formulario después de agregar/editar usuario
        document.getElementById("mdlRegistro").querySelector("form").reset();
        document.getElementById("mdlRegistro").querySelector("form").hide();

        // Recargar la tabla de usuarios
        limpiarTabla();
        cargarTabla();
    });

    document.getElementById("mdlRegistro").addEventListener('shown.bs.modal', (e) => {
        document.getElementById("btnLimpiar").click();
        operacion = e.relatedTarget.innerText;
        
        // Establecer el título del modal según la operación
        e.target.querySelector(".modal-title").innerText = operacion;

        // Mostrar u ocultar campos de contraseña según la operación
        let txtPassword = document.getElementById("txtPassword");
        let txtConfirmarPassword = document.getElementById("txtConfirmarPassword");
        let lblPassword = document.getElementById("lblPassword");
        let lblConfirmarPassword = document.getElementById("lblConfirmarPassword");
        let txtEmail = document.getElementById("txtEmail");
        let lblEmail = document.getElementById("lblEmail");
        let txtNombre = document.getElementById("txtNombre");
        let lblNombre = document.getElementById("lblNombre");
        let txtTelefono = document.getElementById("txtTelefono");
        let lblTelefono = document.getElementById("lblTelefono");

        
        if (operacion === 'Editar') {
            // Cargar los datos del usuario en el formulario para editar
            let correo = e.relatedTarget.value;
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            let usuario = usuarios.find(element => element.correo === correo);
            usuarioEd = usuario; // Guardar el usuario actual para edición
            document.getElementById("txtNombre").value = usuario.nombre;
            document.getElementById("txtEmail").value = usuario.correo;
            document.getElementById("txtTelefono").value = usuario.telefono;

            // Ocultar campos de contraseña en la edición
            txtPassword.style.display = "none";
            txtConfirmarPassword.style.display = "none";
            lblPassword.style.display = "none";
            lblConfirmarPassword.style.display = "none";

            txtEmail.style.display = "block";
            lblEmail.style.display = "block";
            
            txtNombre.style.display = "block";
            lblNombre.style.display = "block";
            txtTelefono.style.display = "block";
            lblTelefono.style.display = "block";

        } else if (operacion === 'Agregar'){

            // Mostrar campos de contraseña al agregar un nuevo usuario
            txtPassword.style.display = "block";
            txtConfirmarPassword.style.display = "block";
            lblPassword.style.display = "block";
            lblConfirmarPassword.style.display = "block";

            txtEmail.style.display = "block";
            lblEmail.style.display = "block";
            
            txtNombre.style.display = "block";
            lblNombre.style.display = "block";
            txtTelefono.style.display = "block";
            lblTelefono.style.display = "block";


        } else {
            
            // Cargar los datos del usuario en el formulario para editar
            let correo = e.relatedTarget.value;
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            let usuario = usuarios.find(element => element.correo === correo);
            usuarioEd = usuario; // Guardar el usuario actual para edición
            document.getElementById("txtNombre").value = usuario.nombre;
            document.getElementById("txtEmail").value = usuario.correo;
            document.getElementById("txtTelefono").value = usuario.telefono;

            // Ocultar campos de contraseña en la edición
            txtEmail.style.display = "none";
            lblEmail.style.display = "none";
            
            txtNombre.style.display = "none";
            lblNombre.style.display = "none";
            txtTelefono.style.display = "none";
            lblTelefono.style.display = "none";

            txtPassword.style.display = "block";
            txtConfirmarPassword.style.display = "block";
            lblPassword.style.display = "block";
            lblConfirmarPassword.style.display = "block";
        }

        // Enfocar en el campo de nombre al abrir el modal
        document.getElementById("txtNombre").focus();
    });

    // Función para mostrar mensajes de error
    function mostrarMensajeError(mensaje) {
        let alerta = document.createElement('div');
        alerta.innerHTML = mensaje + ' <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';
        alerta.className = "alert alert-warning alert-dismissible fade show";
        
        let modalRegistro = document.getElementById('mdlRegistro');
        modalRegistro.querySelector('.modal-body').insertBefore(alerta, modalRegistro.querySelector('.modal-body').firstChild);

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
});

// Otras funciones
function revisarControl(e, min, max) {
    let txt = e.target;
    txt.setCustomValidity("");
    txt.classList.remove("valido");
    txt.classList.remove("novalido");
    if (txt.value.trim().length < min || txt.value.trim().length > max) {
        txt.setCustomValidity("Campo no válido");
        txt.classList.add("novalido");
    } else {
        txt.classList.add("valido");
    }
}

function cargarTabla() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    let tbody = document.querySelector("#tblUsuarios tbody");
    for (let usuario of usuarios) {
        let fila = document.createElement("tr");
        let celda = document.createElement("td");
        celda.innerText = usuario.nombre;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.correo;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerText = usuario.telefono;
        fila.appendChild(celda);

        celda = document.createElement("td");
        celda.innerHTML = '<button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#mdlRegistro" value="'+usuario.correo+'">Editar</button>' + 
        '<button type="button" class="btn btn-danger eliminarFila" value="'+usuario.correo+'">Eliminar</button>' + 
        '<button type="button" data-bs-toggle="modal" data-bs-target="#mdlRegistro" class="btn btn-dark" value="'+usuario.correo+'">Cambiar Contraseña</button>';
        fila.appendChild(celda);
        tbody.appendChild(fila);
    }
}

function inicializarDatos() {
    let usuarios = localStorage.getItem('usuarios');
    if (!usuarios) {
        usuarios = [
            {
                nombre: 'Uriel Perez Gomez',
                correo: 'uriel@gmail.com',
                password: '123456',
                telefono: ''
            },
            {
                nombre: 'Lorena Garcia Hernandez',
                correo: 'lorena@gmail.com',
                password: '567890',
                telefono: '4454577468'
            }
        ];

        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

function limpiarTabla() {
    let tbody = document.querySelector("#tblUsuarios tbody");
    tbody.innerHTML = ""; // Limpiar contenido de la tabla
}
