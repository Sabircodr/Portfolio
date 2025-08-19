// Portfolio Website JavaScript

// DOM Elements
const loadingScreen = document.getElementById('loadingScreen');
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');
const styleSwitcher = document.getElementById('styleSwitcher');
const switcherToggle = document.getElementById('switcherToggle');
const themeToggle = document.getElementById('themeToggle');
const colorOptions = document.querySelectorAll('.color-option');
const scrollTopBtn = document.getElementById('scrollTop');
const typingText = document.getElementById('typingText');
const contactForm = document.getElementById('contactForm');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const progressFills = document.querySelectorAll('.progress-fill');
const hireMeBtns = document.querySelectorAll('.hire-me');

// Popup elements
const popupOverlay = document.getElementById('popupOverlay');
const popupNotification = document.getElementById('popupNotification');
const popupClose = document.getElementById('popupClose');

// State
let currentSection = 'home';
let currentTheme = 'blue';
let isDarkMode = document.body.classList.contains('dark');
let typingIndex = 0;
let isTypingForward = true;

// Typing Animation
const professions = ['Web Designer', 'Web Developer', 'Graphic Designer', 'Game Developer', 'AR/VR Developer'];
let professionIndex = 0;
let charIndex = 0;

function typeText() {
    const currentProfession = professions[professionIndex];
    
    if (isTypingForward) {
        if (charIndex < currentProfession.length) {
            typingText.textContent = currentProfession.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeText, 100);
        } else {
            setTimeout(() => {
                isTypingForward = false;
                typeText();
            }, 2000);
        }
    } else {
        if (charIndex > 0) {
            typingText.textContent = currentProfession.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeText, 50);
        } else {
            isTypingForward = true;
            professionIndex = (professionIndex + 1) % professions.length;
            setTimeout(typeText, 500);
        }
    }
}

// Initialize
function init() {
    // Hide loading screen
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1500);

    // Start typing animation
    setTimeout(typeText, 2000);

    // Initialize theme
    document.body.setAttribute('data-theme', currentTheme);
    
    // Initialize progress bars
    observeProgressBars();
    
    // Initialize scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Initialize resize events
    window.addEventListener('resize', handleResize);
}

// Navigation Functions
function showSection(targetSection) {
    // Hide all sections
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const section = document.getElementById(targetSection);
    if (section) {
        section.classList.add('active');
        currentSection = targetSection;
        
        // Trigger progress bar animations for about section
        if (targetSection === 'about') {
            setTimeout(animateProgressBars, 300);
        }
    }
    
    // Update active nav link
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === targetSection) {
            link.classList.add('active');
        }
    });
    
    // Close mobile menu
    closeMobileMenu();
}

function updateNavigation(element) {
    const targetSection = element.getAttribute('data-section');
    if (targetSection) {
        showSection(targetSection);
    }
}

// Mobile Menu Functions
function toggleMobileMenu() {
    sidebar.classList.toggle('open');
    mobileMenuToggle.classList.toggle('active');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function closeMobileMenu() {
    sidebar.classList.remove('open');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Style Switcher Functions
function toggleStyleSwitcher() {
    styleSwitcher.classList.toggle('open');
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark', isDarkMode);
    
    const icon = themeToggle.querySelector('i');
    icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save to localStorage
    localStorage.setItem('isDarkMode', isDarkMode);
}

function changeTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    // Update active color option
    colorOptions.forEach(option => {
        option.classList.remove('active');
        if (option.getAttribute('data-theme') === theme) {
            option.classList.add('active');
        }
    });
    
    // Save to localStorage
    localStorage.setItem('currentTheme', theme);
}

// Portfolio Filter Functions
function filterPortfolio(category) {
    portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.style.display = 'block';
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100);
        } else {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        }
    });
    
    // Update active filter button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

// Progress Bar Functions
function animateProgressBars() {
    progressFills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width;
    });
}

function observeProgressBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProgressBars();
            }
        });
    }, { threshold: 0.5 });
    
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}

// Scroll Functions
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Show/hide scroll to top button
    if (scrollTop > 300) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
    
    // Auto-hide style switcher on scroll
    if (styleSwitcher.classList.contains('open')) {
        styleSwitcher.classList.remove('open');
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Resize Functions
function handleResize() {
    if (window.innerWidth >= 1024) {
        closeMobileMenu();
    }
}

// Load Saved Preferences
function loadPreferences() {
    // Load theme preference
    const savedTheme = localStorage.getItem('currentTheme');
    if (savedTheme) {
        currentTheme = savedTheme;
        changeTheme(savedTheme);
    }
    
    // Load dark mode preference
    const savedDarkMode = localStorage.getItem('isDarkMode');
    if (savedDarkMode !== null) {
        isDarkMode = savedDarkMode === 'true';
        document.body.classList.toggle('dark', isDarkMode);
        const icon = themeToggle.querySelector('i');
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    init();
    loadPreferences();
    
    // Navigation events
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            updateNavigation(link);
        });
    });
    
    // Hire me buttons
    hireMeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showSection('contact');
        });
    });
    
    // Mobile menu events
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    
    // Style switcher events
    switcherToggle.addEventListener('click', toggleStyleSwitcher);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Color option events
    colorOptions.forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            changeTheme(theme);
        });
    });
    
    // Portfolio filter events
    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = btn.getAttribute('data-filter');
            filterPortfolio(category);
        });
    });
    
    // Scroll to top event
    scrollTopBtn.addEventListener('click', scrollToTop);
    
    // Popup events
    popupClose.addEventListener('click', hidePopup);
    popupOverlay.addEventListener('click', hidePopup);
    
    // Add popup to "Coming Soon" portfolio items
    document.querySelectorAll('.portfolio-link').forEach(link => {
        if (link.querySelector('.fa-clock')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                showPopup();
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            closeMobileMenu();
        }
        
        if (!styleSwitcher.contains(e.target) && !switcherToggle.contains(e.target)) {
            styleSwitcher.classList.remove('open');
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.getAttribute('href').substring(1);
            if (target) {
                showSection(target);
            }
        });
    });
});

// Add some interactive animations
function addInteractiveAnimations() {
    // Add hover effects to cards
    const cards = document.querySelectorAll('.skill-card, .portfolio-item, .contact-item, .timeline-item, .ongoing-item');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Add parallax effect to floating shapes
    window.addEventListener('mousemove', (e) => {
        const shapes = document.querySelectorAll('.shape');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.5;
            const xPos = x * speed * 10;
            const yPos = y * speed * 10;
            shape.style.transform = `translate(${xPos}px, ${yPos}px) rotate(${xPos}deg)`;
        });
    });
}

// Initialize interactive animations
document.addEventListener('DOMContentLoaded', addInteractiveAnimations);

// Popup Functions
function showPopup() {
    popupOverlay.classList.add('show');
    popupNotification.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hidePopup() {
    popupOverlay.classList.remove('show');
    popupNotification.classList.remove('show');
    document.body.style.overflow = '';
}

// Add loading animation for images
function addImageLoadingEffects() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
}

// Initialize image loading effects
document.addEventListener('DOMContentLoaded', addImageLoadingEffects);

// Add smooth transitions for section changes
function addSectionTransitions() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

// Initialize section transitions
document.addEventListener('DOMContentLoaded', addSectionTransitions);