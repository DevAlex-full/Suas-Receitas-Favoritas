// Engine.js - Pitadas & Descobertas (Versão Otimizada)

// ========== CONFIGURAÇÃO DA API ==========
const API_CONFIG = {
    BASE_URL: 'https://www.themealdb.com/api/json/v1/1/',
    ENDPOINTS: {
        SEARCH: 'search.php?s=',
        CATEGORY: 'filter.php?c=',
        RANDOM: 'random.php',
        LOOKUP: 'lookup.php?i='
    }
};

// ========== MAPEAMENTOS ==========
const CATEGORY_MAPPING = {
    'Dessert': 'doce',
    'Beef': 'salgado',
    'Chicken': 'salgado',
    'Pork': 'salgado',
    'Seafood': 'salgado',
    'Lamb': 'salgado',
    'Vegetarian': 'vegetariano',
    'Vegan': 'vegetariano',
    'Breakfast': 'salgado',
    'Pasta': 'salgado',
    'Miscellaneous': 'salgado'
};

const PORTUGUESE_TO_API = {
    'doce': ['Dessert'],
    'salgado': ['Beef', 'Chicken', 'Pork', 'Seafood'],
    'vegetariano': ['Vegetarian', 'Vegan']
};

const CATEGORY_NAMES = {
    'doce': 'Doce',
    'salgado': 'Salgado',
    'vegetariano': 'Vegetariano'
};

// ========== VARIÁVEIS GLOBAIS ==========
let recipesData = [];
let allLoadedRecipes = [];
let currentFilter = 'todas';
let searchTerm = '';
let isLoading = false;

// ========== ELEMENTOS DOM ==========
const DOM = {
    hamburger: document.querySelector('.hamburger'),
    navMenu: document.querySelector('.nav-menu'),
    searchInput: document.getElementById('search-input'),
    searchBtn: document.getElementById('search-btn'),
    recipesGrid: document.getElementById('recipes-grid'),
    filterButtons: document.querySelectorAll('.filter-btn'),
    categoryCards: document.querySelectorAll('.category-card')
};

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
    console.log('🚀 Inicializando aplicação...');
    setupEventListeners();
    setupSmoothScroll();
    setupScrollAnimations();
    addScrollIndicator();
    await loadInitialData();
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
    // Menu mobile
    DOM.hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Busca
    DOM.searchInput?.addEventListener('input', debounce(handleSearchInput, 800));
    DOM.searchInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearchButton();
        }
    });
    DOM.searchBtn?.addEventListener('click', handleSearchButton);
    
    // Filtros e categorias
    DOM.filterButtons.forEach(btn => btn.addEventListener('click', handleFilterClick));
    DOM.categoryCards.forEach(card => card.addEventListener('click', handleCategoryClick));
    
    // Menu mobile - fechamento
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    document.addEventListener('click', (e) => {
        if (DOM.hamburger && DOM.navMenu && 
            !DOM.hamburger.contains(e.target) && !DOM.navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) closeMobileMenu();
    });
}

// ========== FUNÇÕES DE MENU MOBILE ==========
function toggleMobileMenu() {
    if (!DOM.hamburger || !DOM.navMenu) return;
    
    DOM.hamburger.classList.toggle('active');
    DOM.navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
    
    const spans = DOM.hamburger.querySelectorAll('span');
    if (DOM.hamburger.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
    } else {
        spans.forEach(span => {
            span.style.transform = 'none';
            span.style.opacity = '1';
        });
    }
}

function closeMobileMenu() {
    if (!DOM.hamburger || !DOM.navMenu) return;
    
    DOM.hamburger.classList.remove('active');
    DOM.navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    
    DOM.hamburger.querySelectorAll('span').forEach(span => {
        span.style.transform = 'none';
        span.style.opacity = '1';
    });
}

