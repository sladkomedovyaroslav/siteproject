// Инициализация слайдера
$(document).ready(function(){
    $('.slider').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });
});

// Меню ресторана
const menuData = {
    starters: [
        { name: "Брускетта с томатами", price: "450 ₽", desc: "Свежие томаты, базилик, оливковое масло" },
        { name: "Карпаччо из говядины", price: "690 ₽", desc: "Тонко нарезанная говядина с пармезаном" },
        { name: "Тартар из тунца", price: "780 ₽", desc: "С авокадо и кунжутным соусом" }
    ],
    main: [
        { name: "Стейк Рибай", price: "1850 ₽", desc: "350г, с овощами гриль" },
        { name: "Лосось на гриле", price: "1250 ₽", desc: "С лимонным соусом и рисом" },
        { name: "Паста Карбонара", price: "890 ₽", desc: "По традиционному рецепту" }
    ],
    desserts: [
        { name: "Тирамису", price: "550 ₽", desc: "Классический итальянский десерт" },
        { name: "Чизкейк Нью-Йорк", price: "480 ₽", desc: "С ягодным соусом" },
        { name: "Шоколадный фондан", price: "520 ₽", desc: "С ванильным мороженым" }
    ],
    drinks: [
        { name: "Мохито", price: "450 ₽", desc: "Классический освежающий коктейль" },
        { name: "Негрони", price: "580 ₽", desc: "Классика итальянского аперитива" },
        { name: "Домашний лимонад", price: "320 ₽", desc: "С мятой и имбирем" }
    ]
};

// Функция отображения меню
function displayMenu(category) {
    const menuItemsContainer = document.getElementById('menu-items');
    const items = menuData[category];
    
    let html = '';
    items.forEach(item => {
        html += `
            <div class="menu-item fade-in">
                <h3>${item.name}</h3>
                <p class="price">${item.price}</p>
                <p class="description">${item.desc}</p>
            </div>
        `;
    });
    
    menuItemsContainer.innerHTML = html;
    
    // Обновляем активную кнопку категории
    document.querySelectorAll('.menu-category').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`).classList.add('active');
}

// Инициализация меню при загрузке
document.addEventListener('DOMContentLoaded', function() {
    displayMenu('starters');
    
    // Обработчики для кнопок категорий
    document.querySelectorAll('.menu-category').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            displayMenu(category);
        });
    });
    
    // Плавная прокрутка для якорей
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if(this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Валидация формы
function validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    
    inputs.forEach(input => {
        if(!input.value.trim()) {
            isValid = false;
            input.classList.add('error');
        } else {
            input.classList.remove('error');
        }
    });
    
    // Валидация email
    const email = form.querySelector('input[type="email"]');
    if(email && email.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email.value)) {
            isValid = false;
            email.classList.add('error');
        }
    }
    
    return isValid;
}

// Сохранение в LocalStorage
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch(e) {
        console.error('Ошибка сохранения в LocalStorage:', e);
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch(e) {
        console.error('Ошибка чтения из LocalStorage:', e);
        return null;
    }
}

// Загрузка сохраненных данных формы при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const savedData = loadFromLocalStorage('reservation_form');
    if(savedData) {
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if(input) {
                input.value = savedData[key];
            }
        });
    }
    
    // Сохранение данных формы при вводе
    const form = document.getElementById('reservation-form');
    if(form) {
        form.addEventListener('input', function(e) {
            const formData = {};
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                if(input.name) {
                    formData[input.name] = input.value;
                }
            });
            saveToLocalStorage('reservation_form', formData);
        });
    }
});
