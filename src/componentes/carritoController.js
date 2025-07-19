import { updateVentaView } from '../views/Venta/ventaController.js';
import Swal from "sweetalert2";

// === Declaraciones de variables para elementos del DOM (inicializadas en carritoController) ===
// Estas variables se declararán una vez que el HTML del sidebar se haya insertado.
let sidebarCartContent;
let sidebarCartFooter;
let cartIcon;
let closeSidebarBtn;
let sidebarOverlay;
let shoppingBagSidebar;

// =========================================================================
// === Funciones Auxiliares (declaradas en el ámbito global del módulo) ===
// =========================================================================

/**
 * Abre la barra lateral del carrito.
 */
export const openSidebar = () => {
    // Asegurarse de que las referencias a los elementos del DOM estén actualizadas
    shoppingBagSidebar = document.getElementById('shoppingBagSidebar');
    sidebarOverlay = document.getElementById('sidebarOverlay');

    if (shoppingBagSidebar && sidebarOverlay) {
        shoppingBagSidebar.classList.add('open');
        sidebarOverlay.classList.add('active');
        document.body.classList.add('no-scroll'); 

        // Cargar productos cada vez que se abre el carrito
        cargarContenidoDelCarrito();
    }
};

/**
 * Cierra la barra lateral del carrito.
 */
export const closeSidebar = () => {
    // Asegurarse de que las referencias a los elementos del DOM estén actualizadas
    shoppingBagSidebar = document.getElementById('shoppingBagSidebar');
    sidebarOverlay = document.getElementById('sidebarOverlay');

    if (shoppingBagSidebar && sidebarOverlay) {
        shoppingBagSidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.classList.remove('no-scroll'); 

        // SOLO si el usuario está en la página de #venta, actualiza la vista.
        if (location.hash === '#venta') {
            updateVentaView(); // Llama a la función exportada del ventaController
        }
    }
};

/**
 * Función principal para cargar los productos en el panel del carrito.
 * Determina si el usuario está logueado para obtener los productos de la BD o de LocalStorage.
 * También se encarga de renderizar el HTML del carrito y adjuntar eventos.
 */
