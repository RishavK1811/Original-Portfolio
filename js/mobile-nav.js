/* =========================================================================
   Mobile Navigation — Hamburger Menu Toggle
   Additive only. Does NOT modify any existing JS functionality.
   ========================================================================= */
document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!hamburgerBtn || !navLinks) return;

    // Create overlay element for background dim
    const overlay = document.createElement('div');
    overlay.classList.add('nav-overlay');
    document.body.appendChild(overlay);

    function openMenu() {
        hamburgerBtn.classList.add('active');
        navLinks.classList.add('mobile-open');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('active');
        navLinks.classList.remove('mobile-open');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', () => {
        if (navLinks.classList.contains('mobile-open')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking backdrop overlay
    overlay.addEventListener('click', closeMenu);

    // Close menu when clicking a nav link (smooth scroll continues as normal)
    navLinks.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('mobile-open')) {
                closeMenu();
            }
        });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
            closeMenu();
        }
    });

    // Close menu if window resizes past breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navLinks.classList.contains('mobile-open')) {
            closeMenu();
        }
    });
});
