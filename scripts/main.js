(() => {
  const body = document.body;
  const stickyHeader = document.querySelector('[data-sticky-header]');
  const logoImage = stickyHeader ? stickyHeader.querySelector('[data-logo-default]') : null;
  const contactMethodInputs = Array.from(document.querySelectorAll('input[name="contact_method"]'));
  const contactFields = Array.from(document.querySelectorAll('[data-contact-field]'));
  const phoneInput = document.querySelector('[data-phone-input]');
  const contactForm = document.querySelector('.contact-form');
  const modalMap = new Map(Array.from(document.querySelectorAll('[data-modal]')).map((modal) => [modal.id, modal]));
  const focusableSelector = 'a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';
  let activeModal = null;
  let lastFocusedElement = null;

  const getFocusableElements = (scope) => {
    return Array.from(scope.querySelectorAll(focusableSelector)).filter((element) => {
      return !element.hidden && (element.offsetParent !== null || element === document.activeElement);
    });
  };

  const syncStickyHeader = () => {
    if (!stickyHeader) {
      return;
    }

    const isScrolled = window.scrollY > 40;
    stickyHeader.classList.toggle('is-scrolled', isScrolled);

    if (logoImage) {
      logoImage.src = isScrolled ? logoImage.dataset.logoSticky : logoImage.dataset.logoDefault;
    }
  };

  const openModal = (id) => {
    const modal = modalMap.get(id);
    if (!modal) {
      return;
    }

    if (activeModal && activeModal !== modal) {
      activeModal.hidden = true;
    }

    lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    activeModal = modal;
    modal.hidden = false;
    body.classList.add('modal-open');

    const focusableElements = getFocusableElements(modal);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  };

  const closeModal = (modal = activeModal) => {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    if (activeModal === modal) {
      activeModal = null;
      body.classList.remove('modal-open');
    }

    if (lastFocusedElement instanceof HTMLElement) {
      lastFocusedElement.focus();
      lastFocusedElement = null;
    }
  };

  const syncContactFields = () => {
    const activeMethod = contactMethodInputs.find((input) => input.checked)?.value || 'phone';

    contactFields.forEach((field) => {
      const isVisible = field.dataset.contactField === activeMethod;
      field.hidden = !isVisible;
      field.querySelectorAll('input').forEach((input) => {
        input.required = isVisible;
      });
    });
  };

  const formatPhoneValue = (value) => {
    const digits = value.replace(/\D/g, '');
    const localDigits = (digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits).slice(0, 10);

    if (!localDigits) {
      return '+7 ';
    }

    let formatted = '+7 (' + localDigits.slice(0, 3);
    if (localDigits.length >= 3) {
      formatted += ')';
    }
    if (localDigits.length > 3) {
      formatted += ' ' + localDigits.slice(3, 6);
    }
    if (localDigits.length > 6) {
      formatted += '-' + localDigits.slice(6, 8);
    }
    if (localDigits.length > 8) {
      formatted += '-' + localDigits.slice(8, 10);
    }

    return formatted;
  };

  syncStickyHeader();
  syncContactFields();

  if (phoneInput) {
    phoneInput.value = formatPhoneValue(phoneInput.value);
  }

  window.addEventListener('scroll', syncStickyHeader, { passive: true });
  window.addEventListener('resize', syncStickyHeader);

  document.addEventListener('click', (event) => {
    const openTrigger = event.target.closest('[data-modal-open]');
    if (openTrigger) {
      event.preventDefault();
      openModal(openTrigger.dataset.modalOpen);
      return;
    }

    const closeTrigger = event.target.closest('[data-modal-close]');
    if (closeTrigger) {
      closeModal(closeTrigger.closest('[data-modal]') || activeModal);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!activeModal) {
      return;
    }

    if (event.key === 'Escape') {
      closeModal(activeModal);
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements(activeModal);
    if (focusableElements.length === 0) {
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  contactMethodInputs.forEach((input) => {
    input.addEventListener('change', syncContactFields);
  });

  if (phoneInput) {
    phoneInput.addEventListener('focus', () => {
      if (!phoneInput.value.trim()) {
        phoneInput.value = '+7 ';
      }
    });

    phoneInput.addEventListener('input', () => {
      phoneInput.value = formatPhoneValue(phoneInput.value);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }
})();
