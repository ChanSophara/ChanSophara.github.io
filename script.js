document.addEventListener('DOMContentLoaded', function() {
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
    // Mobile device detection
    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || 
               (navigator.userAgent.indexOf('IEMobile') !== -1) ||
               (window.innerWidth <= 768);
    }

    // Add mobile class to body if needed
    if (isMobileDevice()) {
        document.body.classList.add('mobile-device');
    }

    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('nav ul');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle body overflow when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
    });
    
    // Sticky Header with mobile optimization
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        // Less scroll required for sticky header on mobile
        const scrollThreshold = isMobileDevice() ? 50 : 100;
        header.classList.toggle('scrolled', window.scrollY > scrollThreshold);
    });
    
    // Smooth Scrolling for Anchor Links with mobile offset adjustment
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            // Don't intercept anchor links that don't point to elements
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Smaller offset for mobile devices
                const offset = isMobileDevice() ? 60 : 80;
                const targetPosition = targetElement.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });
    
    // YouTube Video Handling with mobile optimizations
    const videoBtns = document.querySelectorAll('.video-btn');
    const videoModal = document.querySelector('.video-modal');
    const closeModal = document.querySelector('.close-modal');
    const youtubeIframeContainer = document.querySelector('.youtube-iframe-container');
    
    function openYoutubeVideo(videoId) {
        // Clear previous iframe
        youtubeIframeContainer.innerHTML = '';
        
        // Create new iframe with mobile-appropriate settings
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        
        // Adjust sizing for mobile
        if (isMobileDevice()) {
            iframe.style.width = '100%';
            iframe.style.height = '56.25vw'; // 16:9 aspect ratio
            iframe.style.minHeight = '200px';
            iframe.style.maxHeight = 'calc(100vh - 100px)';
        } else {
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.minHeight = '400px';
        }
        
        youtubeIframeContainer.appendChild(iframe);
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        // Close modal when pressing Escape key
        document.addEventListener('keydown', function escClose(e) {
            if (e.key === 'Escape') {
                closeVideoModal();
                document.removeEventListener('keydown', escClose);
            }
        });
    }
    
    function closeVideoModal() {
        videoModal.style.display = 'none';
        youtubeIframeContainer.innerHTML = '';
        document.body.style.overflow = 'auto';
    }
    
    // Click on project card video area
    document.querySelectorAll('.youtube-container').forEach(container => {
        container.addEventListener('click', function(e) {
            // Don't trigger if clicking on the play button or video button
            if (e.target.closest('.play-button') || e.target.closest('.video-btn')) {
                return;
            }
            
            const videoId = this.getAttribute('data-video-id');
            openYoutubeVideo(videoId);
        });
    });
    
    // Click on play video button
    videoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const videoId = this.closest('.project-media').querySelector('.youtube-container').getAttribute('data-video-id');
            openYoutubeVideo(videoId);
        });
    });
    
    closeModal.addEventListener('click', closeVideoModal);
    
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Animation on Scroll with mobile optimizations
    AOS.init({
        duration: isMobileDevice() ? 600 : 800,
        easing: 'ease-in-out',
        once: true,
        disable: isMobileDevice() ? 'phone' : false,
        offset: isMobileDevice() ? 120 : 200
    });
    
    // Project Video Placeholder Interaction with mobile hover fallback
    document.querySelectorAll('.youtube-container').forEach(container => {
        const playBtn = container.querySelector('.play-button');
        
        if (!isMobileDevice()) {
            // Hover effects only for non-mobile
            container.addEventListener('mouseenter', function() {
                playBtn.style.transform = 'translate(-50%, -50%) scale(1.1)';
            });
            
            container.addEventListener('mouseleave', function() {
                playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
            });
        }
        
        // Touch feedback for mobile
        container.addEventListener('touchstart', function() {
            if (isMobileDevice()) {
                this.style.opacity = '0.9';
            }
        });
        
        container.addEventListener('touchend', function() {
            if (isMobileDevice()) {
                this.style.opacity = '1';
            }
        });
    });
    
    // Prevent background scroll when modal is open
    document.addEventListener('touchmove', function(e) {
        if (videoModal.style.display === 'flex') {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Handle iOS viewport height issue
    function handleViewportHeight() {
        if (isMobileDevice()) {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        }
    }
    
    // Initial call
    handleViewportHeight();
    
    // Update on resize
    window.addEventListener('resize', handleViewportHeight);
    
    // Handle iOS form zooming prevention
    if (isMobileDevice()) {
        document.addEventListener('focusin', function(e) {
            if (e.target.matches('input, textarea, select')) {
                window.setTimeout(function() {
                    document.documentElement.style.zoom = '1';
                }, 100);
            }
        });
    }
});