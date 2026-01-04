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
const colorPicker = document.getElementById('colorPicker');
const colorPreview = document.getElementById('colorPreview');
const presetBtns = document.querySelectorAll('.preset-btn');
const scrollTopBtn = document.getElementById('scrollTop');
const typingText = document.getElementById('typingText');
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const progressFills = document.querySelectorAll('.progress-fill');
const hireMeBtns = document.querySelectorAll('.hire-me');

// Popup elements
const popupOverlay = document.getElementById('popupOverlay');
const popupNotification = document.getElementById('popupNotification');
const popupClose = document.getElementById('popupClose');

// Certificate modal elements
const certificateModalOverlay = document.getElementById('certificateModalOverlay');
const certificateModal = document.getElementById('certificateModal');
const modalTitle = document.getElementById('modalTitle');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// State
let currentSection = 'home';
let currentColor = '#3b82f6';
let isDarkMode = document.body.classList.contains('dark');
let typingIndex = 0;
let isTypingForward = true;

// Typing Animation
const professions = [
    'AIML Engineer',
    'AR/VR Developer',
    'App Developer',
    'Data Analyst',
    'Game Developer',
    'Graphic Designer',
    'Educator'
];
    
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

// Color Theme Functions
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function generateColorVariations(baseColor) {
    const rgb = hexToRgb(baseColor);
    if (!rgb) return;
    
    // Generate darker variation for secondary color
    const secondary = {
        r: Math.max(0, rgb.r - 40),
        g: Math.max(0, rgb.g - 40),
        b: Math.max(0, rgb.b - 40)
    };
    
    const secondaryHex = `#${secondary.r.toString(16).padStart(2, '0')}${secondary.g.toString(16).padStart(2, '0')}${secondary.b.toString(16).padStart(2, '0')}`;
    
    return {
        primary: baseColor,
        secondary: secondaryHex,
        light: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`,
        glow: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`
    };
}

function updateThemeColors(color) {
    const variations = generateColorVariations(color);
    if (!variations) return;
    
    const root = document.documentElement;
    
    // Update CSS custom properties
    root.style.setProperty('--accent-primary', variations.primary);
    root.style.setProperty('--accent-secondary', variations.secondary);
    root.style.setProperty('--accent-light', variations.light);
    root.style.setProperty('--accent-glow', variations.glow);
    root.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${variations.primary} 0%, ${variations.secondary} 100%)`);
    
    // Update animated background orbs and meshes
    updateAnimatedBackground(variations);
    
    // Update color preview
    colorPreview.style.background = variations.primary;
    
    // Save to localStorage
    localStorage.setItem('customColor', color);
    currentColor = color;
}

function updateAnimatedBackground(variations) {
    const orbs = document.querySelectorAll('.floating-orb');
    const meshes = document.querySelectorAll('.mesh-gradient');
    
    orbs.forEach((orb, index) => {
        const color = index % 2 === 0 ? variations.primary : variations.secondary;
        orb.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
    });
    
    meshes.forEach((mesh, index) => {
        if (index === 0) {
            mesh.style.background = `conic-gradient(from 0deg, ${variations.primary}, ${variations.secondary}, ${variations.primary})`;
        } else if (index === 1) {
            mesh.style.background = `conic-gradient(from 180deg, ${variations.secondary}, ${variations.primary}, ${variations.secondary})`;
        } else {
            mesh.style.background = `conic-gradient(from 90deg, ${variations.primary}, ${variations.secondary}, ${variations.primary})`;
        }
    });
}

/*  Global Data & Initialization  */
let certificatesData = null;

// Load JSON immediately
fetch('certificates.json')
    .then(response => response.json())
    .then(data => {
        certificatesData = data;
        generateCertificateCards(data); // Generate cards as soon as data loads
        console.log("Certificates loaded and rendered.");
    })
    .catch(error => console.error('Error loading certificate data:', error));


/*  Function to Generate Cards (Main Page)  */
function generateCertificateCards(data) {
    const container = document.getElementById('certificates-grid-container');
    container.innerHTML = '';

    Object.keys(data).forEach(key => {
        const cert = data[key];
        
        // Logic: specific link if provided, otherwise standard '#'
        const linkUrl = cert.verifyLink ? cert.verifyLink : '#';
        const linkTarget = cert.verifyLink && cert.verifyLink !== '#' ? 'target="_blank"' : '';

        const cardHTML = `
            <div class="certificate-card glass-panel" data-cert="${key}">
                <div class="certificate-icon">
                    <i class="${cert.icon}"></i>
                </div>
                <div class="certificate-content">
                    <h4>${cert.title}</h4>
                    <p>${cert.description}</p>
                    <div class="certificate-meta">
                        <span class="cert-type">${cert.category}</span>
                        <span class="cert-year">${cert.year}</span>
                    </div>
                    
                    <div class="cert-actions">
                        <button class="verify-btn" onclick="showCertificateModal('${key}')">
                            <i class="fas fa-certificate"></i>
                            View Details
                        </button>
                        
                        <a href="${linkUrl}" ${linkTarget} class="verify-btn secondary">
                            <i class="fas fa-shield-alt"></i>
                            Verify
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cardHTML;
    });
}


