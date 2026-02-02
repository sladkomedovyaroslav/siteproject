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
    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }
    
    if (popupOverlay) {
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
    }
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.style.display === 'flex') {
            closePopup();
        }
    });
    
    // Анимация открытия попапа с RequestAnimationFrame
    function openPopup() {
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
    }
    
    function closePopup() {
        let opacity = 1;
        
        function animate() {
            opacity -= 0.05;
            popupOverlay.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                popupOverlay.style.display = 'none';
                // Сбрасываем форму
                if (contactForm) {
                    contactForm.reset();
                }
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Отправка формы бронирования
    if (reservationForm) {
        // Устанавливаем минимальную дату как сегодня
        const dateInput = document.getElementById('date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
            
            // Устанавливаем значение по умолчанию (завтра)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            dateInput.value = tomorrow.toISOString().split('T')[0];
        }
        
        // Устанавливаем время по умолчанию
        const timeInput = document.getElementById('time');
        if (timeInput) {
            timeInput.value = '19:00';
        }
        
        reservationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) {
                showMessage('Пожалуйста, заполните все обязательные поля правильно', 'error');
                return;
            }
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Блокировка кнопки и отображение загрузки
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                // Здесь нужно указать ваш URL для отправки формы
                const response = await fetch('https://formspree.io/f/mvgnvgae', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                if (response.ok) {
                    showMessage('✅ Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    this.reset();
                    
                    // Сбрасываем дату и время к значениям по умолчанию
                    if (dateInput) {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        dateInput.value = tomorrow.toISOString().split('T')[0];
                    }
                    if (timeInput) {
                        timeInput.value = '19:00';
                    }
                    
                    localStorage.removeItem('reservation_form');
                    
                    // Прокрутка к сообщению об успехе
                    const messageDiv = document.getElementById('form-message');
                    if (messageDiv) {
                        messageDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    throw new Error('Ошибка при отправке формы');
                }
            } catch (error) {
                console.error('Ошибка:', error);
                showMessage('❌ Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.', 'error');
            } finally {
                // Разблокировка кнопки
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Отправка контактной формы
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (!validateForm(this)) {
                return;
            }
            
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Блокировка кнопки
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            const formData = new FormData(this);
            
            try {
                const response = await fetch('https://formspree.io/f/mvgnvgae', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                if (response.ok) {
                    alert('✅ Сообщение отправлено! Мы ответим вам в ближайшее время.');
                    this.reset();
                    closePopup();
                } else {
                    throw new Error('Ошибка при отправке');
                }
            } catch (error) {
                alert('❌ Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.classList.remove('loading');
                submitBtn.textContent = originalText;
            }
        });
    }
    
    // Показ сообщений
    function showMessage(text, type) {
        const messageDiv = document.getElementById('form-message');
        if (messageDiv) {
            messageDiv.textContent = text;
            messageDiv.className = `form-message ${type}`;
            messageDiv.style.display = 'block';
            
            // Автоматическое скрытие через 5 секунд
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 5000);
        }
    }
    
    // Валидация формы
    function validateForm(form) {
        let isValid = true;
        const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
        
        requiredInputs.forEach(input => {
            const errorSpan = input.nextElementSibling;
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('error');
                if (errorSpan && errorSpan.classList.contains('error-message')) {
                    errorSpan.textContent = 'Это поле обязательно для заполнения';
                    errorSpan.classList.add('show');
                }
            } else {
                input.classList.remove('error');
                if (errorSpan && errorSpan.classList.contains('error-message')) {
                    errorSpan.classList.remove('show');
                }
                
                // Валидация email
                if (input.type === 'email' && input.value) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value)) {
                        isValid = false;
                        input.classList.add('error');
                        if (errorSpan) {
                            errorSpan.textContent = 'Введите корректный email адрес';
                            errorSpan.classList.add('show');
                        }
                    }
                }
                
                // Валидация телефона
                if (input.type === 'tel' && input.value) {
                    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
                    if (!phoneRegex.test(input.value) || input.value.replace(/\D/g, '').length < 10) {
                        isValid = false;
                        input.classList.add('error');
                        if (errorSpan) {
                            errorSpan.textContent = 'Введите корректный номер телефона';
                            errorSpan.classList.add('show');
                        }
                    }
                }
            }
        });
        
        return isValid;
    }
    
    // Валидация телефона с маской
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length === 1 && value !== '7') {
                    value = '7' + value;
                }
                if (value.length > 1) {
                    value = '+7 (' + value.substring(1);
                    if (value.length > 7) {
                        value = value.substring(0, 7) + ') ' + value.substring(7);
                    }
                    if (value.length > 12) {
                        value = value.substring(0, 12) + '-' + value.substring(12);
                    }
                    if (value.length > 15) {
                        value = value.substring(0, 15) + '-' + value.substring(15);
                    }
                    if (value.length > 18) {
                        value = value.substring(0, 18);
                    }
                }
            }
            this.value = value;
        });
    }
});