// ========== FUNÇÕES DE BUSCA ==========
async function handleSearchInput(e) {
    const query = e.target.value.trim();
    console.log(`🔍 Busca: "${query}"`);
    
    if (query.length === 0) {
        currentFilter = 'todas';
        recipesData = [...allLoadedRecipes];
        renderRecipes();
        resetFilterButtons();
        return;
    }
    
    if (query.length >= 2) {
        searchTerm = query.toLowerCase();
        await searchRecipes(query);
    }
}

async function handleSearchButton() {
    const searchValue = DOM.searchInput?.value.trim();
    if (!searchValue) return;
    
    if (searchValue.length >= 2) {
        searchTerm = searchValue.toLowerCase();
        await searchRecipes(searchValue);
        scrollToRecipes();
        resetFilterButtons();
    } else {
        alert('Digite pelo menos 2 caracteres para buscar');
        DOM.searchInput?.focus();
    }
}

// ========== FUNÇÕES DE FILTRO ==========
async function handleFilterClick(e) {
    const filter = e.target.dataset.filter;
    updateActiveFilter(e.target);
    
    currentFilter = filter;
    clearSearch();
    
    if (filter === 'todas') {
        recipesData = [...allLoadedRecipes];
        renderRecipes();
    } else {
        await loadRecipesByCategory(filter);
    }
}

async function handleCategoryClick(e) {
    const categoryCard = e.target.closest('.category-card');
    if (!categoryCard) return;
    
    const category = categoryCard.dataset.category;
    currentFilter = category;
    
    const targetBtn = document.querySelector(`[data-filter="${category}"]`);
    if (targetBtn) updateActiveFilter(targetBtn);
    
    clearSearch();
    await loadRecipesByCategory(category);
    scrollToRecipes();
}

// ========== FUNÇÕES AUXILIARES DE FILTRO ==========
function updateActiveFilter(activeBtn) {
    DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
    activeBtn.classList.add('active');
}

function resetFilterButtons() {
    DOM.filterButtons.forEach(btn => btn.classList.remove('active'));
    const allButton = document.querySelector('[data-filter="todas"]');
    if (allButton) allButton.classList.add('active');
}

function clearSearch() {
    searchTerm = '';
    if (DOM.searchInput) DOM.searchInput.value = '';
}

function scrollToRecipes() {
    const recipesSection = document.getElementById('receitas');
    if (recipesSection) {
        recipesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ========== FUNÇÕES DA API ==========
async function makeAPIRequest(endpoint, params = '') {
    const url = API_CONFIG.BASE_URL + endpoint + params;
    console.log(`🌐 API: ${url}`);
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('❌ Erro na API:', error);
        throw error;
    }
}

async function loadInitialData() {
    console.log('📡 Carregando dados iniciais...');
    showLoading();
    
    try {
        await loadMixedRecipes();
        console.log(`✅ ${recipesData.length} receitas carregadas`);
        renderRecipes();
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        showError('Erro ao carregar receitas. Verifique sua conexão.');
    }
}

async function loadMixedRecipes() {
    recipesData = [];
    allLoadedRecipes = [];
    
    const categories = ['Dessert', 'Chicken', 'Vegetarian', 'Beef'];
    
    for (const category of categories) {
        try {
            const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.CATEGORY, category);
            
            if (response.meals?.length) {
                const mappedCategory = CATEGORY_MAPPING[category] || 'salgado';
                const recipesToAdd = response.meals.slice(0, 4);
                
                for (const meal of recipesToAdd) {
                    try {
                        const detailResponse = await makeAPIRequest(API_CONFIG.ENDPOINTS.LOOKUP, meal.idMeal);
                        if (detailResponse.meals?.[0]) {
                            const transformedRecipe = transformMealData(detailResponse.meals[0], mappedCategory);
                            recipesData.push(transformedRecipe);
                            allLoadedRecipes.push(transformedRecipe);
                        }
                    } catch (error) {
                        console.warn(`⚠️ Erro ao carregar ${meal.idMeal}:`, error);
                    }
                }
            }
        } catch (error) {
            console.warn(`⚠️ Erro categoria ${category}:`, error);
        }
    }
    
    recipesData = shuffleArray(recipesData);
}

