export const generosController = async (params) => {
    const generoSolicitado = params.nombre;
    const app = document.getElementById("app");

    console.log(generoSolicitado);
    const title = document.createElement("h2");
    title.classList.add("titulo-genero");
    title.textContent = `Explora nuestra colección de ${generoSolicitado}`;
    const container_card = document.querySelector("#contenedor-productos");
    app.append(title, container_card);

    try {
        const response = await fetch(`http://localhost:3000/api/productos/genero/${generoSolicitado}`);
        const result = await response.json();
        if (!result.success) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("error");
            errorMessage.textContent = "No se pudieron cargar los productos.";
            app.append(errorMessage);
            console.error(result.message);
            return;
        }
        const productos = result.data;
        if (productos.length === 0) {
            const errorMessage = document.createElement("p");
            errorMessage.classList.add("sin-productos");
            errorMessage.textContent = "No hay productos disponibles para este género.";
            container_card.append(errorMessage);
            return;
        }
        productos.forEach(producto => {
            const card = document.createElement("div");
            card.classList.add("card");
            const divimg = document.createElement('div');
            divimg.classList.add('card-img-container');
            // agregar imagen y contenido a la tarjeta
            const img = document.createElement('img');
            img.setAttribute('src', `/src/uploads/${producto.imagen}`);
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
            container_card.appendChild(card);
            card.addEventListener("click", () => {
                window.location.hash = `#productos/${producto.id}`;
            });
        });
    } catch (error) {
        container_card.innerHTML = `<p class="error">Error al cargar los productos.</p>`;
        console.error("Error al obtener productos:", error);
    }
};
