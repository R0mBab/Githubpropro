const promptsContainer = document.getElementById('prompts-container');
let categories = {};
let currentCategory = 'all';
let clickCount = 0;
const CLICK_THRESHOLD = 4;

const TRANSLATIONS = {
  en: {
    mainTitle: "Prompt library",
    searchPlaceholder: "Search prompts...",
    allButton: "All",
    copiedToClipboard: "Copied to clipboard!",
    clickToCopy: "Click on the text below to copy the prompt",
        registration: {
      title: "Registration",
      username: "Username",
      email: "Email",
      submit: "Register",
      success: "Registration successful!",
      error: "Registration failed. Please try again.",
      emailExists: "This email is already registered",
      pleaseRegister: "Please register to view prompts"
    }
  },
  ru: {
    mainTitle: "Библиотека промптов",
    searchPlaceholder: "Поиск промптов...",
    allButton: "Все",
    copiedToClipboard: "Скопировано в буфер обмена!",
    clickToCopy: "Нажмите на текст ниже, чтобы скопировать промпт",
    registration: {
      title: "Регистрация",
      username: "Имя пользователя",
      email: "Email",
      submit: "Зарегистрироваться",
      success: "Регистрация успешна!",
      error: "Ошибка регистрации. Попробуйте снова.",
      emailExists: "Этот email уже зарегистрирован",
      pleaseRegister: "Пожалуйста, зарегистрируйтесь для просмотра промптов"
    }
  }
};

let currentLanguage = 'en';

fetch('prompts.json')
  .then(response => response.json())
  .then(prompts => {
    prompts.forEach(prompt => {
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-3';

      const card = document.createElement('div');
      card.className = 'card h-100 shadow-sm prompt-card bg-dark text-light';
      card.style.cursor = 'pointer';
      card.style.transition = 'box-shadow 0.3s ease-in-out';

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body';

      const name = document.createElement('h6');
      name.className = 'card-subtitle mb-2';
      name.textContent = prompt.name[currentLanguage];

      const description = document.createElement('p');
      description.className = 'card-text description';
      description.textContent = prompt.description[currentLanguage];

      cardBody.appendChild(name);
      cardBody.appendChild(description);
      card.appendChild(cardBody);
      col.appendChild(card);
      promptsContainer.appendChild(col);

      card.dataset.promptData = JSON.stringify(prompt);

      card.addEventListener('mouseenter', () => card.classList.add('shadow'));
      card.addEventListener('mouseleave', () => card.classList.remove('shadow'));

      card.addEventListener('click', () => openPromptModal(prompt));

      const category = prompt.category[currentLanguage];
      categories[category] = (categories[category] || 0) + 1;
    });

    createCategoryFilters();
  })
  .catch(error => console.error('Error loading prompts:', error));

