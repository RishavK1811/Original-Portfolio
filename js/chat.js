document.addEventListener('DOMContentLoaded', () => {
    const responseArea = document.getElementById('ai-response-area');
    const inputField = document.getElementById('ai-input');
    const sendBtn = document.getElementById('ai-send');
    const pills = document.querySelectorAll('.ai-pill');

    // AI Knowledge Base
    const kb = {
        'hey':"Hello there! I'm Rishav's AI assistant. How can I help you today?",
        'hii':"Hello there! I'm Rishav's AI assistant. How can I help you today?",
        'hi':"Hello there! I'm Rishav's AI assistant. How can I help you today?",
        'greeting': "Hello there! I'm Rishav's AI assistant. How can I help you today?",
        'whoami': "I'm an AI assistant created by Rishav to help answer questions about his portfolio and background. Ask me anything!",
        'name': "My creator is Rishav Kumar. I'm just his humble AI assistant.",
        'education': "Rishav is currently pursuing his BCA degree with a strong foundation in AI and system-level computing.",
        'location': "Rishav is based in India.",
        'hobbies': "Rishav loves fitness & discipline, continuous learning, and gaming & strategy. He believes in mastering both body and mind.",
        'freelance': "Yes! Rishav is open to collaboration and freelance opportunities. Feel free to reach out to him via the contact section.",
        'resume': "You can discover all about Rishav's background here on the portfolio, or contact him directly for a formal CV.",
        'experience': "Rishav has hands-on experience building full-stack applications, AI models, and real-time computer vision tools. Check out the projects section for more!",
        'socials': "You can find Rishav on LinkedIn and GitHub. Links are in the footer below!",
        'about': "I am currently pursuing BCA with a strong focus on AI and Machine Learning. I enjoy building intelligent solutions and continuously improving through hands-on projects in Python and Web Development.",
        'contact': "You can reach me via email at rishavkumar181101@gmail.com or call me at 6204550755. I'm always open to discussing new opportunities or tech!",
        'email': "My email address is rishavkumar181101@gmail.com.",
        'phone': "You can call me at 6204550755.",
        'skills': "My technical skills include Python, Web Development, HTML, CSS, JavaScript, React, Node.js, and working within Linux environments. I'm also deeply interested in AI & ML algorithms.",
        'work': "I've built several projects including a Computer Vision Cube Solver, an Improvement Tree mobile app, and sleek modern web interfaces. Check out my Featured Projects section below!",
        'non_english': "I can only understand and communicate in English right now. Please ask your questions in English! 🌍",
        'default': "I'm not exactly sure about that. Try asking about my skills, work, contact info, education, or hobbies!"
    };

    let typingTimeout;
    let thinkingTimeout;

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
        // Stop any ongoing typing animation and thinking timeout
        clearTimeout(typingTimeout);
        clearTimeout(thinkingTimeout);
        
        query = query.toLowerCase().trim();
        if (!query) return;

        let response = kb.default;

        // Keyword matching logic
        if (query.match(/^(hi|hey|hello|sup|greetings|hola|namaste)(\s|$)/)) {
            response = kb.greeting;
        } else if (query.match(/\b(kya|kaise|tum|aap|hindi|bhai|karo|kardo|samajh|hai|nahi|kon)\b/)) {
            response = kb.non_english;
        } else if (query.match(/[^\x00-\x7F]/)) {
            // Checks for non-ASCII characters (e.g. Hindi script, etc.)
            response = kb.non_english;
        } else if (query.includes('who are you') || query.includes('what are you')) {
            response = kb.whoami;
        } else if (query.includes('your name')) {
            response = kb.name;
        } else if (query.includes('education') || query.includes('college') || query.includes('degree') || query.includes('university') || query.includes('study')) {
            response = kb.education;
        } else if (query.includes('location') || query.includes('live') || query.includes('where') || query.includes('city') || query.includes('country') || query.includes('from')) {
            response = kb.location;
        } else if (query.includes('hobby') || query.includes('hobbies') || query.includes('fun') || query.includes('free time')) {
            response = kb.hobbies;
        } else if (query.includes('freelance') || query.includes('hire') || query.includes('work for') || query.includes('available')) {
            response = kb.freelance;
        } else if (query.includes('resume') || query.includes('cv')) {
            response = kb.resume;
        } else if (query.includes('experience') || query.includes('years') || query.includes('history')) {
            response = kb.experience;
        } else if (query.includes('social') || query.includes('github') || query.includes('linkedin') || query.includes('twitter')) {
            response = kb.socials;
        } else if (query.includes('about') || query.includes('who')) {
            response = kb.about;
        } else if (query.includes('contact') || query.includes('reach') || query.includes('find')) {
            response = kb.contact;
        } else if (query.includes('email')) {
            response = kb.email;
        } else if (query.includes('phone') || query.includes('call') || query.includes('mobile') || query.includes('number')) {
            response = kb.phone;
        } else if (query.includes('skill') || query.includes('tech') || query.includes('stack') || query.includes('know')) {
            response = kb.skills;
        } else if (query.includes('work') || query.includes('project') || query.includes('built')) {
            response = kb.work;
        }

        // Clear input field
        if (inputField) inputField.value = '';

        // Show thinking state
        responseArea.innerHTML = 'AI IS THINKING...<span class="ai-cursor"></span>';
        responseArea.classList.add('active');

        // Wait 3 seconds before displaying the response
        thinkingTimeout = setTimeout(() => {
            typeWriter(response, responseArea);
        }, 3000);
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
