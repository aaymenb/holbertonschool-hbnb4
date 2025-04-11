/**
 * RBNB - Script principal moderne
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser toutes les fonctionnalités
    initializeHeader();
    initializeImageGalleries();
    initializeFavorites();
    initializeFilters();
    initializeAnimations();
    initializeSearchBar();
    initializeToggles();
    loadListings();
    
    // Montrer une notification de bienvenue
    setTimeout(() => {
        showNotification('👋 Bienvenue sur RBNB', 'Découvrez des logements uniques et vivez comme un local partout dans le monde.');
    }, 2000);
});

/**
 * Gestion du header 
 */
function initializeHeader() {
    const header = document.querySelector('.site-header');
    const userProfileButton = document.querySelector('.user-profile-button');
    let lastScrollY = window.scrollY;
    
    // Créer le menu utilisateur
    const userMenu = document.createElement('div');
    userMenu.className = 'user-dropdown';
    userMenu.innerHTML = `
        <div class="dropdown-menu">
            <a href="login.html" class="dropdown-item"><i class="fas fa-sign-in-alt"></i> Connexion</a>
            <a href="register.html" class="dropdown-item"><i class="fas fa-user-plus"></i> Inscription</a>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item"><i class="fas fa-home"></i> Héberger des voyageurs</a>
            <a href="#" class="dropdown-item"><i class="fas fa-gift"></i> Organiser une expérience</a>
            <a href="#" class="dropdown-item"><i class="fas fa-question-circle"></i> Aide</a>
        </div>
    `;
    
    if (userProfileButton) {
        userProfileButton.parentNode.appendChild(userMenu);
        
        userProfileButton.addEventListener('click', function() {
            userMenu.classList.toggle('active');
        });
    }
    
    // Fermer le menu lorsque l'utilisateur clique ailleurs
    document.addEventListener('click', function(event) {
        if (userProfileButton && !userProfileButton.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.remove('active');
        }
    });
    
    // Gérer le comportement du header au défilement
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            
            // Cache/Affiche le header selon la direction du scroll
            if (window.scrollY > lastScrollY) {
                header.classList.add('header-hidden');
            } else {
                header.classList.remove('header-hidden');
            }
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScrollY = window.scrollY;
    });
}

/**
 * Galeries d'images pour les logements
 */
function initializeImageGalleries() {
    const listingCards = document.querySelectorAll('.listing-card');
    
    listingCards.forEach(card => {
        const gallery = card.querySelector('.listing-gallery');
        if (!gallery) return;
        
        const images = gallery.querySelectorAll('img');
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'gallery-dots';
        
        // Créer les indicateurs pour chaque image
        images.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'gallery-dot' + (index === 0 ? ' active' : '');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                showImage(gallery, index);
            });
            dotsContainer.appendChild(dot);
        });
        
        gallery.appendChild(dotsContainer);
        
        // Boutons de navigation
        const prevButton = document.createElement('button');
        prevButton.className = 'gallery-nav prev';
        prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
        prevButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateGallery(gallery, 'prev');
        });
        
        const nextButton = document.createElement('button');
        nextButton.className = 'gallery-nav next';
        nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
        nextButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateGallery(gallery, 'next');
        });
        
        gallery.appendChild(prevButton);
        gallery.appendChild(nextButton);
    });
}

/**
 * Affiche une image spécifique dans la galerie
 */
function showImage(gallery, index) {
    const images = gallery.querySelectorAll('img');
    const dots = gallery.querySelectorAll('.gallery-dot');
    
    images.forEach((img, i) => {
        img.style.transform = `translateX(${(i - index) * 100}%)`;
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    gallery.dataset.currentIndex = index;
}

/**
 * Navigation dans la galerie (prev/next)
 */
function navigateGallery(gallery, direction) {
    const images = gallery.querySelectorAll('img');
    let currentIndex = parseInt(gallery.dataset.currentIndex || 0);
    
    if (direction === 'prev') {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
    } else {
        currentIndex = (currentIndex + 1) % images.length;
    }
    
    showImage(gallery, currentIndex);
}

/**
 * Gestion des favoris
 */
function initializeFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-button');
    
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            this.classList.toggle('active');
            
            // Animation de favoris
            if (this.classList.contains('active')) {
                const heart = this.querySelector('i');
                heart.classList.add('pulse');
                setTimeout(() => {
                    heart.classList.remove('pulse');
                }, 1000);
                
                showNotification('❤️ Ajouté aux favoris', 'Ce logement a été ajouté à votre liste de favoris.');
            }
        });
    });
}

/**
 * Filtres de catégories
 */
