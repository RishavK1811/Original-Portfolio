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

    // 2. Reveal Project Cards
    const cards = document.querySelectorAll('.premium-project-card');
    
    cards.forEach((card, index) => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 85%", // when top of the card hits 85% of the viewport height
                toggleActions: "play none none reverse"
            },
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
            delay: index * 0.1,
            clearProps: "all" // removes inline styles after animation so CSS hover rules work
        });
    });
});
