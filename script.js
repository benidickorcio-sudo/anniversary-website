document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initPasswordGate();
    initScrollAnimations();
    initEnvelopeAndModal();
    initAssetFallbacks();
    initSmoothScroll();
    initAudioSystem();
    initScrapbookMemoryAlbum();
});

/* ==========================================================================
   AUDIO PLAYER & SOUND CONTROLS
   ========================================================================== */
let lastVolume = 0.6;

function setAudioVolume(level) {
    const bgMusic = document.getElementById('bg-music');
    const floatingVol = document.getElementById('floating-vol-slider');
    const deckVol = document.getElementById('deck-vol-slider');
    const volBadge = document.getElementById('volume-percent');
    const speakerBtn = document.getElementById('quick-mute-btn');

    const vol = Math.max(0, Math.min(1, parseFloat(level)));

    if (bgMusic) bgMusic.volume = vol;
    if (floatingVol) floatingVol.value = vol;
    if (deckVol) deckVol.value = vol;
    if (volBadge) volBadge.textContent = `${Math.round(vol * 100)}%`;

    if (speakerBtn) {
        if (vol === 0) {
            speakerBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <line x1="23" y1="9" x2="17" y2="15"></line>
                    <line x1="17" y1="9" x2="23" y2="15"></line>
                </svg>`;
        } else {
            speakerBtn.innerHTML = `
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                </svg>`;
        }
    }
}

function playSong() {
    const bgMusic = document.getElementById('bg-music');
    const floatingBar = document.getElementById('music-floating-widget');
    const btnText = document.getElementById('music-btn-text');
    const vinyl = document.getElementById('vinyl-record');
    const turntableArm = document.getElementById('turntable-arm');

    if (bgMusic) {
        setAudioVolume(bgMusic.volume || 0.6);
        const playPromise = bgMusic.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    if (floatingBar) {
                        floatingBar.classList.remove('hidden', 'paused');
                        btnText.textContent = 'Playing';
                    }
                    if (vinyl) vinyl.classList.remove('paused');
                    if (turntableArm) turntableArm.classList.remove('paused');
                })
                .catch(() => {
                    if (floatingBar) {
                        floatingBar.classList.remove('hidden');
                        floatingBar.classList.add('paused');
                        btnText.textContent = 'Paused';
                    }
                    if (vinyl) vinyl.classList.add('paused');
                    if (turntableArm) turntableArm.classList.add('paused');
                });
        }
    }
}

function toggleSong() {
    const bgMusic = document.getElementById('bg-music');
    const floatingBar = document.getElementById('music-floating-widget');
    const btnText = document.getElementById('music-btn-text');
    const vinyl = document.getElementById('vinyl-record');
    const turntableArm = document.getElementById('turntable-arm');

    if (!bgMusic) return;

    if (bgMusic.paused) {
        bgMusic.play();
        if (floatingBar) {
            floatingBar.classList.remove('paused');
            btnText.textContent = 'Playing';
        }
        if (vinyl) vinyl.classList.remove('paused');
        if (turntableArm) turntableArm.classList.remove('paused');
    } else {
        bgMusic.pause();
        if (floatingBar) {
            floatingBar.classList.add('paused');
            btnText.textContent = 'Paused';
        }
        if (vinyl) vinyl.classList.add('paused');
        if (turntableArm) turntableArm.classList.add('paused');
    }
}

function initAudioSystem() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const turntableArea = document.getElementById('turntable-click-area');
    const floatingVol = document.getElementById('floating-vol-slider');
    const deckVol = document.getElementById('deck-vol-slider');
    const muteBtn = document.getElementById('quick-mute-btn');
    const bgMusic = document.getElementById('bg-music');

    if (musicBtn) musicBtn.addEventListener('click', toggleSong);
    if (turntableArea) turntableArea.addEventListener('click', toggleSong);

    const onVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        if (val > 0) lastVolume = val;
        setAudioVolume(val);
    };

    if (floatingVol) floatingVol.addEventListener('input', onVolumeChange);
    if (deckVol) deckVol.addEventListener('input', onVolumeChange);

    if (muteBtn) {
        muteBtn.addEventListener('click', () => {
            if (!bgMusic) return;
            if (bgMusic.volume > 0) {
                lastVolume = bgMusic.volume;
                setAudioVolume(0);
            } else {
                setAudioVolume(lastVolume || 0.6);
            }
        });
    }
}

/* ==========================================================================
   1. PASSWORD GATE & CINEMATIC UNLOCK
   ========================================================================= */
function initPasswordGate() {
    const gateScreen = document.getElementById('password-screen');
    const gateCard = document.querySelector('.gate-card');
    const gateForm = document.getElementById('gate-form');
    const passInput = document.getElementById('password-input');
    const toggleBtn = document.getElementById('toggle-password-btn');
    const errorMsg = document.getElementById('error-message');
    const mainContent = document.getElementById('main-content');

    if (!gateForm || !passInput) return;

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
                void gateCard.offsetWidth;
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
   4. INTERACTIVE 3D MEMORY BOOK (30 MEMORIES)
   ========================================================================== */
function initScrapbookMemoryAlbum() {
    const openBtn = document.getElementById('open-book-btn');
    const closeBtn = document.getElementById('close-book-btn');
    const closedCover = document.querySelector('.closed-cover');
    const closedView = document.getElementById('closed-book-view');
    const openedView = document.getElementById('opened-book-view');
    const memoriesSection = document.getElementById('memories');
    const nextBtn = document.getElementById('next-memory-btn');
    const prevBtn = document.getElementById('prev-memory-btn');
    const activePage = document.getElementById('active-album-page');
    const photoEl = document.getElementById('current-book-photo');
    const badgeEl = document.getElementById('memory-badge');
    const captionEl = document.getElementById('memory-caption-text');
    const pageNumRight = document.getElementById('page-number-right');
    const pageNumLeft = document.getElementById('page-number-left');
    const progressEl = document.getElementById('current-page-num');
    const leftQuote = document.getElementById('page-left-quote');

    if (!openedView || !closedView || !photoEl) return;

    // 30 Memories Data Array
    const memories = [
        { photo: 'assets/photo1.jpg', caption: 'Really love this pic, ang cute natin^^', quote: ' basta may drill that time, we so cute ^^' },
        { photo: 'assets/photo2.jpg', caption: 'OUR FIRST PICTURE TOGETHER, MASK ERA KO HAHAHA', quote: 'the first picture we have as a puppy lovers' },
        { photo: 'assets/photo3.jpg', caption: 'OUR FIRST HIKING WE LOOOK CUTE COUPLE HERE ANG CINEMATIC NIYA', quote: 'one of the best memory we have, next time sa mas mahirap naman ah ^^' },
        { photo: 'assets/photo4.jpg', caption: 'FOR ME THIS IS THE SWEETEST PICTURE THAT WE HAVE', quote: 'I really love kissing your cheeks ang cute kasi e hehe chubby cheeeks' },
        { photo: 'assets/photo5.jpg', caption: 'Another sweet core memory with my favorite person ♥', quote: 'ur just so simply pretty love' },
        { photo: 'assets/photo6.jpg', caption: 'di nahagip wahhh✨', quote: 'cute mo dito tho' },
        { photo: 'assets/photo7.jpg', caption: 'Your smile is still my favorite.', quote: 'see ur so cute and I will love that cuteness of yours' },
        { photo: 'assets/photo8.jpg', caption: 'I really miss our shs days, especially kapag kasama kita pauwi sainyo ^^', quote: 'yey our graduation day' },
        { photo: 'assets/photo9.jpg', caption: 'kinuha ko talaga yung mga medj epic tayo kasi feeling ko mas genuine tignan hehe', quote: 'You are my happiest thought every day.' },
        { photo: 'assets/photo10.jpg', caption: 'angas ko lang kaya ko nilagay mwehehe', quote: 'I dont really remember pasaan tayo neto' },
        { photo: 'assets/photo11.jpg', caption: 'Thank you for being my constant comfort and peace.', quote: 'I love this pic, ang gaan sa pakiramdam' },
        { photo: 'assets/photo12.jpg', caption: 'Cutie moments that I will always cherish.', quote: 'shs days, first time dagat natin tas may video na nagkiss?' },
        { photo: 'assets/photo13.jpg', caption: 'pero masaya naman diba?', quote: 'the our dating spot kasi di legal hahaha' },
        { photo: 'assets/photo14.jpg', caption: 'You make every ordinary moment feel special.', quote: 'kissing u is my favorite thing to do' },
        { photo: 'assets/photo15.jpg', caption: 'hays diko maayos to huhu, but ang cute natin here', quote: 'In your hands, I found my world.' },
        { photo: 'assets/photo16.jpg', caption: 'Every smile of yours is pure magic to me.', quote: 'remeber this? first photoshoot ko kasama ka' },
        { photo: 'assets/photo17.jpg', caption: 'I would say first simple hike or get to know my fam? ', quote: 'sa balayan to e, ang cute lang nakakamiss kasi ang saya natin' },
        { photo: 'assets/photo18.jpg', caption: 'Another unforgettable chapter of our story, ganda mo e.', quote: 'the graduation photoshoot' },
        { photo: 'assets/photo19.jpg', caption: 'Ang ganda mo palagi, inside and out baby.', quote: 'The most beautiful soul I have ever known.' },
        { photo: 'assets/photo20.jpg', caption: 'Making each other laugh even on tough days.', quote: 'You are my safe place baby' },
        { photo: 'assets/photo21.jpg', caption: 'Core memories that keep us strong through distance.', quote: 'favorite dating fast food ba natin ang mcdo? wala pa ako nakikita na jabi e HAHAHA' },
        { photo: 'assets/photo22.jpg', caption: 'Our cute little selfies ^^', quote: 'damn youre so pretty here talaga ' },
        { photo: 'assets/photo23.jpg', caption: 'A sweet afternoon spent just being with you.', quote: 'happenings tuwing lunch sa school shs days kamiss' },
        { photo: 'assets/photo24.jpg', caption: 'I will always choose you, no matter what.', quote: 'In every universe, I will find you.' },
        { photo: 'assets/photo25.jpg', caption: 'Our quiet shared moments together, dolomite beachh.', quote: 'the so damn fitted pants of mine :<' },
        { photo: 'assets/photo26.jpg', caption: 'Thank you for all the patience, love, and care.', quote: 'You deserve all the gentleness in this world.' },
        { photo: 'assets/photo27.jpg', caption: 'Can’t wait for all the future memories we will make.', quote: 'The best chapters are still ahead of us.' },
        { photo: 'assets/photo28.jpg', caption: 'Always my favorite view in every crowd.', quote: 'You are the only one my eyes search for.' },
        { photo: 'assets/photo29.jpg', caption: 'My partner in everything, my love.', quote: 'Thank you for walking this road with me.' },
        { photo: 'assets/photo30.jpg', caption: 'The day you said, boyfriend mo na ako ahhhhh, I REALLY LOVE YOU SO MUCH MY LOVE', quote: 'Happy Anniversary, my Lolly. I love you.' }
    ];

    let currentIndex = 0;
    let isFlipping = false;

    // Web Audio API Page-Flip Sound
    const playFlipSound = () => {
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(140, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.12);

            gain.gain.setValueAtTime(0.08, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.13);
        } catch (e) {
            // Silently fallback if audio context is blocked
        }
    };

    // Render Page Content
    const renderMemory = (index) => {
        const item = memories[index];
        const formattedNum = String(index + 1).padStart(2, '0');

        photoEl.src = item.photo;
        photoEl.alt = `Memory ${formattedNum}`;
        if (badgeEl) badgeEl.textContent = `Memory ${formattedNum} / 30`;
        if (captionEl) captionEl.textContent = item.caption;

        if (pageNumRight) pageNumRight.textContent = formattedNum;
        if (pageNumLeft) pageNumLeft.textContent = formattedNum;
        if (progressEl) progressEl.textContent = formattedNum;
        if (leftQuote) leftQuote.textContent = `"${item.quote}"`;

        // Image fallback handler
        photoEl.onerror = () => {
            const fallbackIndex = (index % 6) + 1;
            photoEl.src = `assets/photo${fallbackIndex}.jpg`;
        };
    };

    // Open Book
    const handleOpenBook = () => {
        playFlipSound();
        closedView.classList.add('is-opening');

        if (memoriesSection) {
            memoriesSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        setTimeout(() => {
            renderMemory(0);
            openedView.classList.add('visible-spread');
            currentIndex = 0;
        }, 420);
    };

    // Close Book
    const handleCloseBook = () => {
        playFlipSound();
        openedView.classList.remove('visible-spread');

        setTimeout(() => {
            closedView.classList.remove('is-opening');
            currentIndex = 0;
        }, 420);
    };

    if (openBtn) openBtn.addEventListener('click', handleOpenBook);
    if (closedCover) closedCover.addEventListener('click', handleOpenBook);
    if (closeBtn) closeBtn.addEventListener('click', handleCloseBook);

    // Turn Page Function
    const flipPage = (direction) => {
        if (isFlipping) return;
        isFlipping = true;
        playFlipSound();

        let nextIndex = currentIndex;
        if (direction === 'next') {
            nextIndex = (currentIndex + 1) % memories.length;
            if (activePage) activePage.classList.add('flipping-next');
        } else {
            nextIndex = (currentIndex - 1 + memories.length) % memories.length;
            if (activePage) activePage.classList.add('flipping-prev');
        }

        setTimeout(() => {
            renderMemory(nextIndex);
            currentIndex = nextIndex;
        }, 360);

        setTimeout(() => {
            if (activePage) activePage.classList.remove('flipping-next', 'flipping-prev');
            isFlipping = false;
        }, 750);
    };

    if (nextBtn) nextBtn.addEventListener('click', () => flipPage('next'));
    if (prevBtn) prevBtn.addEventListener('click', () => flipPage('prev'));

    // Keyboard Arrow Keys & ESC support
    document.addEventListener('keydown', (e) => {
        if (!openedView.classList.contains('visible-spread')) return;
        if (e.key === 'ArrowRight') flipPage('next');
        if (e.key === 'ArrowLeft') flipPage('prev');
        if (e.key === 'Escape') handleCloseBook();
    });

    // Mobile Touch Swipe Support
    let touchStartX = 0;
    let touchEndX = 0;
    const albumBook = document.getElementById('album-book');
    if (albumBook) {
        albumBook.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        albumBook.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 45) {
                flipPage('next');
            } else if (touchEndX - touchStartX > 45) {
                flipPage('prev');
            }
        }, { passive: true });
    }
}

/* ==========================================================================
   5. ENVELOPE OPENING & FULLSCREEN MODAL SEQUENCE (WITH RE-OPEN SUPPORT)
   ========================================================================== */
function initEnvelopeAndModal() {
    const envelope = document.getElementById('envelope-wrapper');
    const openBtn = document.getElementById('open-envelope-btn');
    const reopenBtn = document.getElementById('reopen-letter-btn');
    const modal = document.getElementById('letter-modal');
    const closeBtn = document.getElementById('close-letter-btn');
    const doneBtn = document.getElementById('letter-done-btn');
    const backdrop = document.querySelector('.letter-modal-backdrop');

    if (!envelope || !modal) return;

    // Show letter modal
    const showModal = () => {
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    // First time opening envelope
    if (openBtn) {
        openBtn.addEventListener('click', () => {
            envelope.classList.add('open');
            openBtn.classList.add('hidden');
            if (reopenBtn) reopenBtn.classList.remove('hidden');

            setTimeout(() => {
                showModal();
            }, 700);
        });
    }

    // Re-opening letter after it has already been opened
    if (reopenBtn) {
        reopenBtn.addEventListener('click', () => {
            showModal();
        });
    }

    // Close letter modal
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
   6. MEDIA FALLBACKS
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
   7. SMOOTH SCROLL FOR ARROWS & LINKS
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