// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Hero Slideshow functionality
    const slideshow = {
        images: document.querySelectorAll('.hero-image'),
        currentIndex: 0,
        interval: null,

        init() {
            // Start automatic slideshow
            this.startSlideshow();

            // Pause on hover
            const heroSection = document.querySelector('.hero');
            heroSection.addEventListener('mouseenter', () => this.pauseSlideshow());
            heroSection.addEventListener('mouseleave', () => this.startSlideshow());
        },

        goToSlide(index) {
            // Remove active class from current
            this.images[this.currentIndex].classList.remove('active');

            // Update current index
            this.currentIndex = index;

            // Add active class to new current
            this.images[this.currentIndex].classList.add('active');
        },

        nextSlide() {
            const nextIndex = (this.currentIndex + 1) % this.images.length;
            this.goToSlide(nextIndex);
        },

        startSlideshow() {
            if (this.interval) clearInterval(this.interval);
            this.interval = setInterval(() => this.nextSlide(), 2000);
        },

        pauseSlideshow() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    };

    // Initialize slideshow
    slideshow.init();

    // Section-based scrolling
    const sections = document.querySelectorAll('.hero, .biography, .gallery, .contact');
    let isScrolling = false;
    let currentSection = 0;

    function scrollToSection(index) {
        if (index >= 0 && index < sections.length) {
            isScrolling = true;
            sections[index].scrollIntoView({ behavior: 'smooth' });
            currentSection = index;
            
            // Update header style based on section
            const header = document.querySelector('header');
            if (index === 0) {
                header.classList.remove('scrolled');
            } else {
                header.classList.add('scrolled');
            }

            // Reset scrolling flag after animation
            setTimeout(() => {
                isScrolling = false;
            }, 1000);
        }
    }

    // Handle wheel events for section navigation
    window.addEventListener('wheel', (e) => {
        if (!isScrolling) {
            if (e.deltaY > 0) {
                // Scroll down
                scrollToSection(currentSection + 1);
            } else {
                // Scroll up
                scrollToSection(currentSection - 1);
            }
        }
        e.preventDefault();
    }, { passive: false });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!isScrolling) {
            if (e.key === 'ArrowDown' || e.key === 'PageDown') {
                scrollToSection(currentSection + 1);
                e.preventDefault();
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                scrollToSection(currentSection - 1);
                e.preventDefault();
            }
        }
    });

    // Update current section on scroll end
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const viewportMiddle = window.innerHeight / 2;
            let closestSection = 0;
            let closestDistance = Infinity;

            sections.forEach((section, index) => {
                const rect = section.getBoundingClientRect();
                const distance = Math.abs(rect.top + rect.height / 2 - viewportMiddle);
                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestSection = index;
                }
            });

            currentSection = closestSection;
        }, 100);
    });

    // Handle navigation menu clicks
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetSection = document.querySelector(targetId);
            const targetIndex = Array.from(sections).indexOf(targetSection);
            if (targetIndex !== -1) {
                scrollToSection(targetIndex);
            }
        });
    });

    // Enhanced language detection
    function detectLanguage() {
        // Always default to Traditional Chinese
        const defaultLang = 'tw';
        
        // Check localStorage for user's previous preference
        const savedLang = localStorage.getItem('preferredLanguage');
        if (savedLang && translations[savedLang]) {
            return savedLang;
        }

        // Get browser's language preferences
        const browserLangs = navigator.languages || [navigator.language || navigator.userLanguage];
        
        // Map of browser language codes to our supported languages
        const languageMap = {
            'zh-TW': 'tw',
            'zh-HK': 'tw', // Hong Kong uses Traditional Chinese
            'zh-MO': 'tw', // Macau uses Traditional Chinese
            'zh-CN': 'cn',
            'zh': 'tw',    // Generic Chinese defaults to Traditional
            'ja': 'jp',
            'ja-JP': 'jp',
            'en': 'en',
            'en-US': 'en',
            'en-GB': 'en'
        };

        // Try to find a matching language
        for (const browserLang of browserLangs) {
            const normalizedLang = browserLang.toLowerCase();
            
            // Check for exact match
            if (languageMap[browserLang]) {
                return languageMap[browserLang];
            }
            
            // Check for partial match (e.g., 'en' matches 'en-US')
            for (const [key, value] of Object.entries(languageMap)) {
                if (normalizedLang.startsWith(key.toLowerCase())) {
                    return value;
                }
            }
        }

        // Return Traditional Chinese as default
        return defaultLang;
    }
    
    // Set initial language to Traditional Chinese
    const initialLang = detectLanguage();
    setLanguage(initialLang);

    // Update language switcher buttons to show TW as default
    document.querySelectorAll('.language-switch').forEach(switcher => {
        if (!localStorage.getItem('preferredLanguage')) {
            switcher.textContent = 'TW ▾';
        }
    });
    
    // Language switcher functionality
    const languageSwitchers = document.querySelectorAll('.language-switch');
    const languageDropdowns = document.querySelectorAll('.language-dropdown');
    
    languageSwitchers.forEach(switcher => {
        switcher.addEventListener('click', function() {
            this.nextElementSibling.classList.toggle('show');
        });
    });
    
    // Language selection
    const languageButtons = document.querySelectorAll('.language-dropdown button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            languageDropdowns.forEach(dropdown => dropdown.classList.remove('show'));
        });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.language-switch')) {
            languageDropdowns.forEach(dropdown => dropdown.classList.remove('show'));
        }
    });
    
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    function toggleMobileMenu(show) {
        hamburger.classList.toggle('active', show);
        mobileMenu.classList.toggle('active', show);
        body.style.overflow = show ? 'hidden' : '';
        
        // Ensure menu is displayed before starting animations
        if (show) {
            mobileMenu.style.display = 'block';
            // Force reflow
            mobileMenu.offsetHeight;
        }
    }

    hamburger.addEventListener('click', function() {
        const willShow = !this.classList.contains('active');
        toggleMobileMenu(willShow);
    });

    // Close mobile menu when clicking a link
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMobileMenu(false);
        });
    });

    // Close mobile menu when clicking outside
    mobileMenu.addEventListener('click', function(e) {
        if (e.target === this) {
            toggleMobileMenu(false);
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMobileMenu(false);
        }
    });

    // Handle mobile menu language selection
    const mobileLangButtons = document.querySelectorAll('.mobile-nav-links .language-dropdown button');
    mobileLangButtons.forEach(button => {
        button.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLanguage(lang);
            toggleMobileMenu(false);
        });
    });

    // Carousel functionality
    const carousel = {
        container: document.querySelector('.carousel-container'),
        track: document.querySelector('.carousel-track'),
        slides: document.querySelectorAll('.carousel-slide'),
        prevButton: document.querySelector('.carousel-button.prev'),
        nextButton: document.querySelector('.carousel-button.next'),
        indicators: document.querySelectorAll('.carousel-indicator'),
        currentIndex: 0,
        slidesToShow: 3,
        
        init() {
            // Update slidesToShow based on screen width
            this.updateSlidesToShow();
            
            // Clone slides for infinite scroll effect
            const slidesToClone = 2;
            for (let i = 0; i < slidesToClone; i++) {
                this.slides.forEach(slide => {
                    const clone = slide.cloneNode(true);
                    this.track.appendChild(clone);
                });
            }
            
            // Add event listeners
            this.prevButton.addEventListener('click', () => this.move('prev'));
            this.nextButton.addEventListener('click', () => this.move('next'));
            
            // Add indicator click events
            this.indicators.forEach((indicator, index) => {
                indicator.addEventListener('click', () => this.goToSlide(index));
            });

            // Add swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            
            this.container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            });
            
            this.container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    this.move('next');
                } else if (touchEndX - touchStartX > 50) {
                    this.move('prev');
                }
            });

            // Add resize listener
            window.addEventListener('resize', () => {
                this.updateSlidesToShow();
                this.updateSlidePosition();
            });

            // Initial position
            this.updateSlidePosition();
        },

        updateSlidesToShow() {
            if (window.innerWidth <= 768) {
                this.slidesToShow = 1;
            } else if (window.innerWidth <= 1200) {
                this.slidesToShow = 2;
            } else {
                this.slidesToShow = 3;
            }
        },
        
        move(direction) {
            // Update indicators
            this.indicators[this.currentIndex].classList.remove('active');
            
            if (direction === 'next') {
                this.currentIndex = (this.currentIndex + this.slidesToShow) % this.slides.length;
            } else {
                this.currentIndex = (this.currentIndex - this.slidesToShow + this.slides.length) % this.slides.length;
            }
            
            this.indicators[this.currentIndex].classList.add('active');
            this.updateSlidePosition();
        },
        
        updateSlidePosition() {
            const slideWidth = this.slides[0].offsetWidth;
            const gap = 20; // Match the CSS gap value
            const offset = -(this.currentIndex * (slideWidth + gap));
            this.track.style.transform = `translateX(${offset}px)`;
        },
        
        goToSlide(index) {
            if (index === this.currentIndex) return;
            
            this.indicators[this.currentIndex].classList.remove('active');
            this.currentIndex = index;
            this.indicators[this.currentIndex].classList.add('active');
            this.updateSlidePosition();
        }
    };
    
    // Initialize carousel
    carousel.init();

    // Artwork data
    const artworkData = {
        artwork1: {
            title: {
                en: "Mountain Landscape in Ink",
                tw: "水墨山水",
                cn: "水墨山水",
                jp: "水墨山水"
            },
            year: "2023",
            dimensions: "120 x 180 cm",
            medium: "Ink and color on paper",
            description: {
                en: "A contemplative landscape depicting the misty mountains of Taiwan's central range.",
                tw: "以水墨描繪台灣中央山脈的靈秀之氣。",
                cn: "以水墨描绘台湾中央山脉的灵秀之气。",
                jp: "台湾中央山脈の霊気を水墨で表現。"
            }
        },
        artwork2: {
            title: {
                en: "Traditional Architecture",
                tw: "傳統建築",
                cn: "传统建筑",
                jp: "伝統建築"
            },
            year: "2022",
            dimensions: "90 x 150 cm",
            medium: "Ink and color on paper",
            description: {
                en: "A detailed study of traditional Taiwanese temple architecture.",
                tw: "台灣傳統寺廟建築的細緻描繪。",
                cn: "台湾传统寺庙建筑的细致描绘。",
                jp: "台湾の伝統的な寺院建築の細密な描写。"
            }
        },
        artwork3: {
            title: {
                en: "Misty Mountains",
                tw: "雲霧山巒",
                cn: "云雾山峦",
                jp: "霧の山々"
            },
            year: "2023",
            dimensions: "100 x 160 cm",
            medium: "Ink and color on paper",
            description: {
                en: "Capturing the ethereal beauty of mountain peaks shrouded in mist.",
                tw: "捕捉雲霧繚繞山峰的空靈之美。",
                cn: "捕捉云雾缭绕山峰的空灵之美。",
                jp: "霧に包まれた山々の幽玄な美しさを表現。"
            }
        },
        artwork4: {
            title: {
                en: "Landscape Study",
                tw: "山水寫生",
                cn: "山水写生",
                jp: "風景写生"
            },
            year: "2022",
            dimensions: "80 x 120 cm",
            medium: "Ink and color on paper",
            description: {
                en: "A plein air study capturing the essence of Taiwan's natural landscape.",
                tw: "戶外寫生，捕捉台灣自然景觀的精髓。",
                cn: "户外写生，捕捉台湾自然景观的精髓。",
                jp: "屋外写生で台湾の自然景観の本質を捉える。"
            }
        }
    };

    // Artwork Modal functionality
    const modal = {
        init() {
            this.modal = document.getElementById('artwork-modal');
            if (!this.modal) {
                // Create modal if it doesn't exist
                this.createModal();
            }
            
            this.setupEventListeners();
            this.setupArtworkClicks();
        },

        createModal() {
            const modalHTML = `
                <div id="artwork-modal" class="artwork-modal">
                    <div class="modal-content">
                        <button class="modal-close" aria-label="Close modal"></button>
                        <div class="modal-body">
                            <div class="artwork-image">
                                <img id="modal-image" src="" alt="">
                            </div>
                            <div class="artwork-details">
                                <h3 id="modal-title"></h3>
                                <div class="artwork-metadata">
                                    <p id="modal-year"></p>
                                    <p id="modal-dimensions"></p>
                                    <p id="modal-medium"></p>
                                </div>
                                <div class="artwork-description">
                                    <p id="modal-description"></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            this.modal = document.getElementById('artwork-modal');
        },

        setupEventListeners() {
            // Close button
            const closeButton = this.modal.querySelector('.modal-close');
            closeButton.addEventListener('click', () => this.hide());

            // Click outside to close
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hide();
                }
            });

            // Escape key to close
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.hide();
                }
            });
        },

        setupArtworkClicks() {
            document.querySelectorAll('.carousel-slide').forEach(slide => {
                slide.addEventListener('click', () => {
                    const artworkId = slide.getAttribute('data-artwork-id');
                    if (artworkId && artworkData[artworkId]) {
                        this.show(artworkId);
                    }
                });
            });
        },

        show(artworkId) {
            const artwork = artworkData[artworkId];
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            
            const modalImage = this.modal.querySelector('#modal-image');
            const modalTitle = this.modal.querySelector('#modal-title');
            const modalYear = this.modal.querySelector('#modal-year');
            const modalDimensions = this.modal.querySelector('#modal-dimensions');
            const modalMedium = this.modal.querySelector('#modal-medium');
            const modalDescription = this.modal.querySelector('#modal-description');

            modalImage.src = `images/${artworkId}.jpg`;
            modalImage.alt = artwork.title[lang];
            modalTitle.textContent = artwork.title[lang];
            modalYear.textContent = artwork.year;
            modalDimensions.textContent = artwork.dimensions;
            modalMedium.textContent = artwork.medium;
            modalDescription.textContent = artwork.description[lang];
            
            this.modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        hide() {
            this.modal.classList.remove('active');
            document.body.style.overflow = '';
        },

        updateLanguage(lang) {
            if (!this.modal.classList.contains('active')) return;
            
            const modalImage = this.modal.querySelector('#modal-image');
            const artworkId = modalImage.src.split('/').pop().split('.')[0];
            
            if (artworkId && artworkData[artworkId]) {
                const artwork = artworkData[artworkId];
                this.modal.querySelector('#modal-title').textContent = artwork.title[lang];
                this.modal.querySelector('#modal-description').textContent = artwork.description[lang];
            }
        }
    };

    // Initialize modal
    modal.init();

    // Update modal language when language changes
    const originalSetLanguage = window.setLanguage;
    window.setLanguage = function(lang) {
        originalSetLanguage(lang);
        modal.updateLanguage(lang);
    };
});

// Function to set language
function setLanguage(lang) {
    // Default to Traditional Chinese if the requested language is not available
    if (!translations[lang]) {
        lang = 'tw';
    }
    
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) element.textContent = translation;
    });
    
    document.querySelectorAll('[data-i18n-alt]').forEach(element => {
        const key = element.getAttribute('data-i18n-alt');
        const translation = getNestedTranslation(translations[lang], key);
        if (translation) element.alt = translation;
    });
    
    // Update language switcher text
    document.querySelectorAll('.language-switch').forEach(switcher => {
        switcher.textContent = lang.toUpperCase() + ' ▾';
    });
    
    // Save language preference only if it's different from the default
    if (lang !== 'tw') {
        localStorage.setItem('preferredLanguage', lang);
    } else {
        localStorage.removeItem('preferredLanguage');
    }
}

// Helper function to get nested translations
function getNestedTranslation(obj, path) {
    return path.split('.').reduce((p, c) => p && p[c], obj);
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-fade, .animate-content').forEach(element => {
    observer.observe(element);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        document.querySelector(targetId).scrollIntoView({
            behavior: 'smooth'
        });
    });
}); 