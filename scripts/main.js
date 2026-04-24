const initSite = () => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const heroHeader = document.querySelector(".hero-top");
  const heroLogoImage = document.querySelector(".hero-logo img");
  const heroMenuToggle = document.querySelector(".hero-menu-toggle");
  const heroTopNav = document.querySelector(".hero-top-nav");
  const heroTopControls = document.querySelector(".hero-top-controls");
  const heroMenuMediaQuery = window.matchMedia("(max-width: 980px)");
  const modalClosers = document.querySelectorAll("[data-modal-close]");
  const contactModals = document.querySelectorAll(".contact-modal");
  const testimonialLetters = document.querySelectorAll(".testimonial-modal .testimonial-letter");
  const testimonialsGrid = document.querySelector("[data-testimonials-grid]");
  const testimonialLoadButton = document.querySelector("[data-load-testimonials]");
  const parsePositiveInt = (value, fallback) => {
    const parsed = Number.parseInt(value ?? "", 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
  };
  const TESTIMONIALS_INITIAL_VISIBLE = parsePositiveInt(
    testimonialsGrid?.dataset.testimonialsInitialVisible || testimonialLoadButton?.dataset.testimonialsInitialVisible,
    15
  );
  const TESTIMONIALS_BATCH_SIZE = parsePositiveInt(
    testimonialsGrid?.dataset.testimonialsBatchSize || testimonialLoadButton?.dataset.testimonialsBatchSize,
    15
  );
  const pageLanguage = document.documentElement.lang?.toLowerCase().startsWith("en") ? "en" : "ru";
  const uiText = pageLanguage === "en"
    ? {
        testimonialReadMore: "Read full review",
        testimonialViewProject: "View project",
        testimonialScan: "Scan",
        testimonialText: "Text version"
      }
    : {
        testimonialReadMore: "Читать полностью",
        testimonialViewProject: "Смотреть проект",
        testimonialScan: "Скан",
        testimonialText: "Текстовый вариант"
      };
  const menuText = pageLanguage === "en"
    ? {
        openMenu: "Open menu",
        closeMenu: "Close menu"
      }
    : {
        openMenu: "Открыть меню",
        closeMenu: "Закрыть меню"
      };
  let isHeroMenuOpen = false;
  const setHeroMenuAccessibility = (element, isHidden) => {
    if (!element) {
      return;
    }

    element.setAttribute("aria-hidden", String(isHidden));

    if ("inert" in element) {
      element.inert = isHidden;
    }
  };
  const syncHeroLogo = (isStickyState = heroHeader?.classList.contains("is-sticky") ?? false) => {
    if (!heroLogoImage) {
      return;
    }

    heroLogoImage.src = (isStickyState || isHeroMenuOpen)
      ? heroLogoImage.dataset.stickyLogo
      : heroLogoImage.dataset.defaultLogo;
  };
  const syncHeroMenuState = ({ restoreFocus = false } = {}) => {
    const isMobileMenu = heroMenuMediaQuery.matches;
    const shouldOpenMenu = isMobileMenu && isHeroMenuOpen;

    if (heroHeader) {
      heroHeader.classList.toggle("is-menu-open", shouldOpenMenu);
    }

    if (heroMenuToggle) {
      heroMenuToggle.setAttribute("aria-expanded", String(shouldOpenMenu));
      heroMenuToggle.setAttribute("aria-label", shouldOpenMenu ? menuText.closeMenu : menuText.openMenu);
    }

    setHeroMenuAccessibility(heroTopNav, isMobileMenu && !shouldOpenMenu);
    setHeroMenuAccessibility(heroTopControls, isMobileMenu && !shouldOpenMenu);
    document.body.classList.toggle("menu-open", shouldOpenMenu);
    syncHeroLogo();

    if (!shouldOpenMenu && restoreFocus && heroMenuToggle) {
      heroMenuToggle.focus();
    }
  };
  const closeHeroMenu = (options = {}) => {
    if (!isHeroMenuOpen) {
      syncHeroMenuState(options);
      return;
    }

    isHeroMenuOpen = false;
    syncHeroMenuState(options);
  };
  const openHeroMenu = () => {
    if (!heroMenuMediaQuery.matches) {
      return;
    }

    isHeroMenuOpen = true;
    syncHeroMenuState();
    window.requestAnimationFrame(() => {
      heroTopNav?.querySelector("a")?.focus();
    });
  };
  const toggleHeroMenu = () => {
    if (isHeroMenuOpen) {
      closeHeroMenu({ restoreFocus: true });
      return;
    }

    openHeroMenu();
  };

  const testimonialSources = pageLanguage === "en"
    ? [
        {
          brand: "align",
          modalId: "testimonial-align-modal",
          projectId: "project-align",
          logoSrc: "./logos/clients/color/Align-logo.svg",
          logoAlt: "Align Technology",
          personName: "Viktoriya Klepatskaya",
          personRole: "Head of Administrative Department, Align Technology",
          quotes: [
            "A high level of planning and work organization allowed the project to be delivered on time, at the expected quality level, and without exceeding the budget.",
            "The project was delivered within the agreed timeframe and fully met our quality expectations.",
            "The professionalism of the team deserves the highest rating.",
            "The project manager and leadership team showed a high level of responsibility at every stage.",
            "Clear execution and quick response helped the project move forward without disruption.",
            "An individual approach to delivery became a distinct advantage of the team.",
            "The team created a modern, technology-driven workspace aligned with all business processes.",
            "As general contractor, the company handled design, demolition, general construction, engineering, and commissioning.",
            "Office delivery was organized at a high level from kickoff to handover.",
            "The company has proven itself to be a reliable partner in construction and general contracting."
          ]
        },
        {
          brand: "dell",
          modalId: "testimonial-dell-modal",
          projectId: "project-dell",
          logoSrc: "./logos/clients/color/Dell-logo.svg",
          logoAlt: "Dell Technologies",
          personName: "Shcherbakov B.I.",
          personRole: "General manager, Dell Technologies",
          quotes: [
            "The team kept to the schedule and met every deadline without compromising quality.",
            "Gint-M confidently manages all engineering and construction capabilities required for high-quality project delivery.",
            "As general contractor, the team delivered the full scope of general construction works, including mechanical and electrical systems.",
            "Detailed design and implementation were completed within a single responsibility perimeter.",
            "The team delivered a complex 2,400 sqm office project in just four months.",
            "Strict compliance with the schedule was confirmed at every stage of the project.",
            "The company demonstrated the ability to deliver complex office projects quickly without sacrificing quality.",
            "The corporate office project was executed as one managed process from design to construction.",
            "The engineering and construction expertise of the team ensured a predictable result.",
            "All deadlines were fully met, while the quality of work remained high."
          ]
        },
        {
          brand: "winline",
          modalId: "testimonial-winline-modal",
          projectId: "project-winline",
          logoSrc: "./logos/clients/color/winline-logo.svg",
          logoAlt: "Winline",
          personName: "Sergey Ovcharov",
          personRole: "Technical Director, Winline",
          quotes: [
            "The project was delivered ahead of the agreed deadline and without compromises on quality.",
            "The contractor proposed genuinely effective solutions rather than taking the path of least resistance.",
            "Even amid objective challenges, the team kept the project at a high professional level.",
            "Partial redesign during delivery did not affect the pace or quality of implementation.",
            "Non-standard ceiling structures and engineering solutions were delivered carefully and precisely.",
            "The office turned out technically well thought-out and genuinely comfortable.",
            "The team communicated effectively with the client, building services, and subcontractors alike.",
            "All works progressed in strict accordance with the planned schedule, without organizational disruptions.",
            "The full package of general construction, fit-out, engineering works, and detailed design was delivered as one coordinated scope.",
            "The team can be recommended as a professional and reliable partner for complex office projects."
          ]
        }
      ]
    : [
        {
          brand: "align",
          modalId: "testimonial-align-modal",
          projectId: "project-align",
          logoSrc: "./logos/clients/color/Align-logo.svg",
          logoAlt: "Align Technology",
          personName: "Виктория Клепацкая",
          personRole: "Руководитель административного департамента, Align Technology",
          quotes: [
            "Высокий уровень планирования и организации работ позволил сдать проект в срок, в ожидаемом качестве и без превышения бюджета.",
            "Проект был сдан в оговоренные сроки и полностью соответствовал ожиданиям по качеству.",
            "Профессионализм команды заслуживает самой высокой оценки.",
            "Высокий уровень ответственности руководителя и менеджера проекта ощущался на каждом этапе.",
            "Четкость и оперативность в выполнении задач помогли пройти проект без сбоев.",
            "Индивидуальный подход к реализации проекта стал отдельным преимуществом команды.",
            "Команда создала современное технологичное пространство, соответствующее всем рабочим процессам.",
            "Как генподрядчик, компания закрыла проектирование, демонтаж, общестроительные, инженерные и пусконаладочные работы.",
            "Реализация офиса была организована на высоком уровне от старта до сдачи.",
            "Компания зарекомендовала себя как надежный партнер в строительстве и генподряде."
          ]
        },
        {
          brand: "dell",
          modalId: "testimonial-dell-modal",
          projectId: "project-dell",
          logoSrc: "./logos/clients/color/Dell-logo.svg",
          logoAlt: "Dell Technologies",
          personName: "Shcherbakov B.I.",
          personRole: "General manager, Dell Technologies",
          quotes: [
            "Команда держала график и соблюдала все сроки без компромиссов по качеству работ.",
            "Gint-M уверенно управляет всеми инженерными и строительными компетенциями, нужными для качественной реализации проекта.",
            "В роли генподрядчика команда выполнила весь комплекс общестроительных работ, включая механические и электрические системы.",
            "Детальное проектирование и реализация были выполнены в одном контуре ответственности.",
            "Сложный офисный проект площадью 2 400 кв. м команда реализовала всего за четыре месяца.",
            "Строгое соблюдение графика подтверждалось на каждом этапе проекта.",
            "Компания показала способность быстро реализовывать сложные офисные проекты без потери качества.",
            "Проект корпоративного офиса был выполнен как единый управляемый процесс от design до construction.",
            "Инженерная и строительная экспертиза команды обеспечила предсказуемый результат.",
            "Сроки были выдержаны полностью, а качество работ осталось на высоком уровне."
          ]
        },
        {
          brand: "winline",
          modalId: "testimonial-winline-modal",
          projectId: "project-winline",
          logoSrc: "./logos/clients/color/winline-logo.svg",
          logoAlt: "Winline",
          personName: "Сергей Овчаров",
          personRole: "Технический директор, Winline",
          quotes: [
            "Проект был сдан раньше согласованного срока и без компромиссов по качеству.",
            "Подрядчик предлагал действительно эффективные решения, а не путь наименьшего сопротивления.",
            "Даже при объективных сложностях команда держала проект на высоком профессиональном уровне.",
            "Частичное перепроектирование по ходу проекта не повлияло на темп и качество реализации.",
            "Нестандартные потолочные конструкции и инженерные решения были реализованы аккуратно и точно.",
            "Офис получился технически продуманным и по-настоящему комфортным.",
            "Команда эффективно коммуницировала и с заказчиком, и со службами здания, и с субподрядчиками.",
            "Все работы шли в четком соответствии с намеченным графиком, без организационных сбоев.",
            "Полный комплекс общестроительных, отделочных, инженерных работ и рабочее проектирование был выполнен в одной связке.",
            "Команду можно рекомендовать как профессионального и надежного партнера для сложных офисных проектов."
          ]
        }
      ];
  const testimonialItems = [];
  let renderedTestimonialCount = 0;
  const statCounters = Array.from(document.querySelectorAll("[data-count-to]"));
  const testimonialSourceMap = new Map(testimonialSources.map((source) => [source.brand, source]));
  const createTestimonialItem = (source, quoteIndex) => ({
    brand: source.brand,
    modalId: source.modalId,
    projectId: source.projectId,
    logoSrc: source.logoSrc,
    logoAlt: source.logoAlt,
    personName: source.personName,
    personRole: source.personRole,
    quoteIndex,
    quote: source.quotes[quoteIndex]
  });
  const featuredTestimonialSpecs = [
    { brand: "align", quoteIndex: 0 },
    { brand: "dell", quoteIndex: 0 },
    { brand: "winline", quoteIndex: 0 },
    { brand: "align", quoteIndex: 2 },
    { brand: "dell", quoteIndex: 4 },
    { brand: "winline", quoteIndex: 1 },
    { brand: "align", quoteIndex: 7 },
    { brand: "winline", quoteIndex: 9 }
  ];
  const featuredTestimonialItems = featuredTestimonialSpecs
    .map(({ brand, quoteIndex }) => {
      const source = testimonialSourceMap.get(brand);

      return source ? createTestimonialItem(source, quoteIndex) : null;
    })
    .filter(Boolean);
  const featuredTestimonialKeys = new Set(
    featuredTestimonialItems.map((item) => `${item.brand}:${item.quoteIndex}`)
  );

  testimonialSources[0].quotes.forEach((_, index) => {
    testimonialSources.forEach((source) => {
      const item = createTestimonialItem(source, index);

      if (!featuredTestimonialKeys.has(`${item.brand}:${item.quoteIndex}`)) {
        testimonialItems.push(item);
      }
    });
  });

  testimonialItems.unshift(...featuredTestimonialItems);

  const createTestimonialCard = (item) => {
    const card = document.createElement("article");
    card.className = `testimonial-review-card testimonial-review-card-${item.brand} micro-float`;
    card.innerHTML = `
      <div class="testimonial-review-top">
        <span class="testimonial-review-brand">
          <img class="testimonial-brand-logo${item.brand === "align" ? " testimonial-brand-logo-align" : ""}" src="${item.logoSrc}" alt="${item.logoAlt}" />
        </span>
      </div>

      <div class="testimonial-review-body">
        <blockquote class="testimonial-review-quote">
          <p>${item.quote}</p>
        </blockquote>
      </div>

      <footer class="testimonial-review-footer">
        <div class="testimonial-review-meta">
          <p class="testimonial-review-name">${item.personName}</p>
          <p class="testimonial-review-role">${item.personRole}</p>
        </div>
        <button class="testimonial-read-more" type="button" data-modal-open="${item.modalId}">${uiText.testimonialReadMore}</button>
      </footer>
    `;

    return card;
  };
  const syncTestimonialLoadButton = () => {
    if (!testimonialLoadButton) {
      return;
    }

    testimonialLoadButton.hidden = renderedTestimonialCount >= testimonialItems.length;
  };

  const appendTestimonialBatch = (count = TESTIMONIALS_BATCH_SIZE) => {
    if (!testimonialsGrid) {
      syncTestimonialLoadButton();
      return [];
    }

    const nextItems = testimonialItems.slice(renderedTestimonialCount, renderedTestimonialCount + count);
    const nextCards = nextItems.map(createTestimonialCard);

    nextCards.forEach((card) => {
      testimonialsGrid.append(card);
    });

    renderedTestimonialCount += nextCards.length;
    syncTestimonialLoadButton();

    return nextCards;
  };

  appendTestimonialBatch(TESTIMONIALS_INITIAL_VISIBLE);

  const formatCountValue = (value) => {
    return Math.round(value)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  const renderCountValue = (element, value) => {
    const prefix = element.dataset.countPrefix || "";
    const suffix = element.dataset.countSuffix || "";
    element.textContent = `${prefix}${formatCountValue(value)}${suffix}`;
  };

  const animateStatCounters = () => {
    if (statCounters.length === 0) {
      return;
    }

    const duration = 1100;

    statCounters.forEach((counter) => {
      if (counter.dataset.countAnimated === "true") {
        return;
      }

      const targetValue = Number(counter.dataset.countTo);

      if (!Number.isFinite(targetValue)) {
        return;
      }

      counter.dataset.countAnimated = "true";

      if (prefersReducedMotion) {
        renderCountValue(counter, targetValue);
        return;
      }

      const startTime = performance.now();

      const tick = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        renderCountValue(counter, targetValue * easedProgress);

        if (progress < 1) {
          window.requestAnimationFrame(tick);
          return;
        }

        renderCountValue(counter, targetValue);
      };

      renderCountValue(counter, 0);
      window.requestAnimationFrame(tick);
    });
  };

  const initStatCounters = () => {
    if (statCounters.length === 0) {
      return;
    }

    if (prefersReducedMotion) {
      animateStatCounters();
      return;
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        const shouldAnimate = entries.some((entry) => entry.isIntersecting);

        if (!shouldAnimate) {
          return;
        }

        animateStatCounters();
        counterObserver.disconnect();
      },
      {
        threshold: 0.35
      }
    );

    statCounters.forEach((counter) => {
      counterObserver.observe(counter);
    });
  };

  const setTestimonialView = (letter, view) => {
    if (!letter) {
      return;
    }

    const previewPanel = letter.querySelector("[data-testimonial-panel='scan']");
    const textPanel = letter.querySelector("[data-testimonial-panel='text']");
    const toggle = letter.querySelector("[data-testimonial-toggle]");
    const isTextView = view === "text";

    letter.dataset.testimonialView = isTextView ? "text" : "scan";

    if (previewPanel) {
      previewPanel.hidden = isTextView;
    }

    if (textPanel) {
      textPanel.hidden = !isTextView;
    }

    if (toggle) {
      toggle.textContent = isTextView ? uiText.testimonialScan : uiText.testimonialText;
      toggle.setAttribute("aria-pressed", String(isTextView));
    }
  };

  const resetTestimonialViews = (scope = document) => {
    scope.querySelectorAll(".testimonial-letter[data-testimonial-view]").forEach((letter) => {
      setTestimonialView(letter, "scan");
    });
  };

  testimonialLetters.forEach((letter) => {
    const previewPanel = letter.querySelector(".testimonial-letter-preview");
    const textPanel = letter.querySelector(".testimonial-letter-body");

    if (!previewPanel || !textPanel) {
      return;
    }

    previewPanel.classList.add("testimonial-letter-panel");
    previewPanel.dataset.testimonialPanel = "scan";
    textPanel.classList.add("testimonial-letter-panel");
    textPanel.dataset.testimonialPanel = "text";
    textPanel.hidden = true;
    letter.dataset.testimonialView = "scan";

    if (!letter.querySelector("[data-testimonial-toggle]")) {
      const actions = document.createElement("div");
      actions.className = "testimonial-letter-actions";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "testimonial-letter-toggle testimonial-action testimonial-action-secondary";
      toggle.dataset.testimonialToggle = "";
      toggle.setAttribute("aria-pressed", "false");
      toggle.textContent = uiText.testimonialText;

      toggle.addEventListener("click", () => {
        const nextView = letter.dataset.testimonialView === "text" ? "scan" : "text";
        setTestimonialView(letter, nextView);
      });

      actions.append(toggle);
      letter.append(actions);
    }
  });
  if (testimonialLoadButton) {
    testimonialLoadButton.addEventListener("click", () => {
      const nextCards = appendTestimonialBatch(testimonialItems.length);

      nextCards.forEach((card, index) => {
        card.classList.add("reveal");
        card.style.setProperty("--reveal-delay", `${index * 70}ms`);

        if (prefersReducedMotion) {
          card.classList.add("is-visible");
          return;
        }

        window.requestAnimationFrame(() => {
          card.classList.add("is-visible");
        });
      });
    });
  }

  const awardsTimeline = document.querySelector("[data-awards-timeline]");
  const awardsTimelineStage = awardsTimeline ? awardsTimeline.querySelector("[data-awards-timeline-stage]") : null;
  const awardsTimelineTrack = awardsTimeline ? awardsTimeline.querySelector("[data-awards-timeline-track]") : null;
  let awardsTimelineItems = awardsTimelineTrack ? Array.from(awardsTimelineTrack.querySelectorAll(".awards-timeline-item")) : [];
  const awardsTimelinePrevButton = awardsTimeline ? awardsTimeline.querySelector('[data-awards-timeline-nav="prev"]') : null;
  const awardsTimelineNextButton = awardsTimeline ? awardsTimeline.querySelector('[data-awards-timeline-nav="next"]') : null;
  let awardsTimelineSyncFrame = 0;
  let awardsTimelineAutoplayId = 0;

  if (awardsTimelineTrack && awardsTimelineItems.length > 1) {
    awardsTimelineItems = awardsTimelineItems
      .map((item, index) => {
        const yearLabel = item.querySelector(".awards-timeline-year");
        const yearValue = Number.parseInt(yearLabel?.textContent?.trim() || "", 10);

        return {
          item,
          index,
          year: Number.isFinite(yearValue) ? yearValue : 0
        };
      })
      .sort((left, right) => right.year - left.year || left.index - right.index)
      .map(({ item }) => item);

    awardsTimelineTrack.append(...awardsTimelineItems);
  }

  const getAwardsTimelineStep = () => {
    if (!awardsTimelineStage || awardsTimelineItems.length === 0) {
      return 0;
    }

    const firstItem = awardsTimelineItems[0];
    const firstItemWidth = firstItem.getBoundingClientRect().width;
    const trackStyles = awardsTimelineTrack ? window.getComputedStyle(awardsTimelineTrack) : null;
    const gap = trackStyles ? Number.parseFloat(trackStyles.columnGap || trackStyles.gap || "0") || 0 : 0;
    const viewportStep = Math.round(awardsTimelineStage.clientWidth * 0.82);

    return Math.max(Math.round(firstItemWidth + gap), viewportStep);
  };

  const syncAwardsTimelineButtons = () => {
    if (!awardsTimelineStage) {
      return;
    }

    const maxScrollLeft = Math.max(0, awardsTimelineStage.scrollWidth - awardsTimelineStage.clientWidth);
    const isScrollable = maxScrollLeft > 4;
    const atStart = awardsTimelineStage.scrollLeft <= 4;
    const atEnd = maxScrollLeft - awardsTimelineStage.scrollLeft <= 4;

    if (awardsTimelinePrevButton) {
      awardsTimelinePrevButton.disabled = !isScrollable || atStart;
    }

    if (awardsTimelineNextButton) {
      awardsTimelineNextButton.disabled = !isScrollable || atEnd;
    }
  };

  const requestAwardsTimelineSync = () => {
    if (awardsTimelineSyncFrame !== 0) {
      return;
    }

    awardsTimelineSyncFrame = window.requestAnimationFrame(() => {
      awardsTimelineSyncFrame = 0;
      syncAwardsTimelineButtons();
    });
  };

  const shiftAwardsTimeline = (direction) => {
    if (!awardsTimelineStage) {
      return;
    }

    const step = getAwardsTimelineStep();

    if (step <= 0) {
      return;
    }

    const maxScrollLeft = Math.max(0, awardsTimelineStage.scrollWidth - awardsTimelineStage.clientWidth);
    const nextLeft = Math.min(
      maxScrollLeft,
      Math.max(0, awardsTimelineStage.scrollLeft + (step * direction))
    );

    awardsTimelineStage.scrollTo({
      left: nextLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });

    requestAwardsTimelineSync();
  };

  const stopAwardsTimelineAutoplay = () => {
    if (awardsTimelineAutoplayId === 0) {
      return;
    }

    window.clearInterval(awardsTimelineAutoplayId);
    awardsTimelineAutoplayId = 0;
  };

  const autoplayAwardsTimeline = () => {
    if (!awardsTimelineStage) {
      return;
    }

    const maxScrollLeft = Math.max(0, awardsTimelineStage.scrollWidth - awardsTimelineStage.clientWidth);
    const atEnd = maxScrollLeft - awardsTimelineStage.scrollLeft <= 4;

    if (maxScrollLeft <= 4) {
      return;
    }

    if (atEnd) {
      awardsTimelineStage.scrollTo({
        left: 0,
        behavior: "auto"
      });
      requestAwardsTimelineSync();
      return;
    }

    shiftAwardsTimeline(1);
  };

  const startAwardsTimelineAutoplay = () => {
    stopAwardsTimelineAutoplay();

    if (!awardsTimelineStage || prefersReducedMotion) {
      return;
    }

    const maxScrollLeft = Math.max(0, awardsTimelineStage.scrollWidth - awardsTimelineStage.clientWidth);

    if (maxScrollLeft <= 4) {
      return;
    }

    awardsTimelineAutoplayId = window.setInterval(() => {
      autoplayAwardsTimeline();
    }, 3000);
  };

  if (awardsTimelineStage) {
    syncAwardsTimelineButtons();
    awardsTimelineStage.addEventListener("scroll", requestAwardsTimelineSync, { passive: true });

    if (awardsTimelineNextButton) {
      awardsTimelineNextButton.addEventListener("click", () => {
        stopAwardsTimelineAutoplay();
        shiftAwardsTimeline(1);
        startAwardsTimelineAutoplay();
      });
    }

    if (awardsTimelinePrevButton) {
      awardsTimelinePrevButton.addEventListener("click", () => {
        stopAwardsTimelineAutoplay();
        shiftAwardsTimeline(-1);
        startAwardsTimelineAutoplay();
      });
    }

    if ("ResizeObserver" in window) {
      const awardsTimelineResizeObserver = new ResizeObserver(() => {
        requestAwardsTimelineSync();
        startAwardsTimelineAutoplay();
      });

      awardsTimelineResizeObserver.observe(awardsTimelineStage);

      if (awardsTimelineTrack) {
        awardsTimelineResizeObserver.observe(awardsTimelineTrack);
      }
    }

    if (awardsTimeline) {
      awardsTimeline.addEventListener("pointerenter", stopAwardsTimelineAutoplay);
      awardsTimeline.addEventListener("pointerleave", startAwardsTimelineAutoplay);
      awardsTimeline.addEventListener("focusin", stopAwardsTimelineAutoplay);
      awardsTimeline.addEventListener("focusout", (event) => {
        if (!awardsTimeline.contains(event.relatedTarget)) {
          startAwardsTimelineAutoplay();
        }
      });

      document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
          stopAwardsTimelineAutoplay();
          return;
        }

        startAwardsTimelineAutoplay();
      });
    }

    window.addEventListener("load", requestAwardsTimelineSync, { once: true });
    window.addEventListener("resize", requestAwardsTimelineSync);
    window.addEventListener("resize", startAwardsTimelineAutoplay);
    startAwardsTimelineAutoplay();
  }

  const companyLogosSlider = document.querySelector("[data-company-logos]");
  const companyLogosTrack = companyLogosSlider ? companyLogosSlider.querySelector("[data-company-logos-track]") : null;
  const companyLogoPages = companyLogosTrack ? Array.from(companyLogosTrack.querySelectorAll("[data-company-logos-page]")) : [];
  const companyLogoPrevButton = companyLogosSlider ? companyLogosSlider.querySelector('[data-company-logos-nav="prev"]') : null;
  const companyLogoNextButton = companyLogosSlider ? companyLogosSlider.querySelector('[data-company-logos-nav="next"]') : null;
  const companyLogoPageCount = companyLogoPages.length;
  let companyLogoSlides = companyLogoPages;
  let companyLogoSlideIndex = companyLogoPageCount > 1 ? 1 : 0;
  let companyLogoIsAnimating = false;
  let companyLogoAutoplayId = 0;

  if (companyLogosTrack && companyLogoPageCount > 1) {
    const firstClone = companyLogoPages[0].cloneNode(true);
    const lastClone = companyLogoPages[companyLogoPageCount - 1].cloneNode(true);

    firstClone.dataset.companyLogosClone = "first";
    lastClone.dataset.companyLogosClone = "last";
    firstClone.setAttribute("aria-hidden", "true");
    lastClone.setAttribute("aria-hidden", "true");

    companyLogosTrack.prepend(lastClone);
    companyLogosTrack.append(firstClone);
    companyLogoSlides = Array.from(companyLogosTrack.children);
  }

  const syncCompanyLogoButtons = () => {
    if (companyLogoPrevButton) {
      companyLogoPrevButton.disabled = companyLogoPageCount < 2;
    }

    if (companyLogoNextButton) {
      companyLogoNextButton.disabled = companyLogoPageCount < 2;
    }
  };

  const getActiveCompanyLogoPageIndex = () => {
    if (companyLogoPageCount < 2) {
      return 0;
    }

    if (companyLogoSlideIndex === 0) {
      return companyLogoPageCount - 1;
    }

    if (companyLogoSlideIndex === companyLogoSlides.length - 1) {
      return 0;
    }

    return companyLogoSlideIndex - 1;
  };

  const syncCompanyLogosSlider = (animate = true) => {
    if (!companyLogosTrack || companyLogoSlides.length === 0) {
      return;
    }

    const useAnimation = animate && !prefersReducedMotion;
    const activePageIndex = getActiveCompanyLogoPageIndex();

    companyLogosTrack.style.transitionDuration = useAnimation ? "820ms" : "0ms";
    companyLogosTrack.style.transitionTimingFunction = useAnimation ? "var(--ease-out-soft)" : "linear";
    companyLogosTrack.style.transform = `translate3d(-${companyLogoSlideIndex * 100}%, 0, 0)`;

    companyLogoPages.forEach((page, index) => {
      const isActive = index === activePageIndex;

      page.classList.toggle("is-active", isActive);
      page.hidden = false;
      page.setAttribute("aria-hidden", String(!isActive));

      if ("inert" in page) {
        page.inert = !isActive;
      }
    });

    companyLogoSlides.forEach((page, index) => {
      const isClone = page.hasAttribute("data-company-logos-clone");
      const isActive = index === companyLogoSlideIndex;

      page.setAttribute("aria-hidden", String(!isActive || isClone));

      if ("inert" in page) {
        page.inert = !isActive || isClone;
      }
    });
  };

  const normalizeCompanyLogosLoop = () => {
    if (companyLogoPageCount < 2) {
      companyLogoIsAnimating = false;
      return;
    }

    if (companyLogoSlideIndex === 0) {
      companyLogoSlideIndex = companyLogoPageCount;
      syncCompanyLogosSlider(false);
    } else if (companyLogoSlideIndex === companyLogoSlides.length - 1) {
      companyLogoSlideIndex = 1;
      syncCompanyLogosSlider(false);
    }

    companyLogoIsAnimating = false;
  };

  const showCompanyLogoPage = (direction) => {
    if (!companyLogosTrack || companyLogoPageCount < 2 || companyLogoIsAnimating) {
      return;
    }

    companyLogoSlideIndex += direction;

    if (prefersReducedMotion) {
      if (companyLogoSlideIndex === 0) {
        companyLogoSlideIndex = companyLogoPageCount;
      } else if (companyLogoSlideIndex === companyLogoSlides.length - 1) {
        companyLogoSlideIndex = 1;
      }

      syncCompanyLogosSlider(false);
      return;
    }

    companyLogoIsAnimating = true;
    syncCompanyLogosSlider(true);
  };

  const stopCompanyLogosAutoplay = () => {
    if (companyLogoAutoplayId === 0) {
      return;
    }

    window.clearInterval(companyLogoAutoplayId);
    companyLogoAutoplayId = 0;
  };

  const startCompanyLogosAutoplay = () => {
    stopCompanyLogosAutoplay();

    if (companyLogoPageCount < 2 || prefersReducedMotion) {
      return;
    }

    companyLogoAutoplayId = window.setInterval(() => {
      showCompanyLogoPage(1);
    }, 3000);
  };

  const shiftCompanyLogoPage = (direction) => {
    if (companyLogoPageCount < 2) {
      return;
    }

    showCompanyLogoPage(direction);
    startCompanyLogosAutoplay();
  };

  syncCompanyLogoButtons();
  syncCompanyLogosSlider(false);

  if (companyLogoPrevButton) {
    companyLogoPrevButton.addEventListener("click", () => {
      shiftCompanyLogoPage(-1);
    });
  }

  if (companyLogoNextButton) {
    companyLogoNextButton.addEventListener("click", () => {
      shiftCompanyLogoPage(1);
    });
  }

  if (companyLogosTrack) {
    companyLogosTrack.addEventListener("transitionend", (event) => {
      if (event.propertyName !== "transform") {
        return;
      }

      normalizeCompanyLogosLoop();
    });
  }

  if (companyLogosSlider) {
    companyLogosSlider.addEventListener("pointerenter", stopCompanyLogosAutoplay);
    companyLogosSlider.addEventListener("pointerleave", startCompanyLogosAutoplay);
    companyLogosSlider.addEventListener("focusin", stopCompanyLogosAutoplay);
    companyLogosSlider.addEventListener("focusout", (event) => {
      if (!companyLogosSlider.contains(event.relatedTarget)) {
        startCompanyLogosAutoplay();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopCompanyLogosAutoplay();
        return;
      }

      startCompanyLogosAutoplay();
    });
  }

  startCompanyLogosAutoplay();
  const messengerToggles = document.querySelectorAll("[data-messenger-toggle]");
  const messengerFields = Array.from(document.querySelectorAll("[data-messenger-field]")).reduce((fields, field) => {
    fields.set(field.dataset.messengerField, field);
    return fields;
  }, new Map());
  const phoneInput = document.querySelector("[data-phone-input]");
  const phoneMethodToggle = document.querySelector('[data-contact-method="phone"]');
  const projectLoadButton = document.querySelector("[data-load-projects]");
  const projectsMasonry = document.querySelector(".projects-masonry");
  const projectCards = projectsMasonry ? Array.from(projectsMasonry.querySelectorAll(".project-photo-card")) : [];
  const orderedProjectSlugs = [
    "kit-med",
    "skolkovo-park",
    "natsproektstroy",
    "restaurant-skolkovo-park",
    "ab-development",
    "krylatskie-holmy",
    "winline",
    "align",
    "avito-spb",
    "avito-spb-2021",
    "avito-cks",
    "international-bank",
    "avito-spb-2020",
    "snigeri-school",
    "align-technology",
    "bnp-paribas",
    "dell",
    "avito-moscow",
    "s7-airlines",
    "philip-morris",
    "skolkovo-vet",
    "samsung"
  ];
  const projectYearBySlug = new Map([
    ["kit-med", "2025"],
    ["skolkovo-park", "2025"],
    ["natsproektstroy", "2024"],
    ["restaurant-skolkovo-park", "2024"],
    ["ab-development", "2023"],
    ["krylatskie-holmy", "2023"],
    ["winline", "2022"],
    ["align", "2022"],
    ["avito-spb", "2021"],
    ["avito-spb-2021", "2021"],
    ["avito-cks", "2021"],
    ["international-bank", "2021"],
    ["avito-spb-2020", "2020"],
    ["snigeri-school", "2020"],
    ["align-technology", "2020"],
    ["bnp-paribas", "2020"],
    ["dell", "2020"],
    ["avito-moscow", "2020"],
    ["s7-airlines", "2019"],
    ["philip-morris", "2019"],
    ["skolkovo-vet", "2019"],
    ["samsung", "2018"]
  ]);
  const projectSortOrder = new Map(orderedProjectSlugs.map((slug, index) => [slug, index]));
  const PROJECTS_INITIAL_VISIBLE = 16;
  let hiddenProjectCards = [];
  const revealElements = [];
  let projectMasonryFrame = null;
  let lastProjectMasonryWidth = 0;

  const getProjectSlug = (card) => {
    const link = card.querySelector(".project-photo-link");

    if (!link) {
      return "";
    }

    try {
      const url = new URL(link.href, window.location.href);
      return url.searchParams.get("slug") || "";
    } catch {
      return "";
    }
  };

  const ensureProjectYearBadge = (card, year) => {
    if (!year) {
      return;
    }

    const caption = card.querySelector(".project-photo-caption");
    const title = caption?.querySelector(".project-photo-name");

    if (!caption || !title) {
      return;
    }

    let heading = caption.querySelector(".project-photo-heading");

    if (!heading) {
      heading = document.createElement("div");
      heading.className = "project-photo-heading";
      caption.prepend(heading);
    }

    if (!heading.contains(title)) {
      heading.prepend(title);
    }

    let badge = heading.querySelector(".project-photo-year");

    if (!badge) {
      const existingBadge = caption.querySelector(".project-photo-year");
      badge = document.createElement("span");
      badge.className = "project-photo-year";
      (existingBadge || badge).replaceWith(badge);
      heading.append(badge);
    } else if (!heading.contains(badge)) {
      heading.append(badge);
    }

    badge.textContent = year;
    badge.setAttribute("aria-label", `Год реализации ${year}`);
    card.dataset.projectYear = year;

    const legacyMeta = caption.querySelector(".project-photo-meta");

    if (legacyMeta) {
      legacyMeta.remove();
    }
  };

  const syncProjectCardOrder = () => {
    if (!projectsMasonry || projectCards.length === 0) {
      return;
    }

    const orderedCards = projectCards
      .map((card, index) => {
        const slug = getProjectSlug(card);
        const year = projectYearBySlug.get(slug) || "";
        const yearValue = Number.parseInt(year, 10) || 0;

        ensureProjectYearBadge(card, year);

        return {
          card,
          index,
          yearValue,
          sortIndex: projectSortOrder.get(slug) ?? Number.MAX_SAFE_INTEGER
        };
      })
      .sort((left, right) => (
        right.yearValue - left.yearValue
        || left.sortIndex - right.sortIndex
        || left.index - right.index
      ));

    orderedCards.forEach(({ card }) => {
      projectsMasonry.append(card);
    });

    projectCards.splice(0, projectCards.length, ...orderedCards.map(({ card }) => card));
  };

  const syncInitialProjectVisibility = () => {
    hiddenProjectCards = [];

    projectCards.forEach((card, index) => {
      const shouldHide = index >= PROJECTS_INITIAL_VISIBLE;

      card.hidden = shouldHide;

      if (shouldHide) {
        hiddenProjectCards.push(card);
      }
    });
  };

  const resetProjectMasonryCardStyles = (card) => {
    card.style.removeProperty("width");
    card.style.removeProperty("left");
    card.style.removeProperty("top");
  };

  const disableProjectMasonry = () => {
    if (!projectsMasonry) {
      return;
    }

    projectsMasonry.classList.remove("is-enhanced");
    projectsMasonry.style.removeProperty("height");
    projectCards.forEach(resetProjectMasonryCardStyles);
  };

  const getProjectColumnCount = () => {
    if (!projectsMasonry) {
      return 1;
    }

    const styles = window.getComputedStyle(projectsMasonry);
    const columnCount = Number.parseInt(styles.getPropertyValue("--projects-columns"), 10);

    return Number.isFinite(columnCount) && columnCount > 0 ? columnCount : 1;
  };

  const resolveProjectLength = (value) => {
    const normalizedValue = value.trim();

    if (!normalizedValue) {
      return Number.NaN;
    }

    const pixelValue = Number.parseFloat(normalizedValue);

    if (/^-?\d+(?:\.\d+)?px$/.test(normalizedValue) && Number.isFinite(pixelValue)) {
      return pixelValue;
    }

    const clampMatch = normalizedValue.match(/^clamp\(\s*(-?\d+(?:\.\d+)?)px\s*,\s*(-?\d+(?:\.\d+)?)vw\s*,\s*(-?\d+(?:\.\d+)?)px\s*\)$/);

    if (clampMatch) {
      const min = Number.parseFloat(clampMatch[1]);
      const preferredViewportWidth = Number.parseFloat(clampMatch[2]);
      const max = Number.parseFloat(clampMatch[3]);
      const preferred = (window.innerWidth * preferredViewportWidth) / 100;

      return Math.min(max, Math.max(min, preferred));
    }

    return pixelValue;
  };

  const getProjectColumnGap = () => {
    if (!projectsMasonry) {
      return 0;
    }

    const styles = window.getComputedStyle(projectsMasonry);
    const explicitGap = resolveProjectLength(styles.getPropertyValue("--projects-gap"));
    const columnGap = Number.parseFloat(styles.columnGap);

    if (Number.isFinite(explicitGap)) {
      return explicitGap;
    }

    return Number.isFinite(columnGap) ? columnGap : 0;
  };

  const layoutProjectMasonry = () => {
    if (!projectsMasonry || projectCards.length === 0) {
      return;
    }

    const visibleCards = projectCards.filter((card) => !card.hidden);
    const columnCount = getProjectColumnCount();

    if (visibleCards.length === 0 || columnCount < 2) {
      disableProjectMasonry();
      return;
    }

    const containerWidth = projectsMasonry.clientWidth;

    if (!containerWidth) {
      return;
    }

    const gap = getProjectColumnGap();
    const columnWidth = (containerWidth - gap * (columnCount - 1)) / columnCount;

    if (columnWidth <= 0) {
      disableProjectMasonry();
      return;
    }

    const columnHeights = Array.from({ length: columnCount }, () => 0);

    projectsMasonry.classList.add("is-enhanced");

    visibleCards.forEach((card) => {
      card.style.width = `${columnWidth}px`;
    });

    // Place each card into the currently shortest column to avoid row gaps.
    visibleCards.forEach((card) => {
      let targetColumn = 0;

      for (let index = 1; index < columnHeights.length; index += 1) {
        if (columnHeights[index] < columnHeights[targetColumn]) {
          targetColumn = index;
        }
      }

      const x = targetColumn * (columnWidth + gap);
      const y = columnHeights[targetColumn];
      const cardHeight = card.offsetHeight;

      card.style.left = `${x}px`;
      card.style.top = `${y}px`;
      columnHeights[targetColumn] = y + cardHeight + gap;
    });

    projectsMasonry.style.height = `${Math.max(0, Math.max(...columnHeights) - gap)}px`;
  };

  const requestProjectMasonryLayout = () => {
    if (!projectsMasonry || projectCards.length === 0) {
      return;
    }

    if (projectMasonryFrame) {
      window.cancelAnimationFrame(projectMasonryFrame);
    }

    projectMasonryFrame = window.requestAnimationFrame(() => {
      projectMasonryFrame = null;
      layoutProjectMasonry();
    });
  };

  syncProjectCardOrder();
  syncInitialProjectVisibility();

  const applyClasses = (selectors, classes) => {
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.classList.add(...classes);
      });
    });
  };

  let revealObserver = null;

  const registerRevealElement = (element, delay = 0) => {
    if (!element) {
      return;
    }

    element.classList.add("reveal");
    element.style.setProperty("--reveal-delay", `${delay}ms`);
    revealElements.push(element);

    if (prefersReducedMotion) {
      element.classList.add("is-visible");
      return;
    }

    if (revealObserver) {
      revealObserver.observe(element);
    }
  };

  const enhanceProjectCard = (element, delay = 0) => {
    if (!element) {
      return;
    }

    element.classList.add("micro-float");
    registerRevealElement(element, delay);
    const media = element.querySelector(".project-photo");

    if (media) {
      media.classList.add("micro-media");
    }
  };

  const revealGroups = [
    [".company-head", 0],
    [".company-lead", 90],
    [".company-logos", 150],
    [".projects-head", 0],
    [".project-photo-card", 80],
    [".testimonials-header", 0],
    [".testimonial-review-card", 80],
    [".contact-cta-copy", 0],
    [".awards-head", 0],
    [".award-card", 90],
    [".news-head", 0],
    [".news-card", 80],
    [".news-actions", 160],
    [".site-footer-brand", 0],
    [".site-footer-contacts", 90]
  ];

  revealGroups.forEach(([selector, baseDelay]) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${baseDelay + index * 70}ms`);
      revealElements.push(element);
    });
  });

  applyClasses([
    ".award-card",
    ".news-card"
  ], ["micro-float", "micro-sheen"]);

  applyClasses([".project-photo-card"], ["micro-float"]);

  applyClasses([
    ".hero-btn-primary",
    ".hero-top-cta",
    ".company-link-text",
    ".projects-link",
    ".projects-load-more",
    ".awards-link",
    ".news-button",
    ".contact-cta-submit",
    ".testimonial-action",
    ".contact-form-channel",
    ".site-footer-contact"
  ], ["micro-button"]);

  applyClasses([
    ".project-photo",
    ".news-card-image",
    ".award-card-trophy"
  ], ["micro-media"]);

  if (projectsMasonry && projectCards.length > 0) {
    projectCards.forEach((card) => {
      const media = card.querySelector(".project-photo-media");

      if (media && !media.complete) {
        media.addEventListener("load", requestProjectMasonryLayout);
        media.addEventListener("error", requestProjectMasonryLayout);
      }
    });

    if ("ResizeObserver" in window) {
      const projectMasonryResizeObserver = new ResizeObserver((entries) => {
        const [entry] = entries;

        if (!entry) {
          return;
        }

        const nextWidth = Math.round(entry.contentRect.width);

        if (nextWidth === lastProjectMasonryWidth) {
          return;
        }

        lastProjectMasonryWidth = nextWidth;
        requestProjectMasonryLayout();
      });

      projectMasonryResizeObserver.observe(projectsMasonry);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        requestProjectMasonryLayout();
      });
    }

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        requestProjectMasonryLayout();
      }
    });

    window.addEventListener("load", requestProjectMasonryLayout, { once: true });
    window.addEventListener("resize", requestProjectMasonryLayout);
    requestProjectMasonryLayout();
  }

  if (prefersReducedMotion) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  const syncProjectLoadButtonState = () => {
    if (!projectLoadButton) {
      return;
    }

    projectLoadButton.hidden = hiddenProjectCards.length === 0;
  };

  const revealProjectBatch = () => {
    const nextProjects = hiddenProjectCards.splice(0, hiddenProjectCards.length);

    nextProjects.forEach((card, index) => {
      card.hidden = false;
      enhanceProjectCard(card, 80 + index * 70);
    });

    if (nextProjects.length > 0) {
      requestProjectMasonryLayout();
    }

    syncProjectLoadButtonState();
    return nextProjects.length > 0;
  };

  syncProjectLoadButtonState();

  if (projectLoadButton && !projectLoadButton.hidden) {
    projectLoadButton.addEventListener("click", () => {
      revealProjectBatch();
    });
  }

  document.addEventListener("click", (event) => {
    const projectLink = event.target.closest("[data-project-target]");

    if (!projectLink) {
      return;
    }

    const targetId = projectLink.dataset.projectTarget;
    const target = targetId ? document.getElementById(targetId) : null;

    if (!target) {
      return;
    }

    event.preventDefault();

    if (target.hidden) {
      revealProjectBatch();
    }

    requestProjectMasonryLayout();

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center"
        });
      });
    });
  });

  if (heroHeader) {
    let wasStickyState = null;

    const updateStickyHeader = () => {
      const triggerPoint = 56;
      const isSticky = window.scrollY > triggerPoint;

      if (isSticky === wasStickyState) {
        return;
      }

      wasStickyState = isSticky;
      heroHeader.classList.toggle("is-sticky", isSticky);

      syncHeroLogo(isSticky);
    };

    updateStickyHeader();
    window.addEventListener("scroll", updateStickyHeader, { passive: true });
    window.addEventListener("resize", updateStickyHeader);
  }

  if (heroMenuToggle) {
    heroMenuToggle.addEventListener("click", toggleHeroMenu);
  }

  [heroTopNav, heroTopControls].forEach((group) => {
    group?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeHeroMenu();
      });
    });
  });

  window.addEventListener("resize", () => {
    if (heroMenuMediaQuery.matches) {
      syncHeroMenuState();
      return;
    }

    closeHeroMenu();
  });

  syncHeroMenuState();

  const formatPhoneValue = (rawValue) => {
    const digits = rawValue.replace(/\D/g, "");
    const localDigits = (digits.startsWith("7") || digits.startsWith("8")) ? digits.slice(1, 11) : digits.slice(0, 10);

    let formatted = "+7";

    if (localDigits.length > 0) {
      formatted += ` (${localDigits.slice(0, 3)}`;
    } else {
      return `${formatted} `;
    }

    if (localDigits.length >= 4) {
      formatted += `) ${localDigits.slice(3, 6)}`;
    }

    if (localDigits.length >= 7) {
      formatted += `-${localDigits.slice(6, 8)}`;
    }

    if (localDigits.length >= 9) {
      formatted += `-${localDigits.slice(8, 10)}`;
    }

    return formatted;
  };

  const setMessengerFieldState = () => {
    messengerToggles.forEach((toggle) => {
      const target = messengerFields.get(toggle.dataset.messengerToggle);

      if (!target) {
        return;
      }

      target.hidden = !toggle.checked;
    });
  };

  const syncPhoneMethodState = () => {
    if (!phoneInput || !phoneMethodToggle) {
      return;
    }

    const digits = phoneInput.value.replace(/\D/g, "");
    const localDigits = digits.startsWith("7") ? digits.slice(1) : digits;

    phoneMethodToggle.checked = localDigits.length > 0;
  };

  const resetMessengerState = () => {
    messengerToggles.forEach((toggle) => {
      toggle.checked = false;
    });
  };

  const syncModalOpenState = () => {
    const hasVisibleModal = Array.from(contactModals).some((modal) => !modal.hidden);
    document.body.classList.toggle("modal-open", hasVisibleModal);
  };

  const openModal = (modal) => {
    if (!modal) {
      return;
    }

    closeHeroMenu();
    closeAllModals();
    modal.hidden = false;
    syncModalOpenState();

    if (modal.classList.contains("testimonial-modal")) {
      resetTestimonialViews(modal);
    } else {
      resetMessengerState();
      resetTestimonialViews(modal);

      if (phoneInput) {
        phoneInput.value = formatPhoneValue(phoneInput.value);
      }

      syncPhoneMethodState();
      setMessengerFieldState();
    }
  };

  const closeModal = (modal) => {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    resetTestimonialViews(modal);
    syncModalOpenState();
  };

  const closeAllModals = () => {
    contactModals.forEach((modal) => {
      modal.hidden = true;
      resetTestimonialViews(modal);
    });
    syncModalOpenState();
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-modal-open]");

    if (!trigger) {
      return;
    }

    event.preventDefault();
    openModal(document.getElementById(trigger.dataset.modalOpen));
  });

  modalClosers.forEach((closer) => {
    closer.addEventListener("click", () => {
      closeModal(document.getElementById(closer.dataset.modalClose));
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (isHeroMenuOpen) {
      closeHeroMenu({ restoreFocus: true });
      return;
    }

    closeAllModals();
  });

  messengerToggles.forEach((toggle) => {
    toggle.addEventListener("change", setMessengerFieldState);
  });

  if (phoneInput) {
    phoneInput.value = formatPhoneValue(phoneInput.value);

    phoneInput.addEventListener("focus", () => {
      phoneInput.value = formatPhoneValue(phoneInput.value);
    });

    phoneInput.addEventListener("input", () => {
      const cursorPos = phoneInput.selectionStart;
      const prevLen = phoneInput.value.length;
      phoneInput.value = formatPhoneValue(phoneInput.value);
      const newLen = phoneInput.value.length;
      const newPos = Math.max(0, cursorPos + (newLen - prevLen));
      phoneInput.setSelectionRange(newPos, newPos);
      syncPhoneMethodState();
    });
  }

  syncPhoneMethodState();
  setMessengerFieldState();
  initStatCounters();
};

if (window.sharedPartialsReady && typeof window.sharedPartialsReady.then === "function") {
  window.sharedPartialsReady
    .then(initSite)
    .catch(() => {
      initSite();
    });
} else {
  initSite();
}