/*   Function to Show Modal (Details)  */
function showCertificateModal(certType) {
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalOverlay = document.getElementById('certificateModalOverlay');

    if (!certificatesData) return;

    const data = certificatesData[certType];

    if (data) {
        modalTitle.textContent = data.title;

        const listItemsHTML = data.listItems.map(item => `<li>${item}</li>`).join('');
        const verificationHTML = data.verificationDetails.join('<br>');

        // Inject content with specific structure for the preloader
        modalContent.innerHTML = `
            <div class="modal-header-section">
                <div class="modal-icon-wrapper">
                    <i class="${data.icon}"></i>
                </div>
                <h4 class="modal-cert-title">${data.title}</h4>
            </div>

            <div class="modal-image-container">
                <div class="image-loader"></div>
                <img src="${data.image}" alt="${data.title}" class="modal-cert-image" id="modalCertImage">
            </div>

            <p class="modal-description">${data.description}</p>
            
            <div style="margin-bottom: 1.5rem;">
                <h5 class="modal-list-title">${data.listTitle || 'Key Highlights'}:</h5>
                <ul class="modal-list">
                    ${listItemsHTML}
                </ul>
            </div>

            <div class="modal-box-container">
                <h5 class="modal-list-title">Verification Details:</h5>
                <p class="modal-verification-text">
                    ${verificationHTML}
                </p>
            </div>

            <div class="modal-box-container">
                <p class="modal-quote">"${data.quote}"</p>
            </div>
        `;

        // --- PRELOADER LOGIC ---
        const img = document.getElementById('modalCertImage');
        const loader = modalContent.querySelector('.image-loader');

        // Function to run when image is ready
        const imageLoaded = () => {
            loader.style.display = 'none'; // Hide spinner
            img.classList.add('loaded');   // Fade image in
        };

        if (img.complete) {
            // If image is already cached, load immediately
            imageLoaded();
        } else {
            // Otherwise wait for load event
            img.onload = imageLoaded;
            img.onerror = () => {
                loader.style.display = 'none'; // Hide spinner on error
                // Optional: You could display an error message here
            };
        }

        modalOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}


/*  Close Modal Logic  */
document.addEventListener('DOMContentLoaded', () => {
    const modalOverlay = document.getElementById('certificateModalOverlay');
    const closeBtn = document.getElementById('modalClose');

    function closeCertificateModal() {
        modalOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeCertificateModal);
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeCertificateModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.classList.contains('show')) {
            closeCertificateModal();
        }
    });
});

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

    // Initialize color picker
    colorPicker.value = currentColor;
    updateThemeColors(currentColor);
    
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
    // Load custom color preference
    const savedColor = localStorage.getItem('customColor');
    if (savedColor) {
        currentColor = savedColor;
        colorPicker.value = savedColor;
        updateThemeColors(savedColor);
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
    
    // Color picker events
    colorPicker.addEventListener('input', (e) => {
        updateThemeColors(e.target.value);
    });
    
    // Preset color events
    presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.getAttribute('data-color');
            colorPicker.value = color;
            updateThemeColors(color);
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
    
    // Certificate modal events
    modalClose.addEventListener('click', hideCertificateModal);
    certificateModalOverlay.addEventListener('click', (e) => {
        if (e.target === certificateModalOverlay) {
            hideCertificateModal();
        }
    });
    
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
    const cards = document.querySelectorAll('.skill-card, .portfolio-item, .contact-item, .timeline-item, .planned-item, .certificate-card');
    
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

// Global function for certificate modal (called from HTML)
window.showCertificateModal = showCertificateModal;