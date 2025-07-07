

// Estilos generales y por vista
import './main.css';
import './views/Login/style.css';
import './views/Registro/style.css';
import './views/Inicio/style.css';
import './views/Buscar/style.css';
import './views/Contacto/style.css';
import './views/Envios/style.css';
import './views/Pagos/style.css';
import './views/Devoluciones/style.css';
import './views/Contactanos/style.css';
import './views/Tienda/style.css';
import './views/Carrito/style.css';
import './views/Producto/style.css';

// Componentes globales
import './componentes/header.js';
import './componentes/footer.js';
import { carritoController } from './componentes/carritoController.js';

// SPA Router
import { router } from './router/router.js';

const app = document.querySelector('#app');

window.addEventListener('DOMContentLoaded', () => {
    router(app);
    carritoController(); // Inicializa el controlador del carrito
});

window.addEventListener('hashchange', () => {
    router(app);
});


