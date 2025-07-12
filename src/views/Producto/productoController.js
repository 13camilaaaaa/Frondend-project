import { listar_productos } from "../../casos de uso/listarProductos";
import Swal from "sweetalert2";
import { openSidebar } from '../../componentes/carritoController';

export const productoController = async () => {
    const id = window.location.hash.split('/')[1];

    try {
        const res = await fetch(`http://localhost:3000/api/productos/${id}`);
        const data = await res.json();
        const producto = data.data;

        console.log(producto); // para depuración

        // Obtener los elementos del DOM
        const titulo = document.querySelector('.product-title');
        const precio = document.querySelector('.product-price');
        const imagen = document.querySelector('.main-product-image');
        const talla = document.querySelector('.size-button');
        const color = document.querySelector('.color');
        const categoria = document.querySelector('.Categoría');
        const genero = document.querySelector('.genero');
        const descripcion = document.querySelector('.descripcion');

        if (titulo) titulo.innerText = producto.nombre;
        if (precio) precio.innerText = `$${parseFloat(producto.precio).toLocaleString('es-CO')}`;
        if (imagen) {
            imagen.src = `/src/uploads/${producto.imagen}`;
            imagen.alt = producto.nombre;
        }
        if (talla) talla.innerText = producto.talla_nombre;
        if (color) color.innerText = `Color: ${producto.color_nombre}`;
        if (categoria) categoria.innerText = `Categoría: ${producto.categoria_nombre}`;
        if (genero) genero.innerText = `Género: ${producto.genero_nombre}`;
        if (descripcion) descripcion.innerText = producto.descripcion;

        // Eventos para cantidad
        const btnAumentar = document.querySelector('.quantity-button-');
        const btnDisminuir = document.querySelector('.quantity-button');
        const inputCantidad = document.querySelector('.quantity-display');

        if (btnAumentar && inputCantidad) {
            btnAumentar.addEventListener('click', () => {
                inputCantidad.value = parseInt(inputCantidad.value) + 1;
            });
        }

        if (btnDisminuir && inputCantidad) {
            btnDisminuir.addEventListener('click', () => {
                if (parseInt(inputCantidad.value) > 1) {
                    inputCantidad.value = parseInt(inputCantidad.value) - 1;
                }
            });
        }

        // Evento de agregar al carrito
        const btnAdd = document.querySelector(".add-to-cart-button");
        if (btnAdd) {
            btnAdd.addEventListener("click", async () => {
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                const token = localStorage.getItem("token");
                const cantidad = parseInt(document.querySelector(".quantity-display").value);

                const productoPendiente = {
                    id_producto: producto.id,
                    nombre: producto.nombre,
                    imagen: producto.imagen,
                    cantidad: cantidad,
                    precio: parseFloat(producto.precio),
                    talla: producto.talla_nombre,  
                    color: producto.color_nombre  
                };

                if (!usuario || !token) {
                    // Guardar producto pendiente en localStorage
                    3// **Usuario NO logueado:** Guardar en localStorage como carrito temporal
                    let carritoLocal = JSON.parse(localStorage.getItem("carritoTemporal") || "[]");
                    const existingItemIndex = carritoLocal.findIndex(item => item.id_producto === productoPendiente.id_producto);

                    if (existingItemIndex > -1) {
                        // Si el producto ya existe, actualizar la cantidad
                        carritoLocal[existingItemIndex].cantidad += productoPendiente.cantidad;
                    } else {
                        // Si no existe, añadirlo
                        carritoLocal.push(productoPendiente);
                    }

                    localStorage.setItem("carritoTemporal", JSON.stringify(carritoLocal));
                    localStorage.setItem("abrirCarritoPostLogin", "true");
                    localStorage.setItem("ultimoProductoAnadido", JSON.stringify(productoPendiente)); // Para mostrarlo de primero si se loguea
                    return Swal.fire({
                        title: "Debes iniciar sesión 🛑",
                        text: "Inicia sesión para guardar tus productos en el carrito de forma permanente.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Iniciar sesión",
                        cancelButtonText: "Seguir viendo",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            window.location.hash = "#login";
                        } else {
                            // Si elige "Seguir viendo", aún se muestra el carrito temporal
                            openSidebar(); // Abre el panel para que vea que se añadió al carrito temporal
                            Swal.fire({
                                icon: "success",
                                title: "¡Añadido al carrito temporal!",
                                text: `${producto.nombre} fue agregado con éxito (guardado localmente).`,
                                timer: 2000,
                                showConfirmButton: false,
                            });
                        }
                    });
                }

                try {
                    const res = await fetch("http://localhost:3000/api/carrito/agregar", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(productoPendiente)
                    });

                    const data = await res.json();
                    if (res.ok) {
                        Swal.fire({
                            icon: "success",
                            title: "¡Añadido al carrito!",
                            text: `${producto.nombre} fue agregado con éxito`,
                            timer: 1500,
                            showConfirmButton: false,
                        });
                        localStorage.removeItem("carritoTemporal"); // Limpiar carrito temporal si se añade logueado
                        localStorage.removeItem("ultimoProductoAnadido"); // Limpiar el último añadido temporal
                        openSidebar();
                    } else {
                        Swal.fire("Error", data.message || "No se pudo agregar el producto", "error");
                    }
                } catch (err) {
                    console.error("Error al agregar al carrito:", err);
                    Swal.fire("Error", "Error inesperado al agregar el producto", "error");
                }
            });
        }

    } catch (err) {
        console.error("Error en productoController:", err);
        Swal.fire("Error", "No se pudo mostrar el detalle del producto", "error");
    }
};


