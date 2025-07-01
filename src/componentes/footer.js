export const crearFooter = () => {
    const footer = document.getElementById("footer");
    footer.innerHTML = `
        <div class="footer-content">
            <p>&copy; 2023 Tu Tienda. Todos los derechos reservados.</p>
            <ul class="social-links">
                <li><a href="https://www.facebook.com" target="_blank">Facebook</a></li>
                <li><a href="https://www.twitter.com" target="_blank">Twitter</a></li>
                <li><a href="https://www.instagram.com" target="_blank">Instagram</a></li>
            </ul>
        </div>
    `;
    document.body.appendChild(footer);
};
