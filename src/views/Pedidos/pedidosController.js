import Swal from 'sweetalert2';

export const pedidosController = async () => {
    const token = localStorage.getItem("token");
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const container = document.querySelector(".container-pedidos");
    const saludo = document.querySelector(".saludo_usuario");

    if (saludo && usuario) {
        saludo.textContent = `Hola, ${usuario.nombre_usuario}!`;
    }

    if (!token || !usuario) {
        container.innerHTML = "<p>Debes iniciar sesión para ver tus pedidos.</p>";
        return;
    }

    try {
        const res = await fetch("http://localhost:3000/api/ventas/mis-pedidos", {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
            throw new Error(data.message || "No se pudieron obtener los pedidos.");
        }

        const pedidos = data.pedidos;

        if (pedidos.length === 0) {
            container.innerHTML = "<h2>No tienes pedidos registrados.</h2>";
            return;
        }

        container.innerHTML = "<h1>Mis Pedidos</h1>";

        // crear wrapper para scroll si hay más de 3
        const pedidosWrapper = document.createElement("div");
        pedidosWrapper.classList.add("pedidos-wrapper");
        if (pedidos.length > 3) {
            pedidosWrapper.classList.add("scroll-container");
        }

        pedidos.forEach(pedido => {
            const pedidoBox = document.createElement("div");
            pedidoBox.classList.add("order-details-box");

            // Manejar la fecha de forma segura
            let fechaFormateada = "Fecha no disponible";
            if (pedido.fecha && !isNaN(new Date(pedido.fecha))) {
                fechaFormateada = new Date(pedido.fecha).toLocaleDateString("es-CO", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            // Lista de productos
            const listaProductos = pedido.detalle.map(p =>
                `<li>${p.nombre} (Cantidad: ${p.cantidad}) - $${parseFloat(p.precio_unitario).toLocaleString('es-CO')}</li>`
            ).join("");

            // Contenido del pedido
            pedidoBox.innerHTML = `
                <div class="detail-row">
                    <span class="label">Fecha del Pedido:</span>
                    <span class="value">${fechaFormateada}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Productos:</span>
                    <ul class="product-list">${listaProductos}</ul>
                </div>
                <div class="detail-row">
                    <span class="label">Total:</span>
                    <span class="value">$${parseFloat(pedido.total).toLocaleString('es-CO')}</span>
                </div>
                <div class="detail-row">
                    <span class="label">Estado:</span>
                    <span class="value estado-${pedido.estado_pedido.toLowerCase()}">${pedido.estado_pedido}</span>
                </div>
            `;

            // Botón para cancelar si el estado no es "cancelado"
            if (pedido.estado_pedido.toLowerCase() !== "cancelado") {
                const btnCancelar = document.createElement("button");
                btnCancelar.classList.add("cancel-button");
                btnCancelar.textContent = "CANCELAR PEDIDO";

                btnCancelar.addEventListener("click", async () => {
                    const confirm = await Swal.fire({
                        title: "¿Estás seguro?",
                        text: "Esta acción marcará el pedido como cancelado.",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonText: "Sí, cancelar",
                        cancelButtonText: "No"
                    });

                    if (confirm.isConfirmed) {
                        const cancelRes = await fetch(`http://localhost:3000/api/ventas/${pedido.id}/status`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ estado_pedido: "Cancelado" })
                        });

                        const cancelData = await cancelRes.json();

                        if (cancelRes.ok) {
                            Swal.fire("Cancelado", "Tu pedido ha sido cancelado.", "success");
                            pedidosController(); // Recargar vista
                        } else {
                            Swal.fire("Error", cancelData.message || "No se pudo cancelar.", "error");
                        }
                    }
                });

                pedidoBox.appendChild(btnCancelar);
            }

            pedidosWrapper.appendChild(pedidoBox);
        });

        container.appendChild(pedidosWrapper);

    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        container.innerHTML = `<p>Error al obtener tus pedidos. Intenta más tarde.</p>`;
    }
};
