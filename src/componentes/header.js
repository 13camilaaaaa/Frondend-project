// ... (código existente del header.js o main.js) ...

const app = document.querySelector('#app');
const header = document.querySelector('#header');
header.classList.add('container', 'header');

// --- ICONO DE HAMBURGUESA ---
const hamburgerMenuIcon = document.createElement('div');
hamburgerMenuIcon.classList.add('hamburger-menu-icon');
hamburgerMenuIcon.innerHTML = '<i class="fas fa-bars"></i>';


// --- MENÚ PRINCIPAL (VERSiÓN ESCRITORIO) ---
const menuDiv = document.createElement('div');
menuDiv.classList.add('menu');

// --- Grupo Izquierdo del Menú de Escritorio (Servicio al cliente) ---
const menuLeft = document.createElement('div');
menuLeft.classList.add('menu__left');

const contacto = document.createElement('a');
contacto.textContent = 'Servicio al cliente';
contacto.classList.add('menu__link');
contacto.setAttribute("href", '/contacto');
menuLeft.append(contacto);

// --- Grupo Central del Menú de Escritorio (ROSS MILLE) ---
const menuCenter = document.createElement('div');
menuCenter.classList.add('menu__center');

const inicio = document.createElement('a');
// **MODIFICACIÓN AQUÍ**: El texto inicial será ROSS MILLE
inicio.textContent = 'ROSS MILLE';
inicio.classList.add('menu__link', 'menu__brand');
inicio.setAttribute("href", '/');
menuCenter.append(inicio);


// --- Grupo Derecho del Menú de Escritorio (Login y Carrito, y BUSCADOR PARA MÓVIL/TABLETA) ---
const menuRight = document.createElement('div');
menuRight.classList.add('menu__right');

const login = document.createElement('a');
login.setAttribute("href", '/login');
login.classList.add('menu__link');
const loginIcon = document.createElement('i');
loginIcon.classList.add('fas', 'fa-user');
const loginText = document.createElement('span');
loginText.textContent = 'Iniciar sesión';
loginText.classList.add('menu__link-text');
login.append(loginIcon, loginText);
menuRight.append(login);

const carrito = document.createElement('a');
carrito.setAttribute("href", '/carrito');
carrito.classList.add('menu__link');
const carritoIcon = document.createElement('i');
carritoIcon.classList.add('fas', 'fa-shopping-cart');
const carritoText = document.createElement('span');
carritoText.textContent = 'Carrito';
carritoText.classList.add('menu__link-text');
carrito.append(carritoIcon, carritoText);
menuRight.append(carrito);

// BUSCADOR EN EL HEADER (PARA MÓVIL/TABLETA)
const searchHeaderContainer = document.createElement('div');
searchHeaderContainer.classList.add('search-header-container');
const searchHeaderInput = document.createElement('input');
searchHeaderInput.setAttribute("type", 'search');
searchHeaderInput.setAttribute("placeholder", 'Buscar...');
searchHeaderInput.classList.add('category__link', 'search__input', 'search-header-input');
searchHeaderInput.setAttribute("id", 'productSearchHeaderInput');
searchHeaderInput.setAttribute("name", 'search_query_header');
const searchHeaderIcon = document.createElement('i');
searchHeaderIcon.classList.add('fas', 'fa-search');

searchHeaderContainer.append(searchHeaderIcon, searchHeaderInput);
menuRight.append(searchHeaderContainer);

menuDiv.append(menuLeft, menuCenter, menuRight);

// --- BARRA DE CATEGORÍAS (DEBAJO DEL HEADER, PARA ESCRITORIO) ---
const categoriesBar = document.createElement('div');
categoriesBar.classList.add('container', 'categories-bar');

const categoriesMenu = document.createElement('div');
categoriesMenu.classList.add('categories-menu');

const categoriesGroup = document.createElement('div');
categoriesGroup.classList.add('categories-menu__group');

const mujerLink = document.createElement('a');
mujerLink.textContent = 'Mujer';
mujerLink.classList.add('category__link');
mujerLink.setAttribute("href", '/productos/mujer');
categoriesGroup.append(mujerLink);

