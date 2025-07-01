const app = document.querySelector('#app');
const header = document.querySelector('#header');
header.classList.add('container', 'header');

// --- ICONO DE HAMBURGUESA ---
const hamburgerMenuIcon = document.createElement('div');
hamburgerMenuIcon.classList.add('hamburger-menu-icon');
hamburgerMenuIcon.innerHTML = '<i class="fas fa-bars"></i>';


// --- MENÚ PRINCIPAL (VERSIÓN ESCRITORIO) ---
const menuDiv = document.createElement('div');
menuDiv.classList.add('menu'); // Esta es la barra superior del header con ROSS MILLE, etc.

// --- Grupo Izquierdo del Menú de Escritorio (Servicio al cliente) ---
const menuLeft = document.createElement('div');
menuLeft.classList.add('menu__left');

const contacto = document.createElement('a');
contacto.textContent = 'Servicio al cliente';
contacto.classList.add('menu__link', 'menu__link--contacto');
contacto.setAttribute("href", '#contacto');
menuLeft.append(contacto);

// --- Grupo Central del Menú de Escritorio (ROSS MILLE) ---
const menuCenter = document.createElement('div');
menuCenter.classList.add('menu__center');

const inicio = document.createElement('a');
inicio.textContent = 'ROSS MILLE';
inicio.classList.add('menu__link', 'menu__brand');
inicio.setAttribute("href", '/');
menuCenter.append(inicio);


// --- Grupo Derecho del Menú de Escritorio (Login y Carrito, y BUSCADOR PARA MÓVIL/TABLETA) ---
const menuRight = document.createElement('div');
menuRight.classList.add('menu__right');

const login = document.createElement('a');
login.setAttribute("href", '#login');
login.classList.add('menu__link');
const loginIcon = document.createElement('i');
loginIcon.classList.add('fas', 'fa-user');
const loginText = document.createElement('span');
loginText.textContent = 'Iniciar sesión';
loginText.classList.add('menu__link-text');
login.append(loginIcon, loginText);
menuRight.append(login);

const carrito = document.createElement('a');
carrito.setAttribute("href", '#carrito');
carrito.classList.add('menu__link');
const carritoIcon = document.createElement('i');
carritoIcon.classList.add('fas', 'fa-shopping-cart');
const carritoText = document.createElement('span');
carritoText.textContent = 'Carrito';
carritoText.classList.add('menu__link-text');
carrito.append(carritoIcon, carritoText);
menuRight.append(carrito);

// BUSCADOR EN EL HEADER (PARA MÓVIL/TABLETA) - **Este se mantiene en menuRight para móvil**
const searchHeaderContainer = document.createElement('div');
searchHeaderContainer.classList.add('search-header-container');
const searchHeaderIcon = document.createElement('i');
searchHeaderIcon.classList.add('fas', 'fa-search');
const searchHeaderInput = document.createElement('input');
searchHeaderInput.setAttribute("type", 'search');
searchHeaderInput.setAttribute("placeholder", 'Buscar...');
searchHeaderInput.classList.add('category__link', 'search__input', 'search-header-input');
searchHeaderInput.setAttribute("id", 'productSearchHeaderInput');
searchHeaderInput.setAttribute("name", 'search_query_header');
searchHeaderContainer.append(searchHeaderIcon, searchHeaderInput);
menuRight.append(searchHeaderContainer); // Se adjunta a menuRight

// Adjuntar los grupos al menú principal
menuDiv.append(menuLeft, menuCenter, menuRight);

// --- BARRA DE CATEGORÍAS (AHORA DENTRO DEL HEADER) ---
const categoriesBar = document.createElement('div');
categoriesBar.classList.add('container', 'categories-bar'); // Mantén 'container' y 'categories-bar'

const categoriesMenu = document.createElement('div');
categoriesMenu.classList.add('categories-menu'); // Aquí puedes añadir 'flex' si tu CSS lo requiere

const categoriesGroup = document.createElement('div');
categoriesGroup.classList.add('categories-menu__group');

const mujerLink = document.createElement('a');
mujerLink.textContent = 'Mujer';
mujerLink.classList.add('category__link');
mujerLink.setAttribute("href", '#productos/Mujer');
categoriesGroup.append(mujerLink);

const hombreLink = document.createElement('a');
hombreLink.textContent = 'Hombre';
hombreLink.classList.add('category__link');
hombreLink.setAttribute("href", '#productos/Hombre');
categoriesGroup.append(hombreLink);

const bebesLink = document.createElement('a');
bebesLink.textContent = 'Bebés';
bebesLink.classList.add('category__link');
bebesLink.setAttribute("href", '#productos/Bebe');
categoriesGroup.append(bebesLink);

const ninosLink = document.createElement('a');
ninosLink.textContent = 'Niños';
ninosLink.classList.add('category__link');
ninosLink.setAttribute("href", '#productos/Nino');
categoriesGroup.append(ninosLink);

categoriesMenu.append(categoriesGroup);

// BUSCADOR EN EL HEADER (PARA ESCRITORIO) - **Ahora también estará dentro de categoriesMenu**
const searchDesktopContainer = document.createElement('div');
searchDesktopContainer.classList.add('search-desktop-container');
const searchDesktopIcon = document.createElement('i');
searchDesktopIcon.classList.add('fas', 'fa-search');
const searchDesktopInput = document.createElement('input');
searchDesktopInput.setAttribute("type", 'search');
searchDesktopInput.setAttribute("placeholder", 'Buscar Productos...');
searchDesktopInput.classList.add('category__link', 'search__input', 'search-desktop-input');
searchDesktopInput.setAttribute("id", 'productSearchDesktopInput');
searchDesktopInput.setAttribute("name", 'search_query_desktop');
searchDesktopContainer.append(searchDesktopIcon, searchDesktopInput);
categoriesMenu.append(searchDesktopContainer); // Se adjunta a categoriesMenu