function initializeFilters() {
    const categoryItems = document.querySelectorAll('.category-item');
    const filterButton = document.querySelector('.filter-button');
    
    // Filtres de catégories
    categoryItems.forEach(item => {
        item.addEventListener('click', function() {
            // Désactiver l'élément actif précédent
            document.querySelector('.category-item.active')?.classList.remove('active');
            
            // Activer l'élément cliqué
            this.classList.add('active');
            
            // Animation de filtrage (simulée)
            const listings = document.querySelectorAll('.listing-card');
            listings.forEach(listing => {
                listing.style.opacity = '0.5';
                listing.style.transform = 'scale(0.95)';
            });
            
            setTimeout(() => {
                // Réinitialiser après l'animation
                listings.forEach(listing => {
                    listing.style.opacity = '1';
                    listing.style.transform = 'scale(1)';
                });
            }, 500);
        });
    });
    
    // Bouton de filtres avancés
    if (filterButton) {
        filterButton.addEventListener('click', function() {
            // Créer et afficher le modal de filtres
            showFilterModal();
        });
    }
    
    initializeCategoriesNavigation();
}

/**
 * Affiche le modal de filtres avancés
 */
function showFilterModal() {
    // Créer le contenu du modal
    const modalContent = `
        <div class="filter-header">
            <h3>Filtres</h3>
            <button class="close-button"><i class="fas fa-times"></i></button>
        </div>
        <div class="filter-body">
            <div class="filter-section">
                <h4>Budget</h4>
                <div class="price-range">
                    <input type="range" min="0" max="1000" value="500" class="price-slider">
                    <div class="price-inputs">
                        <div class="price-input">
                            <label>Min €</label>
                            <input type="number" value="0" min="0" max="1000">
                        </div>
                        <div class="price-input">
                            <label>Max €</label>
                            <input type="number" value="500" min="0" max="1000">
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="filter-section">
                <h4>Type de logement</h4>
                <div class="filter-options">
                    <label class="filter-checkbox">
                        <input type="checkbox"> Logement entier
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Chambre privée
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Chambre partagée
                    </label>
                </div>
            </div>
            
            <div class="filter-section">
                <h4>Équipements</h4>
                <div class="filter-options filter-grid">
                    <label class="filter-checkbox">
                        <input type="checkbox"> Wi-Fi
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Cuisine
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Lave-linge
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Climatisation
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Chauffage
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Piscine
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Parking gratuit
                    </label>
                    <label class="filter-checkbox">
                        <input type="checkbox"> Jacuzzi
                    </label>
                </div>
            </div>
        </div>
        <div class="filter-footer">
            <button class="secondary-button">Effacer tout</button>
            <button class="primary-button">Afficher les résultats</button>
        </div>
    `;
    
    // Créer et afficher le modal
    const modal = document.createElement('div');
    modal.className = 'modal filter-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">${modalContent}</div>
    `;
    
    document.body.appendChild(modal);
    
    // Animation d'entrée
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);
    
    // Gérer la fermeture du modal
    const closeButton = modal.querySelector('.close-button');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeButton.addEventListener('click', () => closeModal(modal));
    overlay.addEventListener('click', () => closeModal(modal));
    
    // Gérer le slider de prix
    const priceSlider = modal.querySelector('.price-slider');
    const maxPriceInput = modal.querySelector('.price-inputs input:nth-child(2)');
    
    priceSlider.addEventListener('input', function() {
        maxPriceInput.value = this.value;
    });
    
    maxPriceInput.addEventListener('input', function() {
        priceSlider.value = this.value;
    });
}

/**
 * Ferme un modal
 */
function closeModal(modal) {
    modal.classList.remove('active');
    
    // Supprimer le modal après l'animation
    setTimeout(() => {
        modal.remove();
    }, 300);
}

/**
 * Initialiser les animations
 */
function initializeAnimations() {
    // Animation des éléments au chargement de la page
    const animatedElements = document.querySelectorAll('.listing-card, .category-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
}

/**
 * Initialise la barre de recherche simplifiée
 */
function initializeSearchBar() {
    const simpleSearch = document.querySelector('.simple-search');
    
    if (simpleSearch) {
        simpleSearch.addEventListener('click', function() {
            // Rediriger vers une page de recherche au lieu d'afficher un formulaire
            showNotification('Recherche', 'Fonctionnalité de recherche simplifiée activée');
            
            // En option : animation de clic
            this.classList.add('search-pulse');
            setTimeout(() => {
                this.classList.remove('search-pulse');
            }, 500);
        });
    }
}

/**
 * Initialise les toggles (comme l'affichage des prix)
 */
function initializeToggles() {
    const priceToggle = document.querySelector('.price-toggle-button');
    
    if (priceToggle) {
        priceToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Mise à jour des prix affichés (simulé)
            document.querySelectorAll('.listing-price').forEach(price => {
                if (this.classList.contains('active')) {
                    const basePrice = price.querySelector('strong').textContent;
                    price.dataset.basePrice = basePrice;
                    
                    // Calculer un prix total simulé (avec taxes)
                    const baseValue = parseInt(basePrice.replace(/[^\d]/g, ''));
                    const totalValue = Math.round(baseValue * 1.15);
                    
                    price.querySelector('strong').textContent = basePrice.replace(/\d+/, totalValue);
                } else if (price.dataset.basePrice) {
                    price.querySelector('strong').textContent = price.dataset.basePrice;
                }
            });
        });
    }
}

/**
 * Affiche une notification
 */
function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <h4>${title}</h4>
            <p>${message}</p>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // Animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Fermeture automatique après 5 secondes
    const closeTimeout = setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Fermeture manuelle
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        clearTimeout(closeTimeout);
        closeNotification(notification);
    });
}

/**
 * Ferme une notification
 */
function closeNotification(notification) {
    notification.classList.remove('show');
    
    // Supprimer après l'animation
    setTimeout(() => {
        notification.remove();
    }, 300);
}

/**
 * Charge plus de logements (simulation)
 */
function loadListings() {
    const loadMoreButton = document.querySelector('.load-more-button');
    
    if (loadMoreButton) {
        loadMoreButton.addEventListener('click', function() {
            // Afficher un indicateur de chargement
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
            
            // Simuler le chargement
            setTimeout(() => {
                // Créer de nouvelles cartes de logement
                const newListings = createNewListings();
                
                // Ajouter à la grille
                const listingsGrid = document.querySelector('.listings-grid');
                listingsGrid.innerHTML += newListings;
                
                // Réinitialiser le bouton
                this.innerHTML = '<span>Afficher plus</span><i class="fas fa-chevron-down"></i>';
                
                // Réinitialiser les fonctionnalités sur les nouvelles cartes
                initializeImageGalleries();
                initializeFavorites();
                initializeAnimations();
            }, 1500);
        });
    }
}

/**
 * Crée de nouvelles cartes de logement (simulé)
 */
function createNewListings() {
    // Données fictives pour de nouveaux logements
    const listings = [
        {
            images: [
                'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            title: 'Villa moderne avec piscine',
            distance: 'À 8 500 kilomètres',
            dates: '12-18 novembre',
            price: '225 €',
            rating: '4.98'
        },
        {
            images: [
                'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1576941089067-2de3c901e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            ],
            title: 'Maison contemporaine au bord du lac',
            distance: 'À 6 320 kilomètres',
            dates: '1-8 décembre',
            price: '195 €',
            rating: '4.87'
        }
    ];
    
    // Générer le HTML
    return listings.map(listing => `
        <div class="listing-card">
            <div class="listing-gallery">
                <img src="${listing.images[0]}" alt="${listing.title}">
                <img src="${listing.images[1]}" alt="${listing.title}">
                <button class="favorite-button">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="listing-content">
                <div class="listing-header">
                    <h3 class="listing-title">${listing.title}</h3>
                    <div class="listing-rating">
                        <i class="fas fa-star"></i>
                        <span>${listing.rating}</span>
                    </div>
                </div>
                <p class="listing-distance">${listing.distance}</p>
                <p class="listing-dates">${listing.dates}</p>
                <p class="listing-price"><strong>${listing.price}</strong> par nuit</p>
            </div>
        </div>
    `).join('');
}

function initializeCategoriesNavigation() {
    const categoriesFilter = document.querySelector('.categories-filter');
    
    if (!categoriesFilter) return;
    
    // Créer les boutons de navigation
    const prevButton = document.createElement('button');
    prevButton.className = 'categories-nav-button prev';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'categories-nav-button next';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    
    // Ajouter les boutons à la section parent
    categoriesFilter.parentNode.appendChild(prevButton);
    categoriesFilter.parentNode.appendChild(nextButton);
    
    // Gérer le défilement horizontal
    prevButton.addEventListener('click', () => {
        categoriesFilter.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
    });
    
    nextButton.addEventListener('click', () => {
        categoriesFilter.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
    });
    
    // Gérer la visibilité des boutons en fonction de la position de défilement
    function updateNavButtons() {
        const isAtStart = categoriesFilter.scrollLeft === 0;
        const isAtEnd = categoriesFilter.scrollLeft + categoriesFilter.clientWidth >= categoriesFilter.scrollWidth - 5;
        
        prevButton.style.opacity = isAtStart ? '0.5' : '1';
        prevButton.style.pointerEvents = isAtStart ? 'none' : 'auto';
        
        nextButton.style.opacity = isAtEnd ? '0.5' : '1';
        nextButton.style.pointerEvents = isAtEnd ? 'none' : 'auto';
    }
    
    categoriesFilter.addEventListener('scroll', updateNavButtons);
    window.addEventListener('resize', updateNavButtons);
    
    // Initialiser l'état des boutons
    updateNavButtons();
} 
