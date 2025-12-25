// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const html = document.documentElement;
const navbar = document.querySelector('.navbar');

// Theme Toggle
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateThemeIcon(savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Mobile Menu
hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    // Animate hamburger lines
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
});

// Close mobile menu when clicking a link
document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
    });
});

// Smooth Scroll for Navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
        navbar.style.boxShadow = "none";
    }
});

// CGPA Chart using Chart.js
const ctx = document.getElementById('cgpaChart').getContext('2d');
new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
        datasets: [{
            label: 'CGPA Growth',
            data: [7.33, 7.80, 9.71, 9.13],
            borderColor: '#2563EB', // Primary Color
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#FFFFFF',
            pointBorderColor: '#2563EB',
            pointBorderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 8
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                padding: 10,
                displayColors: false,
                callbacks: {
                    label: function (context) {
                        return 'CGPA: ' + context.parsed.y;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 6,
                max: 10,
                grid: {
                    color: 'rgba(200, 200, 200, 0.1)'
                },
                ticks: {
                    font: {
                        family: 'Outfit'
                    }
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        family: 'Outfit'
                    }
                }
            }
        }
    }
});

/* --- Smart Features --- */

// 1. Recommendation Modal
const modal = document.getElementById('recommendation-modal');
const closeModal = document.querySelector('.close-modal');
const personaBtns = document.querySelectorAll('.persona-btn');
const projects = document.querySelectorAll('.project-card');

// Show modal on first visit (using session storage to simple logic)
window.addEventListener('load', () => {
    if (!sessionStorage.getItem('visited')) {
        setTimeout(() => {
            modal.style.display = 'flex';
        }, 1500); // Show after 1.5 seconds
        sessionStorage.setItem('visited', 'true');
    }
});

closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target == modal) {
        modal.style.display = 'none';
    }
});

personaBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const persona = btn.getAttribute('data-persona');
        modal.style.display = 'none';

        // Highlight relevant projects based on persona
        highlightProjects(persona);

        // Scroll to projects section
        document.querySelector('#projects').scrollIntoView({ behavior: 'smooth' });
    });
});

function highlightProjects(persona) {
    // Reset all projects opacity
    projects.forEach(p => {
        p.style.opacity = '0.5';
        p.style.transform = 'scale(0.95)';
        p.style.border = '1px solid var(--border-color)';
    });

    // Select based on persona logic
    let filter = '';
    if (persona === 'recruiter') {
        // Recruiters want to see Backend/Fullstack (Bank, Restaurant)
        // We'll highlight everything as all are impressive, but maybe focus on the most "Enterprise" ones
        highlightCard('backend');
        highlightCard('fullstack');
    } else if (persona === 'student') {
        // Students like cool tech (QR, Future AR)
        highlightCard('innovative');
        highlightCard('future');
    } else if (persona === 'developer') {
        // Developers look at code quality and logic (Bank, Restaurant)
        highlightCard('backend');
        highlightCard('fullstack');
    }
}

function highlightCard(category) {
    const cards = document.querySelectorAll(`.project-card[data-category="${category}"]`);
    cards.forEach(card => {
        card.style.opacity = '1';
        card.style.transform = 'scale(1.02)';
        card.style.border = '2px solid var(--primary-color)';
    });
}

// 2. Chatbot Logic
const chatbotToggler = document.querySelector(".chatbot-toggler");
const closeBtn = document.querySelector(".close-btn");
const chatbox = document.querySelector(".chatbox");
const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input span");

let userMessage = null;
const inputInitHeight = chatInput.scrollHeight;

// Predefined knowledge base
const knowledgeBase = {
    skills: "I am proficient in Java, Advanced Java (Servlets, JSP), MySQL/SQL, and Front-end technologies like HTML, CSS, and JavaScript. I also have strong UI/UX design skills.",
    projects: "I've built a Bank Management System, a Restaurant Order System, and a QR Code Menu. I'm also planning an AR Shopping experience!",
    internships: "I've completed 3 internships: Web Development, Full Stack Java Development, and a Technical Internship.",
    experience: "I have hands-on experience in full-stack development, database management, and UI/UX design through multiple internships and projects.",
    contact: "You can reach me via email at email@example.com or connect with me on LinkedIn!",
    default: "I'm not sure about that, but I can tell you about my Skills, Projects, or Experience. What would you like to know?"
};

const createChatLi = (message, className) => {
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined"><i class="fas fa-robot"></i></span><p></p>`;
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const messageElement = incomingChatLi.querySelector("p");

    // Simple keyword matching
    const msg = userMessage.toLowerCase();
    let response = knowledgeBase.default;

    if (msg.includes("skill") || msg.includes("tech")) response = knowledgeBase.skills;
    else if (msg.includes("project") || msg.includes("work")) response = knowledgeBase.projects;
    else if (msg.includes("intern") || msg.includes("job")) response = knowledgeBase.internships;
    else if (msg.includes("experience")) response = knowledgeBase.experience;
    else if (msg.includes("contact") || msg.includes("email") || msg.includes("reach")) response = knowledgeBase.contact;
    else if (msg.includes("hello") || msg.includes("hi")) response = "Hello! How can I help you explore my portfolio today?";

    // Simulate typing delay
    setTimeout(() => {
        messageElement.textContent = response;
        chatbox.scrollTo(0, chatbox.scrollHeight);
    }, 600);
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;

    // Append user message
    chatbox.appendChild(createChatLi(userMessage, "outgoing"));
    chatbox.scrollTo(0, chatbox.scrollHeight);

    // Append thinking message
    setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        chatbox.scrollTo(0, chatbox.scrollHeight);
        generateResponse(incomingChatLi);
    }, 600);
}

chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);
closeBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
