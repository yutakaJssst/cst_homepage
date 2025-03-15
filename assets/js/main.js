/**
 * Nihon University College of Science and Technology
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load chatbot CSS and JS dynamically for all pages
    loadChatbot();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (mainNav && mainNav.classList.contains('active') && !event.target.closest('nav')) {
            mainNav.classList.remove('active');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Sticky header
    const header = document.querySelector('header');
    const headerOffset = header ? header.offsetTop : 0;
    
    function handleScroll() {
        if (window.pageYOffset > headerOffset) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    if (header) {
        window.addEventListener('scroll', handleScroll);
    }
    
    // Current year for copyright
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
    // Dropdown menus for all devices
    const dropdowns = document.querySelectorAll('.dropdown');
    
    if (dropdowns.length > 0) {
        // For touch devices
        if ('ontouchstart' in window) {
            dropdowns.forEach(dropdown => {
                const link = dropdown.querySelector('a');
                const content = dropdown.querySelector('.dropdown-content');
                
                if (link && content) {
                    link.addEventListener('click', function(e) {
                        // Always prevent default for dropdown links
                        e.preventDefault();
                        
                        // Check if this is a direct click on the dropdown link
                        if (e.target === link) {
                            
                            // Close all other dropdowns
                            dropdowns.forEach(otherDropdown => {
                                if (otherDropdown !== dropdown) {
                                    otherDropdown.querySelector('.dropdown-content').style.display = 'none';
                                }
                            });
                            
                            // Toggle this dropdown
                            if (content.style.display === 'flex' || content.style.display === 'block') {
                                content.style.display = 'none';
                            } else {
                                content.style.display = 'flex';
                            }
                        }
                    });
                }
            });
        }
        
        // For all devices - close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.dropdown')) {
                dropdowns.forEach(dropdown => {
                    const content = dropdown.querySelector('.dropdown-content');
                    if (content) {
                        content.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // News filter (if on news page)
    const newsFilters = document.querySelectorAll('.news-filter');
    const newsItems = document.querySelectorAll('.news-item');
    
    if (newsFilters.length > 0 && newsItems.length > 0) {
        newsFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all filters
                newsFilters.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked filter
                this.classList.add('active');
                
                const category = this.getAttribute('data-category');
                
                // Show/hide news items based on category
                newsItems.forEach(item => {
                    if (category === 'all' || item.getAttribute('data-category') === category) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Image gallery (if on gallery page)
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    
    if (galleryItems.length > 0 && lightbox && lightboxImg && lightboxClose) {
        galleryItems.forEach(item => {
            item.addEventListener('click', function() {
                const imgSrc = this.querySelector('img').getAttribute('src');
                const imgAlt = this.querySelector('img').getAttribute('alt');
                
                lightboxImg.setAttribute('src', imgSrc);
                lightboxImg.setAttribute('alt', imgAlt);
                lightbox.style.display = 'flex';
                
                // Prevent scrolling when lightbox is open
                document.body.style.overflow = 'hidden';
            });
        });
        
        lightboxClose.addEventListener('click', function() {
            lightbox.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Form validation (if on contact or application page)
    const forms = document.querySelectorAll('form[data-validate]');
    
    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                let isValid = true;
                
                // Check required fields
                const requiredFields = form.querySelectorAll('[required]');
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Add error message if not exists
                        let errorMsg = field.parentNode.querySelector('.error-message');
                        if (!errorMsg) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = '必須項目です';
                            field.parentNode.appendChild(errorMsg);
                        }
                    } else {
                        field.classList.remove('error');
                        const errorMsg = field.parentNode.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.remove();
                        }
                    }
                });
                
                // Check email format
                const emailFields = form.querySelectorAll('input[type="email"]');
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                
                emailFields.forEach(field => {
                    if (field.value.trim() && !emailRegex.test(field.value.trim())) {
                        isValid = false;
                        field.classList.add('error');
                        
                        // Add error message if not exists
                        let errorMsg = field.parentNode.querySelector('.error-message');
                        if (!errorMsg) {
                            errorMsg = document.createElement('div');
                            errorMsg.className = 'error-message';
                            errorMsg.textContent = 'メールアドレスの形式が正しくありません';
                            field.parentNode.appendChild(errorMsg);
                        } else {
                            errorMsg.textContent = 'メールアドレスの形式が正しくありません';
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    
                    // Scroll to first error
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.focus();
                        firstError.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            });
            
            // Clear error on input
            form.querySelectorAll('input, textarea, select').forEach(field => {
                field.addEventListener('input', function() {
                    this.classList.remove('error');
                    const errorMsg = this.parentNode.querySelector('.error-message');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                });
            });
        });
    }
    
    // Function to load chatbot CSS and JS
    function loadChatbot() {
        // Get the base URL for the site
        const baseUrl = getBaseUrl();
        
        // Load chatbot CSS
        if (!document.querySelector('link[href*="chatbot.css"]')) {
            const chatbotCss = document.createElement('link');
            chatbotCss.rel = 'stylesheet';
            chatbotCss.href = baseUrl + 'assets/css/chatbot.css';
            document.head.appendChild(chatbotCss);
        }
        
        // Load chatbot JS
        if (!document.querySelector('script[src*="chatbot.js"]')) {
            // Wait for CSS to load before loading JS
            setTimeout(() => {
                const chatbotJs = document.createElement('script');
                chatbotJs.type = 'module';
                chatbotJs.src = baseUrl + 'assets/js/chatbot.js';
                document.body.appendChild(chatbotJs);
            }, 300);
        }
    }
    
    // Function to get the base URL
    function getBaseUrl() {
        // Get the current path
        const path = window.location.pathname;
        
        // Count the number of directory levels
        const pathParts = path.split('/').filter(part => part !== '');
        
        // Create the relative path to the root
        let baseUrl = '';
        if (pathParts.length > 0) {
            for (let i = 0; i < pathParts.length; i++) {
                baseUrl += '../';
            }
        }
        
        return baseUrl;
    }
});