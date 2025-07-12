import { Validation } from "../helpers/Validation";
import Swal from "sweetalert2";

export const editarCalleController = async () => {
    console.log("cargado desde editar Calle");

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if (!usuario) {
        Swal.fire("Error", "No se encontró usuario en localStorage.", "error");
        return;
    }

    const saludo = document.querySelector(".saludo_usuario");
    if (saludo) {
        saludo.textContent = `Hola, ${usuario.nombre_usuario}!`;
    }

    const paisSelect = document.getElementById("pais_select");
    const depSelect = document.getElementById("departamento_select");
    const muniSelect = document.getElementById("municipio_select");
    const tipoViaSelect = document.getElementById("tipo_via_select");
    const numeroVia = document.getElementById("numero_via_input");
    const complemento = document.getElementById("complemento_input");
    const barrio = document.getElementById("barrio_input");



    // cargar tipos de vía
    try {
        const respTV = await fetch(`http://localhost:3000/api/tipos-via`);
        const tiposVia = (await respTV.json()).data;
        tipoViaSelect.innerHTML = '<option value="">Seleccione tipo de vía</option>';
        tiposVia.forEach(tv => {
            const option = document.createElement("option");
            option.value = tv.id;
            option.textContent = tv.nombre_tipo_via;
            tipoViaSelect.appendChild(option);
        });
        // asignar valor si ya existe
        if (usuario.direccion_tipo_via) {
            tipoViaSelect.value = usuario.direccion_tipo_via_id;
        }
    } catch (error) {
        Swal.fire("Error", "Error al cargar tipos de vía:", "error");
    }

    // cargar países
    try {
        const respP = await fetch(`http://localhost:3000/api/paises`);
        const paises = (await respP.json()).data;
        paisSelect.innerHTML = '<option value="">Seleccione país</option>';
        paises.forEach(p => {
            const option = new Option(p.nombre_pais, p.id);
            paisSelect.appendChild(option);
        });

        if (usuario.direccion_pais_id) {
            paisSelect.value = usuario.direccion_pais_id;
            await cargarDepartamentos(usuario.direccion_pais_id, usuario.direccion_departamento_id, usuario.direccion_ciudad_id);
        }
    } catch (error) {
        Swal.fire("Error", "Error al cargar países", "error");
    }

    // Función para cargar departamentos y municipios
    async function cargarDepartamentos(paisID, departamentoID = null, ciudadID = null) {
        try {
            const respD = await fetch(`http://localhost:3000/api/departamentos/pais/${paisID}`);
            const departamentos = (await respD.json()).data;

            depSelect.innerHTML = '<option value="">Seleccione Departamento</option>';

            departamentos.forEach(dep => {
                const option = new Option(dep.nombre_departamento, dep.id);
                depSelect.appendChild(option);
            });

            if (departamentoID) {
                depSelect.value = departamentoID;
                await cargarCiudades(departamentoID, ciudadID);
            }
        } catch (error) {
            Swal.fire("Error", "Error al cargar departamentos", "error");
        }
    }

    async function cargarCiudades(departamentoID, ciudadID = null) {
        try {
            const respC = await fetch(`http://localhost:3000/api/ciudades/departamento/${departamentoID}`);
            const ciudades = (await respC.json()).data;

            muniSelect.innerHTML = '<option value="">Seleccione Municipio</option>';

            ciudades.forEach(c => {
                const option = new Option(c.nombre_ciudad, c.id);
                muniSelect.appendChild(option);
            });

            if (ciudadID) {
                muniSelect.value = ciudadID;
            }
        } catch (error) {
            Swal.fire("Error", "Error al cargar municipios", "error");
        }
    }

    // listeners para cambios en país y departamento
    paisSelect.addEventListener('change', async () => {
        if (!paisSelect.value) return;
        await cargarDepartamentos(paisSelect.value);
    });

    depSelect.addEventListener('change', async () => {
        if (!depSelect.value) return;
        await cargarCiudades(depSelect.value);
    });

    // rellenar campos de texto si ya existen
    numeroVia.value = usuario.direccion_numero_via || "";
    complemento.value = usuario.direccion_complemento || "";
    barrio.value = usuario.direccion_barrio || "";

    // manejar envío del formulario
    const form = document.getElementById("formulario_anadir_calle");
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const pais = paisSelect.value;
        const departamento = depSelect.value;
        const municipio = muniSelect.value;
        const tipoVia = tipoViaSelect.value;


        //validacion de los select
        if (!Validation.isSelectValid(pais)) {
            Swal.fire("Error", "Seleccione un país.", "error");
            return;
        }
        if (!Validation.isSelectValid(departamento)) {
            Swal.fire("Error", "Seleccione un departamento.", "error")
            return;
        };
        if (!Validation.isSelectValid(municipio)) {
            Swal.fire("Error", "Seleccione un municipio.", "error")
            return;
        };
        if (!Validation.isSelectValid(tipoVia)) {
            Swal.fire("Error", "Seleccione un tipo de vía.", "error")
            return;
        };

        // Validacion numero principal
        if (!Validation.isNotEmpty(numeroVia.value)) {
            Swal.fire("Error", "Ingrese el número de vía.", "error")
            return;
        };

        //Validacion complemento 
        if (!Validation.hasMaxLength(complemento.value, 50)) {
            Swal.fire("Error", "El complemento no puede exceder los 50 caracteres", "error");
            return;
        }

        // validacion barrio
        if (!Validation.isNotEmpty(barrio.value)) {
            Swal.fire("Error", "Ingrese el barrio.", "error")
            return;
        };

        const data = {
            id_tipo_via: parseInt(tipoVia),
            numero_via: numeroVia.value.trim(),
            complemento: complemento.value.trim() || null,
            barrio: barrio.value.trim(),
            id_ciudad: parseInt(municipio)
        };

        try {
            const resp = await fetch(`http://localhost:3000/api/usuarios/${usuario.id}/direccion`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await resp.json();

            if (resp.ok && result.success) {
                Swal.fire({
                    icon: "success",
                    title: "¡Éxito!",
                    text: "La dirección fue actualizada correctamente.",
                    confirmButtonText: "OK"
                }).then(() => {
                    // redirigir a #calle después de confirmar
                    window.location.hash = "#calle";
                });
                // actualizar localStorage con todos los datos retornados (id + nombres)
                const direccionActualizada = result.data;
                localStorage.setItem("usuario", JSON.stringify({
                    ...usuario,
                    direccion_pais: direccionActualizada.nombre_pais,
                    direccion_pais_id: direccionActualizada.direccion_pais,
                    direccion_departamento: direccionActualizada.nombre_departamento,
                    direccion_departamento_id: direccionActualizada.direccion_departamento,
                    direccion_ciudad: direccionActualizada.nombre_ciudad,
                    direccion_ciudad_id: direccionActualizada.direccion_ciudad,
                    direccion_tipo_via: direccionActualizada.nombre_tipo_via,
                    direccion_tipo_via_id: direccionActualizada.direccion_tipo_via,
                    direccion_numero_via: direccionActualizada.direccion_numero_via,
                    direccion_complemento: direccionActualizada.direccion_complemento,
                    direccion_barrio: direccionActualizada.direccion_barrio
                }));

            } else {
                Swal.fire("Error", result.message || "No se pudo actualizar la dirección.", "error");
            }
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Hubo un problema al enviar la dirección.", "error");
        }
    });

    const info = document.querySelector("#info_importante");
    info.addEventListener("click", async (e) => {

        Swal.fire({
            title: "Información importante 🛑",
            html: `
            <p><strong>¡Hola querido usuario/a!</strong>  Nos alegra mucho tenerte aquí 💛</p><br>
            <p>Queremos informarte con toda transparencia que, por el momento, <strong>nuestros envíos están limitados únicamente a la ciudad de <em>Bucaramanga, Santander</em></strong>.</p>
            <p>En la sección de "Departamento", solo verás habilitadas las zonas más cercanas, ya que son las únicas donde actualmente tenemos cobertura directa.</p>
            <p>Sabemos que esto puede ser una limitación para ti, y sinceramente <strong>nos encantaría llegar a todos los rincones del país</strong>.<br> Estamos trabajando con esfuerzo para ampliar nuestra cobertura 🛍️✨</p>
            <p>Si deseas consultar otras posibles formas de envío, dirígete a: <br>
            <strong>Servicio al cliente → Envíos → ¿A dónde entregamos?</strong></p>
            <p>Allí encontrarás un enlace que te llevará a un chat con nuestro equipo, quienes estarán felices de ayudarte 💬🙌</p>
            <p>¡Gracias por tu tiempo y comprensión!</p>
        `,
            icon: "info",
            confirmButtonText: "Entendido"
        });
    });
};