const hombreLink = document.createElement('a');
hombreLink.textContent = 'Hombre';
hombreLink.classList.add('category__link');
hombreLink.setAttribute("href", '/productos/hombre');
categoriesGroup.append(hombreLink);

const bebesLink = document.createElement('a');
bebesLink.textContent = 'Bebés';
bebesLink.classList.add('category__link');
bebesLink.setAttribute("href", '/productos/bebes');
categoriesGroup.append(bebesLink);

const ninosLink = document.createElement('a');
ninosLink.textContent = 'Niños';
ninosLink.classList.add('category__link');
ninosLink.setAttribute("href", '/productos/ninos');
categoriesGroup.append(ninosLink);

categoriesMenu.append(categoriesGroup);

const searchDesktopContainer = document.createElement('div');
searchDesktopContainer.classList.add('search-desktop-container');
const searchDesktopInput = document.createElement('input');
searchDesktopInput.setAttribute("type", 'search');
searchDesktopInput.setAttribute("placeholder", 'Buscar Productos...');
searchDesktopInput.classList.add('category__link', 'search__input', 'search-desktop-input');
searchDesktopInput.setAttribute("id", 'productSearchDesktopInput');
searchDesktopInput.setAttribute("name", 'search_query_desktop');
const searchDesktopIcon = document.createElement('i');
searchDesktopIcon.classList.add('fas', 'fa-search');

searchDesktopContainer.append(searchDesktopIcon, searchDesktopInput);
categoriesMenu.append(searchDesktopContainer);

categoriesBar.append(categoriesMenu);

// --- MENÚ MÓVIL/TABLET (EL CONTENEDOR DESPLEGABLE DE LA HAMBURGUESA) ---
const mobileNav = document.createElement('nav');
mobileNav.classList.add('mobile-nav');
const mobileMenuUl = document.createElement('ul');
mobileMenuUl.classList.add('mobile-menu__list');
mobileNav.append(mobileMenuUl);

// Contenido del Menú Móvil - **Asegurarse de que ROSS MILLE también esté aquí si se quiere en la hamburguesa**
const mobileLinksData = [
    { text: 'Servicio al cliente', href: '/contacto', icon: null },
    { text: 'ROSS MILLE', href: '/', icon: null }, // ROSS MILLE también en hamburguesa
    { text: 'Mujer', href: '/productos/mujer', icon: null },
    { text: 'Hombre', href: '/productos/hombre', icon: null },
    { text: 'Bebés', href: '/productos/bebes', icon: null },
    { text: 'Niños', href: '/productos/ninos', icon: null },
    { text: 'Iniciar sesión', href: '/login', icon: 'fas fa-user' },
    { text: 'Carrito', href: '/carrito', icon: 'fas fa-shopping-cart' },
    { text: 'Buscar Productos', href: '/buscar', icon: 'fas fa-search' }
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
header.append(hamburgerMenuIcon, menuDiv);
app.append(header, categoriesBar, mobileNav);

// Lógica para el Toggle del Menú de Hamburguesa
hamburgerMenuIcon.addEventListener('click', () => {
    mobileNav.classList.toggle('is-open');
    hamburgerMenuIcon.classList.toggle('is-active');
});

app.addEventListener('click', (event) => {
    if (!mobileNav.contains(event.target) && !hamburgerMenuIcon.contains(event.target) && mobileNav.classList.contains('is-open')) {
        mobileNav.classList.remove('is-open');
        hamburgerMenuIcon.classList.remove('is-active');
    }
});

// **NUEVA FUNCIÓN Y LISTENER PARA EL CAMBIO DE ROSS MILLE / RM**
function updateRossMilleBrand() {
    const screenWidth = window.innerWidth;
    const rossMilleElement = document.querySelector('.menu__brand'); // Seleccionamos el elemento ROSS MILLE

    if (screenWidth < 550) {
        rossMilleElement.textContent = ''; // Añade una clase para la fuente
    } else {
        rossMilleElement.textContent = 'ROSS MILLE'; // Quita la clase si no es necesario
    }
}

// Llamar a la función al cargar la página
updateRossMilleBrand();

// Llamar a la función cada vez que se redimensiona la ventana
window.addEventListener('resize', updateRossMilleBrand);