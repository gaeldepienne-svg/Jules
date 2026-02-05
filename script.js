document.addEventListener('DOMContentLoaded', () => {
    // Accordion Functionality
    const headers = document.querySelectorAll('.module-header');

    headers.forEach(header => {
        header.addEventListener('click', () => {
            const module = header.parentElement;
            const isOpen = module.classList.contains('expanded');

            // Close all modules
            document.querySelectorAll('.module').forEach(m => {
                m.classList.remove('expanded');
                const icon = m.querySelector('.accordion-icon i');
                if (icon) {
                    icon.classList.remove('fa-chevron-up');
                    icon.classList.add('fa-chevron-down');
                }
            });

            // If it wasn't open, open it now
            if (!isOpen) {
                module.classList.add('expanded');
                const icon = module.querySelector('.accordion-icon i');
                if (icon) {
                    icon.classList.remove('fa-chevron-down');
                    icon.classList.add('fa-chevron-up');
                }
            }
        });
    });

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                }, err => {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
});