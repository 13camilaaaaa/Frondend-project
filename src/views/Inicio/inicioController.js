import { listar_productos } from "../../casos de uso/listarProductos.js";

export const inicioController = async () => {
    const app = document.getElementById('app');
    app.innerHTML = ''; // limpiar contenido previo

    const titulo = document.createElement('h2');
    titulo.textContent = 'Novedades';
    app.append(titulo); // agregar título al app

    // crear contenedor dinámico dentro del app
    const contenedor = document.createElement('div');
    contenedor.id = 'contenedor-productos';
    contenedor.classList.add('grid-productos'); // opcional para estilos

    app.appendChild(contenedor); // insertamos el contenedor dentro de #app

    // función para crear tarjetas
    const crearCard = (producto) => {
        const card = document.createElement('div');
        card.classList.add('card');

        // --- Contenedor de Imagen y Corazón ---
        const divimg = document.createElement('div');
        divimg.classList.add('card-img-container');

        const img = document.createElement('img');
        img.setAttribute('src', `/src/uploads/${producto.imagen}`); // ruta de la imagen por defecto
        img.setAttribute('alt', producto.nombre);
        img.classList.add('card-img');
        divimg.append(img);

        // --- Información del producto ---
        const divinfo = document.createElement('div');
        divinfo.classList.add('card-info');

        const nombre = document.createElement('h3');
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;

        const precio = document.createElement('span');
        precio.classList.add('precio');
        precio.textContent = `$${producto.precio.toLocaleString()}`;


        // Agregamos la información al divinfo
        divinfo.append(nombre, descripcion, precio); // Añade colorOptions aquí

        // Agregamos la imagen y la info a la tarjeta principal
        card.append(divimg, divinfo);

        // Opcional: Hacer que toda la tarjeta sea clickable
        // redirige al hacer clic
        card.addEventListener("click", () => {
            window.location.hash = `#productos/${producto.id}`;
        });

        return card;
    };

    // obtener productos y mostrarlos
    const productos = await listar_productos();
    productos.slice(0, 12).forEach(producto => {
        const card = crearCard(producto);
        contenedor.appendChild(card);
    });
};