async function searchRecipes(query) {
    if (!query?.trim() || query.trim().length < 2) {
        recipesData = [...allLoadedRecipes];
        renderRecipes();
        return;
    }
    
    console.log(`🔍 Buscando: "${query}"`);
    showLoading();
    
    try {
        const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.SEARCH, encodeURIComponent(query.trim()));
        
        if (response.meals?.length) {
            recipesData = response.meals.map(meal => {
                const category = CATEGORY_MAPPING[meal.strCategory] || 'salgado';
                return transformMealData(meal, category);
            });
        } else {
            recipesData = [];
        }
        
        renderRecipes();
    } catch (error) {
        console.error('❌ Erro na busca:', error);
        showError('Erro na busca. Tente novamente.');
    }
}

async function loadRecipesByCategory(categoryFilter) {
    if (categoryFilter === 'todas') {
        recipesData = [...allLoadedRecipes];
        renderRecipes();
        return;
    }
    
    console.log(`📋 Carregando categoria: ${categoryFilter}`);
    showLoading();
    
    try {
        const apiCategories = PORTUGUESE_TO_API[categoryFilter] || ['Chicken'];
        let categoryRecipes = [];
        
        for (const apiCategory of apiCategories) {
            const response = await makeAPIRequest(API_CONFIG.ENDPOINTS.CATEGORY, apiCategory);
            
            if (response.meals?.length) {
                const recipesToAdd = response.meals.slice(0, 6);
                
                for (const meal of recipesToAdd) {
                    try {
                        const detailResponse = await makeAPIRequest(API_CONFIG.ENDPOINTS.LOOKUP, meal.idMeal);
                        if (detailResponse.meals?.[0]) {
                            const transformedRecipe = transformMealData(detailResponse.meals[0], categoryFilter);
                            categoryRecipes.push(transformedRecipe);
                        }
                    } catch (error) {
                        console.warn(`⚠️ Erro detalhes:`, error);
                    }
                }
            }
        }
        
        // Remove duplicatas
        const uniqueRecipes = categoryRecipes.filter((recipe, index, self) => 
            index === self.findIndex(r => r.id === recipe.id)
        );
        
        recipesData = shuffleArray(uniqueRecipes).slice(0, 12);
        renderRecipes();
        
    } catch (error) {
        console.error('❌ Erro categoria:', error);
        showError('Erro ao carregar receitas da categoria.');
    }
}

// ========== TRANSFORMAÇÃO DE DADOS ==========
function transformMealData(meal, category) {
    let description = '';
    if (meal.strInstructions) {
        const sentences = meal.strInstructions.split('. ');
        description = sentences[0];
        if (description.length > 150) {
            description = description.substring(0, 150) + '...';
        } else if (sentences.length > 1) {
            description += '.';
        }
    }
    
    if (!description) {
        description = `Deliciosa receita de ${meal.strMeal} para você preparar em casa.`;
    }
    
    return {
        id: meal.idMeal,
        title: meal.strMeal,
        description: description,
        category: category,
        image: meal.strMealThumb,
        area: meal.strArea || 'Internacional',
        youtube: meal.strYoutube || '',
        ingredients: extractIngredients(meal),
        instructions: meal.strInstructions || 'Instruções não disponíveis.',
        originalCategory: meal.strCategory
    };
}

function extractIngredients(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if (ingredient?.trim()) {
            ingredients.push({
                name: ingredient.trim(),
                measure: measure ? measure.trim() : ''
            });
        }
    }
    return ingredients;
}

// ========== RENDERIZAÇÃO ==========
function renderRecipes() {
    console.log(`🎨 Renderizando ${recipesData.length} receitas`);
    
    if (!DOM.recipesGrid) return;
    
    DOM.recipesGrid.innerHTML = '';
    
    if (recipesData.length === 0) {
        DOM.recipesGrid.innerHTML = `
            <div class="no-results">
                <h3>Nenhuma receita encontrada</h3>
                <p>Tente buscar por outro termo ou selecionar uma categoria diferente.</p>
                <button onclick="resetSearch()" class="reset-btn">Ver todas as receitas</button>
            </div>
        `;
        return;
    }
    
    recipesData.forEach((recipe, index) => {
        const recipeElement = createRecipeElement(recipe, index);
        DOM.recipesGrid.appendChild(recipeElement);
    });
    
    animateRecipeCards();
}