function openPromptModal(prompt) {
  clickCount++;

  if (clickCount === 4) {
    showRegistrationForm();
    return;
  }

  const currentUser = localStorage.getItem('currentUser');
  if (clickCount > 4 && !currentUser) {
    showAlert(TRANSLATIONS[currentLanguage].registration.pleaseRegister, 'warning');
    showRegistrationForm();
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-lg">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">${prompt.name[currentLanguage]}</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p class="mb-3">${prompt.description[currentLanguage]}</p>
          <p class="text-muted small mb-2">${TRANSLATIONS[currentLanguage].clickToCopy}</p>
          <div class="bg-dark p-3 rounded position-relative border border-secondary" style="max-height: 50vh; overflow-y: auto;">
            <p class="mb-0 prompt-text text-light" style="cursor: pointer; white-space: pre-wrap;" onclick="copyToClipboard(this)">${prompt.text[currentLanguage]}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const modalInstance = new bootstrap.Modal(modal);
  modalInstance.show();
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function showRegistrationForm() {
  const registrationForm = document.createElement('div');
  registrationForm.className = 'modal fade';
  registrationForm.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content bg-dark text-light">
        <div class="modal-header border-secondary">
          <h5 class="modal-title">${TRANSLATIONS[currentLanguage].registration.title}</h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form id="registrationForm">
            <div class="mb-3">
              <label for="username" class="form-label">${TRANSLATIONS[currentLanguage].registration.username}</label>
              <input type="text" class="form-control bg-dark text-light" id="username" required>
            </div>
            <div class="mb-3">
              <label for="email" class="form-label">${TRANSLATIONS[currentLanguage].registration.email}</label>
              <input type="email" class="form-control bg-dark text-light" id="email" required>
            </div>
            <button type="submit" class="btn btn-primary">${TRANSLATIONS[currentLanguage].registration.submit}</button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(registrationForm);
  const modal = new bootstrap.Modal(registrationForm);
  modal.show();

  document.getElementById('registrationForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const userData = {
      username: document.getElementById('username').value,
      email: document.getElementById('email').value,
      registrationDate: new Date().toISOString()
    };

    try {
      let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

      if (registeredUsers.some(user => user.email === userData.email)) {
        showAlert(TRANSLATIONS[currentLanguage].registration.emailExists, 'danger');
        return;
      }

      registeredUsers.push(userData);
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      localStorage.setItem('currentUser', JSON.stringify(userData));

      saveLocalStorageToJson();

      modal.hide();
      showAlert(TRANSLATIONS[currentLanguage].registration.success, 'success');
      updateUIForRegisteredUser(userData);

    } catch (error) {
      console.error('Registration error:', error);
      showAlert(TRANSLATIONS[currentLanguage].registration.error, 'danger');
    }
  });

  registrationForm.addEventListener('hidden.bs.modal', () => {
    registrationForm.remove();
  });
}

function saveLocalStorageToJson() {
  const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
  console.log('Users data:', registeredUsers);
  // Данные сохраняются только локально
}

function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
  alertDiv.style.zIndex = '9999';
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  document.body.appendChild(alertDiv);
  setTimeout(() => {
    alertDiv.remove();
  }, 3000);
}

function updateUIForRegisteredUser(userData) {
  // Здесь можно добавить обновление интерфейса для зарегистрированного пользователя
}

function copyToClipboard(element) {
  const text = element.textContent;
  navigator.clipboard.writeText(text).then(() => {
    const tooltip = bootstrap.Tooltip.getOrCreateInstance(element, {
      title: TRANSLATIONS[currentLanguage].copiedToClipboard,
      placement: 'top',
      trigger: 'manual'
    });
    tooltip.show();
    setTimeout(() => tooltip.hide(), 2000);
  }).catch(err => console.error('Failed to copy text: ', err));
}

document.addEventListener('DOMContentLoaded', () => {
  const languageLinks = document.querySelectorAll('.language-links a');

  currentLanguage = navigator.language.startsWith('ru') ? 'ru' : 'en';

  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam && ['en', 'ru'].includes(langParam)) {
    currentLanguage = langParam;
  }

  updateLanguage();

  languageLinks.forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      currentLanguage = event.target.dataset.lang;
      updateLanguage();
      const newUrl = new URL(window.location);
      newUrl.searchParams.set('lang', currentLanguage);
      window.history.pushState({}, '', newUrl);
    });
  });

  // Добавляем поиск по вводу
  document.getElementById('search').addEventListener('input', filterPrompts);
});

