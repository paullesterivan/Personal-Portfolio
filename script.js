document.addEventListener('DOMContentLoaded', () => {
    // 3D Cylinder Infinite Loop Carousel Logic
    const track = document.getElementById('skillsTrack');
    const prevBtn = document.getElementById('skillsPrevBtn');
    const nextBtn = document.getElementById('skillsNextBtn');
    const stage = document.getElementById('skillsStage');

    if (track && prevBtn && nextBtn) {
        const cards = Array.from(track.querySelectorAll('.cylinder-card'));
        let currentIndex = 0;
        let autoSlideTimer = null;
        const AUTO_PLAY_INTERVAL = 5000; // 5 seconds

        function updateCarousel() {
            const total = cards.length;

            cards.forEach((card, index) => {
                // Clear state classes
                card.classList.remove('active', 'next', 'prev', 'hidden-right', 'hidden-left');

                // Determine relative index in loop
                let diff = (index - currentIndex + total) % total;

                if (diff === 0) {
                    card.classList.add('active');
                } else if (diff === 1) {
                    card.classList.add('next');
                } else if (diff === total - 1) {
                    card.classList.add('prev');
                } else if (diff <= total / 2) {
                    card.classList.add('hidden-right');
                } else {
                    card.classList.add('hidden-left');
                }
            });
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        }

        // Timer Control Functions
        function startAutoPlay() {
            stopAutoPlay();
            autoSlideTimer = setInterval(nextSlide, AUTO_PLAY_INTERVAL);
        }

        function stopAutoPlay() {
            if (autoSlideTimer) {
                clearInterval(autoSlideTimer);
                autoSlideTimer = null;
            }
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        // Button Click Handlers
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });

        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });

        // Click side card to switch directly
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('next')) {
                    nextSlide();
                    resetAutoPlay();
                } else if (card.classList.contains('prev')) {
                    prevSlide();
                    resetAutoPlay();
                }
            });
        });

        // Pause auto-play on hover so users can read content easily
        if (stage) {
            stage.addEventListener('mouseenter', stopAutoPlay);
            stage.addEventListener('mouseleave', startAutoPlay);
        }

        // Initial render & start timer
        updateCarousel();
        startAutoPlay();
    }
});