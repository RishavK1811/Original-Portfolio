document.addEventListener('DOMContentLoaded', () => {
    const responseArea = document.getElementById('ai-response-area');
    const inputField   = document.getElementById('ai-input');
    const sendBtn      = document.getElementById('ai-send');
    const pills        = document.querySelectorAll('.ai-pill');

    // ─────────────────────────────────────────────────────────────────────────
    // KNOWLEDGE BASE — 100+ topics about Rishav Kumar
    // Each key maps to a topic; handleQuery picks the best match.
    // ─────────────────────────────────────────────────────────────────────────
    const kb = {

        // ── Greetings ─────────────────────────────────────────────────────
        greeting:
            "Hey there! 👋 I'm Rishav's personal AI assistant. I know everything about him — his focus on Cybersecurity, his skills, and his transition from BCA. Go ahead, ask me anything!",

        howAreYou:
            "I'm doing great, just waiting for curious minds like you! 😄 Ask me anything about Rishav!",

        thanks:
            "You're very welcome! 😊 If you have more questions about Rishav's journey into Cybersecurity, I'm right here.",

        bye:
            "See you around! 👋 Feel free to come back anytime. Rishav would love to connect with you — check out the Contact section!",

        whoAmI:
            "I'm an AI assistant built into Rishav's portfolio. I can answer questions about his skills, his transition into Cybersecurity, his education, and more. Think of me as his 24/7 spokesperson! 🤖",

        // ── Personal Info ─────────────────────────────────────────────────
        name:
            "His name is Rishav Kumar — a BCA student deeply passionate about Cybersecurity, Ethical Hacking, and Network Security.",

        age:
            "Rishav is in his early twenties, currently pursuing his BCA degree while actively hunting for vulnerabilities and learning system security.",

        bio:
            "Rishav Kumar is a BCA student transitioning into the field of Cybersecurity. He has a strong foundation in Web Development and basic programming, which gives him a unique perspective on understanding how applications work from both development and security standpoints. He's currently focused on Ethical Hacking, Network Security, and Linux.",

        nationality:
            "Rishav is Indian 🇮🇳 — based in India, available for remote collaborations globally.",

        gender:
            "Rishav is a guy — a tech-obsessed student constantly diving deep into Linux terminals and network packets! 💪",

        personality:
            "Rishav is driven, disciplined, and deeply curious. He's the type who loves finding vulnerabilities and understanding system behavior to improve security. He's an innate problem-solver.",

        language:
            "Rishav speaks Hindi (native) and English (fluent). He communicates professionally in English and is comfortable working in international teams.",

        // ── Education ─────────────────────────────────────────────────────
        education:
            "Rishav is currently pursuing a BCA (Bachelor of Computer Applications). His foundation in programming is paving the way for his true passion: building a strong career in Cybersecurity and Ethical Hacking.",

        college:
            "He's pursuing his BCA at a college in India. Beyond formal coursework, he's heavily invested in online cybersecurity labs, learning network security, and mastering Linux.",

        gpa:
            "Rishav focuses more on building real skills—like understanding system behavior and finding vulnerabilities—than just chasing grades.",

        learning:
            "Rishav believes in continuous learning. Every day he actively learns and practices security concepts, real-world scenarios, and tools like Nmap and Wireshark.",

        // ── Skills & Tech ─────────────────────────────────────────────────
        skills:
            "Rishav's toolkit focuses on Cybersecurity: Networking Basics, Linux Basics, and Ethical Hacking. He supplements this with programming (Python, JavaScript) and Web Development (HTML, CSS). He's currently mastering tools like Ubuntu Linux, Nmap, and Wireshark.",

        python:
            "Python is a key programming language for Rishav. He uses his basic Python skills to script, automate, and better understand security vulnerabilities.",

        javascript:
            "Rishav knows basic JavaScript. Combined with his HTML/CSS skills, it helps him understand frontend development, which is crucial for web application security and ethical hacking.",

        html:
            "Rishav has a strong foundation in HTML and CSS (Web Development). Knowing how websites are built makes identifying their vulnerabilities much easier for him.",

        css:
            "Rishav uses CSS to craft beautiful designs (like this portfolio!). It's part of his strong foundation in Web Development.",

        ai:
            "While Rishav appreciates AI, his primary focus is on Cybersecurity. He's especially interested in how AI intersects with network security and ethical hacking.",

        git:
            "Rishav uses Git and GitHub for version control and sharing his coding projects.",

        linux:
            "Linux is Rishav's playground! He's focused on Linux Basics, specifically using Ubuntu Linux to practice security concepts, run tools like Nmap, and understand system behavior.",

        cybersecurity:
            "Cybersecurity is Rishav's main focus! He is actively transitioning into Ethical Hacking, Network Security, and Linux, with a keen interest in finding vulnerabilities and improving security.",

        tools:
            "Rishav is actively learning powerful security tools. He uses Ubuntu Linux as his daily driver and is currently learning Nmap for network scanning and Wireshark for packet analysis.",

        // ── Work & Projects ──────────────────────────────────────────────
        projects:
            "Rishav is putting his foundation in Web Development and his new focus on Cybersecurity to work! He's constantly practicing security concepts and real-world scenarios. Check out the portfolio section below to see his coding and design skills in action, including his slick Login Page design.",

        work:
            "Rishav's 'work' revolves around learning and practicing security concepts, tools like Wireshark and Nmap, and applying his Web Development foundation to understand application behavior from both sides. He is highly interested in finding vulnerabilities!",

        githubProjects:
            "You can find Rishav's web development and programming work on his GitHub — github.com/RishavK1811. As he dives deeper into Cybersecurity, expect more security-focused scripts there soon!",

        // ── Interests & Hobbies ───────────────────────────────────────────
        hobbies:
            "Outside of coding and practicing Ethical Hacking, Rishav is focused on continuously growing in the tech field. He loves breaking down how systems work and finding ways to secure them.",

        motivation:
            "Rishav is motivated by the desire to find vulnerabilities, understand complex system behavior, and improve overall security. He aims to build a strong, lasting career in the cybersecurity field.",

        // ── Career & Goals ────────────────────────────────────────────────
        goals:
            "Rishav's main aim is to build a rock-solid career in cybersecurity and continuously grow in the field of Ethical Hacking, Network Security, and Linux administration.",

        dream:
            "Rishav dreams of becoming a top-tier Cybersecurity Professional and Ethical Hacker, securing digital frontiers and stopping vulnerabilities in their tracks.",

        future:
            "In the future, Rishav sees himself thriving as a Cybersecurity expert. The transition he is making now during his BCA is laying the groundwork for that.",

        careerPath:
            "Rishav is pivoting his career path directly into Cybersecurity. He leverages his BCA background and Web Dev foundation to become a better Ethical Hacker.",

        internship:
            "Rishav is intensely looking for internships or early opportunities in Cybersecurity, Quality Assurance, or Network Security where he can apply his current learning!",

        // ── Freelance & Availability ──────────────────────────────────────
        freelance:
            "Yes! Rishav is open to collaborations, especially anything related to Web Development or entry-level Cybersecurity tasks. Reach out via the Contact section!",

        available:
            "Rishav is currently open to internship opportunities, freelance web development, and any project where he can flex his cybersecurity knowledge.",

        hire:
            "Hiring Rishav? Great choice! 🎯 He brings a unique blend of Web Development foundations and a passionate focus on Ethical Hacking and Network Security. Contact him below!",

        // ── Contact Info ──────────────────────────────────────────────────
        contact:
            "📬 Here's how to reach Rishav:\n• Email: rishavkumar181101@gmail.com\n• LinkedIn: linkedin.com/in/rishav-kumar-317134368\n• GitHub: github.com/RishavK1811\nOr just use the sleek Contact form below!",

        email:
            "📧 Rishav's email: rishavkumar181101@gmail.com — He checks it regularly and aims to respond within 24 hours.",

        linkedin:
            "🔗 Rishav's LinkedIn: linkedin.com/in/rishav-kumar-317134368 — Connect with him for professional networking!",

        github:
            "🐙 Rishav's GitHub: github.com/RishavK1811 — Check out his coding foundation!",

        // ── Portfolio Info ─────────────────────────────────────────────────
        portfolio:
            "You're looking at Rishav's custom portfolio right now. He designed the glassmorphism layout, integrated the smooth animations, and deployed this AI chatbox to perfectly represent his web dev foundation as he pivots into cybersecurity.",

        design:
            "Rishav has a great eye for design and Web Development, which is exactly what gives this portfolio its premium cyber aesthetic. Understanding how UIs are built helps him understand how to secure them.",

        // ── Work Ethic & Strengths ─────────────────────────────────────────
        workEthic:
            "Rishav is incredibly dedicated. Transitioning into Cybersecurity while doing a BCA requires massive self-teaching, and he's actively putting in the hours with Linux, Nmap, and Wireshark.",

        strengths:
            "Rishav's main strengths are his dual perspective (knowing both development and security), his active learning mindset, and his deep interest in finding vulnerabilities and understanding system behavior.",

        problemSolving:
            "Problem-solving is essential for an Ethical Hacker. Rishav excels at diving into systems, figuring out how they behave, and logically deducing how to secure them.",

        // ── Default fallback ───────────────────────────────────────────────
        default:
            "Hmm, I'm not quite sure about that one! Try asking me about his 'work', 'about', his transition into 'cybersecurity', his 'skills', or 'contact'. I know a LOT about his journey! 😄"
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Chat UI & Typing animation
    // ─────────────────────────────────────────────────────────────────────────
    let typingTimeout;
    let thinkingTimeout;

    function appendMessage(sender, text, isTyping = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}`;

        const avatar = document.createElement('div');
        avatar.className = 'chat-avatar';
        avatar.innerHTML = sender === 'user' ? '<i class="fa-solid fa-user"></i>' : '<i class="fa-solid fa-robot"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);

        // Remove placeholder if present
        const placeholder = responseArea.querySelector('.ai-placeholder');
        if (placeholder) placeholder.remove();

        responseArea.appendChild(msgDiv);
        responseArea.scrollTop = responseArea.scrollHeight;

        if (isTyping) {
            return bubble; // returning bubble so typeWriter can type into it
        } else {
            bubble.innerHTML = text;
            return null;
        }
    }

    function typeWriter(text, element, speed = 18) {
        element.innerHTML = '';
        let i = 0;
        const cursor = document.createElement('span');
        cursor.className = 'ai-cursor';
        element.appendChild(cursor);

        function type() {
            if (i < text.length) {
                element.insertBefore(document.createTextNode(text.charAt(i)), cursor);
                i++;
                responseArea.scrollTop = responseArea.scrollHeight; // Keep scrolling down as it types
                typingTimeout = setTimeout(type, speed);
            } else {
                setTimeout(() => { if (cursor.parentNode) cursor.parentNode.removeChild(cursor); }, 1000);
            }
        }
        type();
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Query Handler — rich multi-keyword matching
    // ─────────────────────────────────────────────────────────────────────────
    function handleQuery(rawQuery) {
        clearTimeout(typingTimeout);
        clearTimeout(thinkingTimeout);
        
        // Clear any previous thinking states or cursors
        document.querySelectorAll('.ai-cursor').forEach(c => c.remove());
        const thinkingBubbles = document.querySelectorAll('.chat-message.bot.thinking');
        thinkingBubbles.forEach(b => b.remove());

        const q = rawQuery.toLowerCase().trim();
        if (!q) return;

        // Display user query in chat
        appendMessage('user', rawQuery);

        let response = kb.default;

        // Helper: check if query includes any of the given words/phrases
        const has = (...terms) => terms.some(t => q.includes(t));

        // ── Non-English guard ──────────────────────────────────────────────
        if (has('kya','kaise','tum','aap','bhai','nahi','hai','kon','karo','yaar','tera','mera','kuch','bata','bol','acha') ||
            /[^\x00-\x7F]/.test(q)) {
            response = kb.nonEnglish;

        // ── Farewells ─────────────────────────────────────────────────────
        } else if (has('bye','goodbye','cya','see you','later','take care','gotta go')) {
            response = kb.bye;

        // ── Thanks ────────────────────────────────────────────────────────
        } else if (has('thank','thanks','thx','ty','appreciate')) {
            response = kb.thanks;

        // ── How are you ───────────────────────────────────────────────────
        } else if (has('how are you','how r u','how you doing','hows it going','how do you do')) {
            response = kb.howAreYou;

        // ── Greetings ─────────────────────────────────────────────────────
        } else if (/^(hi|hey|hello|sup|greetings|hola|yo|what'?s up|howdy)(\s|$)/.test(q)) {
            response = kb.greeting;

        // ── Who are you (the bot) ─────────────────────────────────────────
        } else if (has('who are you','what are you','are you a bot','are you ai','are you human','what is this','what do you do')) {
            response = kb.whoAmI;

        // ── Joke ──────────────────────────────────────────────────────────
        } else if (has('joke','funny','laugh','humor','lol','meme')) {
            response = kb.joke;

        // ── Quote / advice ─────────────────────────────────────────────────
        } else if (has('advice','suggest','tip','recommend') && has('developer','coder','programmer','learn','coding','beginners')) {
            response = kb.advice;
        } else if (has('quote','saying','philosophy','belief','principle','mindset')) {
            response = kb.quote + ' ' + kb.philosophy;

        // ── Fun facts ─────────────────────────────────────────────────────
        } else if (has('fun fact','interesting','did you know','surprise me','tell me something')) {
            response = kb.funFact;

        // ── Superpowers ───────────────────────────────────────────────────
        } else if (has('superpower','super power','best at','greatest','master','expert')) {
            response = kb.superpowers;

        // ── Compare ───────────────────────────────────────────────────────
        } else if (has('compare','different','unique','stand out','special','why rishav','why hire','why you')) {
            response = kb.compare;

        // ── Dark mode ─────────────────────────────────────────────────────
        } else if (has('dark mode','dark theme','light mode','theme')) {
            response = kb.darkMode;

        // ── Coffee / tea ──────────────────────────────────────────────────
        } else if (has('coffee','tea','drink','caffeine')) {
            response = kb.coffeeOrTea;

        // ── Introvert / extrovert ─────────────────────────────────────────
        } else if (has('introvert','extrovert','introversion','shy','social','talkative')) {
            response = kb.introvertExtrovert;

        // ── Love / hate ───────────────────────────────────────────────────
        } else if (has('love','crush','girlfriend','gf','date','romance','relationship') && !has('love coding','love python','love css','love building')) {
            response = kb.love;
        } else if (has('hate','dislike','annoying','worst','bug','spaghetti')) {
            response = kb.hate;

        // ── Name ──────────────────────────────────────────────────────────
        } else if (has('your name','his name','rishav name','what is his name','who is rishav','what is rishav')) {
            response = kb.name;

        // ── Age ───────────────────────────────────────────────────────────
        } else if (has('age','how old','birth','born','year old')) {
            response = kb.age;

        // ── Nationality / country ─────────────────────────────────────────
        } else if (has('nationality','country','indian','india','citizen')) {
            response = kb.nationality;

        // ── Gender ────────────────────────────────────────────────────────
        } else if (has('gender','sex','he','she','they','boy','girl')) {
            response = kb.gender;

        // ── Language spoken ───────────────────────────────────────────────
        } else if (has('speak','spoken language','hindi','tongue','mother tongue','communicate in')) {
            response = kb.language;

        // ── Personality ───────────────────────────────────────────────────
        } else if (has('personality','character','kind of person','type of person','vibe','attitude','nature')) {
            response = kb.personality;

        // ── Zodiac ────────────────────────────────────────────────────────
        } else if (has('zodiac','star sign','astrology','horoscope')) {
            response = kb.zodiac;

        // ── Bio / About ───────────────────────────────────────────────────
        } else if (has('tell me about','about rishav','bio','background','introduce','introduction','who is he')) {
            response = kb.bio;

        // ── Education ─────────────────────────────────────────────────────
        } else if (has('gpa','grade','marks','score','cgpa')) {
            response = kb.gpa;
        } else if (has('certification','certificate','course','bootcamp')) {
            response = kb.certification;
        } else if (has('education','college','university','degree','bca','study','studying','student','academic')) {
            response = kb.education;

        // ── Learning ──────────────────────────────────────────────────────
        } else if (has('how he learn','self learn','self-learn','autodidact','learn on his own','online course','youtube')) {
            response = kb.learning;

        // ── Computer vision ───────────────────────────────────────────────
        } else if (has('computer vision','vision','webcam','image processing','opencv','cv project')) {
            response = kb.computerVision;

        // ── Cube Solver ───────────────────────────────────────────────────
        } else if (has('cube','rubik','cube solver','rubiks')) {
            response = kb.cubeSolver;

        // ── Improvement Tree ──────────────────────────────────────────────
        } else if (has('improvement tree','improvement app','tree app','gamif','xp point','level up','habit app','mobile app')) {
            response = kb.improvementTree;

        // ── Login Page ────────────────────────────────────────────────────
        } else if (has('login page','login project','login ui','login design','login screen')) {
            response = kb.loginPage;

        // ── All projects / Work ──────────────────────────────────────────
        } else if (has('work','what do you do','job')) {
            response = kb.work;
        } else if (has('project','built','created','made','developed','portfolio project','what did')) {
            response = kb.projects;

        // ── GitHub ────────────────────────────────────────────────────────
        } else if (has('github','repo','repository','open source','commit','pull request','contribution')) {
            response = kb.github;

        // ── LinkedIn ──────────────────────────────────────────────────────
        } else if (has('linkedin','professional network','connect','profile link')) {
            response = kb.linkedin;

        // ── Socials ───────────────────────────────────────────────────────
        } else if (has('social','twitter','instagram','social media')) {
            response = kb.github; // GitHub & LinkedIn are main socials

        // ── Python ────────────────────────────────────────────────────────
        } else if (has('python','py','snake')) {
            response = kb.python;

        // ── JavaScript ───────────────────────────────────────────────────
        } else if (has('javascript','js','vanilla js','es6','ecmascript')) {
            response = kb.javascript;

        // ── HTML ──────────────────────────────────────────────────────────
        } else if (has('html','markup','html5','semantic')) {
            response = kb.html;

        // ── CSS ───────────────────────────────────────────────────────────
        } else if (has('css','styling','stylesheet','flexbox','grid layout','animation','css3')) {
            response = kb.css;

        // ── React ─────────────────────────────────────────────────────────
        } else if (has('react','react native','reactjs','component','jsx','frontend framework')) {
            response = kb.react;

        // ── Node.js ───────────────────────────────────────────────────────
        } else if (has('node','nodejs','node.js','express','server','backend','api','rest api')) {
            response = kb.nodejs;

        // ── C++ ───────────────────────────────────────────────────────────
        } else if (has('c++','cpp','c plus plus')) {
            response = kb.cpp;

        // ── Machine Learning ──────────────────────────────────────────────
        } else if (has('machine learning','ml','deep learning','neural','tensorflow','scikit','sklearn','training','model')) {
            response = kb.machinelearning;

        // ── AI ────────────────────────────────────────────────────────────
        } else if (has('artificial intelligence','ai opinion','ai future','ai thoughts','chatgpt','gpt','llm')) {
            response = kb.aiOpinion;
        } else if (has('ai','artificial','intelligent','smart','bot','generative')) {
            response = kb.ai;

        // ── Git ───────────────────────────────────────────────────────────
        } else if (has('git','version control','branch','merge','commit')) {
            response = kb.git;

        // ── Linux ─────────────────────────────────────────────────────────
        } else if (has('linux','ubuntu','terminal','bash','shell','command line','cli')) {
            response = kb.linux;

        // ── Tailwind ──────────────────────────────────────────────────────
        } else if (has('tailwind','tailwindcss','utility class')) {
            response = kb.tailwind;

        // ── MongoDB ───────────────────────────────────────────────────────
        } else if (has('mongodb','mongo','database','nosql','db','sql')) {
            response = kb.mongodb;

        // ── Full stack ────────────────────────────────────────────────────
        } else if (has('full stack','fullstack','full-stack','mern','mean')) {
            response = kb.fullstack;

        // ── Web dev opinion ───────────────────────────────────────────────
        } else if (has('web development','web dev','frontend','front end','back end','software development')) {
            response = kb.webdev;

        // ── Skills (general) ─────────────────────────────────────────────
        } else if (has('skill','tech stack','what can','know','proficient','capable','tools')) {
            response = kb.skills;

        // ── Favorite language ─────────────────────────────────────────────
        } else if (has('favorite language','fav lang','preferred language','favourite language','best language','love coding')) {
            response = kb.favoriteLang;

        // ── Favorite project ──────────────────────────────────────────────
        } else if (has('favorite project','best project','most proud','proud of','coolest project')) {
            response = kb.favoriteProject;

        // ── Favorite framework ────────────────────────────────────────────
        } else if (has('favorite framework','fav framework','best framework')) {
            response = kb.favoriteFramework;

        // ── Editor / IDE ──────────────────────────────────────────────────
        } else if (has('vs code','vscode','editor','ide','vim','emacs','notepad')) {
            response = kb.vscodeVim;

        // ── OS preference ─────────────────────────────────────────────────
        } else if (has('windows','mac','macos','operating system','os prefer','os choice')) {
            response = kb.osPreference;

        // ── Portfolio tech ────────────────────────────────────────────────
        } else if (has('portfolio tech','how built','three.js','threejs','gsap','aos','this website','this portfolio','your website')) {
            response = kb.portfolioTech;

        // ── Portfolio ─────────────────────────────────────────────────────
        } else if (has('portfolio','website','site','design','ui','interface')) {
            response = kb.portfolio;

        // ── Design sense ─────────────────────────────────────────────────
        } else if (has('design','ui/ux','ux','aesthetic','beautiful','pixel perfect','glassmorphism')) {
            response = kb.design;

        // ── Fitness ───────────────────────────────────────────────────────
        } else if (has('fitness','gym','workout','exercise','bodybuilding','health','body','physical')) {
            response = kb.fitness;

        // ── Gaming ───────────────────────────────────────────────────────
        } else if (has('game','gaming','play','gamer','strategy game','esports','video game')) {
            response = kb.gaming;

        // ── Reading / learning ────────────────────────────────────────────
        } else if (has('read','book','article','blog','knowledge','study habit')) {
            response = kb.reading;

        // ── Music ─────────────────────────────────────────────────────────
        } else if (has('music','song','playlist','spotify','listen')) {
            response = kb.music;

        // ── Travel ────────────────────────────────────────────────────────
        } else if (has('travel','trip','visit','tour','vacation','remote')) {
            response = kb.travel;

        // ── Motivation ───────────────────────────────────────────────────
        } else if (has('motivat','inspir','drive','passion','why code','purpose')) {
            response = kb.motivation;

        // ── Daily routine ─────────────────────────────────────────────────
        } else if (has('daily routine','schedule','day','morning','night','wake up','sleep')) {
            response = kb.routine;

        // ── Goals ─────────────────────────────────────────────────────────
        } else if (has('goal','ambition','aim','target','objective','milestone','1 year','5 year','10 year')) {
            response = kb.goals;

        // ── Dream ─────────────────────────────────────────────────────────
        } else if (has('dream','dream job','ultimate goal','vision','big picture','someday','aspire')) {
            response = kb.dream;

        // ── Future ───────────────────────────────────────────────────────
        } else if (has('future','next','plan','path','where heading','5 year','10 year')) {
            response = kb.future;

        // ── Entrepreneur ─────────────────────────────────────────────────
        } else if (has('startup','entrepreneur','own company','business','founder','build product')) {
            response = kb.entrepreneur;

        // ── Career path ───────────────────────────────────────────────────
        } else if (has('career','job','position','role','work as','profession')) {
            response = kb.careerPath;

        // ── Internship ────────────────────────────────────────────────────
        } else if (has('intern','internship','trainee','apprentice')) {
            response = kb.internship;

        // ── Hire ─────────────────────────────────────────────────────────
        } else if (has('hire','hiring','recruit','onboard','job offer','employ')) {
            response = kb.hire;

        // ── Rate / pricing ────────────────────────────────────────────────
        } else if (has('rate','pricing','cost','charge','fee','price','how much')) {
            response = kb.rate;

        // ── Collaboration ─────────────────────────────────────────────────
        } else if (has('collab','collaborate','together','partner','team up','joint','work together')) {
            response = kb.collaboration;

        // ── Freelance / available ─────────────────────────────────────────
        } else if (has('freelance','freelancing','freelancer','available for work','open to work','contract')) {
            response = kb.freelance;

        // ── Work ethic ───────────────────────────────────────────────────
        } else if (has('work ethic','hard work','dedication','committed','responsible','reliable','deadline')) {
            response = kb.workEthic;

        // ── Strengths ────────────────────────────────────────────────────
        } else if (has('strength','strong','best quality','top quality','virtue','talent','gifted')) {
            response = kb.strengths;

        // ── Weaknesses ───────────────────────────────────────────────────
        } else if (has('weakness','weak','struggle','improve','shortcoming','limitation')) {
            response = kb.weaknesses;

        // ── Problem solving ───────────────────────────────────────────────
        } else if (has('problem solve','problem-solving','logical','algorithm','debug','think','troubleshoot','analytical')) {
            response = kb.problemSolving;

        // ── Creativity ───────────────────────────────────────────────────
        } else if (has('creative','creativity','imagination','artistic','innovate','invention')) {
            response = kb.creativity;

        // ── Teamwork ──────────────────────────────────────────────────────
        } else if (has('team','teamwork','group','colab','colleague','peer','communicate','work with other')) {
            response = kb.teamwork;

        // ── Leadership ───────────────────────────────────────────────────
        } else if (has('leader','leadership','manage','manag','head','initiative','guide','mentor')) {
            response = kb.leadership;

        // ── Current work ─────────────────────────────────────────────────
        } else if (has('currently','right now','nowadays','these days','at the moment','what is he doing','working on')) {
            response = kb.currentWork;

        // ── Open to work ──────────────────────────────────────────────────
        } else if (has('open to work','looking for work','job seeking','actively looking','job hunt')) {
            response = kb.openToWork;

        // ── Resume ───────────────────────────────────────────────────────
        } else if (has('resume','cv','curriculum','document')) {
            response = kb.resume;

        // ── Email ────────────────────────────────────────────────────────
        } else if (has('email','mail','gmail','e-mail')) {
            response = kb.email;

        // ── Phone ────────────────────────────────────────────────────────
        } else if (has('phone','call','mobile','number','whatsapp','contact number')) {
            response = kb.phone;

        // ── Location ─────────────────────────────────────────────────────
        } else if (has('location','where','city','state','country','live','based','india','timezone','gmt')) {
            response = kb.location;

        // ── Contact (general) ────────────────────────────────────────────
        } else if (has('contact','reach out','get in touch','message','dm','ping','find')) {
            response = kb.contact;

        // ── Hobbies (general) ────────────────────────────────────────────
        } else if (has('hobby','hobbies','interest','free time','what does he like','what he enjoy','passion','fun','outside coding')) {
            response = kb.hobbies;

        // ── About (fallback) ──────────────────────────────────────────────
        } else if (has('about','who is','tell me','describe')) {
            response = kb.bio;

        // General experience
        } else if (has('experience','years','how long','history','track record')) {
            response = kb.bio + ' ' + (kb.skills || '');
        }

        // Fallback for any removed kb properties
        if (!response) {
            response = kb.default;
        }

        // Clear input
        if (inputField) inputField.value = '';

        // Show thinking state in the chat
        const botBubble = appendMessage('bot', '', true);
        botBubble.parentElement.classList.add('thinking');
        botBubble.innerHTML = '⏳ Thinking...';
        
        thinkingTimeout = setTimeout(() => {
            botBubble.parentElement.classList.remove('thinking');
            botBubble.innerHTML = ''; // Clear 'Thinking...'
            typeWriter(response, botBubble);
        }, 600); // Shorter delay for better UX
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Event Listeners
    // ─────────────────────────────────────────────────────────────────────────
    if (sendBtn)   sendBtn.addEventListener('click',   () => handleQuery(inputField.value));
    if (inputField) inputField.addEventListener('keypress', e => { if (e.key === 'Enter') handleQuery(inputField.value); });
    if (pills)     pills.forEach(pill => pill.addEventListener('click', () => handleQuery(pill.getAttribute('data-query'))));
});
