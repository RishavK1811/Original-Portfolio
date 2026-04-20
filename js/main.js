document.addEventListener('DOMContentLoaded', () => {

    // ─────────────────────────────────────────────────────────────────────────
    // Lenis Smooth Scroll (Highly Responsive for Desktop & Mobile)
    // ─────────────────────────────────────────────────────────────────────────
    let lenis;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: true, // Smooth scrolling on mobile devices as requested
            touchMultiplier: 2, // Slightly faster touch response
        });

        // Integrate Lenis with GSAP ScrollTrigger to prevent conflicts
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0, 0);
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // AOS (Animate on Scroll) Initialization
    // ─────────────────────────────────────────────────────────────────────────
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 750,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Custom Cursor
    // ─────────────────────────────────────────────────────────────────────────
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline) {
        let mouseX = 0, mouseY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top  = `${mouseY}px`;
        });

        // Smooth follow for outline
        function animateCursor() {
            outlineX += (mouseX - outlineX) * 0.12;
            outlineY += (mouseY - outlineY) * 0.12;
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top  = `${outlineY}px`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hide when mouse leaves window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Typing Animation
    // ─────────────────────────────────────────────────────────────────────────
    const typingEl = document.getElementById('typing-text');
    if (typingEl) {
        const phrases = [
            'Cybersecurity Enthusiast',
            'BCA Student',
            'Ethical Hacking Learner',
            'Linux & Network Security',
            'Web Developer & Security',
            'Problem Solver',
        ];
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 90;

        function typeLoop() {
            const currentPhrase = phrases[phraseIdx];

            if (isDeleting) {
                charIdx--;
                typingSpeed = 50;
            } else {
                charIdx++;
                typingSpeed = 90;
            }

            typingEl.textContent = currentPhrase.substring(0, charIdx);

            if (!isDeleting && charIdx === currentPhrase.length) {
                // Pause at end of phrase
                typingSpeed = 1800;
                isDeleting = true;
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 400;
            }

            setTimeout(typeLoop, typingSpeed);
        }

        // Start after a short delay so page loads first
        setTimeout(typeLoop, 1200);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Background glow is now handled by js/background.js (canvas-based)
    // ─────────────────────────────────────────────────────────────────────────


    // ─────────────────────────────────────────────────────────────────────────
    // Theme Toggle
    // ─────────────────────────────────────────────────────────────────────────
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Smooth Scrolling & Active Nav Links
    // ─────────────────────────────────────────────────────────────────────────
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.getElementById(href.substring(1));
                if (targetSection) {
                    if (lenis) {
                        // Use Lenis smooth scroll if active
                        lenis.scrollTo(targetSection, { offset: -100, duration: 1.2 });
                    } else {
                        window.scrollTo({ top: targetSection.offsetTop - 100, behavior: 'smooth' });
                    }
                }
            }
        });
    });

    // Throttle scroll with RAF to prevent jank
    let scrollRafPending = false;
    window.addEventListener('scroll', () => {
        if (scrollRafPending) return;
        scrollRafPending = true;
        requestAnimationFrame(() => {
            scrollRafPending = false;
            let current = '';
            sections.forEach(section => {
                if (pageYOffset >= (section.offsetTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }, { passive: true });

    document.querySelectorAll('a[href="#"]').forEach(a => {
        a.addEventListener('click', e => e.preventDefault());
    });

    // ─────────────────────────────────────────────────────────────────────────
    // Skill Progress Bars (IntersectionObserver)
    // ─────────────────────────────────────────────────────────────────────────
    const skillBars = document.querySelectorAll('.skill-bar-fill');

    if (skillBars.length) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Small stagger: each bar animates shortly after it enters view
                    const bar = entry.target;
                    setTimeout(() => {
                        bar.classList.add('animated');
                    }, 100);
                    barObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        skillBars.forEach(bar => barObserver.observe(bar));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Contact Form (main #contact section)
    // ─────────────────────────────────────────────────────────────────────────
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const contactSubmit = document.getElementById('contact-submit');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name    = document.getElementById('contact-name').value.trim();
            const email   = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !message) return;

            // Save locally
            const msgs = JSON.parse(localStorage.getItem('portfolio_contact_msgs') || '[]');
            msgs.push({ name, email, subject, message, date: new Date().toLocaleString() });
            localStorage.setItem('portfolio_contact_msgs', JSON.stringify(msgs));

            // Visual feedback
            if (contactSubmit) {
                contactSubmit.innerHTML = '<i class="fa-solid fa-circle-check"></i> Sent!';
                contactSubmit.style.background = '#10b981';
                contactSubmit.disabled = true;
            }

            if (contactSuccess) {
                contactSuccess.style.display = 'flex';
            }

            contactForm.reset();

            setTimeout(() => {
                if (contactSubmit) {
                    contactSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> <span>Send Message</span>';
                    contactSubmit.style.background = '';
                    contactSubmit.disabled = false;
                }
                if (contactSuccess) {
                    contactSuccess.style.display = 'none';
                }
            }, 3500);
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Contact Modal (Book a Call button)
    // ─────────────────────────────────────────────────────────────────────────
    const bookCallBtn     = document.getElementById('book-call');
    const contactModal    = document.getElementById('contact-modal');
    const closeModalBtn   = document.getElementById('close-modal');
    const openMsgFormBtn  = document.getElementById('open-msg-form');
    const directMsgForm   = document.getElementById('direct-msg-form');
    const portfolioMsgForm = document.getElementById('portfolio-msg-form');
    const msgSuccess      = document.getElementById('msg-success');

    if (bookCallBtn && contactModal) {
        bookCallBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
        });
        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
            directMsgForm.style.display = 'none';
            msgSuccess.style.display = 'none';
            portfolioMsgForm.reset();
        });
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) contactModal.classList.remove('active');
        });
    }

    if (openMsgFormBtn && directMsgForm) {
        openMsgFormBtn.addEventListener('click', () => {
            directMsgForm.style.display = directMsgForm.style.display === 'none' ? 'block' : 'none';
            if (directMsgForm.style.display === 'block') {
                setTimeout(() => directMsgForm.scrollIntoView({ behavior: 'smooth', block: 'end' }), 100);
            }
        });
    }

    if (portfolioMsgForm) {
        portfolioMsgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name  = document.getElementById('sender-name').value;
            const email = document.getElementById('sender-email').value;
            const msg   = document.getElementById('sender-msg').value;
            const existingMsgs = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
            existingMsgs.push({ name, email, message: msg, date: new Date().toLocaleString() });
            localStorage.setItem('portfolio_messages', JSON.stringify(existingMsgs));
            msgSuccess.style.display = 'block';
            portfolioMsgForm.reset();
            setTimeout(() => {
                contactModal.classList.remove('active');
                directMsgForm.style.display = 'none';
                msgSuccess.style.display = 'none';
            }, 2500);
        });
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Mindset Carousel (Infinite drag scroll)
    // ─────────────────────────────────────────────────────────────────────────
    const mindsetCarousel = document.getElementById('mindset-carousel');
    if (mindsetCarousel) {
        let isDown = false, startX, scrollLeft;

        const slides = Array.from(mindsetCarousel.children);
        const slideCount = slides.length;

        // Clone for infinite loop
        slides.forEach(s => mindsetCarousel.appendChild(s.cloneNode(true)));
        slides.slice().reverse().forEach(s => mindsetCarousel.prepend(s.cloneNode(true)));

        setTimeout(() => {
            mindsetCarousel.style.scrollBehavior = 'auto';
            mindsetCarousel.scrollLeft = mindsetCarousel.offsetWidth * slideCount;
            setTimeout(() => mindsetCarousel.style.scrollBehavior = 'smooth', 50);
        }, 100);

        mindsetCarousel.addEventListener('scroll', () => {
            if (isDown) return;
            const fw = mindsetCarousel.offsetWidth;
            if (mindsetCarousel.scrollLeft <= fw * 0.5) {
                mindsetCarousel.style.scrollBehavior = 'auto';
                mindsetCarousel.scrollLeft += fw * slideCount;
                setTimeout(() => mindsetCarousel.style.scrollBehavior = 'smooth', 10);
            } else if (mindsetCarousel.scrollLeft >= fw * (slideCount * 2.5)) {
                mindsetCarousel.style.scrollBehavior = 'auto';
                mindsetCarousel.scrollLeft -= fw * slideCount;
                setTimeout(() => mindsetCarousel.style.scrollBehavior = 'smooth', 10);
            }
        }, { passive: true });

        mindsetCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            mindsetCarousel.style.cursor = 'grabbing';
            mindsetCarousel.style.scrollSnapType = 'none';
            mindsetCarousel.style.scrollBehavior = 'auto';
            startX = e.pageX - mindsetCarousel.offsetLeft;
            scrollLeft = mindsetCarousel.scrollLeft;
        });

        const stopDrag = () => {
            if (!isDown) return;
            isDown = false;
            mindsetCarousel.style.cursor = 'grab';
            mindsetCarousel.style.scrollSnapType = 'x mandatory';
            mindsetCarousel.style.scrollBehavior = 'smooth';
            mindsetCarousel.dispatchEvent(new Event('scroll'));
        };

        mindsetCarousel.addEventListener('mouseleave', stopDrag);
        mindsetCarousel.addEventListener('mouseup', stopDrag);
        mindsetCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            mindsetCarousel.scrollLeft = scrollLeft - (e.pageX - mindsetCarousel.offsetLeft - startX) * 1.5;
        });
    }

});
