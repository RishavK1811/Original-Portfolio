document.addEventListener("DOMContentLoaded", () => {
    // Check if GSAP and ScrollTrigger are available
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP or ScrollTrigger not loaded.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // 1. Reveal Section Header
    gsap.fromTo(".premium-projects-section .section-header",
        { opacity: 0, y: 40 },
        {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".premium-projects-section",
                start: "top 80%"
            }
        }
    );

    // 2. Reveal Showcase Cards with staggered entrance
    const cards = document.querySelectorAll('.showcase-card');

    cards.forEach((card, index) => {
        // Alternate entrance direction based on card layout
        const inner = card.querySelector('.showcase-card-inner');
        const isReversed = inner && inner.classList.contains('reverse');
        const xOffset = isReversed ? 60 : -60;

        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            x: xOffset,
            y: 30,
            duration: 1,
            ease: "power3.out",
            delay: index * 0.15,
            clearProps: "all"
        });
    });

    // 3. Reveal CTA footer
    const cta = document.querySelector('.projects-cta');
    if (cta) {
        gsap.from(cta, {
            scrollTrigger: {
                trigger: cta,
                start: "top 90%",
            },
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all"
        });
    }
});