function updateLanguage() {
  document.getElementById('main-title').textContent = TRANSLATIONS[currentLanguage].mainTitle;
  document.getElementById('search').placeholder = TRANSLATIONS[currentLanguage].searchPlaceholder;
  document.getElementById('nav-read').textContent = TRANSLATIONS[currentLanguage].nav.read;
  document.getElementById('nav-watch').textContent = TRANSLATIONS[currentLanguage].nav.watch;
  document.getElementById('nav-style').textContent = TRANSLATIONS[currentLanguage].nav.style;


  categories = {};
  document.querySelectorAll('.card').forEach(card => {
    const promptData = JSON.parse(card.dataset.promptData);
    const category = promptData.category[currentLanguage];
    categories[category] = (categories[category] || 0) + 1;
  });

  updateCategoryFilters();
  updatePromptCards();
  updateLanguageLinks();

  document.getElementById('footer-text-' + currentLanguage).style.display = 'inline';
  document.getElementById('footer-text-' + (currentLanguage === 'en' ? 'ru' : 'en')).style.display = 'none';

  const pageTitle = document.getElementById('page-title');
  if (pageTitle) {
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    switch (currentPage) {
      case 'read':
        pageTitle.textContent = `${TRANSLATIONS[currentLanguage].nav.read} - ${TRANSLATIONS[currentLanguage].mainTitle}`;
        break;
      case 'watch':
        pageTitle.textContent = `${TRANSLATIONS[currentLanguage].nav.watch} - ${TRANSLATIONS[currentLanguage].mainTitle}`;
        break;
      case 'style':
        pageTitle.textContent = `${TRANSLATIONS[currentLanguage].nav.style} - ${TRANSLATIONS[currentLanguage].mainTitle}`;
        break;
      default:
        document.title = TRANSLATIONS[currentLanguage].mainTitle;
    }
  }
}

function updateCategoryFilters() {
  const filterContainer = document.getElementById('category-filters');
  if (filterContainer) {
    filterContainer.innerHTML = '';

    const allButton = document.createElement('button');
    const totalPrompts = Object.values(categories).reduce((a, b) => a + b, 0);
    allButton.textContent = `${TRANSLATIONS[currentLanguage].allButton} (${totalPrompts})`;
    allButton.className = currentCategory === 'all' ? 'btn btn-primary me-2 mb-2' : 'btn btn-outline-primary me-2 mb-2';
    allButton.onclick = () => filterByCategory('all');
    filterContainer.appendChild(allButton);

    Object.entries(categories).forEach(([category, count]) => {
      const button = document.createElement('button');
      button.textContent = `${category} (${count})`;
      button.className = category === currentCategory ? 'btn btn-primary me-2 mb-2' : 'btn btn-outline-primary me-2 mb-2';
      button.onclick = () => filterByCategory(category);
      filterContainer.appendChild(button);
    });
  }
}

function updateLanguageLinks() {
  document.querySelectorAll('.language-links a').forEach(link => {
    link.classList.toggle('active', link.dataset.lang === currentLanguage);
  });
}

function updatePromptCards() {
  document.querySelectorAll('.card').forEach(card => {
    const promptData = JSON.parse(card.dataset.promptData);
    card.querySelector('.card-subtitle').textContent = promptData.name[currentLanguage];
    card.querySelector('.description').textContent = promptData.description[currentLanguage];
  });
}

function createCategoryFilters() {
  const filterContainer = document.createElement('div');
  filterContainer.className = 'mb-3';
  filterContainer.id = 'category-filters';
  promptsContainer.parentNode.insertBefore(filterContainer, promptsContainer);
  updateCategoryFilters();
}

function filterByCategory(category) {
  currentCategory = category;
  filterPrompts();

  document.querySelectorAll('#category-filters button').forEach(button => {
    button.className = (button.textContent.startsWith(category) || (category === 'all' && button.textContent.startsWith(TRANSLATIONS[currentLanguage].allButton)))
      ? 'btn btn-primary me-2 mb-2'
      : 'btn btn-outline-primary me-2 mb-2';
  });
}

function filterPrompts() {
  const query = document.getElementById('search').value.toLowerCase();
  document.querySelectorAll('.card').forEach(card => {
    const promptData = JSON.parse(card.dataset.promptData);
    const categoryMatch = currentCategory === 'all' || promptData.category[currentLanguage] === currentCategory;

    const textMatch = Object.keys(promptData.name).some(lang =>
      promptData.name[lang].toLowerCase().includes(query) ||
      promptData.description[lang].toLowerCase().includes(query) ||
      promptData.text[lang].toLowerCase().includes(query)
    );

    card.parentElement.style.display = categoryMatch && textMatch ? '' : 'none';
  });
}

// Инициализация подсказок Bootstrap
document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(element => {
  new bootstrap.Tooltip(element);
});

// Обработка темной темы
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.body.classList.add('dark-mode');
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
  document.body.classList.toggle('dark-mode', e.matches);
});
