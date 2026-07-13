(() => {
  'use strict';

  const locale = document.documentElement.lang.toLowerCase().startsWith('en') ? 'en' : 'zh';

  const i18n = {
    zh: {
      challengeRefreshed: '验证题已刷新',
      formDisabled: '留言功能暂未启用',
      formDisabledTitle: '请先配置飞书公开接收地址',
      formDisabledError: '留言功能暂未启用，请通过电话或邮箱联系我们',
      submitLoading: '提交中...',
      submitDefault: '提交信息',
      submitSuccess: '提交成功！我们会尽快与您联系',
      submitUnknown: '信息已发送，请留意后续回复',
      submitFailed: '提交失败，请稍后重试',
      nameRequired: '请输入您的姓名',
      phoneInvalid: '请输入有效的11位手机号码',
      emailInvalid: '请输入有效的邮箱地址',
      verificationInvalid: '验证答案不正确，请重新输入',
      selected: '已选择：',
      inquiryPrefix: '我对 ',
      inquirySuffix: ' 感兴趣，想了解更多信息。',
      source: 'damiin-website'
    },
    en: {
      challengeRefreshed: 'Verification refreshed',
      formDisabled: 'Online inquiry is not enabled',
      formDisabledTitle: 'Please configure the Feishu public receiving URL first',
      formDisabledError: 'Online inquiry is not enabled yet. Please contact us by phone or email.',
      submitLoading: 'Submitting...',
      submitDefault: 'Submit',
      submitSuccess: 'Submitted successfully. We will contact you soon.',
      submitUnknown: 'Your inquiry has been sent. Please watch for our reply.',
      submitFailed: 'Submission failed. Please try again later.',
      nameRequired: 'Please enter your name',
      phoneInvalid: 'Please enter a valid 11-digit mobile number',
      emailInvalid: 'Please enter a valid email address',
      verificationInvalid: 'Verification answer is incorrect. Please try again.',
      selected: 'Selected: ',
      inquiryPrefix: 'I am interested in ',
      inquirySuffix: ' and would like to learn more.',
      source: 'damiin-website-en'
    }
  }[locale];

  // Configure this with a public Feishu automation/webhook URL.
  // Do not put Feishu App Secret or tenant access tokens in front-end code.
  const FEISHU_FORM_ENDPOINT = '';
  const FEISHU_REQUEST_MODE = 'cors';
  const FEISHU_FIELD_MAP = {
    name: '姓名',
    phone: '电话',
    email: '邮箱',
    message: '留言内容'
  };

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const byId = (id) => document.getElementById(id);

  function setButtonContent(button, iconClass, text) {
    if (!button) return;
    button.replaceChildren();
    const icon = document.createElement('i');
    icon.className = iconClass;
    const label = document.createElement('span');
    label.textContent = text;
    button.append(icon, label);
  }

  function showToast(message, type = 'info', duration = 3000) {
    const container = byId('toastContainer');
    if (!container) return;

    const iconClasses = {
      success: 'fas fa-check-circle text-green-500 text-xl',
      error: 'fas fa-times-circle text-red-500 text-xl',
      warning: 'fas fa-exclamation-circle text-yellow-500 text-xl',
      info: 'fas fa-info-circle text-blue-500 text-xl'
    };

    const toast = document.createElement('div');
    toast.className = 'toast ' + type;

    const icon = document.createElement('i');
    icon.className = iconClasses[type] || iconClasses.info;

    const label = document.createElement('span');
    label.className = 'text-gray800 text-sm font-medium';
    label.textContent = message;

    toast.append(icon, label);
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  function hideLoader() {
    byId('pageLoader')?.classList.add('hidden');
  }

  function initMotion() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (window.AOS && !prefersReducedMotion) {
      window.AOS.init({ duration: 800, once: true, offset: 80, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' });
      return;
    }

    if (prefersReducedMotion) {
      $$('[data-aos]').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
    }
  }

  function animateCounters() {
    const counters = $$('.counter-value');
    if (!counters.length) return;

    counters.forEach((counter) => {
      const target = Number.parseInt(counter.getAttribute('data-target'), 10);
      if (!Number.isFinite(target)) return;

      const duration = 2000;
      const step = target / (duration / 16);
      let current = 0;

      const updateCounter = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current) + '+';
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + '+';
        }
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateCounter();
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }

  function initNavbar() {
    const navbar = byId('navbar');
    const scrollProgress = byId('scrollProgress');
    const backToTop = byId('backToTop');
    const sections = $$('section[id]');
    const navLinks = $$('nav a[href^="#"]');
    let ticking = false;

    const update = () => {
      const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;

      navbar?.classList.toggle('nav-scrolled', window.scrollY > 50);
      if (scrollProgress) scrollProgress.style.width = scrolled + '%';
      backToTop?.classList.toggle('visible', winScroll > 500);

      let current = '';
      sections.forEach((section) => {
        if (scrollY >= section.offsetTop - 100) current = section.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle('text-primary', link.getAttribute('href') === '#' + current);
      });

      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });

    backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    update();
  }

  function initMobileMenu() {
    const menuBtn = byId('menuBtn');
    const closeBtn = byId('closeBtn');
    const mobileMenu = byId('mobileMenu');
    const mobileOverlay = byId('mobileOverlay');

    const closeMobile = () => {
      mobileMenu?.classList.remove('active');
      mobileOverlay?.classList.remove('active');
      document.body.style.overflow = '';
    };

    menuBtn?.addEventListener('click', () => {
      mobileMenu?.classList.add('active');
      mobileOverlay?.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
    closeBtn?.addEventListener('click', closeMobile);
    mobileOverlay?.addEventListener('click', closeMobile);
    $$('#mobileMenu a[href^="#"]').forEach((link) => link.addEventListener('click', closeMobile));

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMobile();
    });
  }

  function initProductSlider() {
    const track = $('.product-slider-track');
    const prevBtn = $('.product-slider-prev');
    const nextBtn = $('.product-slider-next');
    const dots = $$('.product-slider-dot');
    let cards = $$('.product-card');
    let currentIndex = 0;

    if (!track || !cards.length) return;

    const getCardWidth = () => {
      cards = $$('.product-card');
      const firstCard = cards[0];
      if (!firstCard) return 0;
      return window.innerWidth < 768 ? firstCard.offsetWidth + 16 : 380 + 24;
    };

    const switchCard = (index) => {
      cards = $$('.product-card');
      if (!cards.length) return;
      if (index < 0) index = cards.length - 1;
      if (index >= cards.length) index = 0;
      currentIndex = index;

      track.scrollTo({ left: index * getCardWidth(), behavior: 'smooth' });
      dots.forEach((dot, dotIndex) => {
        const isActive = dotIndex === index;
        dot.classList.toggle('active', isActive);
        dot.style.backgroundColor = isActive ? '#2775BB' : '#dee2e6';
        dot.style.width = isActive ? '24px' : '12px';
        dot.style.borderRadius = isActive ? '6px' : '50%';
      });
    };

    prevBtn?.addEventListener('click', () => switchCard(currentIndex - 1));
    nextBtn?.addEventListener('click', () => switchCard(currentIndex + 1));
    dots.forEach((dot, index) => dot.addEventListener('click', () => switchCard(index)));

    let touchStartX = 0;
    track.addEventListener('touchstart', (event) => {
      touchStartX = event.changedTouches[0].screenX;
    }, { passive: true });
    track.addEventListener('touchend', (event) => {
      const diff = touchStartX - event.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) switchCard(currentIndex + (diff > 0 ? 1 : -1));
    }, { passive: true });
    window.addEventListener('resize', () => switchCard(currentIndex));

    switchCard(0);
  }

  function initRipple() {
    $$('.btn-press').forEach((button) => {
      button.addEventListener('click', function onPress(event) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
        ripple.classList.add('ripple');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
      });
    });
  }

  function initContactForm() {
    const contactForm = byId('contactForm');
    if (!contactForm) return;

    const submitBtn = byId('submitBtn');
    const challengeQuestion = byId('challengeQuestion');
    const refreshChallengeBtn = byId('refreshChallengeBtn');
    const verificationAnswerInput = byId('verificationAnswer');
    let expectedVerificationAnswer = null;

    const refreshLocalChallenge = () => {
      if (!challengeQuestion) return;
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 9) + 1;
      expectedVerificationAnswer = a + b;
      challengeQuestion.textContent = a + ' + ' + b + ' = ?';
      if (verificationAnswerInput) verificationAnswerInput.value = '';
    };

    const isVerificationCorrect = (answer) => expectedVerificationAnswer !== null && Number(answer) === expectedVerificationAnswer;

    const submitToFeishu = async (fields) => {
      if (!FEISHU_FORM_ENDPOINT) throw new Error(i18n.formDisabledError);

      const payload = {
        fields,
        source: i18n.source,
        submittedAt: new Date().toISOString()
      };
      const useNoCors = FEISHU_REQUEST_MODE === 'no-cors';
      const response = await fetch(FEISHU_FORM_ENDPOINT, {
        method: 'POST',
        mode: FEISHU_REQUEST_MODE,
        headers: { 'Content-Type': useNoCors ? 'text/plain;charset=UTF-8' : 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!useNoCors && !response.ok) {
        let errorMessage = i18n.submitFailed;
        try {
          const data = await response.json();
          errorMessage = data.msg || data.message || errorMessage;
        } catch (error) {
          // Public webhook endpoints sometimes return empty bodies.
        }
        throw new Error(errorMessage);
      }

      return { statusUnknown: useNoCors };
    };

    refreshChallengeBtn?.addEventListener('click', () => {
      refreshLocalChallenge();
      showToast(i18n.challengeRefreshed, 'info', 1500);
    });
    refreshLocalChallenge();

    if (!FEISHU_FORM_ENDPOINT) {
      submitBtn.disabled = true;
      submitBtn.title = i18n.formDisabledTitle;
      setButtonContent(submitBtn, 'fas fa-wrench', i18n.formDisabled);
    }

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const name = byId('name')?.value.trim() || '';
      const phone = byId('phone')?.value.trim() || '';
      const email = byId('email')?.value.trim() || '';
      const message = byId('message')?.value.trim() || '';
      const verificationAnswer = verificationAnswerInput?.value.trim() || '';

      if (!name) { showToast(i18n.nameRequired, 'warning'); return; }
      if (!phone || !/^1[3-9]\d{9}$/.test(phone)) { showToast(i18n.phoneInvalid, 'warning'); return; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast(i18n.emailInvalid, 'warning'); return; }
      if (!isVerificationCorrect(verificationAnswer)) {
        showToast(i18n.verificationInvalid, 'warning');
        refreshLocalChallenge();
        return;
      }

      submitBtn.disabled = true;
      setButtonContent(submitBtn, 'fas fa-spinner fa-spin', i18n.submitLoading);

      try {
        const fields = {
          [FEISHU_FIELD_MAP.name]: name,
          [FEISHU_FIELD_MAP.phone]: phone,
          [FEISHU_FIELD_MAP.email]: email,
          [FEISHU_FIELD_MAP.message]: message
        };
        const submitResult = await submitToFeishu(fields);
        showToast(submitResult.statusUnknown ? i18n.submitUnknown : i18n.submitSuccess, 'success');
        contactForm.reset();
      } catch (error) {
        showToast(error.message || i18n.submitFailed, 'error');
      } finally {
        if (FEISHU_FORM_ENDPOINT) {
          submitBtn.disabled = false;
          setButtonContent(submitBtn, 'fas fa-paper-plane', i18n.submitDefault);
        }
        refreshLocalChallenge();
      }
    });
  }

  function initSmoothScroll() {
    $$('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function onAnchorClick(event) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        event.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
      });
    });
  }

  function initEnhancements() {
    const lazyImages = $$('img[loading="lazy"]');
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            imageObserver.unobserve(entry.target);
          }
        });
      });
      lazyImages.forEach((img) => imageObserver.observe(img));
    }

    const phoneInput = byId('phone');
    phoneInput?.addEventListener('input', function onPhoneInput() {
      const value = this.value.replace(/\D/g, '');
      this.value = value;
      if (value.length === 11) {
        this.classList.add('border-green-400');
        this.classList.remove('border-gray300', 'border-red-400');
      } else if (value.length > 0) {
        this.classList.add('border-red-400');
        this.classList.remove('border-gray300', 'border-green-400');
      } else {
        this.classList.add('border-gray300');
        this.classList.remove('border-red-400', 'border-green-400');
      }
    });

    $$('.color-card').forEach((card) => {
      card.addEventListener('click', function onColorCardClick() {
        const colorName = this.querySelector('p[data-lang-key]')?.textContent || '';
        if (colorName) showToast(i18n.selected + colorName, 'info', 1500);
      });
    });

    $$('a[href="#contact"]').forEach((button) => {
      button.addEventListener('click', function onInquiryClick() {
        const productCard = this.closest('.product-card');
        if (!productCard) return;

        const productName = productCard.querySelector('h3')?.textContent?.trim() || '';
        const inquiryText = i18n.inquiryPrefix + productName + i18n.inquirySuffix;
        const messageInput = byId('message');
        if (messageInput) messageInput.value = inquiryText;
        sessionStorage.setItem('inquiryProduct', productName);
      });
    });

    const inquiryProduct = sessionStorage.getItem('inquiryProduct');
    const messageInput = byId('message');
    if (inquiryProduct && messageInput) {
      messageInput.value = i18n.inquiryPrefix + inquiryProduct + i18n.inquirySuffix;
      sessionStorage.removeItem('inquiryProduct');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(hideLoader, 500);
    window.addEventListener('error', hideLoader);

    initMotion();
    animateCounters();
    initNavbar();
    initMobileMenu();
    initProductSlider();
    initRipple();
    initContactForm();
    initSmoothScroll();
    initEnhancements();
  });
})();
