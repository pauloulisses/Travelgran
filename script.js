// Travelgram - JavaScript Interativo

document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling para links internos
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animação de fade-in para cards de destinos
    const destinationCards = document.querySelectorAll('.destination-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    destinationCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Efeito de hover melhorado para botões
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Contador de viagens animado
    const tripCounters = document.querySelectorAll('.destination-meta span:last-child');
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + 'k viagens';
        }, 30);
    }
    
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counterText = entry.target.textContent;
                const number = parseInt(counterText.match(/\d+/)[0]);
                animateCounter(entry.target, number);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    tripCounters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // Navegação ativa baseada na seção visível
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#primary-menu a[href^="#"]');
    
    const navObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + currentId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { threshold: 0.3 });
    
    sections.forEach(section => {
        navObserver.observe(section);
    });

    // Modal simples para cards de destinos
    destinationCards.forEach(card => {
        card.addEventListener('click', function() {
            const destinationName = this.querySelector('h3').textContent;
            const destinationDesc = this.querySelector('p').textContent;
            const destinationImg = this.querySelector('img').src;
            
            showDestinationModal(destinationName, destinationDesc, destinationImg);
        });
    });

    function showDestinationModal(name, description, imageSrc) {
        // Criar modal
        const modal = document.createElement('div');
        modal.className = 'destination-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <img src="${imageSrc}" alt="${name}">
                    <h3>${name}</h3>
                    <p>${description}</p>
                    <div class="modal-actions">
                        <button class="btn">Ver mais detalhes</button>
                        <button class="btn btn-secondary">Adicionar aos favoritos</button>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar estilos inline para o modal
        const modalStyles = `
            <style>
                .destination-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .modal-overlay {
                    background: rgba(0, 0, 0, 0.8);
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 500px;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                }
                
                .modal-close {
                    position: absolute;
                    top: 15px;
                    right: 15px;
                    background: rgba(0, 0, 0, 0.5);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 30px;
                    height: 30px;
                    font-size: 20px;
                    cursor: pointer;
                    z-index: 1;
                }
                
                .modal-content img {
                    width: 100%;
                    height: 250px;
                    object-fit: cover;
                }
                
                .modal-content h3 {
                    padding: 20px 20px 10px;
                    margin: 0;
                    color: var(--text-color-primary);
                }
                
                .modal-content p {
                    padding: 0 20px 20px;
                    margin: 0;
                    color: var(--text-color-secondary);
                }
                
                .modal-actions {
                    padding: 0 20px 20px;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }
                
                .btn-secondary {
                    background: var(--surface-color);
                    color: var(--text-color-primary);
                }
                
                .btn-secondary:hover {
                    background: #c4c4c4;
                }
                
                @media (max-width: 768px) {
                    .modal-actions {
                        flex-direction: column;
                    }
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', modalStyles);
        document.body.appendChild(modal);
        
        // Fechar modal
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        function closeModal() {
            modal.remove();
        }
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) {
                closeModal();
            }
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    }

    // Adicionar classe ativa ao link de navegação
    const style = document.createElement('style');
    style.textContent = `
        #primary-menu a.active {
            color: var(--brand-color) !important;
            font-weight: 700;
        }
    `;
    document.head.appendChild(style);

    console.log('🚀 Travelgram carregado com sucesso!');
}); 