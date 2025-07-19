
    const footer = document.getElementById('footer');

    const footerContentWrapper = document.createElement('div');
    footerContentWrapper.classList.add('footer-container-wrapper');

    footerContentWrapper.innerHTML = `
        <div class="footer-container">
            <div class="footer-section">
                <h4>COLECCIONES</h4>
                <ul>
                    <li><a href="#categorias/Mujer">Mujer</a></li>
                    <li><a href="#categorias/Hombre">Hombre</a></li>
                    <li><a href="#categorias/Bebe">Bebé</a></li>
                    <li><a href="#categorias/Ninos">Niños</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4>AYUDA</h4>
                <ul>
                    <li><a href="#servicio-al-cliente">Servicio al cliente</a></li>
                    <li><a href="#login">Mi cuenta</a></li>
                    <li><a href="/">Nuestras tiendas</a></li>
                    <li><a href="#contactanos">Contacto</a></li>
                </ul>
            </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p>El contenido de esta página web está protegida y es propiedad de ROSS MILLE R.V</p>
            <div class="footer-logos">
                <img src="/public/LOGO_OFICIAL.png" alt="H&M Logo">
            </div>
            <p class="country-selector">Colombia | $</p>
        </div>
    `;

    footer.append(footerContentWrapper);