const cargarContenidoDelCarrito = async () => {
    // Asegurarse de que los elementos del DOM existen antes de usarlos
    sidebarCartContent = document.getElementById('sidebarCartContent');
    sidebarCartFooter = document.getElementById('sidebarCartFooter');

    if (!sidebarCartContent || !sidebarCartFooter) {
        console.error("Elementos del carrito (sidebarCartContent o sidebarCartFooter) no encontrados en el DOM.");
        return;
    }

    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");
    let carritoItems = [];
    let totalCarrito = 0;
    let ultimoProducto = null; // Para guardar el último producto añadido (en caso de login)

    // Paso 1: Determinar qué carrito mostrar (BD o LocalStorage)
    if (usuario && token) {
        try {
            const res = await fetch("http://localhost:3000/api/carrito", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();

            if (res.ok && data.success && data.carrito && Array.isArray(data.carrito.items)) {
                carritoItems = data.carrito.items; // Acceder a data.carrito.items

                // Calcular el total
                totalCarrito = carritoItems.reduce((sum, item) => sum + (parseFloat(item.precio || 0) * parseInt(item.cantidad || 0)), 0);

                // Si hay un producto añadido justo antes del login, lo buscamos y lo ponemos de primero
                const lastAdded = localStorage.getItem("ultimoProductoAnadido");
                if (lastAdded) {
                    const lastAddedProduct = JSON.parse(lastAdded);
                    const index = carritoItems.findIndex(item =>
                        item.id_producto === lastAddedProduct.id_producto &&
                        item.talla === lastAddedProduct.talla &&
                        item.color === lastAddedProduct.color
                    );
                    if (index > -1) {
                        ultimoProducto = carritoItems[index];
                        carritoItems.splice(index, 1);
                        carritoItems.unshift(ultimoProducto);
                    }
                    localStorage.removeItem("ultimoProductoAnadido");
                }


            } else {
                console.warn("Backend response for cart was not successful or items were missing:", data);
                carritoItems = [];
            }
        } catch (error) {
            console.error("Error al cargar carrito de la DB:", error);
            Swal.fire("Error", "No se pudo cargar tu carrito de compras. Intenta de nuevo más tarde.", "error");
            carritoItems = [];
        }
    } else {
        // Usuario NO logueado: Obtener del LocalStorage (carrito temporal)
        const carritoLocal = JSON.parse(localStorage.getItem("carritoTemporal") || "[]");
        carritoItems = carritoLocal;
        // Calcular el total
        totalCarrito = carritoItems.reduce((sum, item) => sum + (parseFloat(item.precio || 0) * parseInt(item.cantidad || 0)), 0);
    }

    // Paso 2: Renderizar el contenido del carrito
    if (carritoItems.length === 0) {
        sidebarCartContent.innerHTML = `
            <i class="fas fa-shopping-bag cart-empty-icon"></i>
            <p class="empty-cart-message">Tu carrito está vacío</p>
            <button class="continue-shopping-btn" id="continueShoppingBtnEmpty">Seguir comprando</button>
            ${!usuario ? `<p class="login-prompt">¿Tienes una cuenta? <a href="#login" class="login-link">Inicia sesión</a> para guardar tus productos.</p>` : ''}
        `;
        const continueShoppingBtnEmpty = document.getElementById("continueShoppingBtnEmpty");
        if (continueShoppingBtnEmpty) {
            continueShoppingBtnEmpty.removeEventListener("click", handleContinueShopping);
            continueShoppingBtnEmpty.addEventListener("click", handleContinueShopping);
        }
        // Listener para el link de login si no está logueado
        const loginLink = document.querySelector('#sidebarCartContent .login-link');
        if (loginLink) {
            loginLink.removeEventListener('click', handleLoginLinkClick);
            loginLink.addEventListener('click', handleLoginLinkClick);
        }
        sidebarCartFooter.innerHTML = ''; // Limpiar footer si el carrito está vacío
        sidebarCartContent.style.justifyContent = 'center'; // Centrar el contenido cuando está vacío
    } else {
        // Generar HTML para los items del carrito
        const itemsHtml = carritoItems.map(item => `
            <div class="cart-item" data-id-item-carrito="${item.id}" data-id-producto="${item.id_producto}" data-talla="${item.talla}" data-color="${item.color}" data-stock="${item.stock}">
                <img src="/src/uploads/${item.imagen}" alt="${item.nombre_producto}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.nombre_producto}</h4>
                    <p class="cart-item-variant">${item.talla || 'Talla Indefinida'} | ${item.color || 'Color Indefinido'}</p>
                    <div class="cart-item-quantity-wrapper">
                        <span class="cart-item-price">$${parseFloat(item.precio || 0).toLocaleString('es-CO')}</span>
                        <div class="quantity-selector">
                            <button class="quantity-btn decrease-quantity" data-id-item-carrito="${item.id}" data-id-producto="${item.id_producto}" data-talla="${item.talla}" data-color="${item.color}">-</button>
                            <input type="text" value="${Math.min(item.cantidad, item.stock)}" class="quantity-display-cart" readonly>
                            <button class="quantity-btn increase-quantity" data-id-item-carrito="${item.id}" data-id-producto="${item.id_producto}" data-talla="${item.talla}" data-color="${item.color}">+</button>
                        </div>
                    </div>
                </div>
                <button class="remove-item-btn" data-id-item-carrito="${item.id}" data-id-producto="${item.id_producto}" data-talla="${item.talla}" data-color="${item.color}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `).join("");

        sidebarCartContent.style.justifyContent = 'flex-start'; // Alinear arriba cuando hay productos
        sidebarCartContent.innerHTML = `
            <div class="cart-items-list">
                ${itemsHtml}
            </div>
        `;
        sidebarCartFooter.innerHTML = `
            <div class="cart-summary">
                <p>Subtotal <span>$${totalCarrito.toLocaleString('es-CO')}</span></p>
                <p>Total <span>$${totalCarrito.toLocaleString('es-CO')}</span></p>
            </div>
            <p class="shipping-info">Simula el costo de envío en el siguiente paso.</p>
            <button class="checkout-btn" id="continueCheckoutBtn">CONTINUAR CON EL PEDIDO</button>
        `;

        // Añadir scroll si el contenido excede la altura
        const cartItemsList = sidebarCartContent.querySelector(".cart-items-list");
        if (cartItemsList) {
            cartItemsList.style.maxHeight = "calc(100vh - 200px)";
            cartItemsList.style.overflowY = "auto";
            cartItemsList.style.paddingRight = "5px";
        }

        sidebarCartContent.querySelectorAll(".increase-quantity").forEach(button => {
            button.removeEventListener("click", handleIncreaseQuantity);
            button.addEventListener("click", handleIncreaseQuantity);
        });

        sidebarCartContent.querySelectorAll(".decrease-quantity").forEach(button => {
            button.removeEventListener("click", handleDecreaseQuantity);
            button.addEventListener("click", handleDecreaseQuantity);
        });

        sidebarCartContent.querySelectorAll(".remove-item-btn").forEach(button => {
            button.removeEventListener("click", handleRemoveItem);
            button.addEventListener("click", handleRemoveItem);
        });

        // Evento para el botón de Checkout
        const continueCheckoutBtn = document.getElementById("continueCheckoutBtn");
        if (continueCheckoutBtn) {
            continueCheckoutBtn.removeEventListener("click", handleContinueCheckout);
            continueCheckoutBtn.addEventListener("click", handleContinueCheckout);
        }
    }
    updateCartIconQuantity();
};

const handleContinueShopping = () => {
    closeSidebar();
    window.location.hash = "";
};

const handleLoginLinkClick = () => {
    closeSidebar();
};

const handleIncreaseQuantity = (event) => {
    const idItemCarrito = event.currentTarget.dataset.idItemCarrito;
    const idProducto = event.currentTarget.dataset.idProducto;
    const talla = event.currentTarget.dataset.talla;
    const color = event.currentTarget.dataset.color;
    const currentQuantityEl = event.currentTarget.previousElementSibling;
    let currentQuantity = parseInt(currentQuantityEl.value);

    const cartItemElement = event.currentTarget.closest(".cart-item");
    const stock = parseInt(cartItemElement.dataset.stock);

    if (currentQuantity >= stock) {
        Swal.fire("¡Lo sentimos!", "No contamos con más unidades disponibles de este producto.", "warning");
        return;
    }

    currentQuantity++;
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const token = localStorage.getItem("token");
    actualizarCantidadProducto(idItemCarrito, idProducto, talla, color, currentQuantity, usuario, token, stock);
};

const handleDecreaseQuantity = (event) => {
    const idItemCarrito = event.currentTarget.dataset.idItemCarrito;
    const idProducto = event.currentTarget.dataset.idProducto;
    const talla = event.currentTarget.dataset.talla;
    const color = event.currentTarget.dataset.color;
    const currentQuantityEl = event.currentTarget.nextElementSibling;
    let currentQuantity = parseInt(currentQuantityEl.value);

    if (currentQuantity > 1) {
        currentQuantity--;
        const usuario = JSON.parse(localStorage.getItem("usuario"));
        const token = localStorage.getItem("token");
        actualizarCantidadProducto(idItemCarrito, idProducto, talla, color, currentQuantity, usuario, token);
    } else {
        Swal.fire({
            title: '¿Eliminar producto?',
            text: "¿Estás seguro de que quieres eliminar este producto del carrito?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'No, cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                const usuario = JSON.parse(localStorage.getItem("usuario"));
                const token = localStorage.getItem("token");
                eliminarProductoDelCarrito(idItemCarrito, idProducto, talla, color, usuario, token);
            }
        });
    }
};

