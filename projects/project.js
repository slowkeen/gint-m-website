(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  const projectEntries = [
    ["kit-med", "Кит Мед", "../photos/kit-med/web/kitmed_1.jpg", "Кит Мед", 1800, 1202],
    ["skolkovo-park", "Сколково Парк", "../photos/skolkovo-park/1.jpg", "Сколково Парк", 3974, 3197],
    ["avito-spb", "Авито Санкт-Петербург", "../photos/avito-spb/glavnoe_foto.jpg", "Авито Санкт-Петербург", 1600, 1067],
    ["winline", "Winline", "../photos/Winline/part4854_glavnoe_foto.jpg", "Winline", 3500, 2333],
    ["samsung", "Samsung", "../photos/Samsung/part1987.jpg", "Samsung", 1071, 1500],
    ["skolkovo-vet", "Skolkovo Vet", "../photos/skolkovo-vet/part4859.jpg", "Skolkovo Vet", 2100, 1500],
    ["natsproektstroy", "ГК Нацпроектстрой", "../photos/natsproektstroy/1.jpg", "ГК Нацпроектстрой", 1600, 1067],
    ["restaurant-skolkovo-park", "Ресторан Сколково Парк", "../photos/restaurant-skolkovo/1-1.jpg", "Ресторан Сколково Парк", 1600, 1067],
    ["ab-development", "AB Development", "../photos/ab-development/122a3918_glavnoe_foto.jpg", "AB Development", 1600, 1067],
    ["krylatskie-holmy", "БЦ Крылатские Холмы", "../photos/krylatskie-holmy/glavnoe_foto.jpg", "БЦ Крылатские Холмы", 1600, 1067],
    ["align", "Align", "../photos/Align/glavnoe.jpg", "Align", 1600, 1067],
    ["avito-spb-2021", "AVITO САНКТ-ПЕТЕРБУРГ", "../photos/avito-spb-2021/glavnoe-1.jpg", "AVITO САНКТ-ПЕТЕРБУРГ 2021", 1600, 1067],
    ["avito-cks", "Авито ЦКС", "../photos/avito-cks/1142.png", "Авито ЦКС", 1183, 888],
    ["international-bank", "Международный банк", "../photos/mejdunarodniy-bank/dsc_4648_glavnoe.jpg", "Международный банк", 8219, 5479],
    ["avito-spb-2020", "Авито Санкт-Петербург", "../photos/avito-spb-2020/1.jpg", "Авито Санкт-Петербург 2020", 2000, 1334],
    ["snigeri-school", "Частная школа \"Снегири\"", "../photos/Snigeri/part0013.jpg", "Частная школа Снегири", 2400, 1500],
    ["align-technology", "Align Technology", "../photos/Align-technology/part0928.jpg", "Align Technology", 3000, 1875],
    ["bnp-paribas", "BNP Paribas", "../photos/bnp-paribas/part8100.jpg", "BNP Paribas", 1500, 1000],
    ["dell", "Dell", "../photos/dell/part9384.jpg", "Dell", 1500, 1000],
    ["avito-moscow", "Авито Москва", "../photos/Avito-Moscow/y8a6863_glavnoe_result.jpg", "Авито Москва", 1800, 1200],
    ["s7-airlines", "S7 Airlines", "../photos/s7-airlines/img_1711.jpg", "S7 Airlines", 1800, 1200],
    ["philip-morris", "Philip Morris", "../photos/Philip morris/img_5954.jpg", "Philip Morris", 2048, 1319]
  ];

  const placeholderDurations = ["7 мес.", "11 мес.", "9 мес.", "14 мес.", "6 мес.", "8 мес."];
  const placeholderAreas = [1450, 2200, 1860, 3140, 970, 2680, 1520, 4050];
  const placeholderYears = [2024, 2023, 2022, 2021, 2020, 2019];
  const projectYearBySlug = {
    "kit-med": 2025,
    "skolkovo-park": 2025,
    "avito-spb": 2021,
    "winline": 2022,
    "samsung": 2018,
    "skolkovo-vet": 2019,
    "natsproektstroy": 2024,
    "restaurant-skolkovo-park": 2024,
    "ab-development": 2023,
    "krylatskie-holmy": 2023,
    "align": 2022,
    "avito-spb-2021": 2021,
    "avito-cks": 2021,
    "international-bank": 2021,
    "avito-spb-2020": 2020,
    "snigeri-school": 2020,
    "align-technology": 2020,
    "bnp-paribas": 2020,
    "dell": 2020,
    "avito-moscow": 2020,
    "s7-airlines": 2019,
    "philip-morris": 2019
  };
  const placeholderAddresses = [
    "Москва, ЦАО",
    "Москва, Пресненская наб.",
    "Москва, Ленинградский пр-т",
    "Москва, Ходынский б-р",
    "Москва, Варшавское ш.",
    "Москва, Белорусский деловой район"
  ];

  const createGalleryItem = (src, alt, width, height) => ({ src, alt, width, height });

  const createClientReview = ({
    clientCardTitle = "Клиент",
    clientName = "",
    clientPersonName = "",
    clientPersonRole = "",
    clientSector = "",
    clientQuote = "",
    clientLogoSrc = "",
    clientLogoAlt = "",
    clientLogoWidth = 220,
    clientLogoHeight = 72,
    reviewPreviewImage = "",
    reviewPreviewAlt = "",
    reviewPreviewWidth = 1241,
    reviewPreviewHeight = 1755,
    reviewAddress = "",
    reviewBody = []
  }) => ({
    clientCardTitle,
    clientName,
    clientPersonName,
    clientPersonRole,
    clientSector,
    clientQuote,
    clientLogoSrc,
    clientLogoAlt,
    clientLogoWidth,
    clientLogoHeight,
    reviewPreviewImage,
    reviewPreviewAlt,
    reviewPreviewWidth,
    reviewPreviewHeight,
    reviewAddress,
    reviewBody
  });

  const createProjectAward = ({
    title = "",
    imageSrc = "",
    imageAlt = "",
    imageWidth = 1024,
    imageHeight = 1536
  }) => ({
    title,
    imageSrc,
    imageAlt,
    imageWidth,
    imageHeight
  });

  const buildPlaceholderMetrics = (slug, index) => ({
    workScope: "\u041f\u043e\u043b\u043d\u044b\u0439 \u043a\u043e\u043c\u043f\u043b\u0435\u043a\u0441 \u0441\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u043d\u044b\u0445, \u043e\u0442\u0434\u0435\u043b\u043e\u0447\u043d\u044b\u0445 \u0438 \u0438\u043d\u0436\u0435\u043d\u0435\u0440\u043d\u044b\u0445 \u0440\u0430\u0431\u043e\u0442",
    duration: placeholderDurations[index % placeholderDurations.length],
    area: `${placeholderAreas[index % placeholderAreas.length].toLocaleString("ru-RU")} \u043c\u00b2`,
    year: String(projectYearBySlug[slug] ?? placeholderYears[index % placeholderYears.length]),
    address: placeholderAddresses[index % placeholderAddresses.length]
  });

  const sharedReviews = {
    align: createClientReview({
      clientCardTitle: "Клиент",
      clientName: "Align Technology",
      clientSector: "Рекомендательное письмо по офисному проекту в БЦ «Даниловская Мануфактура».",
      clientQuote: "Проект был сдан в оговоренные сроки, в ожидаемом нами качестве и без превышения бюджета проекта.",
      clientLogoSrc: "../logos/clients/color/Align-logo.svg",
      clientLogoAlt: "Align Technology",
      clientLogoWidth: 220,
      clientLogoHeight: 72,
      reviewPreviewImage: "../reviews/Align/rekomendatel_noe_pis_mo_align_red_1_page-0001.jpg",
      reviewPreviewAlt: "Скан рекомендательного письма Align Technology",
      reviewPreviewWidth: 1241,
      reviewPreviewHeight: 1755,
      reviewAddress: "Генеральному директору ООО «ЮНАЙТЕД КОНТРАКТОРС ГИНТ-М» Гришину В. Н.",
      reviewBody: [
        "Компания Align Technology Inc. благодарит команду «Гинт-М» за реализацию офисного проекта компании, расположенного в БЦ «Даниловская Мануфактура» по адресу Варшавское шоссе, 9 стр. 1Б. «Гинт-М» в роли генерального подрядчика выполняла рабочее проектирование, демонтаж, весь комплекс общестроительных, инженерных, а также пусконаладочных работ.",
        "Реализация проекта отмечена высоким уровнем планирования и организации работ. Проект был сдан в оговоренные сроки, в ожидаемом нами качестве, и без превышения бюджета проекта.",
        "Профессионализм «Гинт-М» заслуживает самой высокой оценки. Готовы отметить высокий уровень ответственности, организационных способностей руководителя и менеджера данного проекта, профессионализм, четкость, оперативность в выполнении задач и индивидуальный подход к реализации проекта, благодаря которым компания Align Technology Inc получила современное технологичное пространство, соответствующее всем рабочим процессам. Искренне рекомендуем «Гинт-М» как надежного партнера в сфере строительства и генподряда."
      ]
    }),
    winline: createClientReview({
      clientCardTitle: "Клиент",
      clientName: "Winline",
      clientSector: "Рекомендательное письмо по офисному проекту в БЦ «Якорь».",
      clientQuote: "Проект был сдан раньше согласованного срока и без компромиссов по качеству.",
      clientLogoSrc: "../logos/clients/color/winline-logo.svg",
      clientLogoAlt: "Winline",
      clientLogoWidth: 220,
      clientLogoHeight: 72,
      reviewPreviewImage: "../reviews/Winline/rek_pis_mo_gint-m_rus-1.png",
      reviewPreviewAlt: "Скан рекомендательного письма Winline",
      reviewPreviewWidth: 1654,
      reviewPreviewHeight: 2339,
      reviewAddress: "Рекомендательное письмо от компании Winline",
      reviewBody: [
        "Компания Winline благодарит строительную компанию «Гинт-М» за реализацию корпоративного офисного проекта, расположенного в бизнес-центре «Якорь» по адресу: Пресненская наб., д. 2. Общая площадь проекта 1800 кв. м.",
        "Команда «Гинт-М» выступила в проекте в роли генерального подрядчика, осуществив полный комплекс общестроительных, отделочных и инженерных работ, а также рабочее проектирование.",
        "Команда реализовала проект на высоком профессиональном уровне, несмотря на ряд объективных сложностей: непростую дистрибуцию некоторых материалов и оборудования из Европы в условиях ковидных ограничений, ряд изменений в проекте по инициативе заказчика, что привело к частичному перепроектированию офиса. Несмотря на все это проект был сдан раньше согласованного срока и без компромиссов по качеству.",
        "Отдельного упоминания заслуживают нестандартные решения в проекте: сложные потолочные конструкции и системы, крытые плинтуса, нестандартное решение по вопросу вентиляции и кондиционирования. Подрядчик искал наилучшие решения из возможных, не вел по пути «наименьшего сопротивления», а предлагал действительно эффективные решения, которые в итоге сделали офис Winline технически продуманным и по-настоящему комфортным.",
        "Команда «Гинт-М» эффективно коммуницирует не только с заказчиком, но и со службами здания, оперативно согласовывая все необходимые работы, а также с субподрядчиками, задействованными в проекте, в итоге все работы идут в четком соответствии с намеченным графиком, без организационных форс-мажоров.",
        "Исходя из вышеизложенного мы характеризуем команду «Гинт-М» как профессионального и надежного партнера в строительной области и рекомендуем ее всем тем, кто стремится реализовать качественный проект в предсказуемые сроки и в рамках согласованного бюджета."
      ]
    }),
    dell: createClientReview({
      clientCardTitle: "Клиент",
      clientName: "Dell Technologies",
      clientSector: "Corporate office fit-out, рекомендательное письмо от 10 февраля 2021 года.",
      clientQuote: "We confirm their strict compliance with the schedule and the ability to keep all deadlines without sacrificing the quality of work.",
      clientLogoSrc: "../logos/clients/color/Dell-logo.svg",
      clientLogoAlt: "Dell Technologies",
      clientLogoWidth: 190,
      clientLogoHeight: 64,
      reviewPreviewImage: "../reviews/Dell/rekomendatel_noe_pis_mo_dell_page-0001.jpg",
      reviewPreviewAlt: "Скан рекомендательного письма Dell Technologies",
      reviewPreviewWidth: 1240,
      reviewPreviewHeight: 1755,
      reviewAddress: "February 10, 2021",
      reviewBody: [
        "DELL Technologies would like to thank the fit-out contractor Gint-M for the design and construction of our corporate office located at Moscow, 10 Presnenskaya nab., block C (Naberezhnaya Tower BC, MIBC Moscow City).",
        "Functioning as general contractor, Gint-M has completed the entire range of general construction works including mechanical and electrical systems. Gint-M has also performed detailed design.",
        "It took the team of Gint-M four months to complete this sophisticated 2,400-sqm project.",
        "The general contractor’s team is in confident command of all necessary engineering and building competences for quality project delivery. We confirm their strict compliance with the schedule and the ability to keep all deadlines without sacrificing the quality of work."
      ]
    })
  };

  const projectOverrides = {
    "kit-med": {
      award: createProjectAward({
        title: "Best Office Awards",
        imageSrc: "../awards/photos/2020/02-best-office-awards-nlmk/ChatGPT Image 9 апр. 2026 г., 19_09_45.png",
        imageAlt: "Награда Best Office Awards",
        imageWidth: 1024,
        imageHeight: 1536
      }),
      galleryLayout: ["pair", "review", "full"],
      galleryLayoutOptions: {
        randomize: true,
        continueAlternating: true,
        preferPortraitReviewImage: true,
        seed: "kit-med-gallery-v2",
        swapReviewPairWithQueueGalleryIndex: 9
      },
      gallery: [
        createGalleryItem("../photos/kit-med/web/kitmed_1.jpg", "Кит Мед — фото 1", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kitmed_2.jpg", "Кит Мед — фото 2", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kitmed_3.jpg", "Кит Мед — фото 3", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kitmed_4.jpg", "Кит Мед — фото 4", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_5.jpg", "Кит Мед — фото 5", 1202, 1800),
        createGalleryItem("../photos/kit-med/web/kit_med_6.jpg", "Кит Мед — фото 6", 1800, 1203),
        createGalleryItem("../photos/kit-med/web/kit_med_7.jpg", "Кит Мед — фото 7", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_8.jpg", "Кит Мед — фото 8", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_9.jpg", "Кит Мед — фото 9", 1800, 1200),
        createGalleryItem("../photos/kit-med/web/kit_med_10.jpg", "Кит Мед — фото 10", 1800, 1200),
        createGalleryItem("../photos/kit-med/web/kit_med_11.jpg", "Кит Мед — фото 11", 1800, 1224),
        createGalleryItem("../photos/kit-med/web/kit_med_12.jpg", "Кит Мед — фото 12", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_13.jpg", "Кит Мед — фото 13", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_14.jpg", "Кит Мед — фото 14", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_15.jpg", "Кит Мед — фото 15", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_16.jpg", "Кит Мед — фото 16", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_17.jpg", "Кит Мед — фото 17", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_18.jpg", "Кит Мед — фото 18", 1200, 1800),
        createGalleryItem("../photos/kit-med/web/kit_med_19.jpg", "Кит Мед — фото 19", 1800, 1202),
        createGalleryItem("../photos/kit-med/web/kit_med_20.jpg", "Кит Мед — фото 20", 1800, 1200)
      ],
      descriptionLead: "Полный комплекс работ по строительству, отделке и инженерному оснащению офисных помещений Заказчика.",
      workScope: "Полный комплекс работ по строительству, отделке и инженерному оснащению офисных помещений Заказчика.",
      duration: "10.02.2025 — 16.07.2025",
      startDate: "10.02.2025",
      endDate: "16.07.2025",
      area: "1100 м²",
      year: "2025",
      address: "Россия, Москва, проезд Бумажный, д. 19, помещ. 9/1С",
      summary: "Офис «Кит Мед» в STONE TOWERS — рабочее и обучающее пространство для команды, гостей и профессионального развития специалистов.",
      about: [
        "Проект реализован для компании «Кит Мед» в бизнес-центре класса A STONE TOWERS, башня C. Пространство задумывалось не только как повседневный офис, но и как среда, совмещающая рабочие процессы, прием гостей и обучающую функцию.",
        "На площади 1 100 м² разместили рабочие места для команды до 60 человек и организовали три функциональные зоны: блок для инженеров, зону отдела продаж и многофункциональное пространство обучения. В его состав вошли три медицинских кабинета, библиотека и площадка Doctor Star School для профессионального развития специалистов индустрии эстетической медицины."
      ],
      role: [
        "Gint-M выступала на объекте генеральным подрядчиком и выполняла полный комплекс строительных, отделочных и инженерных работ по офисным помещениям заказчика.",
        "В рамках реализации команда выполнила отделку и инженерное оснащение офиса, а также интегрировала ряд нестандартных решений: двойное остекление, систему умного дома, светильники индивидуальной разработки, большой объем мебели спецзаказа и шпонированные панели по периметру офиса, в кабинетах и переговорных."
      ],
      clientName: "Кит Мед",
      clientPersonName: "Дмитрий Васильевич Клабуков",
      clientPersonRole: "Владелец компании «Кит Мед»",
      clientQuote: "В новом офисе было важно не только обеспечить функциональность и удобство для сотрудников, но и создать атмосферу уюта, которая подчеркивает статус компании.",
      reviewAddress: "Комментарий владельца компании «Кит Мед»",
      reviewBody: [
        "Владелец компании «Кит Мед», Дмитрий Васильевич Клабуков, поделился своими впечатлениями от переезда компании в новый офис. Он подчеркнул, что при создании этого пространства ставилась задача не просто обеспечить функциональность и удобство для сотрудников, но и создать атмосферу уюта и подчеркнуть статусность компании.",
        "Именно поэтому проект был ориентирован не только на рабочую эффективность, но и на создание среды для встреч, обучения и комфортной повседневной работы сотрудников и гостей компании."
      ]
    },
    align: {
      ...sharedReviews.align
    },
    winline: {
      area: "1 800 м²",
      address: "Москва, Пресненская наб., 2",
      ...sharedReviews.winline
    },
    dell: {
      duration: "4 мес.",
      area: "2 400 м²",
      year: "2020",
      address: "Москва, Пресненская наб., 10, блок C",
      ...sharedReviews.dell
    }
  };

  const projectCatalog = projectEntries
    .map(([slug, title, image, alt, width, height], index) => ({
      slug,
      title,
      image,
      alt,
      width,
      height,
      gallery: [createGalleryItem(image, alt, width, height)],
      ...buildPlaceholderMetrics(slug, index),
      summary: "Кейс проекта Gint-M. Страница находится в наполнении и будет дополнена фактами об объекте.",
      descriptionLead: "Полный комплекс строительных, отделочных и инженерных работ на объекте.",
      startDate: "",
      endDate: "",
      about: [
        "Раздел «О проекте» подготовлен под финальное описание объекта, архитектурной задачи и ключевых решений по реализации."
      ],
      role: [
        "В этом блоке появится финальное описание роли Gint-M, состава работ и зоны ответственности команды на объекте."
      ],
      clientCardTitle: "",
      clientName: "",
      clientSector: "",
      clientQuote: "",
      clientLogoSrc: "",
      clientLogoAlt: "",
      clientLogoWidth: 220,
      clientLogoHeight: 72,
      reviewPreviewImage: "",
      reviewPreviewAlt: "",
      reviewPreviewWidth: 1241,
      reviewPreviewHeight: 1755,
      reviewAddress: "",
      reviewBody: [],
      clientPersonName: "",
      clientPersonRole: ""
    }))
    .map((project) => ({
      ...project,
      ...(projectOverrides[project.slug] ?? {})
    }));

  const renderParagraphs = (target, paragraphs) => {
    if (!target) {
      return;
    }

    target.replaceChildren(
      ...(paragraphs || []).map((text) => {
        const paragraph = document.createElement("p");
        paragraph.textContent = text;
        return paragraph;
      })
    );
  };

  const firstText = (...values) => {
    for (const value of values) {
      if (typeof value === "string" && value.trim()) {
        return value.trim();
      }
    }

    return "";
  };

  const toParagraphs = (items) => (
    Array.isArray(items)
      ? items
        .filter((item) => typeof item === "string" && item.trim())
        .map((item) => item.trim())
      : []
  );

  const createSeededRandom = (seedValue = "") => {
    let seed = 2166136261;

    for (const character of String(seedValue)) {
      seed ^= character.charCodeAt(0);
      seed = Math.imul(seed, 16777619);
    }

    return () => {
      seed += 0x6D2B79F5;
      let nextValue = seed;
      nextValue = Math.imul(nextValue ^ (nextValue >>> 15), nextValue | 1);
      nextValue ^= nextValue + Math.imul(nextValue ^ (nextValue >>> 7), nextValue | 61);
      return ((nextValue ^ (nextValue >>> 14)) >>> 0) / 4294967296;
    };
  };

  const shuffleGalleryItems = (items, random) => {
    const shuffledItems = items.slice();

    for (let index = shuffledItems.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [shuffledItems[index], shuffledItems[swapIndex]] = [shuffledItems[swapIndex], shuffledItems[index]];
    }

    return shuffledItems;
  };

  const pickReviewPairImage = (items, random) => {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }

    const portraitCandidates = items
      .map((item, index) => ({
        index,
        ratio: item.width && item.height ? item.width / item.height : 1
      }))
      .filter(({ ratio }) => Number.isFinite(ratio) && ratio <= 0.9);

    if (portraitCandidates.length > 0) {
      const selectedPortrait = portraitCandidates[Math.floor(random() * portraitCandidates.length)];
      return items.splice(selectedPortrait.index, 1)[0];
    }

    let bestIndex = 0;
    let bestScore = Number.NEGATIVE_INFINITY;

    items.forEach((item, index) => {
      const ratio = item.width && item.height ? item.width / item.height : 1;
      const closenessToTallCard = -Math.abs(ratio - 0.68);
      const softerLandscapeBonus = ratio < 1.2 ? 0.35 : 0;
      const score = closenessToTallCard + softerLandscapeBonus + (random() * 0.05);

      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });

    return items.splice(bestIndex, 1)[0];
  };

  const createGalleryFigure = (item, index, projectTitle, { isHero = false } = {}) => {
    const figure = document.createElement("figure");
    const trigger = document.createElement("button");
    const image = document.createElement("img");
    const resolvedIndex = Number.isInteger(item.galleryIndex) ? item.galleryIndex : index;

    figure.className = "project-case-stream-item";

    if (isHero) {
      figure.classList.add("project-case-stream-item-hero");
    }

    trigger.type = "button";
    trigger.className = "project-case-stream-trigger";
    trigger.dataset.galleryIndex = String(resolvedIndex);
    trigger.setAttribute("aria-label", `Открыть фото ${resolvedIndex + 1}`);

    image.className = "project-case-stream-image";
    image.src = item.src;
    image.alt = item.alt || `${projectTitle} — фото ${resolvedIndex + 1}`;
    image.width = item.width;
    image.height = item.height;
    image.loading = "eager";
    image.decoding = "async";
    image.fetchPriority = isHero || resolvedIndex < 4 ? "high" : "auto";

    trigger.append(image);
    figure.append(trigger);
    return figure;
  };

  const applyGalleryVariant = (figure, variant = "half") => {
    figure.classList.toggle("project-case-stream-item-full", variant === "full");
    figure.classList.toggle("project-case-stream-item-review-pair", variant === "review");
    return figure;
  };

  const defaultGalleryLayout = ["full", "pair", "full", "pair", "review"];

  const buildSecondaryGalleryNodes = (
    items,
    projectTitle,
    reviewNode = null,
    layoutPattern = defaultGalleryLayout,
    layoutOptions = {}
  ) => {
    const options = {
      randomize: false,
      continueAlternating: false,
      preferPortraitReviewImage: false,
      swapReviewPairWithQueueGalleryIndex: null,
      seed: projectTitle,
      ...layoutOptions
    };
    const nodes = [];
    const workingItems = Array.isArray(items) ? items.slice() : [];
    const random = createSeededRandom(options.seed || projectTitle);
    let reviewPairItem = reviewNode && options.preferPortraitReviewImage
      ? pickReviewPairImage(workingItems, random)
      : null;
    const queue = options.randomize ? shuffleGalleryItems(workingItems, random) : workingItems;

    if (reviewPairItem && Number.isInteger(options.swapReviewPairWithQueueGalleryIndex)) {
      const swapIndex = queue.findIndex((item) => item.galleryIndex === options.swapReviewPairWithQueueGalleryIndex);

      if (swapIndex >= 0) {
        const queuedSwapItem = queue[swapIndex];
        queue[swapIndex] = reviewPairItem;
        reviewPairItem = queuedSwapItem;
      }
    }
    let cursor = 0;
    let reviewInserted = false;
    let lastMediaStep = null;

    if (reviewNode) {
      reviewNode.classList.remove("project-case-gallery-review-wide");
    }

    const pushFigure = (item, variant = "half") => {
      const figure = createGalleryFigure(item, item.galleryIndex ?? 0, projectTitle);
      nodes.push(applyGalleryVariant(figure, variant));
      return true;
    };

    const pushImage = (variant = "half") => {
      if (cursor >= queue.length) {
        return false;
      }

      pushFigure(queue[cursor], variant);
      cursor += 1;
      return true;
    };

    const pushPair = () => {
      if (cursor >= queue.length) {
        return false;
      }

      if (queue.length - cursor === 1) {
        return pushImage("full");
      }

      const pushedFirst = pushImage("half");
      const pushedSecond = pushImage("half");
      return pushedFirst || pushedSecond;
    };

    const pushReviewPair = () => {
      if (!reviewNode || reviewInserted) {
        return false;
      }

      if (reviewPairItem) {
        pushFigure(reviewPairItem, "review");
        reviewNode.classList.remove("project-case-gallery-review-wide");
      } else if (!pushImage("review")) {
        reviewNode.classList.add("project-case-gallery-review-wide");
      } else {
        reviewNode.classList.remove("project-case-gallery-review-wide");
      }

      nodes.push(reviewNode);
      reviewInserted = true;
      return true;
    };

    const applyStep = (step) => {
      switch (step) {
        case "full":
          if (pushImage("full")) {
            lastMediaStep = "full";
          }
          break;
        case "pair":
          if (pushPair()) {
            lastMediaStep = "pair";
          }
          break;
        case "review":
          if (reviewNode) {
            pushReviewPair();
          } else if (pushPair()) {
            lastMediaStep = "pair";
          }
          break;
        default:
          break;
      }
    };

    (Array.isArray(layoutPattern) ? layoutPattern : defaultGalleryLayout).forEach((step) => {
      applyStep(step);
    });

    if (options.continueAlternating) {
      let nextStep = lastMediaStep === "pair" ? "full" : "pair";

      while (cursor < queue.length) {
        const pushed = nextStep === "pair"
          ? pushPair()
          : pushImage("full");

        if (!pushed) {
          break;
        }

        lastMediaStep = nextStep;
        nextStep = nextStep === "pair" ? "full" : "pair";
      }
    } else {
      while (cursor < queue.length) {
        pushPair();
      }
    }

    if (reviewNode && !reviewInserted) {
      reviewNode.classList.add("project-case-gallery-review-wide");
      nodes.push(reviewNode);
    }

    return nodes;
  };

  const params = new URLSearchParams(window.location.search);
  const requestedSlug = params.get("slug");
  const currentIndex = projectCatalog.findIndex((entry) => entry.slug === requestedSlug);
  const resolvedIndex = currentIndex >= 0 ? currentIndex : 0;
  const project = projectCatalog[resolvedIndex];

  if (!project) {
    return;
  }

  if (currentIndex < 0) {
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set("slug", project.slug);
    window.history.replaceState({}, "", nextUrl);
  }

  const metaDescription = document.querySelector('meta[name="description"]');
  const galleryHero = document.getElementById("project-case-gallery-hero");
  const galleryGridSection = document.getElementById("project-case-gallery-grid-section");
  const galleryReview = document.getElementById("project-case-gallery-review");
  const galleryStream = document.getElementById("project-case-gallery-stream");
  const yearBadge = document.getElementById("project-case-year");
  const headlineCopy = document.getElementById("project-case-headline-copy");
  const headlineSummary = document.getElementById("project-case-summary");
  const headlineReadMore = document.getElementById("project-case-summary-read-more");
  const descriptionLayout = document.getElementById("project-case-description-layout");
  const dateStartCard = document.getElementById("project-case-date-start-card");
  const dateStartLabel = document.getElementById("project-case-date-start-label");
  const dateStartValue = document.getElementById("project-case-date-start");
  const dateEndCard = document.getElementById("project-case-date-end-card");
  const dateEndValue = document.getElementById("project-case-date-end");
  const awardCard = document.getElementById("project-case-award");
  const awardImage = document.getElementById("project-case-award-image");
  const awardTitle = document.getElementById("project-case-award-title");
  const clientCard = document.getElementById("project-case-client-card");
  const clientBrand = document.getElementById("project-case-client-brand");
  const clientLogo = document.getElementById("project-client-logo");
  const clientName = document.getElementById("project-client-name");
  const clientRole = document.getElementById("project-client-role");
  const clientQuoteCopy = document.getElementById("project-client-quote");
  const clientReadMore = document.getElementById("project-client-read-more");
  const nextTrack = document.getElementById("project-case-next-track");
  const nextPrev = document.getElementById("project-case-next-prev");
  const nextNext = document.getElementById("project-case-next-next");
  const galleryModal = document.getElementById("project-gallery-modal");
  const galleryBackdrop = document.getElementById("project-gallery-backdrop");
  const galleryClose = document.getElementById("project-gallery-close");
  const galleryLightboxImage = document.getElementById("project-gallery-lightbox-image");
  const galleryLightboxPrev = document.getElementById("project-gallery-lightbox-prev");
  const galleryLightboxNext = document.getElementById("project-gallery-lightbox-next");
  const reviewModal = document.getElementById("project-client-review-modal");
  const reviewBackdrop = document.getElementById("project-client-review-backdrop");
  const reviewClose = document.getElementById("project-client-review-close");
  const reviewPreview = document.getElementById("project-client-review-preview");
  const reviewImage = document.getElementById("project-client-review-image");
  const reviewAddress = document.getElementById("project-client-review-address");
  const reviewCopy = document.getElementById("project-client-review-copy");
  const detailsModal = document.getElementById("project-case-details-modal");
  const detailsBackdrop = document.getElementById("project-case-details-backdrop");
  const detailsClose = document.getElementById("project-case-details-close");
  const detailsTitle = document.getElementById("project-case-details-title");
  const detailsLead = document.getElementById("project-case-details-lead");
  const detailsCopy = document.getElementById("project-case-details-copy");
  const detailsRoleSection = document.getElementById("project-case-details-role-section");
  const detailsRoleCopy = document.getElementById("project-case-details-role-copy");
  const breadcrumbCurrent = document.getElementById("project-case-breadcrumb-current");

  document.title = `ГИНТ-М — ${project.title}`;

  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `Проект ГИНТ-М — ${project.title}. ${project.descriptionLead || project.summary || project.workScope || ""}`.trim()
    );
  }

  const setText = (id, value) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  };

  const syncBodyModalState = () => {
    const hasOpenModal = Boolean(
      (galleryModal && !galleryModal.hidden)
      || (reviewModal && !reviewModal.hidden)
      || (detailsModal && !detailsModal.hidden)
    );

    document.body.classList.toggle("modal-open", hasOpenModal);
  };

  setText("project-case-title", project.title);
  if (breadcrumbCurrent) {
    breadcrumbCurrent.textContent = project.title;
  }
  setText("project-case-area", project.area);
  setText("project-case-address", project.address);

  const hasProjectAward = Boolean(
    project.award
    && typeof project.award === "object"
    && project.award.imageSrc
    && project.award.title
  );

  if (yearBadge) {
    yearBadge.hidden = !project.year;
    yearBadge.textContent = project.year || "";
  }

  if (descriptionLayout) {
    descriptionLayout.classList.toggle("project-case-description-layout-has-award", hasProjectAward);
  }

  const descriptionGrid = descriptionLayout?.querySelector(".project-case-description-grid");
  let descriptionMain = descriptionLayout?.querySelector(".project-case-description-main");

  if (descriptionLayout && descriptionGrid) {
    if (!descriptionMain) {
      descriptionMain = document.createElement("div");
      descriptionMain.className = "project-case-description-main";
      descriptionLayout.insertBefore(descriptionMain, descriptionGrid);
    }

    if (headlineCopy && !descriptionMain.contains(headlineCopy)) {
      descriptionMain.append(headlineCopy);
    }

    if (!descriptionMain.contains(descriptionGrid)) {
      descriptionMain.append(descriptionGrid);
    }
  }

  if (awardCard) {
    awardCard.hidden = !hasProjectAward;
  }

  if (awardImage) {
    if (hasProjectAward) {
      awardImage.src = project.award.imageSrc;
      awardImage.alt = project.award.imageAlt || project.award.title || "Project award";
      awardImage.width = project.award.imageWidth || 1024;
      awardImage.height = project.award.imageHeight || 1536;
    } else {
      awardImage.src = transparentPixel;
      awardImage.alt = "";
    }
  }

  if (awardTitle) {
    awardTitle.textContent = hasProjectAward ? (project.award.title || "") : "";
  }

  const galleryItems = Array.isArray(project.gallery) && project.gallery.length > 0
    ? project.gallery
    : [createGalleryItem(project.image, project.alt, project.width, project.height)];
  const galleryRenderItems = galleryItems.map((item, index) => ({
    ...item,
    galleryIndex: index
  }));
  const clientFeatureItem = galleryItems[Math.min(1, galleryItems.length - 1)] || galleryItems[0];

  if (dateStartLabel && dateStartValue) {
    if (project.startDate) {
      dateStartLabel.textContent = "Начало";
      dateStartValue.textContent = project.startDate;
    } else {
      dateStartLabel.textContent = "Срок реализации";
      dateStartValue.textContent = project.duration || "—";
    }
  }

  if (dateEndCard && dateEndValue) {
    if (project.endDate) {
      dateEndCard.hidden = false;
      dateEndValue.textContent = project.endDate;
    } else {
      dateEndCard.hidden = true;
    }
  }

  const summaryText = firstText(project.summary, project.descriptionLead, project.workScope);
  const detailsLeadText = firstText(project.descriptionLead, project.workScope, project.summary);
  const aboutParagraphs = toParagraphs(project.about);
  const roleParagraphs = toParagraphs(project.role);
  const detailParagraphs = [];
  const detailParagraphSet = new Set();
  const pushDetailParagraph = (value) => {
    const text = firstText(value);

    if (!text || detailParagraphSet.has(text)) {
      return;
    }

    detailParagraphSet.add(text);
    detailParagraphs.push(text);
  };

  pushDetailParagraph(project.summary);
  aboutParagraphs.forEach(pushDetailParagraph);

  const detailBodyParagraphs = detailParagraphs.filter((text) => text !== detailsLeadText);
  const hasOverviewDetails = Boolean(detailsLeadText || detailBodyParagraphs.length > 0);
  const hasRoleDetails = roleParagraphs.length > 0;
  const hasDetailsModal = Boolean(
    detailsModal
    && detailsBackdrop
    && detailsClose
    && detailsTitle
    && detailsLead
    && detailsCopy
    && detailsRoleSection
    && detailsRoleCopy
    && (hasOverviewDetails || hasRoleDetails)
  );

  if (headlineCopy) {
    headlineCopy.hidden = !(summaryText || hasDetailsModal);
  }

  if (headlineSummary) {
    headlineSummary.hidden = !summaryText;
    headlineSummary.textContent = summaryText || "";
  }

  if (headlineReadMore) {
    headlineReadMore.hidden = !hasDetailsModal;
  }

  if (hasDetailsModal) {
    detailsTitle.textContent = project.title;
    detailsLead.hidden = !detailsLeadText;
    detailsLead.textContent = detailsLeadText || "";
    detailsCopy.hidden = detailBodyParagraphs.length === 0;
    renderParagraphs(detailsCopy, detailBodyParagraphs);
    detailsRoleSection.hidden = !hasRoleDetails;
    renderParagraphs(detailsRoleCopy, roleParagraphs);
  }

  let activeLightboxIndex = 0;
  let lastLightboxTrigger = null;
  let lastReviewTrigger = null;
  let lastDetailsTrigger = null;

  const hasLightbox = Boolean(
    galleryModal
    && galleryBackdrop
    && galleryClose
    && galleryLightboxImage
    && galleryLightboxPrev
    && galleryLightboxNext
  );

  const hasReviewModal = Boolean(
    reviewModal
    && reviewBackdrop
    && reviewClose
    && reviewPreview
    && reviewImage
    && reviewAddress
    && reviewCopy
  );

  const isLightboxOpen = () => Boolean(galleryModal && !galleryModal.hidden);
  const isReviewModalOpen = () => Boolean(reviewModal && !reviewModal.hidden);
  const isDetailsModalOpen = () => Boolean(detailsModal && !detailsModal.hidden);

  const syncLightbox = (index) => {
    if (!hasLightbox) {
      return;
    }

    activeLightboxIndex = Math.min(Math.max(index, 0), galleryItems.length - 1);
    const activeItem = galleryItems[activeLightboxIndex];
    const hasMultipleImages = galleryItems.length > 1;

    galleryLightboxImage.src = activeItem.src;
    galleryLightboxImage.alt = activeItem.alt || "";
    galleryLightboxImage.width = activeItem.width;
    galleryLightboxImage.height = activeItem.height;
    galleryLightboxPrev.hidden = !hasMultipleImages;
    galleryLightboxNext.hidden = !hasMultipleImages;
    galleryLightboxPrev.disabled = !hasMultipleImages || activeLightboxIndex === 0;
    galleryLightboxNext.disabled = !hasMultipleImages || activeLightboxIndex === galleryItems.length - 1;
  };

  const openLightbox = (index, trigger = null) => {
    if (!hasLightbox) {
      return;
    }

    lastLightboxTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
    syncLightbox(index);
    galleryModal.hidden = false;
    syncBodyModalState();
    galleryClose.focus({ preventScroll: true });
  };

  const closeLightbox = () => {
    if (!hasLightbox || galleryModal.hidden) {
      return;
    }

    galleryModal.hidden = true;
    syncBodyModalState();

    if (lastLightboxTrigger instanceof HTMLElement && document.contains(lastLightboxTrigger)) {
      lastLightboxTrigger.focus({ preventScroll: true });
    }
  };

  const stepLightbox = (direction) => {
    if (!isLightboxOpen()) {
      return;
    }

    const nextIndex = activeLightboxIndex + direction;

    if (nextIndex < 0 || nextIndex >= galleryItems.length) {
      return;
    }

    syncLightbox(nextIndex);
  };

  if (galleryHero) {
    galleryHero.replaceChildren(createGalleryFigure(galleryRenderItems[0], 0, project.title, { isHero: true }));

    galleryHero.querySelectorAll(".project-case-stream-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openLightbox(Number.parseInt(trigger.dataset.galleryIndex || "0", 10), trigger);
      });
    });
  }

  if (hasLightbox) {
    syncLightbox(0);
    galleryBackdrop.addEventListener("click", closeLightbox);
    galleryClose.addEventListener("click", closeLightbox);
    galleryLightboxPrev.addEventListener("click", () => {
      stepLightbox(-1);
    });
    galleryLightboxNext.addEventListener("click", () => {
      stepLightbox(1);
    });
  }

  const reviewParagraphs = Array.isArray(project.reviewBody)
    ? project.reviewBody.filter((item) => typeof item === "string" && item.trim())
    : [];
  const fallbackReviewExcerpt = typeof project.clientQuote === "string" && project.clientQuote.trim()
    ? [project.clientQuote.trim()]
    : [];
  const reviewExcerpt = reviewParagraphs.length > 0
    ? reviewParagraphs.slice(0, 1)
    : fallbackReviewExcerpt;
  const hasClientReview = reviewExcerpt.length > 0;
  const hasClientLogo = Boolean(project.clientLogoSrc && project.clientLogoSrc.trim());
  const hasReviewPreview = Boolean(project.reviewPreviewImage && project.reviewPreviewImage.trim());
  const reviewPreviewSource = hasReviewPreview ? project.reviewPreviewImage : (clientFeatureItem?.src || "");
  const reviewPreviewAlt = hasReviewPreview
    ? (project.reviewPreviewAlt || `Скан рекомендательного письма ${project.clientName || "клиента"}`)
    : (clientFeatureItem?.alt || `${project.title} — отзыв заказчика`);
  const reviewPreviewWidth = hasReviewPreview
    ? (project.reviewPreviewWidth || 1241)
    : (clientFeatureItem?.width || 1600);
  const reviewPreviewHeight = hasReviewPreview
    ? (project.reviewPreviewHeight || 1755)
    : (clientFeatureItem?.height || 1067);
  const hasReviewMedia = Boolean(reviewPreviewSource);
  const displayClientName = project.clientPersonName || project.clientName;
  const displayClientRole = project.clientPersonRole || (project.clientPersonName ? project.clientName : "");
  const hasFullClientReview = Boolean(
    hasReviewModal
    && (reviewParagraphs.length > reviewExcerpt.length || hasReviewPreview)
  );

  if (galleryGridSection) {
    galleryGridSection.hidden = galleryItems.length <= 1 && !hasClientReview;
  }

  if (galleryReview) {
    galleryReview.hidden = !hasClientReview;
    galleryReview.classList.remove("project-case-gallery-review-wide");
  }

  if (clientCard) {
    clientCard.hidden = !hasClientReview;
  }

  if (clientName) {
    clientName.hidden = !displayClientName;
    clientName.textContent = displayClientName || "";
  }

  if (clientRole) {
    clientRole.hidden = !displayClientRole;
    clientRole.textContent = displayClientRole || "";
  }

  if (clientQuoteCopy) {
    renderParagraphs(clientQuoteCopy, reviewExcerpt);
  }

  if (clientBrand) {
    clientBrand.hidden = !hasClientLogo;
  }

  if (clientLogo) {
    if (hasClientLogo) {
      clientLogo.src = project.clientLogoSrc;
      clientLogo.alt = project.clientLogoAlt || project.clientName || "Логотип клиента";
      clientLogo.width = project.clientLogoWidth || 220;
      clientLogo.height = project.clientLogoHeight || 72;
    } else {
      clientLogo.src = transparentPixel;
      clientLogo.alt = "";
    }
  }

  if (clientReadMore) {
    clientReadMore.hidden = !hasFullClientReview;
  }

  if (hasReviewModal) {
    if (reviewPreview) {
      reviewPreview.hidden = !hasReviewMedia;
      reviewPreview.dataset.reviewMediaKind = hasReviewPreview ? "scan" : "photo";
      reviewPreview.setAttribute(
        "aria-label",
        reviewPreviewAlt
      );
    }

    if (hasReviewMedia) {
      reviewImage.src = reviewPreviewSource;
      reviewImage.alt = reviewPreviewAlt;
      reviewImage.width = reviewPreviewWidth;
      reviewImage.height = reviewPreviewHeight;
    } else {
      reviewImage.src = transparentPixel;
      reviewImage.alt = "";
    }

    reviewAddress.hidden = !project.reviewAddress;
    reviewAddress.textContent = project.reviewAddress || "";
    renderParagraphs(reviewCopy, reviewParagraphs);
  }

  if (galleryStream) {
    const secondaryGalleryItems = galleryRenderItems.slice(1);
    const galleryNodes = buildSecondaryGalleryNodes(
      secondaryGalleryItems,
      project.title,
      hasClientReview && galleryReview ? galleryReview : null,
      project.galleryLayout,
      project.galleryLayoutOptions
    );

    galleryStream.replaceChildren(...galleryNodes);

    galleryStream.querySelectorAll(".project-case-stream-trigger").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        openLightbox(Number.parseInt(trigger.dataset.galleryIndex || "0", 10), trigger);
      });
    });
  }

  const openReviewModal = (trigger = null) => {
    if (!hasFullClientReview || !hasReviewModal) {
      return;
    }

    lastReviewTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
    reviewModal.hidden = false;
    syncBodyModalState();
    reviewClose.focus({ preventScroll: true });
  };

  const closeReviewModal = () => {
    if (!hasReviewModal || reviewModal.hidden) {
      return;
    }

    reviewModal.hidden = true;
    syncBodyModalState();

    if (lastReviewTrigger instanceof HTMLElement && document.contains(lastReviewTrigger)) {
      lastReviewTrigger.focus({ preventScroll: true });
    }
  };

  const openDetailsModal = (trigger = null) => {
    if (!hasDetailsModal) {
      return;
    }

    lastDetailsTrigger = trigger instanceof HTMLElement ? trigger : document.activeElement;
    detailsModal.hidden = false;
    syncBodyModalState();
    detailsClose.focus({ preventScroll: true });
  };

  const closeDetailsModal = () => {
    if (!hasDetailsModal || detailsModal.hidden) {
      return;
    }

    detailsModal.hidden = true;
    syncBodyModalState();

    if (lastDetailsTrigger instanceof HTMLElement && document.contains(lastDetailsTrigger)) {
      lastDetailsTrigger.focus({ preventScroll: true });
    }
  };

  if (hasFullClientReview) {
    clientReadMore?.addEventListener("click", () => {
      openReviewModal(clientReadMore);
    });
    reviewBackdrop.addEventListener("click", closeReviewModal);
    reviewClose.addEventListener("click", closeReviewModal);
  }

  if (hasDetailsModal) {
    headlineReadMore?.addEventListener("click", () => {
      openDetailsModal(headlineReadMore);
    });
    detailsBackdrop.addEventListener("click", closeDetailsModal);
    detailsClose.addEventListener("click", closeDetailsModal);
  }

  document.addEventListener("keydown", (event) => {
    if (isDetailsModalOpen()) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDetailsModal();
      }

      return;
    }

    if (isReviewModalOpen()) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeReviewModal();
      }

      return;
    }

    if (!isLightboxOpen()) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeLightbox();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    }
  });

  const nextProjects = Array.from({ length: Math.max(projectCatalog.length - 1, 0) }, (_, offset) => (
    projectCatalog[(resolvedIndex + 1 + offset) % projectCatalog.length]
  ));

  if (nextTrack) {
    const nextCards = nextProjects.map((item) => {
      const link = document.createElement("a");
      const media = document.createElement("div");
      const image = document.createElement("img");
      const body = document.createElement("div");
      const kicker = document.createElement("span");
      const title = document.createElement("span");

      link.className = "project-case-next-card";
      link.href = `./project.html?slug=${item.slug}`;
      link.setAttribute("aria-label", `Открыть проект ${item.title}`);

      media.className = "project-case-next-card-media";
      image.className = "project-case-next-card-image";
      image.src = item.image;
      image.alt = "";
      image.width = item.width;
      image.height = item.height;
      image.loading = "lazy";
      image.decoding = "async";

      body.className = "project-case-next-card-body";
      kicker.className = "project-case-next-card-kicker";
      kicker.textContent = "Проект";
      title.className = "project-case-next-card-title";
      title.textContent = item.title;

      media.append(image);
      body.append(kicker, title);
      link.append(media, body);
      return link;
    });

    nextTrack.replaceChildren(...nextCards);
  }

  const initProjectCaseMotion = () => {
    const motionTargets = [
      ...document.querySelectorAll(".project-case-topline, .project-case-headline, .project-case-description-panel"),
      ...document.querySelectorAll("#project-case-award:not([hidden]) .project-case-award-card"),
      ...document.querySelectorAll(".project-case-gallery-stream-hero .project-case-stream-item"),
      ...document.querySelectorAll("#project-case-gallery-stream .project-case-stream-item"),
      ...document.querySelectorAll(".project-case-client-story, .project-case-next-card")
    ];

    if (motionTargets.length === 0) {
      return;
    }

    motionTargets.forEach((element, index) => {
      element.classList.add("project-case-reveal");
      element.style.setProperty("--project-case-reveal-delay", `${Math.min(index * 42, 252)}ms`);
    });

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      motionTargets.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px"
    });

    motionTargets.forEach((element) => {
      observer.observe(element);
    });
  };

  const getNextScrollStep = () => {
    if (!nextTrack) {
      return 0;
    }

    const firstCard = nextTrack.querySelector(".project-case-next-card");

    if (!firstCard) {
      return nextTrack.clientWidth;
    }

    const styles = window.getComputedStyle(nextTrack);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "0");

    return firstCard.getBoundingClientRect().width + (Number.isFinite(gap) ? gap : 0);
  };

  const updateNextControls = () => {
    if (!nextTrack || !nextPrev || !nextNext) {
      return;
    }

    const maxScrollLeft = Math.max(0, nextTrack.scrollWidth - nextTrack.clientWidth);
    const isOverflowing = maxScrollLeft > 4;

    nextPrev.hidden = !isOverflowing;
    nextNext.hidden = !isOverflowing;
    nextPrev.disabled = !isOverflowing || nextTrack.scrollLeft <= 4;
    nextNext.disabled = !isOverflowing || nextTrack.scrollLeft >= maxScrollLeft - 4;
  };

  const scrollNextProjects = (direction) => {
    if (!nextTrack) {
      return;
    }

    nextTrack.scrollBy({
      left: getNextScrollStep() * direction,
      behavior: prefersReducedMotion ? "auto" : "smooth"
    });
  };

  nextPrev?.addEventListener("click", () => {
    scrollNextProjects(-1);
  });

  nextNext?.addEventListener("click", () => {
    scrollNextProjects(1);
  });

  nextTrack?.addEventListener("scroll", updateNextControls, { passive: true });
  window.addEventListener("resize", updateNextControls);
  window.addEventListener("load", updateNextControls);
  initProjectCaseMotion();
  window.requestAnimationFrame(updateNextControls);
})();
