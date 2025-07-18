import Swal from "sweetalert2";

let currentUser = null;
let userAddresses = [];
let cartItems = []; // Esto se cargará desde el backend con fetchVentaInfo
let selectedAddressId = null;
let selectedPaymentMethod = "Contra Entrega Efectivo"; // Valor por defecto

// Nueva función para actualizar la vista completa de venta
export const updateVentaView = async () => {
    console.log("Updating Venta View...");
    const success = await fetchVentaInfo(); // Re-fetch all necessary data
    if (success) {
        renderUserInfo();
        renderAddressOptions(); // Las direcciones pueden cambiar si el usuario las edita en perfil
        renderProductList();
    } else {
        document.querySelector('.container').innerHTML = '<p>No se pudo cargar la información de venta. Por favor, intenta de nuevo o revisa tus datos de perfil.</p>';
    }
};

export const ventaController = async () => { // Hacemos el controlador exportable para el router
    console.log("Venta Controller loaded.");

    await updateVentaView(); // Carga inicial de la vista

    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.removeEventListener('click', handlePlaceOrder);
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }

    document.querySelectorAll('.payment-method-item').forEach(item => {
        item.removeEventListener('click', handlePaymentMethodClick);
        item.addEventListener('click', handlePaymentMethodClick);
    });
};

// Función para manejar el clic en el método de pago
const handlePaymentMethodClick = (event) => {
    document.querySelectorAll('.payment-method-item').forEach(el => el.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
    event.currentTarget.querySelector('input[type="radio"]').checked = true;
    selectedPaymentMethod = event.currentTarget.querySelector('input[type="radio"]').value;
};


/**
 * Función para obtener la información del usuario (de localStorage), sus direcciones (del mismo objeto de usuario) y su carrito (del backend).
 */
const fetchVentaInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
        Swal.fire({
            icon: 'warning',
            title: 'No has iniciado sesión',
            text: 'Para finalizar tu compra, por favor inicia sesión.',
            showCancelButton: true,
            confirmButtonText: 'Iniciar sesión',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                location.hash = '#login';
            } else {
                location.hash = '';
            }
        });
        return false;
    }

    try {
        currentUser = JSON.parse(localStorage.getItem("usuario")); // Carga el usuario del localStorage

        if (!currentUser || !currentUser.id || !currentUser.correo_usuario) {
            Swal.fire("Error", "No se pudo obtener la información completa del usuario. Por favor, inicia sesión de nuevo.", "error");
            return false;
        }

        // --- OBTENER DIRECCIONES DEL OBJETO currentUser (NO SE HACE FETCH ADICIONAL) ---
        userAddresses = obtenerDireccionesDesdeUsuarioLocal(currentUser); // <-- Aquí se usa la función corregida

        // --- FETCH DEL CARRITO ---
        const carritoResponse = await fetch("http://localhost:3000/api/carrito", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const carritoData = await carritoResponse.json();

        if (carritoResponse.ok && carritoData.success && carritoData.carrito && Array.isArray(carritoData.carrito.items)) {
            cartItems = carritoData.carrito.items;

            // Establecer selectedAddressId si hay direcciones y ninguna está seleccionada
            if (userAddresses.length > 0) {
                // Si ya hay una seleccionada y está en la lista de direcciones, la mantenemos
                if (selectedAddressId && userAddresses.some(addr => String(addr.id) === String(selectedAddressId))) {
                    // selectedAddressId ya es válido, no hacemos nada
                } else {
                    // Si no hay seleccionada, o la seleccionada no es válida, seleccionamos la primera
                    selectedAddressId = userAddresses[0].id;
                }
            } else {
                selectedAddressId = null; // No hay direcciones disponibles
            }
            return true;
        } else {
            cartItems = [];
            let errorMessage = "No se pudo cargar la información del carrito.";
            if (carritoData && carritoData.message) {
                errorMessage = carritoData.message;
            } else if (carritoData && !carritoData.carrito) {
                errorMessage = "La estructura de la respuesta del carrito no es la esperada (falta 'carrito' o 'items').";
            } else if (carritoData.carrito && !Array.isArray(carritoData.carrito.items)) {
                errorMessage = "Los ítems del carrito no son un array.";
            }
            Swal.fire("Error", errorMessage, "error");
            return false;
        }
    } catch (error) {
        console.error("Error fetching venta info:", error);
        cartItems = [];
        Swal.fire("Error", `Error de conexión al cargar la información de venta: ${error.message}`, "error");
        return false;
    }
};

/**
 * Función para extraer la dirección del objeto de usuario en localStorage.
 * Esta función ahora es CRÍTICA y se basa en la estructura que proporcionaste.
 */