const handleRemoveItem = (event) => {
    const idItemCarrito = event.currentTarget.dataset.idItemCarrito;
    const idProducto = event.currentTarget.dataset.idProducto;
    const talla = event.currentTarget.dataset.talla;
    const color = event.currentTarget.dataset.color;
    Swal.fire({
        title: '¿Eliminar producto?',
        text: "¿Estás seguro de que quieres eliminar este producto del carrito?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'No, cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const usuario = JSON.parse(localStorage.getItem("usuario"));
            const token = localStorage.getItem("token");
            eliminarProductoDelCarrito(idItemCarrito, idProducto, talla, color, usuario, token);
        }
    });
};

const handleContinueCheckout = () => {
    closeSidebar();
    window.location.hash = "#venta";
};

const migrarCarritoTemporalABaseDeDatos = async () => {
    const carritoTemporal = JSON.parse(localStorage.getItem("carritoTemporal") || "[]");
    const token = localStorage.getItem("token");

    if (carritoTemporal.length > 0 && token) {
        try {
            for (const item of carritoTemporal) {
                const res = await fetch("http://localhost:3000/api/carrito/agregar", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_producto: item.id_producto,
                        cantidad: item.cantidad,
                        precio_unitario_al_momento: item.precio || 0,
                        talla_nombre_al_momento: item.talla || 'N/A',
                        color_nombre_al_momento: item.color || 'N/A'
                    })
                });
                if (!res.ok) {
                    console.error(`Error al migrar producto ${item.nombre_producto || item.id_producto}:`, await res.json());
                }
            }
            localStorage.removeItem("carritoTemporal");
            Swal.fire({
                icon: "info",
                title: "¡Productos guardados!",
                text: "Tus productos del carrito temporal ahora están en tu cuenta.",
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.error("Error al migrar carrito temporal:", error);
            Swal.fire("Error", "Hubo un problema al guardar tus productos del carrito temporal.", "error");
        }
    }
};

