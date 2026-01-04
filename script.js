document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 120
    });

    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const mobileThemeToggle = document.getElementById('mobile-theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);
    
    // Set mobile toggle state
    if (mobileThemeToggle) {
        mobileThemeToggle.checked = savedTheme === 'dark';
    }
    
    // Desktop theme toggle
    themeToggle.addEventListener('click', () => {
        toggleTheme();
    });
    
    // Mobile theme toggle
    if (mobileThemeToggle) {
        mobileThemeToggle.addEventListener('change', function() {
            toggleTheme();
        });
    }
    
    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        if (mobileThemeToggle) {
            mobileThemeToggle.checked = newTheme === 'dark';
        }
    }

    // Sticky Header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const offset = 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (hamburger.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });
    
    // Video Modal Handling
    const videoBtns = document.querySelectorAll('.video-btn');
    const videoModal = document.querySelector('.video-modal');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const youtubeIframeContainer = document.querySelector('.youtube-iframe-container');
    const youtubeContainers = document.querySelectorAll('.youtube-container');

    let currentVideoId = null;

    function openYoutubeVideo(videoId) {
        currentVideoId = videoId;
        youtubeIframeContainer.innerHTML = '';
        
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        
        // Responsive iframe sizing
        if (window.innerWidth <= 768) {
            iframe.style.width = '100%';
            iframe.style.height = '56.25vw';
            iframe.style.minHeight = '200px';
            iframe.style.maxHeight = 'calc(100vh - 100px)';
        } else {
            iframe.style.width = '100%';
            iframe.style.height = '450px';
        }
        
        youtubeIframeContainer.appendChild(iframe);
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Add escape key listener
        document.addEventListener('keydown', function escClose(e) {
            if (e.key === 'Escape') {
                closeVideoModal();
                document.removeEventListener('keydown', escClose);
            }
        });
    }

    function closeVideoModal() {
        youtubeIframeContainer.innerHTML = '';
        videoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
        currentVideoId = null;
    }

    // Click on project card video area
    youtubeContainers.forEach(container => {
        container.addEventListener('click', function(e) {
            // Don't trigger if clicking on play button or video button
            if (e.target.closest('.play-button') || e.target.closest('.video-btn')) {
                return;
            }
            
            const videoId = this.getAttribute('data-video-id');
            if (videoId) {
                openYoutubeVideo(videoId);
            }
        });
    });

    // Click on play video button
    videoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const projectMedia = this.closest('.project-media');
            const videoId = projectMedia.querySelector('.youtube-container').getAttribute('data-video-id');
            if (videoId) {
                openYoutubeVideo(videoId);
            }
        });
    });

    // Click on play button in video preview
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const videoId = this.closest('.youtube-container').getAttribute('data-video-id');
            if (videoId) {
                openYoutubeVideo(videoId);
            }
        });
    });

    // Close modal events
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.closest('.video-modal')) {
                closeVideoModal();
            } else if (this.closest('.project-modal')) {
                closeProjectModal(this.closest('.project-modal'));
            }
        });
    });

    // Close modal when clicking outside
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });

    // Project Filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category').split(' ');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
    
    // Project Detail Modals
    const projectModals = document.querySelectorAll('.project-modal');
    const detailBtns = document.querySelectorAll('.btn-detail');
    
    detailBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project');
            const modal = document.getElementById(`${projectId}-modal`);
            
            if (modal) {
                modal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    projectModals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeProjectModal(modal);
            }
        });
    });
    
    // Close project modal buttons
    document.querySelectorAll('.close-modal-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.project-modal');
            closeProjectModal(modal);
        });
    });
    
    function closeProjectModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
    });
    
    mobileMenuClose.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
    
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
    
    // Initialize all projects as active
    projectCards.forEach(card => {
        card.classList.remove('hidden');
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    });
    
    // Handle iOS viewport height issue
    function handleViewportHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    // Initial call
    handleViewportHeight();
    
    // Update on resize
    window.addEventListener('resize', handleViewportHeight);
    
    // Force hero photo visibility on mobile
    function checkHeroPhoto() {
        const heroPhoto = document.querySelector('.hero-photo');
        if (window.innerWidth <= 768) {
            heroPhoto.style.display = 'block';
        }
    }

    // Run on load and resize
    window.addEventListener('load', checkHeroPhoto);
    window.addEventListener('resize', checkHeroPhoto);
    
    // Add active class to current nav link
    function setActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-desktop a, .mobile-menu a');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollY >= (sectionTop - 200)) {
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
    }
    
    setActiveNavLink();
    
    // Initialize animated text for hero subtitle
    initAnimatedText();
    
    // Add skill tags animation
    const skillTags = document.querySelectorAll('.skill-tags span');
    skillTags.forEach((tag, index) => {
        tag.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add project card hover effects
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const playButton = this.querySelector('.play-button');
            if (playButton) {
                playButton.style.opacity = '1';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const playButton = this.querySelector('.play-button');
            if (playButton && !playButton.matches(':hover')) {
                playButton.style.opacity = '0';
            }
        });
    });
    
    // Add scroll reveal animations
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right, .scale-in');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.remove('loading');
        });
        
        if (!img.complete) {
            img.classList.add('loading');
        }
    });
});

