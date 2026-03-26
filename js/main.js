document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // Theme Toggle Logic
    // -----------------------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Check for saved theme
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

            // Update TagCanvas text color if using TagCanvas
            if (window.TagCanvas && typeof reinitTagCanvas === 'function') {
                reinitTagCanvas(newTheme);
            }
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.className = 'fa-solid fa-moon';
        } else {
            themeIcon.className = 'fa-solid fa-sun';
        }
    }

    // -----------------------------------------------------------------
    // Smooth Scrolling & Active Nav Links
    // -----------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            // Only prevent default if it's an anchor link
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 100, // Offset for navbar
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Highlight active section on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
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

    // Prevent placeholder links from jumping to the top (`href="#"`)
    document.querySelectorAll('a[href="#"]').forEach(a => {
        a.addEventListener('click', (e) => e.preventDefault());
    });

    // -----------------------------------------------------------------
    // Contact Modal Logic
    // -----------------------------------------------------------------
    const bookCallBtn = document.getElementById('book-call');
    const contactModal = document.getElementById('contact-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const openMsgFormBtn = document.getElementById('open-msg-form');
    const directMsgForm = document.getElementById('direct-msg-form');
    const portfolioMsgForm = document.getElementById('portfolio-msg-form');
    const msgSuccess = document.getElementById('msg-success');

    if (bookCallBtn && contactModal) {
        bookCallBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
        });

        closeModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
            // reset form state
            directMsgForm.style.display = 'none';
            msgSuccess.style.display = 'none';
            portfolioMsgForm.reset();
        });

        // Close on outside click
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
            }
        });
    }

    if (openMsgFormBtn && directMsgForm) {
        openMsgFormBtn.addEventListener('click', () => {
            if (directMsgForm.style.display === 'none') {
                directMsgForm.style.display = 'block';
                setTimeout(() => {
                    directMsgForm.scrollIntoView({ behavior: 'smooth', block: 'end' });
                }, 100);
            } else {
                directMsgForm.style.display = 'none';
            }
        });
    }

    if (portfolioMsgForm) {
        portfolioMsgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('sender-name').value;
            const email = document.getElementById('sender-email').value;
            const msg = document.getElementById('sender-msg').value;
            
            // Save securely strictly for owner (localStorage)
            const existingMsgs = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
            existingMsgs.push({
                name: name,
                email: email,
                message: msg,
                date: new Date().toLocaleString()
            });
            localStorage.setItem('portfolio_messages', JSON.stringify(existingMsgs));
            
            // Show success
            msgSuccess.style.display = 'block';
            portfolioMsgForm.reset();
            
            // Auto close after 2.5 seconds
            setTimeout(() => {
                contactModal.classList.remove('active');
                directMsgForm.style.display = 'none';
                msgSuccess.style.display = 'none';
            }, 2500);
        });
    }

    // Mindset Carousel Drag & Infinite Scroll Logic
    const mindsetCarousel = document.getElementById('mindset-carousel');
    if (mindsetCarousel) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // Create clones for infinite loop
        const slides = Array.from(mindsetCarousel.children);
        const slideCount = slides.length;
        
        // Clone for end (append)
        slides.forEach(slide => {
            let clone = slide.cloneNode(true);
            mindsetCarousel.appendChild(clone);
        });
        
        // Clone for beginning (prepend)
        slides.slice().reverse().forEach(slide => {
            let clone = slide.cloneNode(true);
            mindsetCarousel.prepend(clone);
        });

        // Initialize position to the middle (original) set
        setTimeout(() => {
            mindsetCarousel.style.scrollBehavior = 'auto';
            mindsetCarousel.scrollLeft = mindsetCarousel.offsetWidth * slideCount;
            // Re-enable smooth after initial jump
            setTimeout(() => mindsetCarousel.style.scrollBehavior = 'smooth', 50);
        }, 100);

        // Infinite Scroll reset
        mindsetCarousel.addEventListener('scroll', () => {
            if (isDown) return; // Don't snap while user is dragging
            
            const fw = mindsetCarousel.offsetWidth; // width of one slide
            // If we scrolled into the first set (prepend clones)
            if (mindsetCarousel.scrollLeft <= fw * 0.5) {
                mindsetCarousel.style.scrollBehavior = 'auto'; // disable smooth transition
                mindsetCarousel.scrollLeft += fw * slideCount; // jump forward a full set
                setTimeout(() => mindsetCarousel.style.scrollBehavior = 'smooth', 10);
            } 
            // If we scrolled into the last set (append clones)
            else if (mindsetCarousel.scrollLeft >= fw * (slideCount * 2.5)) {
                mindsetCarousel.style.scrollBehavior = 'auto';
                mindsetCarousel.scrollLeft -= fw * slideCount; // jump backward a full set
                setTimeout(() => mindsetCarousel.style.scrollBehavior = 'smooth', 10);
            }
        });

        // Mouse Drag to Scroll
        mindsetCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            mindsetCarousel.style.cursor = 'grabbing';
            mindsetCarousel.style.scrollSnapType = 'none'; 
            mindsetCarousel.style.scrollBehavior = 'auto'; 
            startX = e.pageX - mindsetCarousel.offsetLeft;
            scrollLeft = mindsetCarousel.scrollLeft;
        });
        
        const stopDrag = () => {
            if(!isDown) return;
            isDown = false;
            mindsetCarousel.style.cursor = 'grab';
            mindsetCarousel.style.scrollSnapType = 'x mandatory';
            mindsetCarousel.style.scrollBehavior = 'smooth';
            
            // Trigger scroll event manually to check bounds after dropping snap
            mindsetCarousel.dispatchEvent(new Event('scroll'));
        };

        mindsetCarousel.addEventListener('mouseleave', stopDrag);
        mindsetCarousel.addEventListener('mouseup', stopDrag);
        
        mindsetCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - mindsetCarousel.offsetLeft;
            const walk = (x - startX) * 1.5; 
            mindsetCarousel.scrollLeft = scrollLeft - walk;
        });
    }
});
