document.addEventListener('DOMContentLoaded', () => {
    // 3D Cylinder Infinite Loop Carousel Logic
    const track = document.getElementById('skillsTrack');
    const prevBtn = document.getElementById('skillsPrevBtn');
    const nextBtn = document.getElementById('skillsNextBtn');

    if (track && prevBtn && nextBtn) {
        const cards = Array.from(track.querySelectorAll('.cylinder-card'));
        let currentIndex = 0;

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

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });

        // Click side card to switch directly
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                if (card.classList.contains('next')) {
                    currentIndex = (currentIndex + 1) % cards.length;
                    updateCarousel();
                } else if (card.classList.contains('prev')) {
                    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
                    updateCarousel();
                }
            });
        });

        // Initial render
        updateCarousel();
    }
});