/**
 * Actualiza la cantidad de un producto en el carrito (BD para logueados, LocalStorage para no logueados).
 * @param {string} idItemCarrito - El ID del ítem en el carrito (de la tabla items_carrito en BD).
 * @param {string} idProducto - El ID del producto (para uso en LocalStorage).
 * @param {string} talla - La talla del producto (para identificar en LocalStorage).
 * @param {string} color - El color del producto (para identificar en LocalStorage).
 * @param {number} nuevaCantidad - La cantidad total deseada para el ítem.
 * @param {object} usuario - Objeto de usuario logueado (puede ser null).
 * @param {string} token - Token de autenticación (puede ser null).
 */
const actualizarCantidadProducto = async (idItemCarrito, idProducto, talla, color, nuevaCantidad, usuario, token, stock) => {
    if (nuevaCantidad > stock) {
        Swal.fire("¡Error!", "La cantidad no puede ser mayor al stock disponible.", "warning");
        return;
    }
    if (usuario && token) {
        try {
            const res = await fetch("http://localhost:3000/api/carrito/actualizar-cantidad", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id_item_carrito: idItemCarrito, cantidad: nuevaCantidad })
            });
            if (!res.ok) {
                const errorData = await res.json();
                Swal.fire("Error", errorData.message || "No se pudo actualizar la cantidad.", "error");
            }
            cargarContenidoDelCarrito();
        } catch (error) {
            console.error("Error al actualizar cantidad en DB:", error);
            Swal.fire("Error", "Error al actualizar la cantidad del producto.", "error");
        }
    } else {
        // Usuario NO logueado: Actualizar en LocalStorage
        let carritoLocal = JSON.parse(localStorage.getItem("carritoTemporal") || "[]");
        const itemIndex = carritoLocal.findIndex(item =>
            item.id_producto == idProducto && item.talla == talla && item.color == color
        );
        if (itemIndex > -1) {
            carritoLocal[itemIndex].cantidad = nuevaCantidad;
            if (carritoLocal[itemIndex].cantidad <= 0) {
                carritoLocal.splice(itemIndex, 1);
            }
            localStorage.setItem("carritoTemporal", JSON.stringify(carritoLocal));
            cargarContenidoDelCarrito();
        }
    }
    updateCartIconQuantity();
};