categoriesBar.append(categoriesMenu); // Adjuntar categoriesMenu a categoriesBar

// --- MENÚ MÓVIL/TABLET (EL CONTENEDOR DESPLEGABLE DE LA HAMBURGUESA) ---
const mobileNav = document.createElement('nav');
mobileNav.classList.add('mobile-nav');
const mobileMenuUl = document.createElement('ul');
mobileMenuUl.classList.add('mobile-menu__list');
mobileNav.append(mobileMenuUl);

// Contenido del Menú Móvil
const mobileLinksData = [
    { text: 'Servicio al cliente', href: '/contacto', icon: null },
    { text: 'Mujer', href: '#productos/Mujer', icon: null },
    { text: 'Hombre', href: '#productos/Hombre', icon: null },
    { text: 'Bebés', href: '#productos/Bebe', icon: null },
    { text: 'Niños', href: '#productos/Niño', icon: null }
];

mobileLinksData.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = link.text;
    a.setAttribute('href', link.href);
    a.classList.add('mobile-menu__link');
    if (link.icon) {
        const icon = document.createElement('i');
        icon.classList.add(...link.icon.split(' '));
        a.prepend(icon);
    }
    li.append(a);
    mobileMenuUl.append(li);
});

// Ensamblaje Final en el DOM
// CAMBIO CLAVE AQUÍ: categoriesBar se adjunta al header
header.append(hamburgerMenuIcon, menuDiv, categoriesBar, mobileNav);
// Quita app.append(categoriesBar); si estaba aquí, ya no es necesario
// app.append( categoriesBar); // ESTO SE ELIMINA


// Lógica para el Toggle del Menú de Hamburguesa
hamburgerMenuIcon.addEventListener('click', () => {
    mobileNav.classList.toggle('is-open');
    hamburgerMenuIcon.classList.toggle('is-active');
});

header.addEventListener('click', (event) => {
    // Asegúrate de que el clic dentro del categoriesBar no cierre el menú móvil si está abierto
    if (!mobileNav.contains(event.target) && !hamburgerMenuIcon.contains(event.target) && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        hamburgerMenuIcon.classList.remove('is-active');
    }
});

// NUEVA FUNCIÓN Y LISTENER PARA EL CAMBIO DE ROSS MILLE / RM
function updateRossMilleBrand() {
    const screenWidth = window.innerWidth;
    const rossMilleElement = document.querySelector('.menu__brand');

    if (rossMilleElement) { // Asegúrate de que el elemento exista
        if (screenWidth < 550) {
            rossMilleElement.textContent = 'R'; // O lo que desees para móvil
        } else {
            rossMilleElement.textContent = 'ROSS MILLE';
        }
    }
}

import { listar_productos } from "../casos de uso/listarProductos.js";

// funcionalidad del buscador en el header
(async () => {
    const input = document.getElementById("productSearchDesktopInput");
    if (!input) return;

    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.classList.add("search-suggestions");
    input.parentElement.appendChild(suggestionsContainer);

    const productos = await listar_productos();

    input.addEventListener("input", () => {
        const query = input.value.toLowerCase();
        suggestionsContainer.innerHTML = "";

        if (query === "") return;

        const resultados = productos.filter(prod =>
            prod.nombre.toLowerCase().includes(query)
        );

        resultados.forEach(prod => {
            const item = document.createElement("div");
            item.textContent = prod.nombre;
            item.classList.add("suggestion-item");

            item.addEventListener("click", () => {
                input.value = prod.nombre;
                suggestionsContainer.innerHTML = "";
                window.location.hash = `#buscar/${encodeURIComponent(prod.nombre)}`;
            });


            suggestionsContainer.appendChild(item);
        });
    });

    input.addEventListener("keypress", e => {
        if (e.key === "Enter") {
            const query = input.value.trim();
            if (query !== "") {
                location.hash = `#buscar/${encodeURIComponent(query)}`;
                suggestionsContainer.innerHTML = "";
            }
        }
    });
})();

function activarBuscador(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const suggestionsContainer = document.createElement("div");
    suggestionsContainer.classList.add("search-suggestions");
    input.parentElement.appendChild(suggestionsContainer);

    listar_productos().then(productos => {
        input.addEventListener("input", () => {
            const query = input.value.toLowerCase();
            suggestionsContainer.innerHTML = "";

            if (query === "") return;

            const resultados = productos.filter(prod =>
                prod.nombre.toLowerCase().includes(query)
            );

            resultados.forEach(prod => {
                const item = document.createElement("div");
                item.textContent = prod.nombre;
                item.classList.add("suggestion-item");

                item.addEventListener("click", () => {
                    input.value = prod.nombre;
                    suggestionsContainer.innerHTML = "";
                    window.location.hash = `#buscar/${encodeURIComponent(prod.nombre)}`;
                });

                suggestionsContainer.appendChild(item);
            });
        });

        input.addEventListener("keypress", e => {
            if (e.key === "Enter") {
                const query = input.value.trim();
                if (query !== "") {
                    location.hash = `#buscar/${encodeURIComponent(query)}`;
                    suggestionsContainer.innerHTML = "";
                }
            }
        });
    });
}

// activamos ambos buscadores (escritorio y móvil)
activarBuscador("productSearchDesktopInput");
activarBuscador("productSearchHeaderInput");




// Llamar a la función al cargar la página
updateRossMilleBrand();

// Llamar a la función cada vez que se redimensiona la ventana
window.addEventListener('resize', updateRossMilleBrand);