const obtenerDireccionesDesdeUsuarioLocal = (usuario) => {
    const addresses = [];
    // Verificar si el objeto de usuario contiene los campos de dirección
    // Usamos usuario.id como el ID de esta dirección única del usuario
    if (usuario.id_direccion && usuario.direccion_numero_via && usuario.direccion_ciudad && usuario.direccion_barrio) {
        addresses.push({
            id: usuario.id,
            nombre_tipo_via: usuario.direccion_tipo_via || 'Calle',
            numero_via: usuario.direccion_numero_via,
            complemento: usuario.direccion_complemento,
            barrio: usuario.direccion_barrio,
            nombre_ciudad: usuario.direccion_ciudad,
            nombre_departamento: usuario.direccion_departamento,
            nombre_pais: usuario.direccion_pais
        });
    }
    return addresses;
};

function ocultarCorreo(correo) {
    if (!correo || !correo.includes("@")) return "********";

    const [nombre, dominioCompleto] = correo.split("@");
    const dominioPartes = dominioCompleto.split(".");
    const dominioNombre = dominioPartes[0]; // parte antes del .com

    const visibleNombre = nombre[0];
    const visibleDominio = dominioNombre[0];
    const dominioRestante = dominioCompleto.slice(1); // incluye .com o .co

    return `${visibleNombre}${"*".repeat(nombre.length - 1)}@${visibleDominio}${"*".repeat(dominioNombre.length - 1)}.${dominioPartes.slice(1).join(".")}`;
}

const renderUserInfo = () => {
    const userNameEl = document.getElementById('userName');
    const userIdentificationEl = document.getElementById('userIdentification');
    const userEmailEl = document.getElementById('userEmail');

    if (currentUser) {
        userNameEl.textContent = `${currentUser.nombre_usuario || ''} ${currentUser.apellido_usuario || ''}`;
        userIdentificationEl.textContent = currentUser.numero_identificacion ? `${currentUser.tipo_identificacion_nombre || ''}: ${currentUser.numero_identificacion}` : 'No proporcionado';
        userEmailEl.textContent = ocultarCorreo(currentUser.correo_usuario) || 'No proporcionado';
    } else {
        userNameEl.textContent = 'No disponible';
        userIdentificationEl.textContent = 'No disponible';
        userEmailEl.textContent = 'No disponible';
    }
};

const renderAddressOptions = () => {
    const addressOptionsEl = document.getElementById('addressOptions');
    addressOptionsEl.innerHTML = ''; // Limpiar opciones anteriores

    if (userAddresses.length === 0) {
        addressOptionsEl.innerHTML = '<p>No tienes direcciones guardadas. Por favor, añade una en tu perfil.</p>';
        selectedAddressId = null;
        return;
    }

    userAddresses.forEach((address) => {
        const addressItem = document.createElement('div');
        const currentAddressId = address.id;
        const isSelected = (String(selectedAddressId) === String(currentAddressId)); // Compara con el ID seleccionado
        addressItem.className = `address-item ${isSelected ? 'selected' : ''}`;
        addressItem.innerHTML = `
            <input type="radio" id="address-${currentAddressId}" name="shippingAddress" value="${currentAddressId}" ${isSelected ? 'checked' : ''}>
            <div class="address-details">
                <p><strong>${address.nombre_tipo_via || ''} ${address.numero_via || ''}</strong></p>
                <p>${address.complemento ? `${address.complemento}, ` : ''}${address.barrio || ''}</p>
                <p>${address.nombre_ciudad || ''}, ${address.nombre_departamento || ''}, ${address.nombre_pais || ''}</p>
            </div>
        `;
        addressOptionsEl.appendChild(addressItem);

        // Adjuntar listener para la selección de dirección
        addressItem.addEventListener('click', () => {
            document.querySelectorAll('.address-item').forEach(item => item.classList.remove('selected'));
            addressItem.classList.add('selected');
            addressItem.querySelector('input[type="radio"]').checked = true;
            selectedAddressId = currentAddressId;
        });

        // Adjuntar listener para el botón de editar dirección (si aplica)
        const editBtn = addressItem.querySelector('.edit-address-btn');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic en el botón seleccione la dirección
                // Aquí podrías redirigir al perfil o abrir un modal para editar la dirección
                location.hash = `#perfil?tab=direccion&edit=${currentAddressId}`;
            });
        }
    });
};

const renderProductList = () => {
    const checkoutProductListEl = document.getElementById('checkoutProductList');
    const summarySubtotalEl = document.getElementById('summarySubtotal');
    const summaryTotalEl = document.getElementById('summaryTotal');

    if (!cartItems || cartItems.length === 0) {
        checkoutProductListEl.innerHTML = '<p>Tu carrito está vacío.</p>';
        summarySubtotalEl.textContent = '$0.00';
        summaryTotalEl.textContent = '$0.00';
        return;
    }

    let subtotal = 0;
    const itemsHtml = cartItems.map(item => {
        const itemPrice = parseFloat(item.precio || 0); // Asegúrate de que item.precio es el precio unitario del producto
        const itemQuantity = parseInt(item.cantidad || 0);
        const itemTotalPrice = itemPrice * itemQuantity;
        subtotal += itemTotalPrice;

        return `
            <div class="product-item">
                <img src="/src/uploads/${item.imagen}" alt="${item.nombre_producto}" class="product-item-img">
                <div class="product-details">
                    <h3>${item.nombre_producto}</h3>
                    <p>${item.talla ? `Talla: ${item.talla} |` : ''} ${item.color ? `Color: ${item.color}` : ''}</p>
                    <p>Cantidad: ${item.cantidad}</p>
                </div>
                <span class="product-price-qty">$${itemTotalPrice.toLocaleString('es-CO')}</span>
            </div>
        `;
    }).join('');

    checkoutProductListEl.innerHTML = itemsHtml;
    summarySubtotalEl.textContent = `$${subtotal.toLocaleString('es-CO')}`;
    summaryTotalEl.textContent = `$${subtotal.toLocaleString('es-CO')}`;
};