/**
 * Elimina un producto del carrito (BD para logueados, LocalStorage para no logueados).
 * @param {string} idItemCarrito - El ID del ítem en el carrito (de la tabla items_carrito en BD).
 * @param {string} idProducto - El ID del producto (para uso en LocalStorage).
 * @param {string} talla - La talla del producto (para identificar en LocalStorage).
 * @param {string} color - El color del producto (para identificar en LocalStorage).
 * @param {object} usuario - Objeto de usuario logueado (puede ser null).
 * @param {string} token - Token de autenticación (puede ser null).
 */
const eliminarProductoDelCarrito = async (idItemCarrito, idProducto, talla, color, usuario, token) => {
    if (usuario && token) {
        try {
            const res = await fetch("http://localhost:3000/api/carrito/eliminar", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id_item_carrito: idItemCarrito }) 
            });
            if (!res.ok) {
                const errorData = await res.json();
                Swal.fire("Error", errorData.message || "No se pudo eliminar el producto.", "error");
            }
            cargarContenidoDelCarrito();
        } catch (error) {
            console.error("Error al eliminar de DB:", error);
            Swal.fire("Error", "Error al eliminar el producto del carrito.", "error");
        }
    } else {
        // Usuario NO logueado: Eliminar de LocalStorage
        let carritoLocal = JSON.parse(localStorage.getItem("carritoTemporal") || "[]");
        // Para LocalStorage, filtramos por id_producto, talla y color
        carritoLocal = carritoLocal.filter(item =>
            !(item.id_producto == idProducto && item.talla == talla && item.color == color)
        );
        localStorage.setItem("carritoTemporal", JSON.stringify(carritoLocal));
        cargarContenidoDelCarrito();
    }
    updateCartIconQuantity();
};

/**
 * Función para actualizar el número en el icono del carrito en el header.
 */
const updateCartIconQuantity = async () => {
    const cartQuantitySpan = document.getElementById('cartQuantity');

    if (!cartQuantitySpan) {
        console.warn("Elemento 'cartQuantity' no encontrado. No se puede actualizar el conteo del carrito.");
        return;
    }

    const token = localStorage.getItem("token");
    let totalItems = 0;

    if (token) {
        try {
            const res = await fetch("http://localhost:3000/api/carrito", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.success && data.carrito && Array.isArray(data.carrito.items)) {
                totalItems = data.carrito.items.reduce((sum, item) => sum + parseInt(item.cantidad || 0), 0);
            }
        } catch (error) {
            console.error("Error al obtener cantidad del carrito para el ícono:", error);
            totalItems = 0; // En caso de error, mostrar 0
        }
    } else {
        const carritoLocal = JSON.parse(localStorage.getItem("carritoTemporal") || "[]");
        totalItems = carritoLocal.reduce((sum, item) => sum + parseInt(item.cantidad || 0), 0);
    }

    cartQuantitySpan.textContent = totalItems > 0 ? totalItems : '';
    cartQuantitySpan.style.display = totalItems > 0 ? 'inline-block' : 'none';
};


