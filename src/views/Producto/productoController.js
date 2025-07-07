import { listar_productos } from "../../casos de uso/listarProductos";
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
        const color = document.querySelector('.color'); // si lo usas
        const categoria = document.querySelector('.Categoría'); // primer <a> de categorías
        const genero = document.querySelector('.genero'); // si lo usas
        const descripcion = document.querySelector('.descripcion'); // si lo usas

        // Asignar valores solo si existen los elementos
        if (titulo) titulo.innerText = producto.nombre;
        if (precio) precio.innerText = `$${parseFloat(producto.precio).toLocaleString('es-CO')}`;
        if (imagen) {
            imagen.src = producto.imagen || '/src/uploads/fashion-1.jpg';
            imagen.alt = producto.nombre;
        }
        if (talla) talla.innerText = producto.talla_nombre; console.log(producto.talla_nombre);
        if (color) color.innerText = `Color: ${producto.color_nombre}` || 'Color no disponible';
        if (categoria) categoria.innerText = `Categoria: ${producto.categoria_nombre}`;
        if (genero) genero.innerText = `Genero: ${producto.genero_nombre}` || 'Género no disponible';
        if (descripcion) descripcion.innerText = producto.descripcion;

        // Eventos para cambiar cantidad
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

    } catch (error) {
        console.error('Error al cargar el producto:', error);
    }
};

