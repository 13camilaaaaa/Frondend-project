
// File: views/Envios/enviosController.js

// This function will be called by your router when the 'envios' route is active.
// src/controllers/enviosController.js
export const enviosController = () => {
    console.log("enviosController loaded and executed!");

    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.closest('.accordion-item');
            const accordionContent = accordionItem.querySelector('.accordion-content');
            const icon = header.querySelector('i');

            accordionItem.classList.toggle('active');

            if (accordionItem.classList.contains('active')) {
                icon.classList.remove('fa-plus');
                icon.classList.add('fa-minus');
                // Esto es crucial: el scrollHeight calcula la altura completa del contenido
                accordionContent.style.maxHeight = accordionContent.scrollHeight + 'px';
            } else {
                icon.classList.remove('fa-minus');
                icon.classList.add('fa-plus');
                accordionContent.style.maxHeight = '0';
            }
        });
    });
};