export const agregarProductoAlCarrito = async (producto, cantidad, usuario, token) => {
    // Si el usuario está logueado, agrega a la BD
    if (usuario && token) {
        try {
            const res = await fetch("http://localhost:3000/api/carrito/agregar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_producto: producto.id_producto,
                    cantidad: cantidad,
                    precio_unitario_al_momento: producto.precio,
                    talla_nombre_al_momento: producto.talla,
                    color_nombre_al_momento: producto.color
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                Swal.fire({
                    icon: 'success',
                    title: '¡Producto añadido!',
                    text: `${producto.nombre_producto} ha sido añadido al carrito.`,
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                Swal.fire('Error', data.message || 'Error al añadir el producto al carrito.', 'error');
            }
        } catch (error) {
            console.error("Error al añadir producto a DB:", error);
            Swal.fire('Error', 'Error de conexión al añadir el producto.', 'error');
        }
    } else {
        // Si el usuario no está logueado, guarda en localStorage
        let carritoLocal = JSON.parse(localStorage.getItem("carritoTemporal") || "[]");
        // Buscar si el producto ya existe con la misma talla y color
        const existingItemIndex = carritoLocal.findIndex(item =>
            item.id_producto === producto.id_producto &&
            item.talla === producto.talla &&
            item.color === producto.color
        );

        if (existingItemIndex > -1) {
            carritoLocal[existingItemIndex].cantidad += cantidad;
        } else {
            // Añade el producto completo si es nuevo
            carritoLocal.push({
                id_producto: producto.id_producto,
                nombre_producto: producto.nombre_producto,
                imagen: producto.imagen,
                precio: producto.precio,
                talla: producto.talla,
                color: producto.color,
                cantidad: cantidad
            });
        }
        localStorage.setItem("carritoTemporal", JSON.stringify(carritoLocal));
        Swal.fire({
            icon: 'success',
            title: '¡Producto añadido!',
            text: `${producto.nombre_producto} ha sido añadido al carrito.`,
            showConfirmButton: false,
            timer: 1500
        });
    }
    updateCartIconQuantity();
};


// =========================================================
// === Función de inicialización del controlador del carrito ===
// =========================================================

export const carritoController = () => {
    if (!document.getElementById('shoppingBagSidebar')) {
        const body = document.body;
        body.insertAdjacentHTML('beforeend', `
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
            <div class="sidebar" id="shoppingBagSidebar">
                <div class="sidebar-header">
                    <button class="close-btn" id="closeSidebarBtn">
                        <i class="fas fa-times"></i>
                    </button>
                    <h2>Shopping Bag</h2>
                </div>
                <div class="sidebar-content" id="sidebarCartContent">
                </div>
                <div class="sidebar-footer" id="sidebarCartFooter">
                </div>
            </div>
        `);
    }

    cartIcon = document.getElementById('cartIcon');
    closeSidebarBtn = document.getElementById('closeSidebarBtn');
    sidebarOverlay = document.getElementById('sidebarOverlay');
    shoppingBagSidebar = document.getElementById('shoppingBagSidebar');
    sidebarCartContent = document.getElementById('sidebarCartContent');
    sidebarCartFooter = document.getElementById('sidebarCartFooter');

    // Adjuntar Event Listeners (con prevención de duplicados)
    if (cartIcon && !cartIcon.dataset.listenerAdded) {
        cartIcon.addEventListener('click', (event) => {
            event.preventDefault();
            openSidebar();
        });
        cartIcon.dataset.listenerAdded = 'true';
    }

    if (closeSidebarBtn && !closeSidebarBtn.dataset.listenerAdded) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
        closeSidebarBtn.dataset.listenerAdded = 'true';
    }

    if (sidebarOverlay && !sidebarOverlay.dataset.listenerAdded) {
        sidebarOverlay.addEventListener('click', closeSidebar);
        sidebarOverlay.dataset.listenerAdded = 'true';
    }

    window.removeEventListener('loginSuccess', handleLoginSuccess);
    window.addEventListener('loginSuccess', handleLoginSuccess);

    updateCartIconQuantity();

    console.log("Cart Panel Manager Initialized.");
};

const handleLoginSuccess = async () => {
    console.log("loginSuccess event detected in carritoController.");

    const abrirCarritoPostLogin = localStorage.getItem("abrirCarritoPostLogin");

    if (abrirCarritoPostLogin === "true") {
        localStorage.removeItem("abrirCarritoPostLogin");

        console.log("Attempting to migrate temporal cart to DB...");
        await migrarCarritoTemporalABaseDeDatos();

        console.log("Opening sidebar after migration...");
        openSidebar();
    } else {
        cargarContenidoDelCarrito();
    }
};
