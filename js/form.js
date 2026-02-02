// Форма бронирования
document.addEventListener('DOMContentLoaded', function() {
    const reservationForm = document.getElementById('reservation-form');
    const contactForm = document.getElementById('contact-form');
    
    // Попап форма
    const contactButtons = document.querySelectorAll('.contact-btn');
    const popupOverlay = document.getElementById('popup-overlay');
    const popupClose = document.getElementById('popup-close');
    
    // Открытие попапа
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openPopup();
        });
    });
    
    // Закрытие попапа
    if(popupClose) {
        popupClose.addEventListener('click', closePopup);
    }
    
    if(popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if(e.target === this) {
                closePopup();
            }
        });
    }
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if(e.key === 'Escape' && popupOverlay.style.display === 'flex') {
            closePopup();
        }
    });
    
    // Анимация открытия попапа
    function openPopup() {
        popupOverlay.style.display = 'flex';
        setTimeout(() => {
            popupOverlay.style.opacity = '1';
        }, 10);
    }
    
    function closePopup() {
        popupOverlay.style.opacity = '0';
        setTimeout(() => {
            popupOverlay.style.display = 'none';
        }, 300);
    }
    
    // Отправка формы бронирования
    if(reservationForm) {
        // Устанавливаем минимальную дату
        const dateInput = document.getElementById('date');
        if(dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }
        
        reservationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if(!validateForm(this)) {
                showMessage('Пожалуйста, заполните все обязательные поля правильно', 'error');
                return;
            }
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Блокировка кнопки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            try {
                // Используем Formspree для отправки
                const response = await fetch('https://formspree.io/f/mbdkpyal', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                if(response.ok) {
                    showMessage('✅ Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    this.reset();
                    
                    // Сброс даты
                    if(dateInput) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        dateInput.value = tomorrow.toISOString().split('T')[0];
                    }
                } else {
                    throw new Error('Ошибка при отправке формы');
                }
            } catch(error) {
                console.error('Ошибка:', error);
                showMessage('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Отправка контактной формы
    if(contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if(!validateForm(this)) {
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Блокировка кнопки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('https://formspree.io/f/xvojpqzl', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: formData
                });
                
                if(response.ok) {
                    alert('✅ Сообщение отправлено! Мы ответим вам в ближайшее время.');
                    this.reset();
                    closePopup();
                } else {
                    throw new Error('Ошибка при отправке');
                }
            } catch(error) {
                alert('❌ Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Валидация формы
    function validateForm(form) {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            const errorSpan = input.nextElementSibling;
            
            if(!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                if(errorSpan) {
                    errorSpan.textContent = 'Это поле обязательно для заполнения';
                    errorSpan.style.display = 'block';
                }
            } else {
                input.classList.remove('error');
                if(errorSpan) {
                    errorSpan.style.display = 'none';
                }
                
                // Валидация email
                if(input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if(!emailRegex.test(input.value)) {
                        isValid = false;
                        input.classList.add('error');
                        if(errorSpan) {
                            errorSpan.textContent = 'Введите корректный email адрес';
                            errorSpan.style.display = 'block';
                        }
                    }
                }
                
                // Валидация телефона
                if(input.type === 'tel' && input.value) {
                    const phoneDigits = input.value.replace(/\D/g, '');
                    if(phoneDigits.length < 10) {
                        isValid = false;
                        input.classList.add('error');
                        if(errorSpan) {
                            errorSpan.textContent = 'Введите корректный номер телефона';
                            errorSpan.style.display = 'block';
                        }
                    }
                }
            }
        });
        
        return isValid;
    }
    
    // Показ сообщений
    function showMessage(text, type) {
        const messageDiv = document.getElementById('form-message');
        if(messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = `form-message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    // Валидация телефона с маской
    const phoneInput = document.getElementById('phone');
    if(phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if(value.length > 0) {
                value = '+7 ' + value;
                if(value.length > 7) {
                    value = value.slice(0, 7) + ' ' + value.slice(7);
                }
                if(value.length > 12) {
                    value = value.slice(0, 12) + '-' + value.slice(12);
                }
                if(value.length > 15) {
                    value = value.slice(0, 15) + '-' + value.slice(15);
                }
            }
            this.value = value;
        });
    }
});
