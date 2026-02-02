// Кастомный слайдер для специальных предложений
class SpecialsSlider {
    constructor() {
        this.slider = document.querySelector('.specials-slider');
        this.slides = document.querySelectorAll('.special-slide');
        this.wrapper = document.querySelector('.slider-wrapper');
        this.indicators = document.querySelectorAll('.indicator');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        
        if (!this.slider || !this.slides.length) return;
        
        this.currentSlide = 0;
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        this.autoSlideInterval = null;
        this.autoSlideDelay = 5000;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.swipeThreshold = 50;
        
        this.init();
    }
    
    init() {
        this.setupSlider();
        this.setupEventListeners();
        this.updateSlider();
        this.startAutoSlide();
        
        window.addEventListener('resize', () => {
            this.updateSlider();
        });
    }
    
    setupSlider() {
        // Устанавливаем ширину слайдера
        this.sliderWidth = this.slider.offsetWidth;
        this.wrapper.style.width = `${this.totalSlides * 100}%`;
        
        // Устанавливаем ширину каждого слайда
        this.slides.forEach(slide => {
            slide.style.width = `${100 / this.totalSlides}%`;
        });
        
        // Показываем первый слайд
        this.showSlide(0);
    }
    
    setupEventListeners() {
        // Кнопки навигации
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
        
        // Индикаторы
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Свайпы на мобильных
        this.slider.addEventListener('touchstart', (e) => {
            this.touchStartX = e.changedTouches[0].screenX;
            this.stopAutoSlide();
        });
        
        this.slider.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
            this.startAutoSlide();
        });
        
        // Клавиатура
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                this.nextSlide();
            }
        });
        
        // Пауза автопрокрутки при наведении
        this.slider.addEventListener('mouseenter', () => this.stopAutoSlide());
        this.slider.addEventListener('mouseleave', () => this.startAutoSlide());
        
        // Кнопки заказа
        document.querySelectorAll('.slide-order-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const slideTitle = btn.closest('.slide-info').querySelector('.slide-title').textContent;
                this.openContactForm(slideTitle);
            });
        });
    }
    
    updateSlider() {
        this.sliderWidth = this.slider.offsetWidth;
        this.wrapper.style.width = `${this.totalSlides * 100}%`;
        this.slides.forEach(slide => {
            slide.style.width = `${100 / this.totalSlides}%`;
        });
        this.goToSlide(this.currentSlide, false);
    }
    
    showSlide(index, animate = true) {
        if (this.isAnimating || index < 0 || index >= this.totalSlides) return;
        
        this.isAnimating = true;
        
        // Обновляем индикаторы
        this.indicators.forEach(indicator => indicator.classList.remove('active'));
        if (this.indicators[index]) {
            this.indicators[index].classList.add('active');
        }
        
        // Анимируем переход
        const translateX = -index * 100;
        if (animate) {
            this.wrapper.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        } else {
            this.wrapper.style.transition = 'none';
        }
        this.wrapper.style.transform = `translateX(${translateX}%)`;
        
        this.currentSlide = index;
        
        // Сбрасываем флаг анимации после завершения
        if (animate) {
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        } else {
            this.isAnimating = false;
        }
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index, animate = true) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.showSlide(index, animate);
    }
    
    handleSwipe() {
        const swipeDistance = this.touchStartX - this.touchEndX;
        
        if (Math.abs(swipeDistance) < this.swipeThreshold) return;
        
        if (swipeDistance > 0) {
            this.nextSlide();
        } else {
            this.prevSlide();
        }
    }
    
    startAutoSlide() {
        this.stopAutoSlide();
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoSlideDelay);
    }
    
    stopAutoSlide() {
        if (this.autoSlideInterval) {
            clearInterval(this.autoSlideInterval);
            this.autoSlideInterval = null;
        }
    }
    
    openContactForm(dishName) {
        const popupOverlay = document.getElementById('popup-overlay');
        const popup = popupOverlay.querySelector('.popup');
        const messageField = document.getElementById('popup-message');
        
        if (popupOverlay && messageField) {
            // Заполняем сообщение
            messageField.value = `Интересует блюдо: ${dishName}. Прошу связаться для уточнения деталей.`;
            
            // Открываем попап с анимацией
            popupOverlay.style.display = 'flex';
            popupOverlay.style.opacity = '0';
            
            let opacity = 0;
            
            function animate() {
                opacity += 0.05;
                popupOverlay.style.opacity = opacity;
                
                if (opacity < 1) {
                    requestAnimationFrame(animate);
                }
            }
            
            requestAnimationFrame(animate);
        } else {
            alert(`Вы выбрали: ${dishName}\nНаш менеджер свяжется с вами для подтверждения заказа.`);
        }
    }
}

// Инициализация слайдера при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация слайдера специальных предложений
    if (document.querySelector('.specials-slider')) {
        new SpecialsSlider();
    }
    
    // Обработчик для кнопки "Назад" в мобильном меню
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function() {
            const mobileMenu = document.querySelector('.mobile-menu');
            const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
            }
            if (mobileMenuBtn) {
                mobileMenuBtn.classList.remove('active');
            }
            document.body.classList.remove('no-scroll');
        });
    }
});