/**
 * Valida la información del usuario antes de realizar el pedido.
 * Muestra alertas si falta información y le da opciones.
 */
const validateUserInfoForOrder = () => {
    // Si no hay currentUser, o falta identificación o dirección, mostrar alerta y dar opciones
    const missingIdentification = !currentUser || !currentUser.numero_identificacion || !currentUser.id_tipo_identificacion;
    const missingAddress = userAddresses.length === 0 || !selectedAddressId; // Validar si hay direcciones cargadas o seleccionada
    const cartEmpty = cartItems.length === 0;

    if (cartEmpty) {
        Swal.fire({
            icon: 'info',
            title: 'Carrito Vacío',
            text: 'No hay productos en tu carrito para realizar un pedido.',
            confirmButtonText: 'Seguir Comprando'
        }).then(() => { location.hash = ''; }); // Redirige al inicio o tienda
        return false;
    }

    if (missingIdentification || missingAddress) {
        let title = '';
        let html = '';
        let icon = 'warning';

        if (missingIdentification && missingAddress) {
            title = 'Información Personal y Dirección Incompletas';
            html = 'Para poder finalizar su pedido, necesitamos que complete su **información de identificación** y **añada una dirección de envío** en su perfil.';
        } else if (missingIdentification) {
            title = 'Información de Identificación Incompleta';
            html = 'Para poder finalizar su pedido, necesitamos que llene su **tipo** y **número de identificación** en su perfil.';
        } else if (missingAddress) {
            title = 'Dirección de Envío Requerida';
            html = 'Para poder finalizar su pedido, debes **seleccionar o añadir una dirección de envío** en su perfil.';
        }

        Swal.fire({
            icon: icon,
            title: title,
            html: html,
            showCancelButton: true,
            confirmButtonText: 'Ir a mi Perfil',
            cancelButtonText: 'Seguir Navegando',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                location.hash = '#perfil'; // Redirige al perfil
            } else {
                location.hash = ''; // Vuelve al inicio o a la tienda
            }
        });
        return false;
    }

    return true; // Si todo está bien, devuelve true
};

const handlePlaceOrder = async () => {
    if (!validateUserInfoForOrder()) {
        return;
    }

    const selectedPaymentRadio = document.querySelector('input[name="paymentMethod"]:checked');

    if (selectedPaymentRadio) {
        selectedPaymentMethod = selectedPaymentRadio.value;
    } else {
        Swal.fire('Error', 'Por favor, selecciona un método de pago.', 'error');
        return;
    }

    Swal.fire({
        title: '¿Confirmar Pedido?',
        text: `Estás a punto de realizar tu pedido con un total de ${document.getElementById('summaryTotal').textContent}.`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, Confirmar',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
            const token = localStorage.getItem("token");
            const totalOrder = parseFloat(document.getElementById('summaryTotal').textContent.replace('$', '').replace(/\./g, '').replace(',', '.'));

            const productsToSend = cartItems.map(item => ({
                id_producto: item.id_producto || item.id,
                cantidad: item.cantidad,
                precio_unitario: item.precio,
                talla: item.talla || item.talla_nombre_al_momento || null,
                color: item.color || item.color_nombre_al_momento || null
            }));

            console.log("🟡 Productos enviados al backend:", productsToSend);
            if (productsToSend.length === 0) {
                Swal.showValidationMessage('El carrito está vacío. No se puede realizar el pedido.');

                return false;
            }
            try {
                const response = await fetch('http://localhost:3000/api/ventas/', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_usuario: currentUser.id,
                        id_direccion_envio: selectedAddressId, // Este será el ID del usuario si la dirección es parte del objeto de usuario
                        metodo_pago: selectedPaymentMethod,
                        total: totalOrder,
                        productos: productsToSend
                    })

                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || 'Error al realizar el pedido.');
                }
                return data;
            } catch (error) {
                console.error("Error en preConfirm (realizar pedido):", error);
                Swal.showValidationMessage(`Error: ${error.message}`);
                return false;
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then(async (result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('cart');
            localStorage.removeItem('cartItems');
            cartItems = [];

            Swal.fire({
                icon: 'success',
                title: '¡Pedido Realizado!',
                text: 'Tu pedido ha sido procesado exitosamente. Recibirás un correo de confirmación.',
                confirmButtonText: 'Ir a Mis Pedidos'
            }).then(() => {
                location.hash = '#pedido';
            });
        }
    });
};