// src/components/footer.js


    const footer = document.getElementById('footer'); // Este es tu <footer id="footer">

    // Una nueva clase para el <footer>

    const footerContentWrapper = document.createElement('div'); // Este es tu nuevo div "footerElement"
    footerContentWrapper.classList.add('footer-container-wrapper'); // Nueva clase para envolver el contenido

    footerContentWrapper.innerHTML = `
        <div class="footer-container">
            <div class="footer-section">
                <h4>COLECCIONES</h4>
                <ul>
                    <li><a href="#/categorias/mujer">Mujer</a></li>
                    <li><a href="#/categorias/hombre">Hombre</a></li>
                    <li><a href="#/categorias/bebe">Bebé</a></li>
                    <li><a href="#/categorias/niños">Niños</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h4>AYUDA</h4>
                <ul>
                    <li><a href="#servicio-al-cliente">Servicio al cliente</a></li>
                    <li><a href="#login">Mi cuenta</a></li>
                    <li><a href="#tiendas">Nuestras tiendas</a></li>
                    <li><a href="#contactanos">Contacto</a></li>
                    <li><a href="#">Peticiones quejas y reclamos</a></li>
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

    // Agrega el div que contiene todo el contenido del footer al footer nativo del HTML
    footer.append(footerContentWrapper);
