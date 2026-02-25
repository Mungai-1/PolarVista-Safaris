// Gallery Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        galleryItems.forEach(item => {
            const categories = item.getAttribute('data-category');
            
            if (filter === 'all' || categories.includes(filter)) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 10);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Image Upload Functionality
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const galleryGrid = document.getElementById('galleryGrid');

if (uploadArea && fileInput) {
    // Click to upload
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f0e6d6';
        uploadArea.style.borderColor = '#6b8e23';
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '#f9f6f1';
        uploadArea.style.borderColor = '#6b4423';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f9f6f1';
        uploadArea.style.borderColor = '#6b4423';
        
        const files = e.dataTransfer.files;
        handleFiles(files);
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        const files = e.target.files;
        handleFiles(files);
    });
}

// Handle uploaded files
function handleFiles(files) {
    Array.from(files).forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                addImageToGallery(e.target.result, file.name);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Show success message
    showUploadSuccess(files.length);
}

// Add image to gallery
function addImageToGallery(imageSrc, imageName) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.setAttribute('data-category', 'wildlife'); // Default category
    
    galleryItem.innerHTML = `
        <img src="${imageSrc}" alt="${imageName}">
        <div class="gallery-item-overlay">
            <div class="gallery-item-title">${imageName}</div>
            <div class="gallery-item-desc">Uploaded by you</div>
        </div>
    `;
    
    // Add to gallery
    galleryGrid.insertBefore(galleryItem, galleryGrid.firstChild);
    
    // Add click event for lightbox
    galleryItem.addEventListener('click', () => {
        openLightbox(imageSrc);
    });
    
    // Animate in
    galleryItem.style.opacity = '0';
    galleryItem.style.transform = 'scale(0.8)';
    setTimeout(() => {
        galleryItem.style.transition = 'all 0.3s ease';
        galleryItem.style.opacity = '1';
        galleryItem.style.transform = 'scale(1)';
    }, 10);
}

// Show upload success message
function showUploadSuccess(count) {
    const message = document.createElement('div');
    message.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #d4edda;
        color: #155724;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    message.textContent = `Successfully uploaded ${count} image${count > 1 ? 's' : ''}!`;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 3000);
}

// Lightbox Functionality
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');

let currentImageIndex = 0;
let visibleImages = [];

// Open lightbox
function openLightbox(imageSrc) {
    // Get all visible images
    visibleImages = Array.from(galleryItems)
        .filter(item => item.style.display !== 'none')
        .map(item => item.querySelector('img').src);
    
    currentImageIndex = visibleImages.indexOf(imageSrc);
    
    lightboxImg.src = imageSrc;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate lightbox
function navigateLightbox(direction) {
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = visibleImages.length - 1;
    } else if (currentImageIndex >= visibleImages.length) {
        currentImageIndex = 0;
    }
    
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        lightboxImg.src = visibleImages[currentImageIndex];
        lightboxImg.style.opacity = '1';
    }, 150);
}

// Event listeners for lightbox
if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
}

if (lightboxPrev) {
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
}

if (lightboxNext) {
    lightboxNext.addEventListener('click', () => navigateLightbox(1));
}

// Close lightbox on background click
if (lightbox) {
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            navigateLightbox(-1);
        } else if (e.key === 'ArrowRight') {
            navigateLightbox(1);
        }
    }
});

// Add click events to existing gallery items
galleryItems.forEach(item => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && img.src) {
            openLightbox(img.src);
        }
    });
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .gallery-item img {
        transition: opacity 0.15s ease;
    }
`;
document.head.appendChild(style);

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
    console.log('Gallery initialized with', galleryItems.length, 'images');
});
