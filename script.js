window.addEventListener('load', function() {
    const loader = document.getElementById('loader');
    loader.style.opacity = '0';
    setTimeout(() => {
      loader.style.display = 'none';
    }, 600);
  });

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageViewerModal');
    const modalImg = document.getElementById('viewerImage');
    const closeBtn = document.querySelector('.close-viewer');
    const galleryImages = document.querySelectorAll('.gallery-item img');
  
    // Base Path
    const basePath = '/'; 

    // Helper: Image path se extension (.jpg, .png, etc.) hatane ke liye
    function getCleanSlug(src) {
        // e.g., "IMG-20251016-WA0000.jpg" -> "IMG-20251016-WA0000"
        return src.replace(/^\//, '').replace(/\.[^/.]+$/, '');
    }
  
    // Common Helper Function: Modal Open Karne ke Liye
    function openModal(imgSrc, shouldPushState = true) {
        modalImg.src = imgSrc;
        modal.style.display = 'flex';
  
        if (shouldPushState) {
            const slug = getCleanSlug(imgSrc);
            const cleanPath = '/' + slug; // e.g., /IMG-20251016-WA0000
            history.pushState({ modalOpen: true, src: imgSrc }, '', cleanPath);
        }
    }

    // Common Helper Function: Modal Close Karne ke Liye
    function closeModal() {
        modal.style.display = 'none';
        modalImg.src = '';
  
        // URL ko wapas home/base path par le aayein
        if (window.location.pathname !== basePath) {
            history.pushState(null, '', basePath);
        }
    }
  
    // 1. Har image par click event listener
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            const imgSrc = img.getAttribute('src');
            openModal(imgSrc, true);
        });
    });
  
    // 2. Close cross (x) button par click handler
    closeBtn.addEventListener('click', closeModal);
  
    // 3. Modal ke bahar dark area par click hone par close ho
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // 4. CHECK DIRECT URL (Bina extension wala URL match karega)
    function checkUrlForImage() {
        const currentPath = window.location.pathname;

        // URL se '/' hata kar clean slug banayein
        const currentSlug = decodeURIComponent(currentPath.replace(/^\//, ''));

        if (currentSlug && currentSlug !== '') {
            let foundMatch = false;

            galleryImages.forEach(img => {
                const imgSrc = img.getAttribute('src');
                const imgSlug = getCleanSlug(imgSrc);

                // Agar URL ka slug aur image slug match ho jaye
                if (imgSlug === currentSlug) {
                    openModal(imgSrc, false); // Direct URL match hone par modal kholo
                    foundMatch = true;
                }
            });

            if (!foundMatch) {
                closeModal();
            }
        } else {
            modal.style.display = 'none';
            modalImg.src = '';
        }
    }

    // Page Load hone par Direct URL check karein
    checkUrlForImage();

    // 5. Browser Back / Forward Button press karne par handle karein
    window.addEventListener('popstate', checkUrlForImage);
});