// Animated text for hero subtitle
function initAnimatedText() {
    const animatedText = document.querySelector('.animated-text');
    if (!animatedText) return;
    
    // Remove any existing data-words and set new ones
    animatedText.removeAttribute('data-words');
    
    const words = ["Data Scientist", "Data Analyst", "Machine Learning Engineer", "AI Enthusiast", "Python Developer", "Computer Vision Specialist", "Data Visualization Expert", "Business Analyst", "Business Networking"];
    let currentWordIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let isPaused = false;
    let typingSpeed = 120; // ms per character
    let deletingSpeed = 100; // ms per character when deleting
    let pauseTime = 2000; // ms to pause between words
    
    function typeWriter() {
        if (isPaused) return;
        
        const currentWord = words[currentWordIndex];
        
        if (!isDeleting && currentCharIndex <= currentWord.length) {
            // Typing
            animatedText.textContent = currentWord.substring(0, currentCharIndex);
            currentCharIndex++;
            setTimeout(typeWriter, typingSpeed);
        } else if (isDeleting && currentCharIndex >= 0) {
            // Deleting
            animatedText.textContent = currentWord.substring(0, currentCharIndex);
            currentCharIndex--;
            setTimeout(typeWriter, deletingSpeed);
        } else {
            // Switch between typing and deleting
            isDeleting = !isDeleting;
            
            if (!isDeleting) {
                // Move to next word
                currentWordIndex = (currentWordIndex + 1) % words.length;
            }
            
            // Pause at the end of typing before deleting
            isPaused = true;
            setTimeout(() => {
                isPaused = false;
                typeWriter();
            }, pauseTime);
        }
    }
    
    // Start animation after a delay
    setTimeout(typeWriter, 1000);
}

// Add tooltip functionality
const tooltipElements = document.querySelectorAll('[title]');
tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', function(e) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = this.getAttribute('title');
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
        tooltip.style.transform = 'translateX(-50%)';
        
        this._tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
        if (this._tooltip) {
            this._tooltip.remove();
            delete this._tooltip;
        }
    });
});

// Add these styles dynamically for tooltips
const tooltipStyles = document.createElement('style');
tooltipStyles.textContent = `
    .tooltip-text {
        position: fixed;
        background: var(--gradient-dark);
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: var(--radius-md);
        font-size: 0.875rem;
        white-space: nowrap;
        z-index: var(--z-tooltip);
        pointer-events: none;
        opacity: 0;
        animation: fadeIn 0.2s ease forwards;
        backdrop-filter: blur(10px);
        border: 1px solid var(--glass-border);
    }
    
    .tooltip-text::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border-width: 6px;
        border-style: solid;
        border-color: var(--primary) transparent transparent transparent;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    
    .loading {
        position: relative;
        overflow: hidden;
    }
    
    .loading::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        animation: loading 1.5s infinite;
    }
    
    @keyframes loading {
        from { left: -100%; }
        to { left: 100%; }
    }
`;

document.head.appendChild(tooltipStyles);

// Make sure animated text is initialized
window.addEventListener('load', function() {
    initAnimatedText();
});