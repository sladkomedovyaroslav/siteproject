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
    
    // Анимация открытия попапа с RequestAnimationFrame
    function openPopup() {
        popupOverlay.style.display = 'flex';
        popupOverlay.style.opacity = '0';
        
        let opacity = 0;
        
        function animate() {
            opacity += 0.05;
            popupOverlay.style.opacity = opacity;
            
            if(opacity < 1) {
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
            
            if(opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                popupOverlay.style.display = 'none';
            }
        }
        
        requestAnimationFrame(animate);
    }
    
    // Отправка формы бронирования
    if(reservationForm) {
        reservationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if(!validateForm(this)) {
                showMessage('Пожалуйста, заполните все обязательные поля правильно', 'error');
                return;
            }
            
            const formData = new FormData(this);
            const submitBtn = this.querySelector('.btn-submit');
            const originalText = submitBtn.textContent;
            
            // Блокировка кнопки и отображение загрузки
            submitBtn.disabled = true;
            submitBtn.textContent = 'Отправка...';
            submitBtn.style.opacity = '0.7';
            
            try {
                // Здесь нужно указать ваш URL для отправки формы
                const response = await fetch('https://formspree.io/f/mvgnvgae', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                if(response.ok) {
                    showMessage('Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.', 'success');
                    this.reset();
                    localStorage.removeItem('reservation_form');
                } else {
                    throw new Error('Ошибка при отправке формы');
                }
            } catch(error) {
                console.error('Ошибка:', error);
                showMessage('Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.', 'error');
            } finally {
                // Разблокировка кнопки
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.style.opacity = '1';
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
                const response = await fetch('https://formspree.io/f/mvgnvgae', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(Object.fromEntries(formData))
                });
                
                if(response.ok) {
                    alert('Сообщение отправлено! Мы ответим вам в ближайшее время.');
                    this.reset();
                    closePopup();
                } else {
                    throw new Error('Ошибка при отправке');
                }
            } catch(error) {
                alert('Ошибка при отправке сообщения. Пожалуйста, попробуйте еще раз.');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
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
    
    // Валидация телефона
    const phoneInput = document.getElementById('phone');
    if(phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if(value.length > 0) {
                value = '+7 (' + value;
                if(value.length > 7) {
                    value = value.slice(0, 7) + ') ' + value.slice(7);
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
