/**
 * ATELIER VANGUARD — FRONTEND ARCHITECTURE & INTERACTIVE ENGINE
 * Features:
 * - Dual Palette Switcher (International Klein Blue <-> Acid Volt)
 * - Synthetic Web Audio Haptics & Feedback
 * - Smooth Lerped Fluid Custom Cursor
 * - Hero 3D Parallax Tilt Physics
 * - Filterable Portfolio System & Case Study Modal Engine
 * - Dynamic Scope Lab & Budget Matrix Calculator
 * - Real-Time Global Studio Clocks (Tokyo, Berlin, NY, London)
 * - Accessible Disclosure Accordions & Endorsement Carousel
 * - Toast Notification Pipeline
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SOUND SYNTHESIS ENGINE (WEB AUDIO API)
     ========================================================================== */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = false;
    }

    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggle() {
      this.init();
      this.enabled = !this.enabled;
      return this.enabled;
    }

    // Subtle tactile tick for button hover / click
    playTick(frequency = 1200, duration = 0.03) {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + duration);

        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Fallback silently if audio fails
      }
    }

    // Warm chord chime for project opening or brief transmission
    playChime() {
      if (!this.enabled || !this.ctx) return;
      try {
        const freqs = [440, 554.37, 659.25, 880];
        freqs.forEach((freq, i) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, this.ctx.currentTime + i * 0.05);

          gain.gain.setValueAtTime(0.03, this.ctx.currentTime + i * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.6);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(this.ctx.currentTime + i * 0.05);
          osc.stop(this.ctx.currentTime + i * 0.05 + 0.6);
        });
      } catch (e) {}
    }
  }

  const sound = new SoundEngine();

  // Audio Toggle UI
  const audioToggleBtn = document.getElementById('audioToggleBtn');
  const audioStatusLabel = document.getElementById('audioStatusLabel');

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      const active = sound.toggle();
      audioToggleBtn.classList.toggle('active', active);
      audioStatusLabel.textContent = active ? 'SOUND ON' : 'SOUND OFF';
      if (active) sound.playChime();
    });
  }

  /* ==========================================================================
     2. ACCENT PALETTE CONTROLLER (KLEIN BLUE <-> ACID VOLT)
     ========================================================================== */
  const accentToggleBtn = document.getElementById('accentToggleBtn');
  const paletteLabel = document.getElementById('paletteLabel');
  const rootHtml = document.documentElement;

  // Retrieve saved preference or default to klein
  const savedAccent = localStorage.getItem('vanguard_accent') || 'klein';
  setAccent(savedAccent);

  if (accentToggleBtn) {
    accentToggleBtn.addEventListener('click', () => {
      const current = rootHtml.getAttribute('data-accent') || 'klein';
      const next = current === 'klein' ? 'volt' : 'klein';
      setAccent(next);
      sound.playTick(1600, 0.05);
      showToast(`Palette switched to ${next === 'volt' ? 'Acid Volt' : 'International Klein Blue'}`);
    });
  }

  function setAccent(accent) {
    rootHtml.setAttribute('data-accent', accent);
    localStorage.setItem('vanguard_accent', accent);
    if (paletteLabel) {
      paletteLabel.textContent = accent === 'volt' ? 'ACID VOLT' : 'KLEIN';
    }
  }

  /* ==========================================================================
     3. SMOOTH CUSTOM CURSOR
     ========================================================================== */
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');

  if (cursorDot && cursorRing && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    });

    // Lerp loop for smooth elastic trailing ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    // Hover state expansion over interactables
    const hoverTargets = 'a, button, input, textarea, .project-card, .service-pill-btn, .radio-card, .addon-item, .accordion-trigger';
    document.querySelectorAll(hoverTargets).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('cursor-hover');
        sound.playTick(900, 0.02);
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('cursor-hover');
      });
    });
  }

  /* ==========================================================================
     4. HERO 3D PARALLAX TILT
     ========================================================================== */
  const heroCard = document.getElementById('heroParallaxCard');
  if (heroCard) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const tiltX = (y / (rect.height / 2)) * -8;
      const tiltY = (x / (rect.width / 2)) * 8;

      heroCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  /* ==========================================================================
     5. HEADER SCROLL STATE & MOBILE MENU DRAWER
     ========================================================================== */
  const siteHeader = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
      sound.playTick(isOpen ? 1200 : 800, 0.04);
    });

    // Close mobile drawer when clicking any link inside
    mobileDrawer.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ==========================================================================
     6. PORTFOLIO FILTERING SYSTEM
     ========================================================================== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');
      sound.playTick(1400, 0.03);

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  /* ==========================================================================
     7. CASE STUDY MODAL ENGINE
     ========================================================================== */
  const caseStudyModal = document.getElementById('caseStudyModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  // Case Study Detailed Database
  const caseStudiesData = {
    auralis: {
      client: "AURALIS LABS × TEENAGE ENGINEERING",
      title: "Auralis Alpha: Tactile Acoustic Hardware",
      img: "assets/images/case-spatial-audio.jpg",
      challenge: "Synthesize raw analog vacuum-tube warmth with frosted-glass digital haptics.",
      timeline: "14 Weeks Commission",
      lift: "+240% Pre-Order Velocity",
      brief: "Auralis challenged Vanguard to engineer a benchmark spatial amplifier. We developed a custom frosted-glass chassis, precision machined titanium detents with variable magnetic resistance, and an illuminated OLED status glyph that mirrors audio wave resonance in real-time.",
      tech: "Embedded firmware interaction design, WebGL 3D configuration engine, real-time audio FFT spectrum visualizer, physical glass refraction simulation.",
      deliverables: [
        "✦ Custom Industrial Form Factor & CMF",
        "✦ Micro-Haptic Detent Engineering",
        "✦ Real-Time WebGL 3D Launch Experience",
        "✦ Global Monograph & Editorial Packaging"
      ]
    },
    polestar: {
      client: "POLESTAR PERFORMANCE EV",
      title: "Synapse OS: Autonomous Cockpit & Spatial HUD",
      img: "assets/images/case-mobility-cockpit.jpg",
      challenge: "Eliminate driver cognitive fatigue across continuous 120-mph autonomous cruising.",
      timeline: "20 Weeks Deep Immersion",
      lift: "0.2s Glance Reaction Time",
      brief: "Synapse OS redefines the in-cockpit luxury mobility experience. By harmonizing curved ultra-wide OLED panels with ambient Scandinavian indirect illumination, the interface proactively surfaces only mission-critical navigational and sensory telemetry when the driver requires it.",
      tech: "Automotive Linux QT architecture, glanceable micro-typography hierarchy, eye-tracking sensor integration, contextual ambient LED color synchronization.",
      deliverables: [
        "✦ Autonomous Driving HUD & Instrument Suite",
        "✦ Contextual Ambient Illumination Protocol",
        "✦ Driver Cognitive Load Benchmark Testing",
        "✦ In-Vehicle Touch & Voice Interaction Physics"
      ]
    },
    monolith: {
      client: "VENICE BIENNALE ARCHITETTURA",
      title: "Monolith Pillars: Light & Mass Dialogue",
      img: "assets/images/case-editorial-installation.jpg",
      challenge: "Transform brutalist cast concrete pillars through real-time visitor biometric resonance.",
      timeline: "10 Weeks Installation Sprint",
      lift: "480,000+ Active Interactions",
      brief: "Selected for the Venice Architecture Biennale, Monolith Pillars stands as an architectural meditation on permanence and ephemerality. Ten cast-concrete monoliths house vertical LED conduits that pulse with generative blue and alabaster illumination in response to foot traffic and ambient crowd acoustics.",
      tech: "LIDAR spatial tracking, Raspberry Pi embedded LED controllers, generative GLSL shader algorithm, spatial multichannel soundscape.",
      deliverables: [
        "✦ 10× Architectural Concrete Monoliths",
        "✦ Real-Time LIDAR Crowd Interaction Engine",
        "✦ Generative Ambient Soundscape Composition",
        "✦ Curatorial Exhibition Monograph"
      ]
    },
    chromaflow: {
      client: "NOTHING TECH × KINETIC LABS",
      title: "Chromaflow: Spatial Design System",
      img: "assets/images/hero-sculpture.jpg",
      challenge: "Pioneer a fluid volumetric design token system for next-gen spatial computing headsets.",
      timeline: "12 Weeks Sprint",
      lift: "120 FPS Sub-Millisecond Physics",
      brief: "Chromaflow is an architectural design language built specifically for spatial depth. Departing from flat mobile skeumorphism, Chromaflow uses liquid chrome specular highlights, refractive glass surfaces, and responsive micro-haptics to create UI controls that feel physically tangible in mid-air.",
      tech: "Three.js / WebGPU shaders, physical spring dynamics, spatial audio UI tokens, cross-platform component library.",
      deliverables: [
        "✦ Volumetric Spatial Component Library",
        "✦ 40+ Custom GLSL Shaders & Glass Presets",
        "✦ Micro-Haptic Audio Sound Library",
        "✦ Developer Documentation & Sandbox"
      ]
    }
  };

  // Open Modal
  projectCards.forEach(card => {
    card.addEventListener('click', () => {
      const pid = card.getAttribute('data-project-id');
      const data = caseStudiesData[pid];
      if (!data) return;

      document.getElementById('modalCoverImg').src = data.img;
      document.getElementById('modalClient').textContent = data.client;
      document.getElementById('modalProjectTitle').textContent = data.title;
      document.getElementById('modalChallenge').textContent = data.challenge;
      document.getElementById('modalTimeline').textContent = data.timeline;
      document.getElementById('modalLift').textContent = data.lift;
      document.getElementById('modalBriefText').textContent = data.brief;
      document.getElementById('modalTechText').textContent = data.tech;

      const deliverablesUl = document.getElementById('modalDeliverables');
      deliverablesUl.innerHTML = '';
      data.deliverables.forEach(d => {
        const li = document.createElement('li');
        li.textContent = d;
        deliverablesUl.appendChild(li);
      });

      caseStudyModal.classList.add('open');
      caseStudyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      sound.playChime();
    });
  });

  // Close Modal
  function closeModal() {
    if (caseStudyModal && caseStudyModal.classList.contains('open')) {
      caseStudyModal.classList.remove('open');
      caseStudyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      sound.playTick(800, 0.03);
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Commission button inside modal
  const modalCommissionBtn = document.getElementById('modalCommissionBtn');
  if (modalCommissionBtn) {
    modalCommissionBtn.addEventListener('click', () => {
      closeModal();
    });
  }

  /* ==========================================================================
     8. REAL-TIME GLOBAL STUDIO CLOCKS
     ========================================================================== */
  function updateStudioClocks() {
    const timezones = {
      clockTokyo: { tz: 'Asia/Tokyo', code: 'JST' },
      clockBerlin: { tz: 'Europe/Berlin', code: 'CEST' },
      clockNewYork: { tz: 'America/New_York', code: 'EDT' },
      clockLondon: { tz: 'Europe/London', code: 'BST' }
    };

    const now = new Date();

    for (const [id, config] of Object.entries(timezones)) {
      const el = document.getElementById(id);
      if (el) {
        try {
          const formatter = new Intl.DateTimeFormat('en-GB', {
            timeZone: config.tz,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          });
          el.textContent = `${formatter.format(now)} ${config.code}`;
        } catch (e) {
          el.textContent = `${now.toTimeString().split(' ')[0]} ${config.code}`;
        }
      }
    }
  }

  updateStudioClocks();
  setInterval(updateStudioClocks, 1000);

  /* ==========================================================================
     9. INTERACTIVE SCOPE LAB & BUDGET ESTIMATOR
     ========================================================================== */
  let currentBasePrice = 45000;
  let currentBaseWeeks = 8;
  let currentVelocityMultiplier = 1.0;
  let currentDisciplineName = "Flagship Web Experience";
  let currentSquad = "1 Creative Dir, 2 Tech Architects, 1 3D Artist";

  const squadConfigs = {
    flagship: "1 Creative Dir, 2 Tech Architects, 1 3D Artist",
    spatial: "1 Spatial Director, 2 Hardware/Haptic Engineers, 1 GLSL Specialist",
    brand: "1 Brand Strategy Partner, 1 Type Designer, 1 Motion Lead",
    venture: "Full Vanguard Squad (6 Principal Specialists & Creative Director)"
  };

  const serviceButtons = document.querySelectorAll('.service-pill-btn');
  const velocityRadios = document.querySelectorAll('input[name="velocity"]');
  const addonCheckboxes = document.querySelectorAll('.addon-check');

  const calcPriceDisplay = document.getElementById('calcPriceDisplay');
  const calcTimelineDisplay = document.getElementById('calcTimelineDisplay');
  const summaryDiscipline = document.getElementById('summaryDiscipline');
  const summarySquad = document.getElementById('summarySquad');

  // Service Selection
  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const service = btn.getAttribute('data-service');
      currentBasePrice = parseInt(btn.getAttribute('data-base-price'), 10);
      currentBaseWeeks = parseInt(btn.getAttribute('data-weeks'), 10);
      currentDisciplineName = btn.querySelector('.pill-title').textContent;
      currentSquad = squadConfigs[service] || squadConfigs.flagship;

      sound.playTick(1300, 0.04);
      calculateEstimates();
    });
  });

  // Velocity Selection
  velocityRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.radio-card').forEach(c => c.classList.remove('active'));
      radio.closest('.radio-card').classList.add('active');
      currentVelocityMultiplier = radio.value === 'accelerated' ? 1.25 : 1.0;
      sound.playTick(1100, 0.03);
      calculateEstimates();
    });
  });

  // Addon Checkbox toggles
  addonCheckboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      sound.playTick(chk.checked ? 1500 : 700, 0.03);
      calculateEstimates();
    });
  });

  function calculateEstimates() {
    let totalAddons = 0;
    addonCheckboxes.forEach(chk => {
      if (chk.checked) {
        totalAddons += parseInt(chk.getAttribute('data-addon-price'), 10);
      }
    });

    const finalPrice = Math.round((currentBasePrice + totalAddons) * currentVelocityMultiplier);
    const finalWeeks = currentVelocityMultiplier > 1 ? Math.max(4, Math.round(currentBaseWeeks * 0.75)) : currentBaseWeeks;

    // Smooth counter animation effect
    if (calcPriceDisplay) {
      animateValue(calcPriceDisplay, finalPrice);
    }
    if (calcTimelineDisplay) {
      calcTimelineDisplay.textContent = `${finalWeeks} WEEKS`;
    }
    if (summaryDiscipline) {
      summaryDiscipline.textContent = currentDisciplineName;
    }
    if (summarySquad) {
      summarySquad.textContent = currentSquad;
    }
  }

  function animateValue(element, target) {
    const formatted = target.toLocaleString('en-US');
    element.textContent = formatted;
  }

  // Handle Project Brief Submission Form
  const scopeInquiryForm = document.getElementById('scopeInquiryForm');
  const formFeedback = document.getElementById('formFeedback');

  if (scopeInquiryForm) {
    scopeInquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const message = document.getElementById('clientMessage').value.trim();

      if (!name || !email) {
        formFeedback.className = 'form-feedback error';
        formFeedback.textContent = 'Please provide both your name and corporate email.';
        return;
      }

      formFeedback.className = 'form-feedback success';
      formFeedback.textContent = `Transmission received, ${name}. Our Executive Director will contact you within 24 hours.`;
      sound.playChime();
      showToast('Brief successfully transmitted to Atelier Vanguard!');

      scopeInquiryForm.reset();
      setTimeout(() => {
        formFeedback.textContent = '';
      }, 7000);
    });
  }

  /* ==========================================================================
     10. GLOBAL HONORS ACCORDION
     ========================================================================== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      accordionItems.forEach(i => {
        i.classList.remove('active');
        const trig = i.querySelector('.accordion-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });

      if (!isAlreadyActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        sound.playTick(1200, 0.03);
      } else {
        sound.playTick(800, 0.02);
      }
    });
  });

  /* ==========================================================================
     11. TESTIMONIALS CAROUSEL
     ========================================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonialPrevBtn');
  const nextBtn = document.getElementById('testimonialNextBtn');
  const counterEl = document.getElementById('testimonialCounter');
  let currentSlide = 0;

  function updateCarousel(index) {
    slides.forEach((s, i) => {
      s.classList.toggle('active', i === index);
    });
    if (counterEl) {
      counterEl.textContent = `0${index + 1} / 0${slides.length}`;
    }
  }

  if (prevBtn && nextBtn && slides.length > 0) {
    prevBtn.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      updateCarousel(currentSlide);
      sound.playTick(1000, 0.02);
    });

    nextBtn.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      updateCarousel(currentSlide);
      sound.playTick(1200, 0.02);
    });
  }

  /* ==========================================================================
     12. NEWSLETTER SUBSCRIPTION & FOOTER
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  const newsletterFeedback = document.getElementById('newsletterFeedback');

  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletterEmail');
      const email = emailInput.value.trim();

      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newsletterFeedback.className = 'newsletter-feedback success';
        newsletterFeedback.textContent = 'Subscribed to Vanguard Monograph Dispatch.';
        emailInput.value = '';
        sound.playChime();
        showToast('Subscribed to quarterly monograph!');
        setTimeout(() => {
          newsletterFeedback.textContent = '';
        }, 5000);
      } else {
        newsletterFeedback.className = 'newsletter-feedback error';
        newsletterFeedback.textContent = 'Please enter a valid email address.';
      }
    });
  }

  // Back to top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      sound.playTick(1500, 0.04);
    });
  }

  /* ==========================================================================
     13. TOAST NOTIFICATION PIPELINE
     ========================================================================== */
  function showToast(msg) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">✦</span>
      <span class="toast-text">${msg}</span>
    `;

    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

});