function createRecipeElement(recipe, index) {
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-item';
    recipeDiv.style.animationDelay = `${index * 0.1}s`;
    
    const categoryColors = {
        'doce': '#ff6b6b',
        'salgado': '#4ecdc4',
        'vegetariano': '#95e1d3'
    };
    
    const iconMap = {
        'doce': '🍰',
        'salgado': '🍲',
        'vegetariano': '🥗'
    };
    
    recipeDiv.innerHTML = `
        <div class="recipe-image-container">
            <img src="${recipe.image}" alt="${recipe.title}" loading="lazy" 
                 onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 200%22><rect fill=%22%238b5cf6%22 width=%22300%22 height=%22200%22/><text x=%2250%%22 y=%2250%%22 fill=%22white%22 font-size=%2220%22 text-anchor=%22middle%22 dy=%22.3em%22>🍳</text></svg>'">
            <div class="recipe-overlay">
                <span class="recipe-icon">${iconMap[recipe.category] || '🍳'}</span>
            </div>
            <div class="recipe-area">${recipe.area}</div>
        </div>
        <div class="recipe-content">
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <div class="recipe-footer">
                <span class="recipe-category" style="background: ${categoryColors[recipe.category] || '#8b5cf6'}">
                    ${CATEGORY_NAMES[recipe.category] || 'Outros'}
                </span>
                ${recipe.youtube ? '<span class="recipe-video">📺</span>' : ''}
            </div>
        </div>
    `;
    
    recipeDiv.addEventListener('click', () => showRecipeDetails(recipe));
    return recipeDiv;
}

// ========== MODAL DE DETALHES ==========
function showRecipeDetails(recipe) {
    const modal = document.createElement('div');
    modal.className = 'recipe-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${recipe.title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="recipe-image-large">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <div class="recipe-meta">
                        <span class="recipe-area-large">📍 ${recipe.area}</span>
                        <span class="recipe-category-large">${CATEGORY_NAMES[recipe.category]}</span>
                    </div>
                </div>
                <div class="ingredients-section">
                    <h3>Ingredientes:</h3>
                    <ul class="ingredients-list">
                        ${recipe.ingredients.map(ing => 
                            `<li><span class="ingredient-measure">${ing.measure}</span> ${ing.name}</li>`
                        ).join('')}
                    </ul>
                </div>
                <div class="instructions-section">
                    <h3>Modo de Preparo:</h3>
                    <p class="instructions-text">${recipe.instructions}</p>
                </div>
                ${recipe.youtube ? `
                    <div class="video-section">
                        <h3>Vídeo Tutorial:</h3>
                        <a href="${recipe.youtube}" target="_blank" class="video-link">
                            📺 Assistir no YouTube
                        </a>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Event listeners do modal
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    function closeModal() {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
    }
}

// ========== FUNÇÕES AUXILIARES ==========
async function resetSearch() {
    searchTerm = '';
    if (DOM.searchInput) DOM.searchInput.value = '';
    currentFilter = 'todas';
    resetFilterButtons();
    recipesData = [...allLoadedRecipes];
    renderRecipes();
}

function animateRecipeCards() {
    const cards = document.querySelectorAll('.recipe-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function showLoading() {
    if (!DOM.recipesGrid) return;
    DOM.recipesGrid.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Carregando receitas deliciosas...</p>
        </div>
    `;
}

function showError(message) {
    if (!DOM.recipesGrid) return;
    DOM.recipesGrid.innerHTML = `
        <div class="error-message">
            <div class="error-icon">⚠️</div>
            <h3>Oops! Algo deu errado</h3>
            <p>${message}</p>
            <button onclick="loadInitialData()" class="retry-btn">Tentar Novamente</button>
        </div>
    `;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ========== FUNCIONALIDADES EXTRAS ==========
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

function setupScrollAnimations() {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.category-card, .about-content, .feature').forEach(el => {
        observer.observe(el);
    });
}

function addScrollIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    indicator.style.cssText = `
        position: fixed; top: 0; left: 0; width: 0%; height: 4px; 
        background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); 
        z-index: 9999; transition: width 0.3s ease;
    `;
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.width = scrolled + '%';
    });
}

// ========== ESTILOS DINÂMICOS ==========
const additionalStyles = `
<style>
/* Mobile menu otimizado */
@media (max-width: 768px) {
    .nav-menu {
        position: fixed; top: 0; right: -100%; width: 100%; height: 100vh;
        background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
        flex-direction: column; justify-content: center; align-items: center; gap: 2rem;
        transition: right 0.3s ease; z-index: 999;
    }
    .nav-menu.active { right: 0; }
    .nav-menu a { font-size: 1.5rem; font-weight: 600; }
    body.menu-open { overflow: hidden; }
    
    /* Hamburger ativo */
    .hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(7px, -6px); }
}

/* Responsividade Hero Section */
@media (max-width: 768px) {
    .hero-content { 
        grid-template-columns: 1fr; text-align: center; gap: 2rem; padding: 0 15px; 
    }
    .hero-content h2 { 
        font-size: 2.2rem; line-height: 1.3; margin-bottom: 1rem; 
    }
    .hero-content p { 
        font-size: 1rem; margin-bottom: 1.5rem; 
    }
    .search-container { 
        max-width: 100%; margin: 0 auto; 
    }
    .phone-mockup { 
        width: 250px; height: 500px; margin: 0 auto; 
    }
}

/* Responsividade Categories */
@media (max-width: 768px) {
    .categories { 
        padding: 60px 0; 
    }
    .categories h2 { 
        font-size: 2rem; margin-bottom: 2rem; 
    }
    .category-grid { 
        grid-template-columns: 1fr; gap: 1.5rem; 
    }
    .category-card { 
        padding: 1.5rem; 
    }
    .category-card h3 { 
        font-size: 1.3rem; 
    }
}

/* Responsividade Recipes Section */
@media (max-width: 768px) {
    .recipes { 
        padding: 60px 0; 
    }
    .section-header { 
        flex-direction: column; align-items: flex-start; gap: 1.5rem; 
    }
    .section-header h2 { 
        font-size: 2rem; 
    }
    .filter-buttons { 
        width: 100%; justify-content: center; flex-wrap: wrap; 
    }
    .filter-btn { 
        padding: 8px 16px; font-size: 0.9rem; 
    }
    .recipes-grid { 
        grid-template-columns: 1fr; gap: 1.5rem; 
    }
}

/* Responsividade About Section */
@media (max-width: 768px) {
    .about { 
        padding: 60px 0; 
    }
    .about-content { 
        grid-template-columns: 1fr; text-align: center; gap: 2rem; 
    }
    .about-text h2 { 
        font-size: 2rem; 
    }
    .about-text p { 
        font-size: 1rem; 
    }
    .cooking-illustration { 
        width: 200px; height: 200px; 
    }
    .cooking-emoji { 
        font-size: 5rem; 
    }
    .features { 
        gap: 1rem; 
    }
    .feature { 
        flex-direction: column; text-align: center; gap: 0.5rem; 
    }
}

/* Modal responsivo */
@media (max-width: 768px) {
    .recipe-modal { 
        padding: 10px; 
    }
    .modal-content { 
        width: 100%; max-height: 95vh; margin: 0; border-radius: 15px; 
    }
    .modal-header { 
        padding: 1rem; 
    }
    .modal-header h2 { 
        font-size: 1.3rem; 
    }
    .modal-body { 
        padding: 1rem; 
    }
    .recipe-image-large img { 
        height: 200px; 
    }
    .ingredients-list { 
        grid-template-columns: 1fr; 
    }
    .recipe-meta { 
        flex-direction: column; gap: 0.5rem; align-items: flex-start; 
    }
}

/* Mobile específico - 480px e menor */
@media (max-width: 480px) {
    .hero-content h2 { 
        font-size: 1.8rem; 
    }
    .hero-content p { 
        font-size: 0.9rem; 
    }
    .search-container { 
        padding: 6px; 
    }
    .search-container input { 
        padding: 10px 15px; font-size: 0.9rem; 
    }
    .search-container button { 
        padding: 10px 15px; 
    }
    
    .categories h2, .section-header h2, .about-text h2 { 
        font-size: 1.7rem; 
    }
    
    .category-card { 
        padding: 1.2rem; 
    }
    .category-icon { 
        font-size: 2.5rem; 
    }
    
    .phone-mockup { 
        width: 200px; height: 400px; 
    }
    
    .container { 
        padding: 0 15px; 
    }
    
    .footer-content { 
        grid-template-columns: 1fr; text-align: center; 
    }
}

/* Animações */
.animate-in { animation: fadeInUp 0.8s ease forwards; }
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
}

.recipe-overlay {
    position: absolute; top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.1); display: flex;
    justify-content: center; align-items: center;
    opacity: 0; transition: opacity 0.3s ease;
}

/* No mobile, mostrar overlay sempre para indicar interatividade */
@media (max-width: 768px) {
    .recipe-overlay { opacity: 0.3; }
    .recipe-item:active .recipe-overlay { opacity: 0.8; }
}

@media (min-width: 769px) {
    .recipe-item:hover .recipe-overlay { opacity: 1; }
}

.recipe-icon { font-size: 3rem; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); }

/* Estados de loading e erro responsivos */
.loading, .error-message, .no-results {
    grid-column: 1 / -1; text-align: center; padding: 2rem 1rem; color: #6b7280;
}

@media (max-width: 480px) {
    .loading, .error-message, .no-results { 
        padding: 1.5rem 0.5rem; 
    }
    .loading h3, .error-message h3, .no-results h3 { 
        font-size: 1.3rem; 
    }
    .loading p, .error-message p, .no-results p { 
        font-size: 0.9rem; 
    }
}

.loading-spinner {
    width: 40px; height: 40px; border: 4px solid #f3f4f6; border-left-color: #8b5cf6;
    border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

.error-icon { font-size: 3rem; margin-bottom: 1rem; }
.error-message h3, .no-results h3 {
    font-size: 1.5rem; margin-bottom: 1rem; font-weight: 600; color: #374151;
}

.reset-btn, .retry-btn {
    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%); color: white;
    border: none; padding: 12px 24px; border-radius: 25px; font-weight: 500;
    cursor: pointer; transition: all 0.3s ease; margin-top: 1rem;
    font-size: 0.9rem; min-width: 120px;
}

@media (max-width: 480px) {
    .reset-btn, .retry-btn { 
        padding: 10px 20px; font-size: 0.85rem; 
    }
}

.reset-btn:hover, .retry-btn:hover { transform: translateY(-2px); }

/* Touch targets melhorados para mobile */
@media (max-width: 768px) {
    .filter-btn { 
        min-height: 44px; 
    }
    .category-card { 
        min-height: 120px; 
    }
    .recipe-item { 
        cursor: pointer; 
    }
}

/* Melhoria na tipografia mobile */
@media (max-width: 768px) {
    body { 
        font-size: 16px; line-height: 1.6; 
    }
    h1, h2, h3, h4, h5, h6 { 
        line-height: 1.3; 
    }
}

/* Scroll suave e otimizado */
html { 
    scroll-behavior: smooth; 
}

/* Indicador de scroll responsivo */
.scroll-indicator {
    position: fixed; top: 0; left: 0; width: 0%; height: 3px;
    background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
    z-index: 9999; transition: width 0.3s ease;
}

@media (max-width: 768px) {
    .scroll-indicator { 
        height: 2px; 
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', additionalStyles);

// ========== LOG INICIAL ==========
console.log(`
🍳 Pitadas & Descobertas - Engine Otimizado
⚡ Versão limpa e funcional carregada
📱 Responsivo e acessível
🔧 ${Object.keys(DOM).length} elementos DOM mapeados
`);