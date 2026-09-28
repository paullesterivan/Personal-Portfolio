// 3D Perspective Depth Carousel for Projects Section (All Cards Navigate to Single Gallery Page)
document.addEventListener('DOMContentLoaded', () => {
    const stage = document.getElementById('projectsStage');
    const track = document.getElementById('projectsTrack');
    const prevBtn = document.getElementById('projectsPrevBtn');
    const nextBtn = document.getElementById('projectsNextBtn');

    if (track && prevBtn && nextBtn) {
        const cards = Array.from(track.querySelectorAll('.cylinder-card'));
        let currentIndex = 0;
        let autoScrollTimer = null;

        function updateProjectsCarousel() {
            const total = cards.length;

            cards.forEach((card, index) => {
                // Clear active layout state classes
                card.classList.remove('active', 'next', 'prev', 'hidden-right', 'hidden-left');

                // Relative offset calculation
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
            updateProjectsCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateProjectsCarousel();
        }

        // Arrow Controls (Prevents navigation when clicking arrow buttons)
        nextBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            nextSlide();
            resetAutoScroll();
        });

        prevBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            prevSlide();
            resetAutoScroll();
        });

        // Click Handler: ALL cards immediately open gallery.html
        cards.forEach((card) => {
            card.addEventListener('click', () => {
                window.location.href = 'gallery.html';
            });
        });

        // --- 5-Second Auto Scroll Functionality ---
        function startAutoScroll() {
            stopAutoScroll();
            autoScrollTimer = setInterval(nextSlide, 5000);
        }

        function stopAutoScroll() {
            if (autoScrollTimer) {
                clearInterval(autoScrollTimer);
                autoScrollTimer = null;
            }
        }

        function resetAutoScroll() {
            stopAutoScroll();
            startAutoScroll();
        }

        // Pause auto-scroll on hover
        if (stage) {
            stage.addEventListener('mouseenter', stopAutoScroll);
            stage.addEventListener('mouseleave', startAutoScroll);
        }

        // Initial render and start timer
        updateProjectsCarousel();
        startAutoScroll();
    }
});