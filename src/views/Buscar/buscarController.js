// src/views/Buscar/buscarController.js
import { listar_productos } from "../../casos de uso/listarProductos.js";

/**
 * Controlador para la vista de búsqueda
 * @param {Object} params - Objeto que contiene los parámetros de la URL, como { query: "camisa" }
 */
export const buscarController = async (params) => {
    const contenedor = document.getElementById("resultadosBusqueda");

    if (!contenedor) {
        console.warn("contenedor no encontrado en buscarController");
        return;
    }

    const productos = await listar_productos();

    const query = decodeURIComponent(params?.query || "").toLowerCase();

    const resultados = productos.filter(prod =>
        prod.nombre.toLowerCase().includes(query)
    );

    mostrarResultados(resultados, contenedor);
};

const mostrarResultados = (productos, contenedor) => {

    if (productos.length === 0) {
        contenedor.innerHTML += "<p>No se encontraron productos.</p>";
        return;
    }

    productos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('card');

        const divimg = document.createElement('div');
        divimg.classList.add('card-img-container');
        // agregar imagen y contenido a la tarjeta
        const img = document.createElement('img');
        // img.setAttribute('src', `/src/uploads/${producto.img}`); // ruta de la imagen por db
        img.setAttribute('src', `/src/uploads/${producto.imagen}`); // ruta de la imagen por defecto
        img.setAttribute('alt', producto.nombre);
        img.classList.add('card-img');
        divimg.append(img);


        // agregar información del producto
        const divinfo = document.createElement('div');
        divinfo.classList.add('card-info');
        const nombre = document.createElement('h3');
        nombre.textContent = producto.nombre;

        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;
        const precio = document.createElement('span');
        precio.classList.add('precio');
        precio.textContent = `$${producto.precio.toLocaleString()}`;
        
        divinfo.append(nombre, descripcion, precio); 
        card.append(divimg, divinfo);
        contenedor.append(card);

        card.addEventListener("click", () => {
                window.location.hash = `#productos/${producto.id}`;
            });
    });
};
