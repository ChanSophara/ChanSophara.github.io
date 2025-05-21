document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;
    
    // Check for saved theme preference or use preferred color scheme
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    body.setAttribute('data-theme', savedTheme);
    
    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

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
            }
        });
    });
    
    // Replace your existing video modal handling code with this:

// Video Modal Handling
const videoBtns = document.querySelectorAll('.video-btn');
const videoModal = document.querySelector('.video-modal');
const closeModalBtns = document.querySelectorAll('.close-modal');
const youtubeIframeContainer = document.querySelector('.youtube-iframe-container');

let currentVideoId = null;

function openYoutubeVideo(videoId) {
    currentVideoId = videoId;
    youtubeIframeContainer.innerHTML = '';
    
    const iframe = document.createElement('iframe');
    iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`);
    iframe.setAttribute('frameborder', '0');
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
    
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
    
    document.addEventListener('keydown', function escClose(e) {
        if (e.key === 'Escape') {
            closeVideoModal();
            document.removeEventListener('keydown', escClose);
        }
    });
}

function closeVideoModal() {
    // Clear the iframe to stop the video
    youtubeIframeContainer.innerHTML = '';
    videoModal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentVideoId = null;
}

// Click on project card video area
document.querySelectorAll('.youtube-container').forEach(container => {
    container.addEventListener('click', function(e) {
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

// Close modal events
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        closeVideoModal();
    });
});

videoModal.addEventListener('click', function(e) {
    if (e.target === videoModal) {
        closeVideoModal();
    }
});

// Also add this to handle when mobile menu closes
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('mobile-menu')) {
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
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.classList.add('fade-in');
                } else {
                    card.style.display = 'none';
                    card.classList.remove('fade-in');
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
            if (e.target === modal || e.target.classList.contains('close-modal-btn')) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Animation on Scroll
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 120
    });
    
    // Initialize all projects as active
    projectCards.forEach(card => {
        card.style.display = 'block';
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
    
    // Add this to your existing script.js
// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
const mobileThemeToggle = document.getElementById('mobile-theme-toggle');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
});

mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// Mobile theme toggle
mobileThemeToggle.addEventListener('change', function() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// Sync mobile theme toggle with system
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    if (mobileThemeToggle) {
        mobileThemeToggle.checked = savedTheme === 'dark';
    }

    
});

});
