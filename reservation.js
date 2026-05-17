// ──────────────────────────────────────────────
//  Reservation modal — injects a Tableo iframe
//  Triggered by any link with .btn-reserve or
//  href pointing to the Tableo URL.
// ──────────────────────────────────────────────
(function () {
    const TABLEO_URL = 'https://app.tableo.com/r/bGCK-09';

    // Build the modal DOM
    const modal = document.createElement('div');
    modal.className = 'reservation-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Réserver une table');
    modal.innerHTML = `
        <div class="reservation-modal-card" role="document">
            <div class="reservation-modal-header">
                <span class="reservation-modal-title">Réserver une table — Au Bout du Quai</span>
            </div>
            <button class="reservation-modal-close" aria-label="Fermer la fenêtre de réservation">✕</button>
            <div class="reservation-modal-iframe-wrap">
                <span class="reservation-modal-loading">Chargement…</span>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    const iframeWrap = modal.querySelector('.reservation-modal-iframe-wrap');
    const closeBtn = modal.querySelector('.reservation-modal-close');
    let iframeLoaded = false;

    function openModal() {
        if (!iframeLoaded) {
            const iframe = document.createElement('iframe');
            iframe.src = TABLEO_URL;
            iframe.setAttribute('referrerpolicy', 'unsafe-url');
            iframe.setAttribute('title', 'Réservation Au Bout du Quai');
            iframe.addEventListener('load', () => {
                modal.classList.add('loaded');
            });
            iframeWrap.appendChild(iframe);
            iframeLoaded = true;
        }
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Close handlers
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    // Intercept reservation links — anything pointing to Tableo or matching reservation buttons
    function attachHandlers() {
        const triggers = document.querySelectorAll(
            'a[href*="tableo.com"], a.btn-reserve, a[data-reserve]'
        );
        triggers.forEach(link => {
            if (link.dataset.reserveAttached) return;
            link.dataset.reserveAttached = '1';
            link.addEventListener('click', (e) => {
                e.preventDefault();
                openModal();
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', attachHandlers);
    } else {
        attachHandlers();
    }
})();
