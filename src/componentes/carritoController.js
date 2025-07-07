// src/views/Carrito/carritoController.js

export const carritoController = () => {
// src/controllers/cartPanelManager.js (nuevo nombre)

let isPanelInitialized = false; // Bandera para asegurar que solo se inyecta una vez


    // Solo inyecta el HTML una vez
    if (!isPanelInitialized) {
        const body = document.body;
        // Opción A: Inyectar directamente al body (más simple si no hay un div contenedor)
        body.insertAdjacentHTML('beforeend', `
            <div class="sidebar-overlay" id="sidebarOverlay"></div>
            <div class="sidebar" id="shoppingBagSidebar">
                <div class="sidebar-header">
                    <h2>Shopping Bag</h2>
                    <button class="close-btn" id="closeSidebarBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="sidebar-content empty-cart">
                    <i class="fas fa-shopping-bag cart-empty-icon"></i>
                    <p class="empty-cart-message">Tu carrito está vacío</p>
                    <button class="continue-shopping-btn" id="continueShoppingBtn">Seguir comprando</button>
                    <p class="login-prompt">¿Tienes una cuenta? <a href="#login" class="login-link">Inicia sesión</a> para finalizar tus compras con mayor rapidez.</p>
                </div>
            </div>
        `);
        isPanelInitialized = true;
    }

    const cartIcon = document.getElementById('cartIcon');
    const shoppingBagSidebar = document.getElementById('shoppingBagSidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const loginLink = document.querySelector('#shoppingBagSidebar .login-link'); // Asegurarse de que selecciona dentro del panel

    // Función para abrir el panel
    const openSidebar = () => {
        if (shoppingBagSidebar && sidebarOverlay) { // Verificación necesaria si se carga dinámicamente
            shoppingBagSidebar.classList.add('open');
            sidebarOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    // Función para cerrar el panel
    const closeSidebar = () => {
        if (shoppingBagSidebar && sidebarOverlay) {
            shoppingBagSidebar.classList.remove('open');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    // Event Listeners (asignados solo una vez)
    if (cartIcon && !cartIcon.dataset.listenerAdded) { // Previene múltiples listeners
        cartIcon.addEventListener('click', (event) => {
            event.preventDefault();
            openSidebar();
        });
        cartIcon.dataset.listenerAdded = 'true'; // Marca que el listener ya fue añadido
    }

    if (closeSidebarBtn && !closeSidebarBtn.dataset.listenerAdded) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
        closeSidebarBtn.dataset.listenerAdded = 'true';
    }

    if (sidebarOverlay && !sidebarOverlay.dataset.listenerAdded) {
        sidebarOverlay.addEventListener('click', closeSidebar);
        sidebarOverlay.dataset.listenerAdded = 'true';
    }

    if (continueShoppingBtn && !continueShoppingBtn.dataset.listenerAdded) {
        continueShoppingBtn.addEventListener('click', () => {
            closeSidebar();
            window.location.hash = '/'; // Vuelve a la página de inicio sin activar el router para el panel
        });
        continueShoppingBtn.dataset.listenerAdded = 'true';
    }

    if (loginLink && !loginLink.dataset.listenerAdded) {
        loginLink.addEventListener('click', () => {
            closeSidebar();
            // El href="#login" ya hace la navegación
        });
        loginLink.dataset.listenerAdded = 'true';
    }

    console.log("Cart Panel Manager Initialized.");
};