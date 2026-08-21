document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initPasswordGate();
    initScrollAnimations();
    initEnvelopeAndModal();
    initAssetFallbacks();
    initSmoothScroll();
    initAudioPlayer();
});

/* ==========================================================================
   AUDIO PLAYER & CONTROLS
   ========================================================================== */
function playSong() {
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle-btn');
    const btnText = document.getElementById('music-btn-text');
    const vinyl = document.getElementById('vinyl-record');

    if (bgMusic) {
        bgMusic.volume = 0.6; // Gentle romantic volume
        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    if (musicBtn) {
                        musicBtn.classList.remove('hidden', 'paused');
                        btnText.textContent = 'Music: Playing';
                    }
                    if (vinyl) vinyl.classList.remove('paused');
                })
                .catch(() => {
                    // Fallback if browser blocks autoplay
                    if (musicBtn) {
                        musicBtn.classList.remove('hidden');
                        musicBtn.classList.add('paused');
                        btnText.textContent = 'Music: Paused (Tap)';
                    }
                    if (vinyl) vinyl.classList.add('paused');
                });
        }
    }
}

function toggleSong() {
    const bgMusic = document.getElementById('bg-music');
    const musicBtn = document.getElementById('music-toggle-btn');
    const btnText = document.getElementById('music-btn-text');
    const vinyl = document.getElementById('vinyl-record');

    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play();
        if (musicBtn) {
            musicBtn.classList.remove('paused');
            btnText.textContent = 'Music: Playing';
        }
        if (vinyl) vinyl.classList.remove('paused');
    } else {
        bgMusic.pause();
        if (musicBtn) {
            musicBtn.classList.add('paused');
            btnText.textContent = 'Music: Paused';
        }
        if (vinyl) vinyl.classList.add('paused');
    }
}

function initAudioPlayer() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const turntableArea = document.getElementById('turntable-click-area');

    if (musicBtn) {
        musicBtn.addEventListener('click', toggleSong);
    }

    if (turntableArea) {
        turntableArea.addEventListener('click', toggleSong);
    }
}

/* ==========================================================================
   1. PASSWORD GATE & CINEMATIC UNLOCK
   ========================================================================== */
function initPasswordGate() {
    const gateScreen = document.getElementById('password-screen');
    const gateCard = document.querySelector('.gate-card');
    const gateForm = document.getElementById('gate-form');
    const passInput = document.getElementById('password-input');
    const toggleBtn = document.getElementById('toggle-password-btn');
    const errorMsg = document.getElementById('error-message');
    const mainContent = document.getElementById('main-content');

    if (!gateForm || !passInput) return;

    // Show/Hide password toggle
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isPassword = passInput.getAttribute('type') === 'password';
            passInput.setAttribute('type', isPassword ? 'text' : 'password');
            toggleBtn.style.color = isPassword ? 'var(--accent-pink)' : 'var(--text-dim)';
        });
    }

    const handleUnlock = () => {
        const entered = passInput.value.trim().toLowerCase();
        const target = 'i love you';

        if (entered === target) {
            if (errorMsg) errorMsg.textContent = '';

            // Trigger music
            playSong();

            if (gateScreen) gateScreen.classList.add('dissolve');
            if (mainContent) mainContent.classList.remove('hidden');

            setTimeout(() => {
                if (gateScreen) gateScreen.style.display = 'none';
                window.dispatchEvent(new Event('scroll'));
            }, 1100);

        } else {
            if (errorMsg) errorMsg.textContent = 'Not quite, my love. Try again ♥';
            if (gateCard) {
                gateCard.classList.remove('shake');
                void gateCard.offsetWidth; // Force reflow
                gateCard.classList.add('shake');
            }
            passInput.focus();
        }
    };

    gateForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUnlock();
    });
}

/* ==========================================================================
   2. AMBIENT PARTICLES (STARS & FLOATING HEARTS)
   ========================================================================== */
function initAmbientCanvas() {
    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particleCount = 45;
    const particles = [];

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.x = Math.random() * width;
            this.y = initial ? Math.random() * height : height + 20;
            this.size = Math.random() * 2 + 0.8;
            this.speedY = Math.random() * 0.4 + 0.15;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.isHeart = Math.random() > 0.8;
        }

        update() {
            this.y -= this.speedY;
            this.x += this.speedX;

            if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.fillStyle = this.isHeart
                ? `rgba(216, 129, 149, ${this.opacity * 0.7})`
                : `rgba(255, 255, 255, ${this.opacity * 0.5})`;

            if (this.isHeart) {
                ctx.translate(this.x, this.y);
                ctx.scale(this.size * 0.8, this.size * 0.8);
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(-2, -2, -4, 0, 0, 4);
                ctx.bezierCurveTo(4, 0, 2, -2, 0, 0);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   3. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollAnimations() {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: '0px 0px -40px 0px'
        }
    );

    reveals.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   4. ENVELOPE OPENING & FULLSCREEN MODAL SEQUENCE
   ========================================================================== */
function initEnvelopeAndModal() {
    const envelope = document.getElementById('envelope-wrapper');
    const openBtn = document.getElementById('open-envelope-btn');
    const modal = document.getElementById('letter-modal');
    const closeBtn = document.getElementById('close-letter-btn');
    const doneBtn = document.getElementById('letter-done-btn');
    const backdrop = document.querySelector('.letter-modal-backdrop');

    if (!envelope || !openBtn || !modal) return;

    openBtn.addEventListener('click', () => {
        envelope.classList.add('open');
        openBtn.style.opacity = '0';
        openBtn.style.pointerEvents = 'none';

        setTimeout(() => {
            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }, 700);
    });

    const closeModal = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    if (doneBtn) {
        doneBtn.addEventListener('click', () => {
            closeModal();
            const videoSection = document.getElementById('video-section');
            if (videoSection) {
                setTimeout(() => {
                    videoSection.scrollIntoView({ behavior: 'smooth' });
                }, 300);
            }
        });
    }
}

/* ==========================================================================
   5. MEDIA FALLBACKS (FIXED: NO AUTOMATIC HIDING)
   ========================================================================== */
function initAssetFallbacks() {
    const images = document.querySelectorAll('.memory-photo');
    images.forEach((img) => {
        img.classList.add('loaded');
        img.style.display = 'block';
    });

    const video = document.getElementById('anniversary-vid');
    const videoWrapper = document.querySelector('.video-outer-frame');

    if (video && videoWrapper) {
        videoWrapper.classList.add('video-loaded');
        video.style.display = 'block';
    }
}

/* ==========================================================================
   6. SMOOTH SCROLL FOR ARROWS & LINKS
   ========================================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach((link) => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}