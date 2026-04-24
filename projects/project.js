(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const transparentPixel = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

  const projectEntries = [
    ["kit-med", "Кит-мед", "../photos/kit-med/kitmed_1.jpg", "Кит-мед", 4095, 2735],
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
    ["avito-spb-2021", "AVITO САНКТ-ПЕТЕРБУРГ 2021", "../photos/avito-spb-2021/glavnoe-1.jpg", "AVITO САНКТ-ПЕТЕРБУРГ 2021", 1600, 1067],
    ["avito-cks", "Авито ЦКС", "../photos/avito-cks/1142.png", "Авито ЦКС", 1183, 888],
    ["international-bank", "Международный банк", "../photos/mejdunarodniy-bank/dsc_4648_glavnoe.jpg", "Международный банк", 8219, 5479],
    ["avito-spb-2020", "Авито Санкт-Петербург 2020", "../photos/avito-spb-2020/1.jpg", "Авито Санкт-Петербург 2020", 2000, 1334],
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
      gallery: [
        createGalleryItem("../photos/kit-med/kitmed_1.jpg", "Кит-мед — фото 1", 4095, 2735),
        createGalleryItem("../photos/kit-med/kitmed_2.jpg", "Кит-мед — фото 2", 4042, 2700),
        createGalleryItem("../photos/kit-med/kitmed_3.jpg", "Кит-мед — фото 3", 4012, 2680),
        createGalleryItem("../photos/kit-med/kitmed_4.jpg", "Кит-мед — фото 4", 4032, 2693),
        createGalleryItem("../photos/kit-med/kit_med_5.jpg", "Кит-мед — фото 5", 2786, 4171),
        createGalleryItem("../photos/kit-med/kit_med_6.jpg", "Кит-мед — фото 6", 4212, 2814),
        createGalleryItem("../photos/kit-med/kit_med_7.jpg", "Кит-мед — фото 7", 4044, 2701),
        createGalleryItem("../photos/kit-med/kit_med_8.jpg", "Кит-мед — фото 8", 4134, 2761),
        createGalleryItem("../photos/kit-med/kit_med_9.jpg", "Кит-мед — фото 9", 2880, 1920),
        createGalleryItem("../photos/kit-med/kit_med_10.jpg", "Кит-мед — фото 10", 2880, 1920),
        createGalleryItem("../photos/kit-med/kit_med_11.jpg", "Кит-мед — фото 11", 2824, 1920),
        createGalleryItem("../photos/kit-med/kit_med_12.jpg", "Кит-мед — фото 12", 4021, 2686),
        createGalleryItem("../photos/kit-med/kit_med_13.jpg", "Кит-мед — фото 13", 4184, 2795),
        createGalleryItem("../photos/kit-med/kit_med_14.jpg", "Кит-мед — фото 14", 4211, 2813),
        createGalleryItem("../photos/kit-med/kit_med_15.jpg", "Кит-мед — фото 15", 3965, 2648),
        createGalleryItem("../photos/kit-med/kit_med_16.jpg", "Кит-мед — фото 16", 4193, 2801),
        createGalleryItem("../photos/kit-med/kit_med_17.jpg", "Кит-мед — фото 17", 4190, 2798),
        createGalleryItem("../photos/kit-med/kit_med_18.jpg", "Кит-мед — фото 18", 1920, 2880),
        createGalleryItem("../photos/kit-med/kit_med_19.jpg", "Кит-мед — фото 19", 4201, 2806),
        createGalleryItem("../photos/kit-med/kit_med_20.jpg", "Кит-мед — фото 20", 2880, 1920)
      ],
      workScope: "\u0421\u0442\u0440\u043e\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e, \u043e\u0442\u0434\u0435\u043b\u043a\u0430 \u0438 \u0438\u043d\u0436\u0435\u043d\u0435\u0440\u043d\u043e\u0435 \u043e\u0441\u043d\u0430\u0449\u0435\u043d\u0438\u0435 \u043e\u0444\u0438\u0441\u043d\u044b\u0445 \u043f\u043e\u043c\u0435\u0449\u0435\u043d\u0438\u0439",
      duration: "10.02.2025 — 16.07.2025",
      area: "1 100 м²",
      year: "2025",
      address: "Россия, Москва, Бумажный пр., 19, помещ. 9/1С",
      summary: "Офис «Кит Мед» в бизнес-центре класса A STONE TOWERS — рабочее и обучающее пространство для команды, гостей и профессионального развития специалистов.",
      about: [
        "Проект реализован для компании «Кит Мед» в бизнес-центре класса A STONE TOWERS, башня C. Пространство задумывалось не только как повседневный офис, но и как среда, совмещающая рабочие процессы, прием гостей и обучающую функцию.",
        "На площади 1 100 м² разместили рабочие места для команды до 60 человек и организовали три функциональные зоны: блок для инженеров, зону отдела продаж и многофункциональное пространство обучения. В его состав вошли три медицинских кабинета, библиотека и площадка Doctor Star School для профессионального развития специалистов индустрии эстетической медицины."
      ],
      role: [
        "Gint-M выступала на объекте генеральным подрядчиком и выполняла полный комплекс строительных, отделочных и инженерных работ по офисным помещениям заказчика.",
        "В рамках реализации команда выполнила отделку и инженерное оснащение офиса, а также интегрировала ряд нестандартных решений: двойное остекление, систему умного дома, светильники индивидуальной разработки, большой объем мебели спецзаказа и шпонированные панели по периметру офиса, в кабинетах и переговорных."
      ],
      clientName: "\u041a\u0438\u0442 \u041c\u0435\u0434",
      clientLogoSrc: "../logos/clients/color/Align-logo.svg",
      clientLogoAlt: "\u0412\u0440\u0435\u043c\u0435\u043d\u043d\u044b\u0439 \u043b\u043e\u0433\u043e\u0442\u0438\u043f \u043a\u043b\u0438\u0435\u043d\u0442\u0430",
      clientQuote: "\u0414\u043c\u0438\u0442\u0440\u0438\u0439 \u0412\u0430\u0441\u0438\u043b\u044c\u0435\u0432\u0438\u0447 \u041a\u043b\u0430\u0431\u0443\u043a\u043e\u0432 \u043e\u0442\u043c\u0435\u0442\u0438\u043b, \u0447\u0442\u043e \u0432 \u043d\u043e\u0432\u043e\u043c \u043e\u0444\u0438\u0441\u0435 \u0431\u044b\u043b\u043e \u0432\u0430\u0436\u043d\u043e \u0441\u043e\u0432\u043c\u0435\u0441\u0442\u0438\u0442\u044c \u0443\u0434\u043e\u0431\u0441\u0442\u0432\u043e \u0434\u043b\u044f \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u043e\u0432 \u0441 \u0443\u044e\u0442\u043d\u043e\u0439 \u0430\u0442\u043c\u043e\u0441\u0444\u0435\u0440\u043e\u0439 \u0438 \u0431\u043e\u043b\u0435\u0435 \u0441\u0442\u0430\u0442\u0443\u0441\u043d\u043e\u0439 \u043f\u043e\u0434\u0430\u0447\u0435\u0439 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u0430.",
      reviewAddress: "\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439 \u0432\u043b\u0430\u0434\u0435\u043b\u044c\u0446\u0430 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438 \u00ab\u041a\u0438\u0442 \u041c\u0435\u0434\u00bb",
      reviewBody: [
        "\u0412\u043b\u0430\u0434\u0435\u043b\u0435\u0446 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438 \u00ab\u041a\u0438\u0442 \u041c\u0435\u0434\u00bb \u0414\u043c\u0438\u0442\u0440\u0438\u0439 \u0412\u0430\u0441\u0438\u043b\u044c\u0435\u0432\u0438\u0447 \u041a\u043b\u0430\u0431\u0443\u043a\u043e\u0432 \u043e\u0442\u043c\u0435\u0442\u0438\u043b, \u0447\u0442\u043e \u043f\u0440\u0438 \u043f\u0435\u0440\u0435\u0435\u0437\u0434\u0435 \u0432 \u043d\u043e\u0432\u044b\u0439 \u043e\u0444\u0438\u0441 \u0434\u043b\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u044b \u0431\u044b\u043b\u043e \u0432\u0430\u0436\u043d\u043e \u043d\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u043b\u0443\u0447\u0438\u0442\u044c \u0444\u0443\u043d\u043a\u0446\u0438\u043e\u043d\u0430\u043b\u044c\u043d\u043e\u0435 \u0438 \u0443\u0434\u043e\u0431\u043d\u043e\u0435 \u0440\u0430\u0431\u043e\u0447\u0435\u0435 \u043f\u0440\u043e\u0441\u0442\u0440\u0430\u043d\u0441\u0442\u0432\u043e, \u043d\u043e \u0438 \u0441\u043e\u0437\u0434\u0430\u0442\u044c \u0431\u043e\u043b\u0435\u0435 \u0443\u044e\u0442\u043d\u0443\u044e \u0441\u0440\u0435\u0434\u0443, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u043f\u043e\u0434\u0447\u0435\u0440\u043a\u0438\u0432\u0430\u0435\u0442 \u0441\u0442\u0430\u0442\u0443\u0441 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438.",
        "\u0418\u043c\u0435\u043d\u043d\u043e \u043f\u043e\u044d\u0442\u043e\u043c\u0443 \u043f\u0440\u043e\u0435\u043a\u0442 \u0431\u044b\u043b \u043e\u0440\u0438\u0435\u043d\u0442\u0438\u0440\u043e\u0432\u0430\u043d \u043d\u0435 \u0442\u043e\u043b\u044c\u043a\u043e \u043d\u0430 \u0440\u0430\u0431\u043e\u0447\u0443\u044e \u044d\u0444\u0444\u0435\u043a\u0442\u0438\u0432\u043d\u043e\u0441\u0442\u044c, \u043d\u043e \u0438 \u043d\u0430 \u0441\u043e\u0437\u0434\u0430\u043d\u0438\u0435 \u0441\u0440\u0435\u0434\u044b \u0434\u043b\u044f \u0432\u0441\u0442\u0440\u0435\u0447, \u043e\u0431\u0443\u0447\u0435\u043d\u0438\u044f \u0438 \u043a\u043e\u043c\u0444\u043e\u0440\u0442\u043d\u043e\u0439 \u043f\u043e\u0432\u0441\u0435\u0434\u043d\u0435\u0432\u043d\u043e\u0439 \u0440\u0430\u0431\u043e\u0442\u044b \u0441\u043e\u0442\u0440\u0443\u0434\u043d\u0438\u043a\u043e\u0432 \u0438 \u0433\u043e\u0441\u0442\u0435\u0439 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438."
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
      reviewBody: []
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

  const getPhotoLabel = (count) => {
    const mod100 = count % 100;
    const mod10 = count % 10;

    if (mod100 >= 11 && mod100 <= 14) {
      return "фотографий";
    }

    if (mod10 === 1) {
      return "фото";
    }

    if (mod10 >= 2 && mod10 <= 4) {
      return "фотографии";
    }

    return "фотографий";
  };

  const createGalleryFigure = (item, index, projectTitle, { isHero = false } = {}) => {
    const figure = document.createElement("figure");
    const trigger = document.createElement("button");
    const image = document.createElement("img");

    figure.className = "project-case-stream-item";

    if (isHero) {
      figure.classList.add("project-case-stream-item-hero");
    }

    trigger.type = "button";
    trigger.className = "project-case-stream-trigger";
    trigger.dataset.galleryIndex = String(index);
    trigger.setAttribute("aria-label", `Открыть фото ${index + 1}`);

    image.className = "project-case-stream-image";
    image.src = item.src;
    image.alt = item.alt || `${projectTitle} — фото ${index + 1}`;
    image.width = item.width;
    image.height = item.height;
    image.loading = isHero && index === 0 ? "eager" : "lazy";
    image.decoding = "async";

    trigger.append(image);
    figure.append(trigger);
    return figure;
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
  const galleryCount = document.getElementById("project-case-gallery-count");
  const galleryStream = document.getElementById("project-case-gallery-stream");
  const clientSection = document.getElementById("project-case-client-section");
  const clientCard = document.getElementById("project-case-client-card");
  const clientBrand = document.getElementById("project-case-client-brand");
  const clientLogo = document.getElementById("project-client-logo");
  const clientName = document.getElementById("project-client-name");
  const clientQuoteCopy = document.getElementById("project-client-quote");
  const clientReadMore = document.getElementById("project-client-read-more");
  const nextTrack = document.getElementById("project-case-next-track");
  const nextPrev = document.getElementById("project-case-next-prev");
  const nextNext = document.getElementById("project-case-next-next");
  const galleryModal = document.getElementById("project-gallery-modal");
  const galleryBackdrop = document.getElementById("project-gallery-backdrop");
  const galleryClose = document.getElementById("project-gallery-close");
  const galleryLightboxImage = document.getElementById("project-gallery-lightbox-image");
  const galleryLightboxTitle = document.getElementById("project-gallery-lightbox-title");
  const galleryLightboxCounter = document.getElementById("project-gallery-lightbox-counter");
  const galleryLightboxPrev = document.getElementById("project-gallery-lightbox-prev");
  const galleryLightboxNext = document.getElementById("project-gallery-lightbox-next");
  const reviewModal = document.getElementById("project-client-review-modal");
  const reviewBackdrop = document.getElementById("project-client-review-backdrop");
  const reviewClose = document.getElementById("project-client-review-close");
  const reviewPreview = document.getElementById("project-client-review-preview");
  const reviewImage = document.getElementById("project-client-review-image");
  const reviewAddress = document.getElementById("project-client-review-address");
  const reviewCopy = document.getElementById("project-client-review-copy");

  document.title = `ГИНТ-М — ${project.title}`;

  if (metaDescription) {
    metaDescription.setAttribute("content", `Проект ГИНТ-М — ${project.title}.`);
  }

  const setText = (id, value) => {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  };

  const syncBodyModalState = () => {
    const hasOpenModal = Boolean(
      (galleryModal && !galleryModal.hidden) || (reviewModal && !reviewModal.hidden)
    );

    document.body.classList.toggle("modal-open", hasOpenModal);
  };

  setText("project-case-breadcrumb-current", project.title);
  setText("project-case-title", project.title);
  setText("project-case-summary", project.summary);
  setText("project-case-metric-workscope", project.workScope);
  setText("project-case-metric-duration", project.duration);
  setText("project-case-metric-area", project.area);
  setText("project-case-metric-year", project.year);
  setText("project-case-metric-address", project.address);

  renderParagraphs(document.getElementById("project-about-copy"), project.about);
  renderParagraphs(document.getElementById("project-role-copy"), project.role);

  const galleryItems = Array.isArray(project.gallery) && project.gallery.length > 0
    ? project.gallery
    : [createGalleryItem(project.image, project.alt, project.width, project.height)];

  if (galleryCount) {
    galleryCount.textContent = `${galleryItems.length} ${getPhotoLabel(galleryItems.length)}`;
  }

  let activeLightboxIndex = 0;
  let lastLightboxTrigger = null;
  let lastReviewTrigger = null;

  const hasLightbox = Boolean(
    galleryModal
    && galleryLightboxImage
    && galleryLightboxTitle
    && galleryLightboxCounter
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

  const syncLightbox = (index) => {
    if (!hasLightbox) {
      return;
    }

    activeLightboxIndex = Math.min(Math.max(index, 0), galleryItems.length - 1);
    const activeItem = galleryItems[activeLightboxIndex];
    const imageTitle = activeItem.alt || `${project.title} — фото ${activeLightboxIndex + 1}`;
    const hasMultipleImages = galleryItems.length > 1;

    galleryLightboxImage.src = activeItem.src;
    galleryLightboxImage.alt = imageTitle;
    galleryLightboxImage.width = activeItem.width;
    galleryLightboxImage.height = activeItem.height;
    galleryLightboxTitle.textContent = imageTitle;
    galleryLightboxCounter.textContent = `${activeLightboxIndex + 1} / ${galleryItems.length}`;
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

  if (galleryStream) {
    const heroFigure = createGalleryFigure(galleryItems[0], 0, project.title, { isHero: true });

    if (galleryItems.length === 1) {
      galleryStream.replaceChildren(heroFigure);
    } else {
      const masonry = document.createElement("div");
      masonry.className = "project-case-gallery-masonry";
      const masonryFigures = galleryItems.slice(1).map((item, index) => (
        createGalleryFigure(item, index + 1, project.title)
      ));

      masonry.append(...masonryFigures);
      galleryStream.replaceChildren(heroFigure, masonry);
    }

    galleryStream.querySelectorAll(".project-case-stream-trigger").forEach((trigger) => {
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
    ? reviewParagraphs.slice(0, Math.min(2, reviewParagraphs.length))
    : fallbackReviewExcerpt;
  const hasClientReview = reviewExcerpt.length > 0;
  const hasClientLogo = Boolean(project.clientLogoSrc && project.clientLogoSrc.trim());
  const hasReviewPreview = Boolean(project.reviewPreviewImage && project.reviewPreviewImage.trim());
  const hasFullClientReview = Boolean(
    hasReviewModal
    && reviewParagraphs.length > 0
  );

  if (clientSection) {
    clientSection.hidden = !hasClientReview;
  }

  if (clientCard) {
    clientCard.hidden = !hasClientReview;
  }

  if (clientName) {
    clientName.hidden = !project.clientName;
    clientName.textContent = project.clientName || "";
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
      reviewPreview.hidden = !hasReviewPreview;
      reviewPreview.setAttribute(
        "aria-label",
        project.reviewPreviewAlt || `\u0421\u043a\u0430\u043d \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u043f\u0438\u0441\u044c\u043c\u0430 ${project.clientName || "\u043a\u043b\u0438\u0435\u043d\u0442\u0430"}`
      );
    }

    if (hasReviewPreview) {
      reviewImage.src = project.reviewPreviewImage;
      reviewImage.alt = project.reviewPreviewAlt || `\u0421\u043a\u0430\u043d \u0440\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0442\u0435\u043b\u044c\u043d\u043e\u0433\u043e \u043f\u0438\u0441\u044c\u043c\u0430 ${project.clientName || "\u043a\u043b\u0438\u0435\u043d\u0442\u0430"}`;
      reviewImage.width = project.reviewPreviewWidth || 1241;
      reviewImage.height = project.reviewPreviewHeight || 1755;
    } else {
      reviewImage.src = transparentPixel;
      reviewImage.alt = "";
    }

    reviewAddress.hidden = !project.reviewAddress;
    reviewAddress.textContent = project.reviewAddress || "";
    renderParagraphs(reviewCopy, reviewParagraphs);
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

  if (hasFullClientReview) {
    clientReadMore?.addEventListener("click", () => {
      openReviewModal(clientReadMore);
    });
    reviewBackdrop.addEventListener("click", closeReviewModal);
    reviewClose.addEventListener("click", closeReviewModal);
  }

  document.addEventListener("keydown", (event) => {
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
  window.requestAnimationFrame(updateNextControls);
})();
