// Меню ресторана
const menuData = {
    starters: [
        { name: "Брускетта с томатами", price: "450 ₽", desc: "Свежие томаты, базилик, оливковое масло на поджаренном хлебе" },
        { name: "Карпаччо из говядины", price: "690 ₽", desc: "Тонко нарезанная говядина с пармезаном и рукколой" },
        { name: "Тартар из тунца", price: "780 ₽", desc: "С авокадо, кунжутным соусом и васаби" },
        { name: "Сырная тарелка", price: "850 ₽", desc: "Ассорти из лучших сыров с орехами и медом" }
    ],
    main: [
        { name: "Стейк Рибай", price: "1850 ₽", desc: "350г премиальной говядины, подается с овощами гриль" },
        { name: "Лосось на гриле", price: "1250 ₽", desc: "Филе лосося с лимонным соусом и диким рисом" },
        { name: "Паста Карбонара", price: "890 ₽", desc: "Спагетти с панчеттой, яйцом и пармезаном" },
        { name: "Утиная грудка", price: "1350 ₽", desc: "С ягодным соусом и картофельным гратеном" }
    ],
    desserts: [
        { name: "Тирамису", price: "550 ₽", desc: "Классический итальянский десерт с кофе и маскарпоне" },
        { name: "Чизкейк Нью-Йорк", price: "480 ₽", desc: "Нежный чизкейк с ягодным соусом" },
        { name: "Шоколадный фондан", price: "520 ₽", desc: "Теплый шоколадный кекс с ванильным мороженым" },
        { name: "Крем-брюле", price: "450 ₽", desc: "Ванильный крем с хрустящей карамельной корочкой" }
    ],
    drinks: [
        { name: "Мохито", price: "450 ₽", desc: "Классический освежающий коктейль с мятой и лаймом" },
        { name: "Негрони", price: "580 ₽", desc: "Классика итальянского аперитива" },
        { name: "Домашний лимонад", price: "320 ₽", desc: "С мятой, имбирем и сезонными ягодами" },
        { name: "Вино карта", price: "от 350 ₽", desc: "Обширная карта французских и итальянских вин" }
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
    // Показываем меню закусок по умолчанию
    if (document.getElementById('menu-items')) {
        displayMenu('starters');
    }
    
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
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            const targetId = href;
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Закрываем мобильное меню если открыто
                const mobileMenu = document.querySelector('.mobile-menu');
                const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
                
                // Прокрутка к элементу
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Загрузка сохраненных данных формы при загрузке страницы
    const savedData = loadFromLocalStorage('reservation_form');
    if (savedData) {
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = savedData[key];
            }
        });
    }
    
    // Сохранение данных формы при вводе
    const form = document.getElementById('reservation-form');
    if (form) {
        form.addEventListener('input', function(e) {
            const formData = {};
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                if (input.name && input.type !== 'submit' && input.type !== 'button') {
                    formData[input.name] = input.value;
                }
            });
            saveToLocalStorage('reservation_form', formData);
        });
    }
    
    // Фиксированная навигация при скролле
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});

// Мобильное меню
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileDropdown = document.querySelector('.mobile-dropdown');
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            this.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
        
        // Закрытие меню при клике на ссылку
        mobileMenu.querySelectorAll('a:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', function() {
                mobileMenuBtn.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });
        
        // Мобильное выпадающее меню
        if (mobileDropdown && dropdownToggle) {
            dropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                if (submenu) {
                    submenu.classList.toggle('active');
                }
            });
        }
    }
    
    // Десктопное выпадающее меню - плавное появление
    const dropdowns = document.querySelectorAll('.menu-dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('mouseenter', function() {
            const submenu = this.querySelector('.dropdown');
            if (submenu) {
                submenu.style.opacity = '0';
                submenu.style.transform = 'translateY(-10px)';
                submenu.style.display = 'block';
                
                requestAnimationFrame(() => {
                    submenu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    submenu.style.opacity = '1';
                    submenu.style.transform = 'translateY(0)';
                });
            }
        });
        
        dropdown.addEventListener('mouseleave', function() {
            const submenu = this.querySelector('.dropdown');
            if (submenu) {
                submenu.style.opacity = '0';
                submenu.style.transform = 'translateY(-10px)';
                
                setTimeout(() => {
                    if (!dropdown.matches(':hover')) {
                        submenu.style.display = 'none';
                    }
                }, 300);
            }
        });
    });
});

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
