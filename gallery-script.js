// Dedicated Gallery Page JavaScript
document.addEventListener('DOMContentLoaded', () => {

    // ----------------------------------------------------
    // 1. DYNAMIC FOOTER YEAR
    // ----------------------------------------------------
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // ----------------------------------------------------
    // 2. LIGHT / DARK THEME TOGGLE
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggle');

    function toggleDarkMode() {
        document.body.classList.toggle('dark');
        const isDark = document.body.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    if (
        localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
        document.body.classList.add('dark');
    } else if (localStorage.getItem('theme') === 'light') {
        document.body.classList.remove('dark');
    }

    themeToggleBtn?.addEventListener('click', toggleDarkMode);

    // ----------------------------------------------------
    // 3. CATEGORY FILTERING LOGIC
    // ----------------------------------------------------
    const filterBtns = document.querySelectorAll('.gallery-filter-btn');
    const galleryCards = document.querySelectorAll('.gallery-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            galleryCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ----------------------------------------------------
    // 4. SUB-CATEGORY & PDF / HTML / IMAGE ASSET DATABASE
    // ----------------------------------------------------
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxClose = document.getElementById('lightboxClose');
    const modalMasonryGrid = document.getElementById('modalMasonryGrid');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxDesc = document.getElementById('lightboxDesc');

    const categoryAssetDatabase = {
        // Billboard & Banner Layouts
        billboards: [
            { img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=500&h=700&auto=format&fit=crop", width: 500, height: 700, alt: "Billboard Layout 1" },
            { img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=500&h=400&auto=format&fit=crop", width: 500, height: 400, alt: "Tarpaulin Layout 2" },
            { img: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&h=560&auto=format&fit=crop", width: 500, height: 560, alt: "Event Branding Display" },
            { img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&h=680&auto=format&fit=crop", width: 500, height: 680, alt: "Large Format Outdoor Signage" },
            { img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=500&h=460&auto=format&fit=crop", width: 500, height: 460, alt: "Stage Banner Concept" },
            { img: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=500&h=540&auto=format&fit=crop", width: 500, height: 540, alt: "Exhibition Poster Graphic" }
        ],

        // Vehicle Branding & Coaster Wraps
        vehicle: [
            { img: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=500&h=400&auto=format&fit=crop", width: 500, height: 400, alt: "Coaster Bus Wrap" },
            { img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=500&h=620&auto=format&fit=crop", width: 500, height: 620, alt: "Transit Fleet Graphics" },
            { img: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?q=80&w=500&h=420&auto=format&fit=crop", width: 500, height: 420, alt: "Fleet Wrap Side Profile" },
            { img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=500&h=380&auto=format&fit=crop", width: 500, height: 380, alt: "Van Commercial Branding" }
        ],

        // Logo Design & Brand Identity
        logo: [
            { img: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?q=80&w=500&h=560&auto=format&fit=crop", width: 500, height: 560, alt: "Brand Guideline Identity" },
            { img: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=500&h=380&auto=format&fit=crop", width: 500, height: 380, alt: "Vector Logo Mark" },
            { img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500&h=650&auto=format&fit=crop", width: 500, height: 650, alt: "Typography System" },
            { img: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=500&h=520&auto=format&fit=crop", width: 500, height: 520, alt: "Color Palette System" },
            { img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=500&h=620&auto=format&fit=crop", width: 500, height: 620, alt: "Logo Asset Mockup" }
        ],

        // Multi-Channel EDM HTML + Social Posters
        marketing: [
            {
                type: "html",
                file: "Archive/Robotics%20-%20EDM%20DSPH.html",
                title: "Robotics - EDM DSPH"
            },
            {
                type: "html",
                file: "Archive/ServerLIFT%20-%20EDM%20DSPH.html",
                title: "ServerLIFT - EDM DSPH"
            },
            { img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500&h=650&auto=format&fit=crop", width: 500, height: 650, alt: "LinkedIn Promotional Poster" },
            { img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=500&h=500&auto=format&fit=crop", width: 500, height: 500, alt: "Facebook Campaign Graphic" },
            { img: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=500&h=420&auto=format&fit=crop", width: 500, height: 420, alt: "Digital Marketing Analytics Poster" }
        ],

        // 2024-2025 Archive PDF Document Entry
        archive: [
            { 
                type: "pdf", 
                file: "Archive/PORTFOLIO%20.pdf", 
                alt: "Paul Malana 2025 Portfolio Archive PDF" 
            }
        ]
    };

    function populateAndOpenModal(card) {
        const title = card.getAttribute('data-title') || 'Project Showcase';
        const tag = card.getAttribute('data-tag') || 'Gallery Asset';
        const desc = card.getAttribute('data-desc') || 'Detailed project preview.';
        
        let key = card.getAttribute('data-key') || card.getAttribute('data-category') || 'archive';

        if (lightboxTitle) lightboxTitle.textContent = title;
        if (lightboxTag) lightboxTag.textContent = tag;
        if (lightboxDesc) lightboxDesc.textContent = desc;

        const categoryItems = categoryAssetDatabase[key] || categoryAssetDatabase.archive || [];

        if (modalMasonryGrid) {
            modalMasonryGrid.innerHTML = '';

            // 1. PDF Mode Handling
            if (categoryItems.length === 1 && categoryItems[0].type === "pdf") {
                const pdfItem = categoryItems[0];
                modalMasonryGrid.className = "w-full h-[70vh] flex flex-col items-center justify-center";
                modalMasonryGrid.innerHTML = `
                    <iframe src="${pdfItem.file}#toolbar=1&navpanes=0&scrollbar=1" 
                            class="w-full h-full rounded-xl border border-white/10 shadow-2xl" 
                            title="${pdfItem.alt || 'PDF Document'}">
                    </iframe>
                `;
            } 
            // 2. Hybrid Mode: HTML EDMs on Left Column + Social Posters on Right Column
            else if (categoryItems.some(item => item && item.type === "html")) {
                modalMasonryGrid.className = "w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-start";

                const htmlItems = categoryItems.filter(item => item && item.type === "html");
                const imageItems = categoryItems.filter(item => item && item.img);

                // Left Column: Stacked Compact Interactive HTML Frames
                const leftCol = document.createElement('div');
                leftCol.className = "flex flex-col gap-3.5 w-full";

                htmlItems.forEach(htmlItem => {
                    const itemTitle = htmlItem.title || 'Interactive Newsletter';
                    const itemFile = htmlItem.file || '#';

                    const edmWrapper = document.createElement('div');
                    edmWrapper.className = "w-full rounded-xl overflow-hidden border border-white/10 bg-slate-900 shadow-lg";
                    edmWrapper.innerHTML = `
                        <div class="px-3.5 py-1.5 bg-slate-800 text-[0.75rem] font-semibold text-sky-400 flex justify-between items-center border-b border-white/10">
                            <span><i class="fa-solid fa-code"></i> ${itemTitle}</span>
                            <a href="${itemFile}" target="_blank" class="hover:underline text-white/80">Open Tab <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                        </div>
                        <iframe src="${itemFile}" class="w-full h-[380px] border-none bg-white" title="${itemTitle}"></iframe>
                    `;
                    leftCol.appendChild(edmWrapper);
                });

                // Right Column: Social Posters Masonry Grid
                const rightCol = document.createElement('div');
                rightCol.className = "columns-2 gap-3 w-full";

                imageItems.forEach((item) => {
                    const figure = document.createElement('figure');
                    figure.className = "group break-inside-avoid m-0 mb-3 rounded-xl overflow-hidden bg-tgl07-well shadow-md cursor-pointer";

                    figure.innerHTML = `
                        <img src="${item.img}" 
                             alt="${item.alt || 'Campaign Poster'}" 
                             loading="lazy" 
                             decoding="async" 
                             width="${item.width || 500}" 
                             height="${item.height || 400}" 
                             class="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.06]">
                    `;

                    figure.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openImageLightbox(item.img, item.alt);
                    });

                    rightCol.appendChild(figure);
                });

                modalMasonryGrid.appendChild(leftCol);
                modalMasonryGrid.appendChild(rightCol);
            } 
            // 3. Standard Column Masonry Grid Mode for pure image categories
            else {
                modalMasonryGrid.className = "w-[min(920px,100%)] columns-4 gap-3.5 max-[820px]:columns-3 max-[560px]:columns-2";

                categoryItems.forEach((item) => {
                    const figure = document.createElement('figure');
                    figure.className = "group break-inside-avoid m-0 mb-3.5 rounded-xl overflow-hidden bg-tgl07-well shadow-[0_8px_22px_-16px_oklch(0.3_0.04_265/0.6)] transition-shadow duration-300 hover:shadow-[0_16px_34px_-18px_oklch(0.3_0.04_265/0.55)] cursor-pointer";

                    figure.innerHTML = `
                        <img src="${item.img}" 
                             alt="${item.alt || 'Gallery Image'}" 
                             loading="lazy" 
                             decoding="async" 
                             width="${item.width || 500}" 
                             height="${item.height || 400}" 
                             class="block w-full h-auto transition-transform duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.06]">
                    `;

                    figure.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openImageLightbox(item.img, item.alt);
                    });

                    modalMasonryGrid.appendChild(figure);
                });
            }
        }

        if (lightboxModal) {
            lightboxModal.classList.add('active');
            lightboxModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightboxModal) {
            lightboxModal.classList.remove('active');
            lightboxModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    galleryCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.preventDefault();
            populateAndOpenModal(card);
        });
    });

    lightboxClose?.addEventListener('click', closeLightbox);
    lightboxOverlay?.addEventListener('click', closeLightbox);

    // ----------------------------------------------------
    // 5. FULL-SCREEN IMAGE FOCUS VIEW
    // ----------------------------------------------------
    function openImageLightbox(imgSrc, altText) {
        let imageFocusModal = document.getElementById('imageFocusModal');
        
        if (!imageFocusModal) {
            imageFocusModal = document.createElement('div');
            imageFocusModal.id = 'imageFocusModal';
            imageFocusModal.className = 'fixed inset-0 z-[2000] flex items-center justify-center bg-black/90 backdrop-blur-md opacity-0 pointer-events-none transition-opacity duration-300';
            imageFocusModal.innerHTML = `
                <button id="imageFocusClose" class="absolute top-5 right-5 z-2010 w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white text-xl flex items-center justify-center cursor-pointer hover:bg-sky-500 hover:border-sky-500 transition-all duration-300">
                    <i class="fa-solid fa-xmark"></i>
                </button>
                <div class="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center p-2">
                    <img id="imageFocusImg" src="" alt="" class="max-w-full max-h-[88vh] object-contain rounded-lg shadow-2xl">
                </div>
            `;
            document.body.appendChild(imageFocusModal);

            const closeBtn = imageFocusModal.querySelector('#imageFocusClose');
            closeBtn.addEventListener('click', closeImageLightbox);
            imageFocusModal.addEventListener('click', (e) => {
                if (e.target === imageFocusModal) closeImageLightbox();
            });
        }

        const focusImg = imageFocusModal.querySelector('#imageFocusImg');
        if (focusImg) {
            focusImg.src = imgSrc;
            focusImg.alt = altText || 'Expanded View';
        }

        imageFocusModal.classList.remove('opacity-0', 'pointer-events-none');
        imageFocusModal.classList.add('opacity-100', 'pointer-events-auto');
    }

    function closeImageLightbox() {
        const imageFocusModal = document.getElementById('imageFocusModal');
        if (imageFocusModal) {
            imageFocusModal.classList.remove('opacity-100', 'pointer-events-auto');
            imageFocusModal.classList.add('opacity-0', 'pointer-events-none');
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const imageFocusModal = document.getElementById('imageFocusModal');
            if (imageFocusModal && imageFocusModal.classList.contains('opacity-100')) {
                closeImageLightbox();
            } else if (lightboxModal?.classList.contains('active')) {
                closeLightbox();
            }
        }
    });

});