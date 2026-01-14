// Luxury Automotive Brand Showcase Carousel
document.addEventListener('DOMContentLoaded', function() {
    const carouselTrack = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicatorsContainer = document.getElementById('indicators');
    const brandCards = document.querySelectorAll('.brand-card');

    let currentIndex = 0;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID;
    let currentIndexStore = 0;

    // Initialize the carousel
    initCarousel();

    function initCarousel() {
        // Create indicators
        createIndicators();

        // Set up event listeners
        setupEventListeners();

        // Position the carousel to show the first card in the center
        updateCarousel();
    }

    function createIndicators() {
        brandCards.forEach((_, idx) => {
            const indicator = document.createElement('button');
            indicator.classList.add('indicator');
            if (idx === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => goToSlide(idx));
            indicatorsContainer.appendChild(indicator);
        });
    }

    function setupEventListeners() {
        // Button navigation
        prevBtn.addEventListener('click', showPrevSlide);
        nextBtn.addEventListener('click', showNextSlide);

        // Touch events for mobile
        carouselTrack.addEventListener('mousedown', dragStart);
        carouselTrack.addEventListener('touchstart', dragStart);

        carouselTrack.addEventListener('mousemove', dragging);
        carouselTrack.addEventListener('touchmove', dragging);

        carouselTrack.addEventListener('mouseup', dragEnd);
        carouselTrack.addEventListener('mouseleave', dragEnd);
        carouselTrack.addEventListener('touchend', dragEnd);

        // Prevent image drag
        const images = document.querySelectorAll('.brand-image');
        images.forEach(img => {
            img.addEventListener('dragstart', (e) => e.preventDefault());
        });

        // Auto-center on window resize
        window.addEventListener('resize', () => {
            updateCarousel();
        });
    }

    function dragStart(e) {
        isDragging = true;

        // Get starting position
        startPos = getPositionX(e);
        currentTranslate = prevTranslate || getTranslateX();

        // Start animation
        animationID = requestAnimationFrame(animation);
        carouselTrack.style.cursor = 'grabbing';

        // Disable transition during drag for smoother experience
        carouselTrack.style.transition = 'none';
    }

    function dragging(e) {
        if (!isDragging) return;

        const currentPosition = getPositionX(e);
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;

        setTransform(currentTranslate);
    }

    function dragEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        carouselTrack.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;

        // If moved more than 50px, change slide
        if (Math.abs(movedBy) > 50) {
            if (movedBy > 0) {
                currentIndex -= 1;
            } else {
                currentIndex += 1;
            }
        }

        // Snap to closest slide
        snapToCurrentSlide();
    }

    function animation() {
        setTransform(currentTranslate);
        if (isDragging) requestAnimationFrame(animation);
    }

    function getPositionX(e) {
        return e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    }

    function getTranslateX() {
        const style = window.getComputedStyle(carouselTrack);
        const matrix = new DOMMatrixReadOnly(style.transform);
        return matrix.m41; // x translation value
    }

    function setTransform(position) {
        carouselTrack.style.transform = `translateX(${position}px)`;
    }

    function showPrevSlide() {
        currentIndex = Math.max(0, currentIndex - 1);
        snapToCurrentSlide();
    }

    function showNextSlide() {
        currentIndex = Math.min(brandCards.length - 1, currentIndex + 1);
        snapToCurrentSlide();
    }

    function goToSlide(index) {
        currentIndex = index;
        snapToCurrentSlide();
    }

    function snapToCurrentSlide() {
        // Clamp index to valid range
        currentIndex = Math.max(0, Math.min(brandCards.length - 1, currentIndex));

        // Calculate the position to center the current card
        const containerWidth = carouselTrack.parentElement.offsetWidth;
        const cardWidth = brandCards[0].offsetWidth;
        const gap = parseInt(getComputedStyle(carouselTrack).gap) || 30;

        // Position to center the current card
        const centerPosition = (containerWidth - cardWidth) / 2;

        // Calculate offset for the current card
        let totalOffset = 0;
        for (let i = 0; i < currentIndex; i++) {
            totalOffset += cardWidth + gap;
        }

        // Adjust position to center the current card
        const newPosition = centerPosition - totalOffset;

        // Apply smooth transition
        carouselTrack.style.transition = 'transform 0.7s cubic-bezier(0.23, 1, 0.32, 1)';
        setTransform(newPosition);

        // Update stored position
        prevTranslate = newPosition;

        // Update active state after transition completes
        setTimeout(() => {
            updateCarousel();
        }, 300); // Slightly before transition ends for smoother effect
    }

    function updateCarousel() {
        // Update active class on cards
        brandCards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });

        // Update indicators
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }
});