document.addEventListener('DOMContentLoaded', () => {
    const responseArea = document.getElementById('ai-response-area');
    const inputField = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send');
    const pills = document.querySelectorAll('.ai-pill');

    // AI Knowledge Base
    const kb = {
        'about': "I am currently pursuing BCA with a strong focus on AI and Machine Learning. I enjoy building intelligent solutions and continuously improving through hands-on projects in Python and Web Development.",
        'contact': "You can reach me via email at rishavkumar181101@gmail.com or call me at 6204550755. I'm always open to discussing new opportunities or tech!",
        'email': "My email address is rishavkumar181101@gmail.com.",
        'phone': "You can call me at 6204550755.",
        'skills': "My technical skills include Python, Web Development, HTML, CSS, JavaScript, React, Node.js, and working within Linux environments. I'm also deeply interested in AI & ML algorithms.",
        'work': "I've built several projects including a Computer Vision Cube Solver, an Improvement Tree mobile app, and sleek modern web interfaces. Check out my Featured Projects section below!",
        'default': "I'm not exactly sure about that. Try asking about my skills, work, contact info, or background!"
    };

    let typingTimeout;

    // Smooth typing animation logic
    function typeWriter(text, element, speed = 20) {
        // Erase old reply
        element.innerHTML = '';
        element.classList.add('active');
        
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'ai-cursor';
        element.appendChild(cursor);

        function type() {
            if (i < text.length) {
                // Insert text character before the cursor
                const charNode = document.createTextNode(text.charAt(i));
                element.insertBefore(charNode, cursor);
                i++;
                typingTimeout = setTimeout(type, speed);
            } else {
                // Remove cursor after typing completes
                setTimeout(() => { 
                    if (cursor.parentNode) cursor.parentNode.removeChild(cursor); 
                }, 1000);
            }
        }
        type();
    }

    // Process user queries
    function handleQuery(query) {
        // Stop any ongoing typing animation
        clearTimeout(typingTimeout);
        
        query = query.toLowerCase().trim();
        if (!query) return;

        let response = kb.default;

        // Simple keyword matching logic
        if (query.includes('about') || query.includes('who')) {
            response = kb.about;
        } else if (query.includes('contact') || query.includes('reach') || query.includes('find')) {
            response = kb.contact;
        } else if (query.includes('email')) {
            response = kb.email;
        } else if (query.includes('phone') || query.includes('call') || query.includes('number')) {
            response = kb.phone;
        } else if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('know')) {
            response = kb.skills;
        } else if (query.includes('work') || query.includes('project') || query.includes('built')) {
            response = kb.work;
        }

        // Trigger typing animation with new response
        typeWriter(response, responseArea);
        
        // Clear input field
        inputField.value = '';
    }

    // Event Listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', () => handleQuery(inputField.value));
    }
    
    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleQuery(inputField.value);
        });
    }

    if (pills) {
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const queryType = pill.getAttribute('data-query');
                handleQuery(queryType);
            });
        });
    }
});
