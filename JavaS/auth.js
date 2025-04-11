// Gestion de l'authentification côté client
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si l'utilisateur est déjà connecté
    checkAuthStatus();
    
    // Gestionnaires pour les formulaires de connexion et d'inscription
    const loginForm = document.querySelector('.login-form');
    const signupForm = document.querySelector('.signup-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Gestionnaire pour la déconnexion
    const logoutBtn = document.querySelector('.logout-button');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Vérifier le statut d'authentification
async function checkAuthStatus() {
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            updateUIForGuest();
            return;
        }
        
        const response = await fetch('/api/v1/auth/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            updateUIForUser(data.data);
        } else {
            // Token invalide ou expiré
            localStorage.removeItem('token');
            updateUIForGuest();
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du statut d\'authentification:', error);
        updateUIForGuest();
    }
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();
    
    const emailInput = document.querySelector('#login-email');
    const passwordInput = document.querySelector('#login-password');
    const loginBtn = document.querySelector('#login-button');
    const errorMsg = document.querySelector('#login-error');
    
    // Valider les entrées
    if (!emailInput.value || !passwordInput.value) {
        showError(errorMsg, 'Veuillez saisir votre email et votre mot de passe');
        return;
    }
    
    try {
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: emailInput.value,
                password: passwordInput.value
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Stocker le token
            localStorage.setItem('token', data.token);
            
            // Rediriger vers la page d'accueil
            window.location.href = '/';
        } else {
            showError(errorMsg, data.error || 'Erreur de connexion');
        }
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        showError(errorMsg, 'Erreur de connexion au serveur');
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerHTML = 'Se connecter';
    }
}

// Gérer l'inscription
async function handleSignup(e) {
    e.preventDefault();
    
    const nameInput = document.querySelector('#signup-name');
    const emailInput = document.querySelector('#signup-email');
    const passwordInput = document.querySelector('#signup-password');
    const signupBtn = document.querySelector('#signup-button');
    const errorMsg = document.querySelector('#signup-error');
    
    // Valider les entrées
    if (!nameInput.value || !emailInput.value || !passwordInput.value) {
        showError(errorMsg, 'Veuillez remplir tous les champs');
        return;
    }
    
    if (passwordInput.value.length < 8) {
        showError(errorMsg, 'Le mot de passe doit contenir au moins 8 caractères');
        return;
    }
    
    try {
        signupBtn.disabled = true;
        signupBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';
        
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: nameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Stocker le token
            localStorage.setItem('token', data.token);
            
            // Rediriger vers la page d'accueil
            window.location.href = '/';
        } else {
            showError(errorMsg, data.error || 'Erreur d\'inscription');
        }
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        showError(errorMsg, 'Erreur de connexion au serveur');
    } finally {
        signupBtn.disabled = false;
        signupBtn.innerHTML = 'S\'inscrire';
    }
}

// Gérer la déconnexion
async function handleLogout() {
    try {
        const token = localStorage.getItem('token');
        
        if (token) {
            await fetch('/api/v1/auth/logout', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }
        
        // Supprimer le token et mettre à jour l'interface
        localStorage.removeItem('token');
        updateUIForGuest();
        
        // Rediriger vers la page d'accueil
        window.location.href = '/';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
    }
}

// Mettre à jour l'interface pour un utilisateur connecté
function updateUIForUser(user) {
    // Mettre à jour le menu utilisateur
    const userMenu = document.querySelector('.user-dropdown');
    const profileSection = document.querySelector('.user-profile');
    
    if (userMenu && profileSection) {
        // Remplacer le contenu du menu déroulant pour un utilisateur connecté
        userMenu.innerHTML = `
            <div class="dropdown-header">
                <div class="dropdown-welcome">
                    <h4>Bonjour, ${user.name}</h4>
                    <p>${user.email}</p>
                </div>
            </div>
            <div class="dropdown-section">
                <a href="/profile.html" class="dropdown-item">
                    <div class="item-icon"><i class="fas fa-user"></i></div>
                    <div class="item-content">
                        <span>Mon profil</span>
                    </div>
                </a>
                <a href="/reservations.html" class="dropdown-item">
                    <div class="item-icon"><i class="fas fa-calendar-check"></i></div>
                    <div class="item-content">
                        <span>Mes réservations</span>
                    </div>
                </a>
                <a href="/favorites.html" class="dropdown-item">
                    <div class="item-icon"><i class="fas fa-heart"></i></div>
                    <div class="item-content">
                        <span>Mes favoris</span>
                    </div>
                </a>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-section">
                <h6 class="dropdown-section-title">Hébergement</h6>
                <a href="/host.html" class="dropdown-item">
                    <div class="item-icon accent-red"><i class="fas fa-home"></i></div>
                    <div class="item-content">
                        <span>Héberger des voyageurs</span>
                    </div>
                </a>
                ${user.role === 'host' || user.role === 'admin' ? `
                <a href="/listings.html" class="dropdown-item">
                    <div class="item-icon accent-green"><i class="fas fa-list"></i></div>
                    <div class="item-content">
                        <span>Mes annonces</span>
                    </div>
                </a>` : ''}
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-section">
                <a href="#" class="dropdown-item logout-button">
                    <div class="item-icon"><i class="fas fa-sign-out-alt"></i></div>
                    <div class="item-content">
                        <span>Déconnexion</span>
                    </div>
                </a>
            </div>
        `;
        
        // Mettre à jour le bouton de profil
        const userButton = profileSection.querySelector('.user-profile-button');
        if (userButton) {
            userButton.innerHTML = `
                <i class="fas fa-bars"></i>
                ${user.avatar ? `<img src="${user.avatar}" alt="${user.name}" class="user-avatar">` : 
                `<i class="fas fa-user-circle"></i>`}
            `;
        }
        
        // Ajouter un gestionnaire d'événements pour la déconnexion
        const logoutBtn = document.querySelector('.logout-button');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

// Mettre à jour l'interface pour un visiteur
function updateUIForGuest() {
    // Laisser l'interface par défaut ou la modifier si nécessaire
}

// Afficher un message d'erreur
function showError(element, message) {
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        
        // Cacher le message après 5 secondes
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
} 
