document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('nav ul');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
    
    // Sticky Header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 100);
    });
    
    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // YouTube Video Handling
    const videoBtns = document.querySelectorAll('.video-btn');
    const videoModal = document.querySelector('.video-modal');
    const closeModal = document.querySelector('.close-modal');
    const youtubeIframeContainer = document.querySelector('.youtube-iframe-container');
    
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
    
    function openYoutubeVideo(videoId) {
        // Clear previous iframe
        youtubeIframeContainer.innerHTML = '';
        
        // Create new iframe
        const iframe = document.createElement('iframe');
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.minHeight = '400px';
        
        youtubeIframeContainer.appendChild(iframe);
        videoModal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }
    
    closeModal.addEventListener('click', function() {
        videoModal.style.display = 'none';
        youtubeIframeContainer.innerHTML = ''; // Remove iframe when closing
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    });
    
    videoModal.addEventListener('click', function(e) {
        if (e.target === videoModal) {
            videoModal.style.display = 'none';
            youtubeIframeContainer.innerHTML = ''; // Remove iframe when clicking outside
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }
    });
    
    // Animation on Scroll
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
    
    // Project Video Placeholder Interaction
    document.querySelectorAll('.youtube-container').forEach(container => {
        const preview = container.querySelector('.video-preview');
        const playBtn = container.querySelector('.play-button');
        
        container.addEventListener('mouseenter', function() {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1.1)';
        });
        
        container.addEventListener('mouseleave', function() {
            playBtn.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
});