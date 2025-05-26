// Language switching functionality
document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero');
    
    const handleScroll = () => {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        const scrollPosition = window.scrollY;
        
        if (scrollPosition > 0) {
            header.classList.add('scrolled');
            console.log('Header scrolled');
        } else {
            header.classList.remove('scrolled');
            console.log('Header at top');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Set initial state - if we're not at the top, add scrolled class
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    }
    
    // Get user's preferred language from localStorage or browser
    const savedLang = localStorage.getItem('preferredLanguage');
    const browserLang = navigator.language.split('-')[0];
    const defaultLang = savedLang || (translations[browserLang] ? browserLang : 'en');
    
    // Set initial language
    setLanguage(defaultLang);
    
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
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        mobileMenu.classList.toggle('active');
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

    // Modal functionality
    const modal = {
        element: document.getElementById('artwork-modal'),
        image: document.getElementById('modal-image'),
        title: document.getElementById('modal-title'),
        year: document.getElementById('modal-year'),
        dimensions: document.getElementById('modal-dimensions'),
        medium: document.getElementById('modal-medium'),
        description: document.getElementById('modal-description'),
        closeButton: document.querySelector('.modal-close'),
        currentLang: 'en',

        init() {
            // Add click event to all artwork slides
            document.querySelectorAll('.carousel-slide').forEach(slide => {
                slide.addEventListener('click', () => {
                    const artworkId = slide.getAttribute('data-artwork-id');
                    this.show(artworkId);
                });
            });

            // Close modal events
            this.closeButton.addEventListener('click', () => this.hide());
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) this.hide();
            });

            // Close on escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.hide();
            });
        },

        show(artworkId) {
            const artwork = artworkData[artworkId];
            const lang = localStorage.getItem('preferredLanguage') || 'en';
            
            this.image.src = `images/${artworkId}.jpg`;
            this.image.alt = artwork.title[lang];
            this.title.textContent = artwork.title[lang];
            this.year.textContent = artwork.year;
            this.dimensions.textContent = artwork.dimensions;
            this.medium.textContent = artwork.medium;
            this.description.textContent = artwork.description[lang];
            
            this.element.classList.add('active');
            document.body.style.overflow = 'hidden';
        },

        hide() {
            this.element.classList.remove('active');
            document.body.style.overflow = '';
        },

        updateLanguage(lang) {
            const activeArtwork = this.image.src.split('/').pop().split('.')[0];
            if (activeArtwork && artworkData[activeArtwork]) {
                const artwork = artworkData[activeArtwork];
                this.title.textContent = artwork.title[lang];
                this.description.textContent = artwork.description[lang];
            }
        }
    };

    // Initialize modal
    modal.init();

    // Update modal language when language changes
    const originalSetLanguage = setLanguage;
    setLanguage = function(lang) {
        originalSetLanguage(lang);
        modal.updateLanguage(lang);
    };
});

// Function to set language
function setLanguage(lang) {
    if (!translations[lang]) return;
    
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
    
    // Save language preference
    localStorage.setItem('preferredLanguage', lang);
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