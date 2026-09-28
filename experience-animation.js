document.addEventListener('DOMContentLoaded', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (!timelineItems.length) return;

    // Check if element is already in viewport on load
    function checkVisibility() {
        const triggerBottom = window.innerHeight * 0.88;

        timelineItems.forEach((item, index) => {
            const itemTop = item.getBoundingClientRect().top;

            if (itemTop < triggerBottom) {
                // Apply small stagger delay per card
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 120);
            }
        });
    }

    // Run on initial page load & during scroll
    checkVisibility();
    window.addEventListener('scroll', checkVisibility, { passive: true });
});
