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
    // IMAGE GENERATOR FOR GALLERY ASSETS
    // ----------------------------------------------------
    function generateFolderImageSet(folder, prefix, maxCount = 60) {
        const images = [];
        for (let i = 1; i <= maxCount; i++) {
            images.push({
                primary: `Images/${folder}/${prefix}${i}.png`,
                fallback: `Images/${folder}/${prefix}${i}.jpg`,
                alt: `${prefix} ${i}`
            });
        }
        return images;
    }

    // ----------------------------------------------------
    // 4. SUB-CATEGORY & ASSET DATABASE
    // ----------------------------------------------------
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxOverlay = document.getElementById('lightboxOverlay');
    const lightboxClose = document.getElementById('lightboxClose');
    const modalMasonryGrid = document.getElementById('modalMasonryGrid');
    const lightboxTitle = document.getElementById('lightboxTitle');
    const lightboxTag = document.getElementById('lightboxTag');
    const lightboxDesc = document.getElementById('lightboxDesc');

    const categoryAssetDatabase = {
        billboards: generateFolderImageSet("billboards", "billboard", 60),
        vehicle: generateFolderImageSet("vehicle", "vehicle", 60),
        logo: generateFolderImageSet("logo", "logo", 60),

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
            {
                type: "html",
                file: "Archive/IXOLIFT%20X510_EDM%20-%20DSSG%20v3.html",
                title: "IXOLIFT X510 - EDM DSSG"
            },
            {
                type: "html",
                file: "Archive/Untitled-1.html",
                title: "Marketing Campaign - EDM Preview"
            },
            ...generateFolderImageSet("marketing", "poster", 60)
        ],

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

            // 1. PDF Mode
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
            // 2. Hybrid Mode: HTML EDMs + Image Posters
            else if (categoryItems.some(item => item && item.type === "html")) {
                const htmlItems = categoryItems.filter(item => item && item.type === "html");
                const candidateImageItems = categoryItems.filter(item => item && item.primary);

                modalMasonryGrid.className = "w-full grid grid-cols-1 md:grid-cols-2 gap-4 items-start";

                // Left Column: HTML EDMs
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

                // Right Column: Social Posters Grid
                const rightCol = document.createElement('div');
                rightCol.className = "columns-2 gap-3 w-full";

                candidateImageItems.forEach((item) => {
                    const figure = document.createElement('figure');
                    figure.className = "group break-inside-avoid m-0 mb-3 rounded-xl overflow-hidden bg-slate-800/80 shadow-md cursor-pointer";

                    const imgEl = document.createElement('img');
                    imgEl.src = item.primary;
                    imgEl.alt = item.alt || 'Campaign Poster';
                    imgEl.loading = "lazy";
                    imgEl.className = "block w-full h-auto transition-transform duration-500 group-hover:scale-[1.06]";

                    // Fallback logic on load error
                    imgEl.onerror = function() {
                        if (this.src.endsWith('.png')) {
                            this.src = item.fallback;
                        } else {
                            figure.remove();
                        }
                    };

                    figure.appendChild(imgEl);
                    figure.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openImageLightbox(imgEl.src, item.alt);
                    });

                    rightCol.appendChild(figure);
                });

                modalMasonryGrid.appendChild(leftCol);
                modalMasonryGrid.appendChild(rightCol);
            } 
            // 3. Pure Image Gallery Mode
            else {
                const candidateImageItems = categoryItems.filter(item => item && item.primary);

                modalMasonryGrid.className = "w-[min(920px,100%)] columns-4 gap-3.5 max-[820px]:columns-3 max-[560px]:columns-2";

                candidateImageItems.forEach((item) => {
                    const figure = document.createElement('figure');
                    figure.className = "group break-inside-avoid m-0 mb-3.5 rounded-xl overflow-hidden bg-slate-800/80 shadow-lg cursor-pointer";

                    const imgEl = document.createElement('img');
                    imgEl.src = item.primary;
                    imgEl.alt = item.alt || 'Gallery Image';
                    imgEl.loading = "lazy";
                    imgEl.className = "block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.06]";

                    // Automatic fallback and silent removal of missing files
                    imgEl.onerror = function() {
                        if (this.src.endsWith('.png')) {
                            this.src = item.fallback;
                        } else {
                            figure.remove();
                        }
                    };

                    figure.appendChild(imgEl);
                    figure.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openImageLightbox(imgEl.src, item.alt);
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
                <button id="imageFocusClose" class="absolute top-5 right-5 z-[2010] w-10 h-10 rounded-full bg-black/60 border border-white/20 text-white text-xl flex items-center justify-center cursor-pointer hover:bg-sky-500 hover:border-sky-500 transition-all duration-300">
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