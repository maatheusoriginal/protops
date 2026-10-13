import type { City, Project } from "@/lib/site-data";

export const locales = ["pt", "en", "es", "fr", "de", "zh"] as const;
export type Locale = (typeof locales)[number];

export const languageOptions: Array<{ code: Locale; short: string; name: string; htmlLang: string }> = [
  { code: "pt", short: "PT", name: "Português", htmlLang: "pt-BR" },
  { code: "en", short: "EN", name: "English", htmlLang: "en" },
  { code: "es", short: "ES", name: "Español", htmlLang: "es" },
  { code: "fr", short: "FR", name: "Français", htmlLang: "fr" },
  { code: "de", short: "DE", name: "Deutsch", htmlLang: "de" },
  { code: "zh", short: "中文", name: "中文", htmlLang: "zh-CN" },
];

const dictionary = {
  pt: {
    nav: { company: "A empresa", capital: "Capital Partners", contact: "Fale conosco", open: "Abrir menu", language: "Selecionar idioma" },
    common: { state: "Minas Gerais", projectImage: "Vista aérea de", cityImage: "Vista aérea de" },
    home: {
      eyebrow: "Desenvolvimento imobiliário desde 2003", title: "Territórios que viram", accent: "patrimônio.",
      heroCopy: "Projetos que conectam visão, infraestrutura e desenvolvimento em Minas Gerais e nos Estados Unidos.",
      primary: "Conheça os empreendimentos", secondary: "Falar com a equipe", scroll: "Ir para as cidades",
      stats: [["2003", "Início da trajetória"], ["4 mil+", "Unidades em Uberlândia"], ["150+", "Projetos no Brasil e EUA"], ["3 cidades", "Portfólio regional"]],
      citiesEyebrow: "Onde estamos", citiesTitle: "Projetos conectados ao crescimento de cada cidade.",
      citiesText: "Escolha uma cidade para conhecer os empreendimentos, ver imagens aéreas e falar com a equipe comercial.",
      featuredEyebrow: "Portfólio em destaque", featuredTitle: "Conheça alguns dos nossos projetos.", featuredCta: "Receber atendimento",
      storyEyebrow: "Nossa história", storyTitle: "Visão para enxergar oportunidades. Estrutura para realizá-las.",
      storyP1: "A Pro-Tops nasceu em Charlotte, nos Estados Unidos, e ampliou sua atuação para o Brasil. Em mais de duas décadas, participou do desenvolvimento e da comercialização de milhares de unidades imobiliárias.",
      storyP2: "Em Uberlândia, Araguari e Sacramento, o grupo atua em projetos residenciais, comerciais, industriais e de infraestrutura com foco em execução, governança e desenvolvimento de longo prazo.",
      seal: "Mais de duas décadas\ntransformando áreas", regional: "Ver atuação regional", international: "Conhecer atuação internacional",
      capitalTitle: "Uma ponte entre experiência imobiliária e oportunidades nos Estados Unidos.",
      capitalText: "Atuação em construção residencial, loteamentos planejados, reformas e gestão de ativos imobiliários no sudeste americano.", capitalCta: "Conhecer a Capital Partners",
      nextEyebrow: "Próximo passo", nextTitle: "Vamos encontrar o projeto certo para você.", nextCta: "Conversar no WhatsApp",
    },
    city: {
      presence: "Pro-Tops em", view: "Ver {count} empreendimentos", localEyebrow: "Portfólio local", title: "Empreendimentos em",
      intro: "Registros reais de drone, contexto urbano e atendimento para confirmar disponibilidade e condições atuais.",
      contactTitle: "Quer conhecer um desses projetos de perto?", contactText: "Fale com a equipe Pro-Tops para receber informações atualizadas e agendar uma visita.", contactCta: "Falar com a equipe",
    },
    project: {
      back: "Voltar para", overview: "Visão do projeto", request: "Solicitar informações", recent: "Imagem aérea recente", archive: "Acervo Pro-Tops 2026",
      note: "A imagem apresenta a área e seu entorno. Disponibilidade, delimitações, valores e condições devem ser confirmados com a equipe comercial.",
      continue: "Continue explorando", others: "Outros projetos em", all: "Ver todos",
    },
    capital: {
      back: "Voltar para Pro-Tops", title: "Experiência imobiliária que atravessa fronteiras.",
      hero: "Uma operação voltada à identificação, desenvolvimento e gestão de oportunidades imobiliárias no sudeste dos Estados Unidos.", cta: "Solicitar apresentação",
      eyebrow: "Atuação internacional", introTitle: "Estrutura para desenvolver, executar e acompanhar cada projeto.",
      intro: "A trajetória iniciada em Charlotte reúne experiência em construção residencial, reformas, acabamentos, loteamentos e gestão de ativos. A Capital Partners conecta essa capacidade de execução a projetos selecionados no mercado americano.",
      pillars: [["Residências e comunidades", "Projetos residenciais, comunidades single family e desenvolvimento de novas unidades."], ["Desenvolvimento imobiliário", "Seleção de áreas, planejamento, infraestrutura, execução e gestão de obras."], ["Gestão estruturada", "Acompanhamento jurídico, comercial e operacional conforme a estrutura de cada projeto."], ["Visão internacional", "Atuação no sudeste dos Estados Unidos com foco em leitura de mercado e longo prazo."]],
      disclaimerTitle: "Informação antes de qualquer decisão.", disclaimer: "Este conteúdo é institucional e não constitui oferta pública, recomendação ou promessa de rentabilidade. Projetos, riscos, estruturas, disponibilidade e condições devem ser avaliados individualmente com documentação própria e orientação profissional.",
    },
    footer: { about: "Desenvolvimento imobiliário com presença no Brasil e nos Estados Unidos.", cities: "Cidades", company: "Pro-Tops", history: "Nossa história", service: "Atendimento comercial", contact: "Contato", rights: "© 2026 Pro-Tops. Todos os direitos reservados.", note: "Informações comerciais sujeitas a confirmação." },
    internationalProject: { summary: "", description: "", features: ["", "", ""] },
  },
  en: {
    nav: { company: "Company", capital: "Capital Partners", contact: "Contact us", open: "Open menu", language: "Select language" },
    common: { state: "Minas Gerais, Brazil", projectImage: "Aerial view of", cityImage: "Aerial view of" },
    home: {
      eyebrow: "Real estate development since 2003", title: "Land transformed into", accent: "lasting value.",
      heroCopy: "Projects connecting vision, infrastructure and long-term development in Brazil and the United States.",
      primary: "Explore our developments", secondary: "Talk to our team", scroll: "Explore our locations",
      stats: [["2003", "Our journey began"], ["4,000+", "Units in Uberlândia"], ["150+", "Projects in Brazil and the US"], ["3 cities", "Regional portfolio"]],
      citiesEyebrow: "Where we operate", citiesTitle: "Projects connected to the growth of each city.",
      citiesText: "Choose a city to explore developments, view current aerial imagery and speak with our commercial team.",
      featuredEyebrow: "Featured portfolio", featuredTitle: "Discover selected Pro-Tops projects.", featuredCta: "Speak with our team",
      storyEyebrow: "Our story", storyTitle: "Vision to identify opportunities. Structure to deliver them.",
      storyP1: "Pro-Tops began in Charlotte, United States, and expanded its operations to Brazil. Over more than two decades, the group has contributed to the development and commercialization of thousands of real estate units.",
      storyP2: "In Uberlândia, Araguari and Sacramento, the group operates across residential, commercial, industrial and infrastructure projects, with a focus on execution, governance and long-term development.",
      seal: "More than two decades\ntransforming land", regional: "View our regional presence", international: "Explore our international operation",
      capitalTitle: "A bridge between real estate expertise and opportunities in the United States.",
      capitalText: "Residential construction, planned communities, renovations and real estate asset management across the American Southeast.", capitalCta: "Explore Capital Partners",
      nextEyebrow: "Next step", nextTitle: "Let us help you find the right project.", nextCta: "Talk to us on WhatsApp",
    },
    city: {
      presence: "Pro-Tops in", view: "View {count} developments", localEyebrow: "Local portfolio", title: "Developments in",
      intro: "Current drone imagery, urban context and direct support to confirm availability and commercial terms.",
      contactTitle: "Would you like to explore one of these projects?", contactText: "Contact the Pro-Tops team for updated information and to schedule a visit.", contactCta: "Talk to our team",
    },
    project: {
      back: "Back to", overview: "Project overview", request: "Request information", recent: "Recent aerial image", archive: "Pro-Tops archive 2026",
      note: "The image presents the site and its surroundings. Availability, boundaries, pricing and terms must be confirmed with the commercial team.",
      continue: "Continue exploring", others: "Other projects in", all: "View all",
    },
    capital: {
      back: "Back to Pro-Tops", title: "Real estate expertise across borders.",
      hero: "An operation focused on identifying, developing and managing selected real estate opportunities in the Southeastern United States.", cta: "Request our presentation",
      eyebrow: "International operations", introTitle: "A structure designed to develop, execute and oversee every project.",
      intro: "Our journey began in Charlotte and includes experience in residential construction, renovations, finishes, planned communities and asset management. Capital Partners connects this execution capacity with selected opportunities in the US market.",
      pillars: [["Homes and communities", "Residential projects, single-family communities and the development of new units."], ["Real estate development", "Site selection, planning, infrastructure, construction and project management."], ["Structured management", "Legal, commercial and operational oversight tailored to each project."], ["International perspective", "Operations across the Southeastern United States with a long-term market view."]],
      disclaimerTitle: "Information before every decision.", disclaimer: "This is institutional content and does not constitute a public offering, recommendation or promise of returns. Each project, risk, structure, availability and term must be assessed individually through its own documentation and professional advice.",
    },
    footer: { about: "Real estate development with operations in Brazil and the United States.", cities: "Cities", company: "Pro-Tops", history: "Our story", service: "Commercial support", contact: "Contact", rights: "© 2026 Pro-Tops. All rights reserved.", note: "Commercial information is subject to confirmation." },
    internationalProject: { summary: "A clear aerial perspective of {name} and its connection to {city}.", description: "Explore {name} through current drone imagery showing the site, surroundings and access routes. Availability, technical details and commercial terms are confirmed directly with the Pro-Tops team.", features: ["Updated aerial imagery", "Site, surroundings and access context", "Availability and terms on request"] },
  },
  es: {
    nav: { company: "La empresa", capital: "Capital Partners", contact: "Contáctenos", open: "Abrir menú", language: "Seleccionar idioma" },
    common: { state: "Minas Gerais, Brasil", projectImage: "Vista aérea de", cityImage: "Vista aérea de" },
    home: {
      eyebrow: "Desarrollo inmobiliario desde 2003", title: "Territorios que se convierten en", accent: "patrimonio.",
      heroCopy: "Proyectos que conectan visión, infraestructura y desarrollo a largo plazo en Brasil y Estados Unidos.",
      primary: "Conozca los proyectos", secondary: "Hable con nuestro equipo", scroll: "Ver ubicaciones",
      stats: [["2003", "Inicio de nuestra trayectoria"], ["4.000+", "Unidades en Uberlândia"], ["150+", "Proyectos en Brasil y EE. UU."], ["3 ciudades", "Portafolio regional"]],
      citiesEyebrow: "Dónde operamos", citiesTitle: "Proyectos conectados con el crecimiento de cada ciudad.",
      citiesText: "Elija una ciudad para conocer los proyectos, ver imágenes aéreas actuales y hablar con el equipo comercial.",
      featuredEyebrow: "Portafolio destacado", featuredTitle: "Conozca algunos de nuestros proyectos.", featuredCta: "Recibir atención",
      storyEyebrow: "Nuestra historia", storyTitle: "Visión para identificar oportunidades. Estructura para hacerlas realidad.",
      storyP1: "Pro-Tops nació en Charlotte, Estados Unidos, y amplió sus operaciones a Brasil. Durante más de dos décadas, participó en el desarrollo y la comercialización de miles de unidades inmobiliarias.",
      storyP2: "En Uberlândia, Araguari y Sacramento, el grupo desarrolla proyectos residenciales, comerciales, industriales y de infraestructura, con enfoque en ejecución, gobernanza y crecimiento a largo plazo.",
      seal: "Más de dos décadas\ntransformando áreas", regional: "Ver presencia regional", international: "Conocer la operación internacional",
      capitalTitle: "Un puente entre la experiencia inmobiliaria y las oportunidades en Estados Unidos.",
      capitalText: "Construcción residencial, comunidades planificadas, reformas y gestión de activos inmobiliarios en el sureste de Estados Unidos.", capitalCta: "Conocer Capital Partners",
      nextEyebrow: "Próximo paso", nextTitle: "Encontremos el proyecto adecuado para usted.", nextCta: "Hablar por WhatsApp",
    },
    city: {
      presence: "Pro-Tops en", view: "Ver {count} proyectos", localEyebrow: "Portafolio local", title: "Proyectos en",
      intro: "Imágenes reales de dron, contexto urbano y atención directa para confirmar disponibilidad y condiciones comerciales.",
      contactTitle: "¿Desea conocer uno de estos proyectos?", contactText: "Hable con el equipo Pro-Tops para recibir información actualizada y programar una visita.", contactCta: "Hablar con el equipo",
    },
    project: {
      back: "Volver a", overview: "Descripción del proyecto", request: "Solicitar información", recent: "Imagen aérea reciente", archive: "Archivo Pro-Tops 2026",
      note: "La imagen presenta el área y su entorno. La disponibilidad, los límites, los precios y las condiciones deben confirmarse con el equipo comercial.",
      continue: "Siga explorando", others: "Otros proyectos en", all: "Ver todos",
    },
    capital: {
      back: "Volver a Pro-Tops", title: "Experiencia inmobiliaria que cruza fronteras.",
      hero: "Una operación enfocada en identificar, desarrollar y gestionar oportunidades inmobiliarias seleccionadas en el sureste de Estados Unidos.", cta: "Solicitar presentación",
      eyebrow: "Operación internacional", introTitle: "Estructura para desarrollar, ejecutar y acompañar cada proyecto.",
      intro: "La trayectoria iniciada en Charlotte reúne experiencia en construcción residencial, reformas, acabados, comunidades planificadas y gestión de activos. Capital Partners conecta esta capacidad de ejecución con proyectos seleccionados del mercado estadounidense.",
      pillars: [["Viviendas y comunidades", "Proyectos residenciales, comunidades de viviendas unifamiliares y desarrollo de nuevas unidades."], ["Desarrollo inmobiliario", "Selección de terrenos, planificación, infraestructura, ejecución y gestión de obras."], ["Gestión estructurada", "Acompañamiento jurídico, comercial y operativo de acuerdo con cada proyecto."], ["Visión internacional", "Operación en el sureste de Estados Unidos con enfoque de mercado a largo plazo."]],
      disclaimerTitle: "Información antes de cada decisión.", disclaimer: "Este contenido es institucional y no constituye una oferta pública, recomendación ni promesa de rentabilidad. Cada proyecto, riesgo, estructura, disponibilidad y condición debe evaluarse individualmente con su propia documentación y asesoramiento profesional.",
    },
    footer: { about: "Desarrollo inmobiliario con presencia en Brasil y Estados Unidos.", cities: "Ciudades", company: "Pro-Tops", history: "Nuestra historia", service: "Atención comercial", contact: "Contacto", rights: "© 2026 Pro-Tops. Todos los derechos reservados.", note: "La información comercial está sujeta a confirmación." },
    internationalProject: { summary: "Una perspectiva aérea clara de {name} y su conexión con {city}.", description: "Conozca {name} mediante imágenes actuales de dron que muestran el área, el entorno y los accesos. La disponibilidad, los detalles técnicos y las condiciones comerciales se confirman directamente con el equipo Pro-Tops.", features: ["Imágenes aéreas actualizadas", "Contexto del área, entorno y accesos", "Disponibilidad y condiciones a consultar"] },
  },
  fr: {
    nav: { company: "L’entreprise", capital: "Capital Partners", contact: "Nous contacter", open: "Ouvrir le menu", language: "Choisir la langue" },
    common: { state: "Minas Gerais, Brésil", projectImage: "Vue aérienne de", cityImage: "Vue aérienne de" },
    home: {
      eyebrow: "Développement immobilier depuis 2003", title: "Des territoires transformés en", accent: "patrimoine.",
      heroCopy: "Des projets qui réunissent vision, infrastructures et développement à long terme au Brésil et aux États-Unis.",
      primary: "Découvrir les projets", secondary: "Parler à notre équipe", scroll: "Voir nos implantations",
      stats: [["2003", "Début de notre parcours"], ["4 000+", "Unités à Uberlândia"], ["150+", "Projets au Brésil et aux États-Unis"], ["3 villes", "Portefeuille régional"]],
      citiesEyebrow: "Nos implantations", citiesTitle: "Des projets liés au développement de chaque ville.",
      citiesText: "Choisissez une ville pour découvrir les projets, consulter les images aériennes et contacter notre équipe commerciale.",
      featuredEyebrow: "Projets à la une", featuredTitle: "Découvrez une sélection de nos projets.", featuredCta: "Contacter notre équipe",
      storyEyebrow: "Notre histoire", storyTitle: "La vision pour identifier les opportunités. La structure pour les réaliser.",
      storyP1: "Pro-Tops est née à Charlotte, aux États-Unis, avant d’étendre ses activités au Brésil. Depuis plus de vingt ans, le groupe participe au développement et à la commercialisation de milliers d’unités immobilières.",
      storyP2: "À Uberlândia, Araguari et Sacramento, le groupe intervient dans des projets résidentiels, commerciaux, industriels et d’infrastructure, avec une attention particulière portée à l’exécution, à la gouvernance et au long terme.",
      seal: "Plus de vingt ans\nà transformer des sites", regional: "Voir notre présence régionale", international: "Découvrir nos activités internationales",
      capitalTitle: "Un pont entre expertise immobilière et opportunités aux États-Unis.",
      capitalText: "Construction résidentielle, communautés planifiées, rénovation et gestion d’actifs immobiliers dans le sud-est des États-Unis.", capitalCta: "Découvrir Capital Partners",
      nextEyebrow: "Prochaine étape", nextTitle: "Trouvons ensemble le projet qui vous correspond.", nextCta: "Échanger sur WhatsApp",
    },
    city: {
      presence: "Pro-Tops à", view: "Voir {count} projets", localEyebrow: "Portefeuille local", title: "Projets à",
      intro: "Images récentes par drone, contexte urbain et accompagnement direct pour confirmer les disponibilités et les conditions commerciales.",
      contactTitle: "Vous souhaitez découvrir l’un de ces projets ?", contactText: "Contactez l’équipe Pro-Tops pour obtenir des informations à jour et organiser une visite.", contactCta: "Contacter l’équipe",
    },
    project: {
      back: "Retour à", overview: "Présentation du projet", request: "Demander des informations", recent: "Image aérienne récente", archive: "Archives Pro-Tops 2026",
      note: "L’image présente le site et son environnement. Les disponibilités, limites, prix et conditions doivent être confirmés auprès de l’équipe commerciale.",
      continue: "Poursuivre la visite", others: "Autres projets à", all: "Voir tous les projets",
    },
    capital: {
      back: "Retour à Pro-Tops", title: "Une expertise immobilière au-delà des frontières.",
      hero: "Une activité consacrée à l’identification, au développement et à la gestion d’opportunités immobilières sélectionnées dans le sud-est des États-Unis.", cta: "Demander la présentation",
      eyebrow: "Activités internationales", introTitle: "Une structure conçue pour développer, réaliser et suivre chaque projet.",
      intro: "Notre parcours, commencé à Charlotte, réunit une expérience en construction résidentielle, rénovation, finitions, communautés planifiées et gestion d’actifs. Capital Partners met cette capacité d’exécution au service de projets sélectionnés sur le marché américain.",
      pillars: [["Résidences et communautés", "Projets résidentiels, communautés de maisons individuelles et développement de nouvelles unités."], ["Développement immobilier", "Sélection de sites, planification, infrastructures, construction et gestion de projet."], ["Gestion structurée", "Suivi juridique, commercial et opérationnel adapté à chaque projet."], ["Vision internationale", "Activités dans le sud-est des États-Unis avec une vision de marché à long terme."]],
      disclaimerTitle: "S’informer avant toute décision.", disclaimer: "Ce contenu est institutionnel et ne constitue ni une offre publique, ni une recommandation, ni une promesse de rendement. Chaque projet, risque, structure, disponibilité et condition doit être évalué individuellement à partir de sa documentation et avec un conseil professionnel.",
    },
    footer: { about: "Développement immobilier au Brésil et aux États-Unis.", cities: "Villes", company: "Pro-Tops", history: "Notre histoire", service: "Service commercial", contact: "Contact", rights: "© 2026 Pro-Tops. Tous droits réservés.", note: "Les informations commerciales sont soumises à confirmation." },
    internationalProject: { summary: "Une perspective aérienne claire de {name} et de son intégration à {city}.", description: "Découvrez {name} grâce à des images récentes par drone présentant le site, son environnement et ses accès. Les disponibilités, informations techniques et conditions commerciales sont confirmées directement par l’équipe Pro-Tops.", features: ["Images aériennes actualisées", "Contexte du site, de l’environnement et des accès", "Disponibilités et conditions sur demande"] },
  },
  de: {
    nav: { company: "Unternehmen", capital: "Capital Partners", contact: "Kontakt", open: "Menü öffnen", language: "Sprache auswählen" },
    common: { state: "Minas Gerais, Brasilien", projectImage: "Luftaufnahme von", cityImage: "Luftaufnahme von" },
    home: {
      eyebrow: "Immobilienentwicklung seit 2003", title: "Aus Flächen entsteht", accent: "bleibender Wert.",
      heroCopy: "Projekte, die Vision, Infrastruktur und langfristige Entwicklung in Brasilien und den Vereinigten Staaten verbinden.",
      primary: "Projekte entdecken", secondary: "Mit unserem Team sprechen", scroll: "Standorte entdecken",
      stats: [["2003", "Beginn unserer Geschichte"], ["4.000+", "Einheiten in Uberlândia"], ["150+", "Projekte in Brasilien und den USA"], ["3 Städte", "Regionales Portfolio"]],
      citiesEyebrow: "Unsere Standorte", citiesTitle: "Projekte, die mit jeder Stadt wachsen.",
      citiesText: "Wählen Sie eine Stadt, entdecken Sie unsere Projekte, aktuelle Luftaufnahmen und den direkten Kontakt zu unserem Vertriebsteam.",
      featuredEyebrow: "Ausgewähltes Portfolio", featuredTitle: "Entdecken Sie ausgewählte Pro-Tops-Projekte.", featuredCta: "Beratung anfragen",
      storyEyebrow: "Unsere Geschichte", storyTitle: "Vision erkennt Chancen. Struktur macht sie realisierbar.",
      storyP1: "Pro-Tops wurde in Charlotte in den Vereinigten Staaten gegründet und weitete seine Aktivitäten auf Brasilien aus. In mehr als zwei Jahrzehnten war die Gruppe an der Entwicklung und Vermarktung Tausender Immobilieneinheiten beteiligt.",
      storyP2: "In Uberlândia, Araguari und Sacramento entwickelt die Gruppe Wohn-, Gewerbe-, Industrie- und Infrastrukturprojekte mit Fokus auf Umsetzung, Governance und langfristige Entwicklung.",
      seal: "Mehr als zwei Jahrzehnte\nin der Flächenentwicklung", regional: "Regionale Präsenz ansehen", international: "Internationale Aktivitäten entdecken",
      capitalTitle: "Eine Brücke zwischen Immobilienkompetenz und Chancen in den Vereinigten Staaten.",
      capitalText: "Wohnungsbau, geplante Communities, Renovierungen und Immobilien-Asset-Management im Südosten der USA.", capitalCta: "Capital Partners entdecken",
      nextEyebrow: "Nächster Schritt", nextTitle: "Gemeinsam finden wir das passende Projekt.", nextCta: "Über WhatsApp sprechen",
    },
    city: {
      presence: "Pro-Tops in", view: "{count} Projekte ansehen", localEyebrow: "Lokales Portfolio", title: "Projekte in",
      intro: "Aktuelle Drohnenaufnahmen, städtischer Kontext und direkte Beratung zu Verfügbarkeit und Konditionen.",
      contactTitle: "Möchten Sie eines dieser Projekte kennenlernen?", contactText: "Kontaktieren Sie das Pro-Tops-Team für aktuelle Informationen und einen Besichtigungstermin.", contactCta: "Team kontaktieren",
    },
    project: {
      back: "Zurück zu", overview: "Projektübersicht", request: "Informationen anfordern", recent: "Aktuelle Luftaufnahme", archive: "Pro-Tops-Archiv 2026",
      note: "Das Bild zeigt das Grundstück und seine Umgebung. Verfügbarkeit, Grenzen, Preise und Konditionen sind beim Vertriebsteam zu bestätigen.",
      continue: "Weitere Projekte", others: "Andere Projekte in", all: "Alle ansehen",
    },
    capital: {
      back: "Zurück zu Pro-Tops", title: "Immobilienkompetenz über Grenzen hinweg.",
      hero: "Ein Geschäftsfeld zur Identifizierung, Entwicklung und Verwaltung ausgewählter Immobilienchancen im Südosten der Vereinigten Staaten.", cta: "Präsentation anfordern",
      eyebrow: "Internationale Aktivitäten", introTitle: "Struktur für Entwicklung, Umsetzung und Begleitung jedes Projekts.",
      intro: "Unsere in Charlotte begonnene Geschichte umfasst Erfahrung im Wohnungsbau, bei Renovierungen, Ausbauarbeiten, geplanten Communities und im Asset-Management. Capital Partners verbindet diese Umsetzungskompetenz mit ausgewählten Projekten auf dem US-Markt.",
      pillars: [["Wohnungen und Communities", "Wohnprojekte, Einfamilienhaus-Communities und die Entwicklung neuer Einheiten."], ["Immobilienentwicklung", "Standortauswahl, Planung, Infrastruktur, Bauausführung und Projektmanagement."], ["Strukturiertes Management", "Rechtliche, kaufmännische und operative Begleitung passend zum jeweiligen Projekt."], ["Internationale Perspektive", "Aktivitäten im Südosten der Vereinigten Staaten mit langfristigem Marktfokus."]],
      disclaimerTitle: "Information vor jeder Entscheidung.", disclaimer: "Diese Inhalte dienen ausschließlich institutionellen Zwecken und stellen weder ein öffentliches Angebot noch eine Empfehlung oder Renditezusage dar. Projekte, Risiken, Strukturen, Verfügbarkeiten und Bedingungen sind jeweils anhand eigener Unterlagen und mit professioneller Beratung zu prüfen.",
    },
    footer: { about: "Immobilienentwicklung mit Präsenz in Brasilien und den Vereinigten Staaten.", cities: "Städte", company: "Pro-Tops", history: "Unsere Geschichte", service: "Vertriebsberatung", contact: "Kontakt", rights: "© 2026 Pro-Tops. Alle Rechte vorbehalten.", note: "Kommerzielle Angaben vorbehaltlich Bestätigung." },
    internationalProject: { summary: "Eine klare Luftperspektive auf {name} und die Verbindung zu {city}.", description: "Entdecken Sie {name} anhand aktueller Drohnenaufnahmen des Grundstücks, der Umgebung und der Zufahrten. Verfügbarkeit, technische Details und Konditionen bestätigt das Pro-Tops-Team direkt.", features: ["Aktuelle Luftaufnahmen", "Kontext zu Grundstück, Umgebung und Zufahrten", "Verfügbarkeit und Konditionen auf Anfrage"] },
  },
  zh: {
    nav: { company: "关于公司", capital: "资本合作", contact: "联系我们", open: "打开菜单", language: "选择语言" },
    common: { state: "巴西米纳斯吉拉斯州", projectImage: "项目航拍：", cityImage: "城市航拍：" },
    home: {
      eyebrow: "自2003年起专注房地产开发", title: "让土地成为", accent: "长期资产。",
      heroCopy: "在巴西与美国，通过远见、基础设施和长期规划创造房地产价值。",
      primary: "浏览开发项目", secondary: "联系团队", scroll: "查看项目城市",
      stats: [["2003", "发展历程起点"], ["4,000+", "乌贝兰迪亚项目单位"], ["150+", "巴西与美国项目"], ["3座城市", "区域项目组合"]],
      citiesEyebrow: "业务布局", citiesTitle: "与城市共同成长的开发项目。",
      citiesText: "选择城市，浏览项目、最新航拍影像，并与我们的商务团队直接沟通。",
      featuredEyebrow: "精选项目", featuredTitle: "了解 Pro-Tops 的代表性项目。", featuredCta: "咨询商务团队",
      storyEyebrow: "我们的历程", storyTitle: "以远见发现机会，以实力推动落地。",
      storyP1: "Pro-Tops 起步于美国夏洛特，之后将业务拓展至巴西。二十多年来，集团参与了数千个房地产单位的开发与商业化运营。",
      storyP2: "在乌贝兰迪亚、阿拉瓜里和萨克拉门托，集团参与住宅、商业、工业及基础设施项目，重视执行能力、治理和长期发展。",
      seal: "二十多年\n持续创造土地价值", regional: "查看巴西区域业务", international: "了解国际业务",
      capitalTitle: "连接房地产专业经验与美国市场机会。",
      capitalText: "专注美国东南部的住宅建设、规划社区、改造项目和房地产资产管理。", capitalCta: "了解 Capital Partners",
      nextEyebrow: "下一步", nextTitle: "让我们协助您找到合适的项目。", nextCta: "通过 WhatsApp 联系",
    },
    city: {
      presence: "Pro-Tops 业务城市：", view: "查看 {count} 个项目", localEyebrow: "当地项目组合", title: "开发项目：",
      intro: "通过最新无人机影像、城市环境信息和直接咨询，了解项目供应及商务条件。",
      contactTitle: "希望进一步了解这些项目？", contactText: "联系 Pro-Tops 团队，获取最新信息并预约实地参观。", contactCta: "联系团队",
    },
    project: {
      back: "返回", overview: "项目概览", request: "索取项目信息", recent: "最新航拍影像", archive: "Pro-Tops 2026 影像资料",
      note: "图片展示项目区域及周边环境。项目供应、边界、价格和商务条件请以商务团队确认为准。",
      continue: "继续浏览", others: "其他项目：", all: "查看全部",
    },
    capital: {
      back: "返回 Pro-Tops", title: "跨越国界的房地产专业能力。",
      hero: "专注于美国东南部优质房地产机会的识别、开发和管理。", cta: "索取项目介绍",
      eyebrow: "国际业务", introTitle: "从开发、执行到管理，为每个项目提供完整支持。",
      intro: "我们的业务起步于夏洛特，积累了住宅建设、改造、装修、规划社区和资产管理经验。Capital Partners 将这些执行能力与美国市场中经过筛选的项目相连接。",
      pillars: [["住宅与社区", "住宅开发、独栋住宅社区及新建单位项目。"], ["房地产开发", "涵盖选址、规划、基础设施、建设执行和项目管理。"], ["体系化管理", "根据项目结构提供法律、商务和运营管理支持。"], ["国际视野", "立足美国东南部市场，重视长期趋势与价值。"]],
      disclaimerTitle: "充分了解后再做决定。", disclaimer: "本页面仅供企业信息介绍，不构成公开发行、投资建议或收益承诺。每个项目的结构、风险、供应和条件均应依据独立文件并在专业顾问协助下进行评估。",
    },
    footer: { about: "业务覆盖巴西与美国的房地产开发集团。", cities: "项目城市", company: "Pro-Tops", history: "公司历程", service: "商务咨询", contact: "联系方式", rights: "© 2026 Pro-Tops。保留所有权利。", note: "商务信息以最终确认为准。" },
    internationalProject: { summary: "通过清晰航拍视角，了解 {name} 及其与 {city} 的城市联系。", description: "通过最新无人机影像了解 {name} 的项目区域、周边环境和交通条件。项目供应、技术信息及商务条件由 Pro-Tops 团队直接确认。", features: ["最新航拍影像", "项目区域、周边及交通信息", "供应和商务条件可咨询"] },
  },
} as const;

const cityTranslations: Record<Locale, Record<City["slug"], Pick<City, "intro" | "statement">>> = {
  pt: {
    uberlandia: { intro: "Empreendimentos que acompanham a expansão urbana e conectam moradia, infraestrutura e valorização.", statement: "Uma presença construída junto com a cidade." },
    araguari: { intro: "Projetos residenciais e industriais pensados para novos ciclos de desenvolvimento da cidade.", statement: "Espaço para construir novas histórias." },
    sacramento: { intro: "Loteamentos conectados ao crescimento local, com registros aéreos recentes e atendimento direto.", statement: "Desenvolvimento que respeita o lugar." },
  },
  en: {
    uberlandia: { intro: "Developments aligned with urban expansion, connecting housing, infrastructure and long-term value.", statement: "A presence built alongside the city." },
    araguari: { intro: "Residential and industrial projects designed for the city’s next development cycles.", statement: "Space for new stories to take shape." },
    sacramento: { intro: "Land developments connected to local growth, with current aerial imagery and direct support.", statement: "Development that respects its surroundings." },
  },
  es: {
    uberlandia: { intro: "Proyectos que acompañan la expansión urbana y conectan vivienda, infraestructura y valorización.", statement: "Una presencia construida junto a la ciudad." },
    araguari: { intro: "Proyectos residenciales e industriales pensados para los próximos ciclos de desarrollo de la ciudad.", statement: "Espacio para construir nuevas historias." },
    sacramento: { intro: "Proyectos conectados con el crecimiento local, imágenes aéreas actuales y atención directa.", statement: "Desarrollo que respeta su entorno." },
  },
  fr: {
    uberlandia: { intro: "Des projets qui accompagnent l’expansion urbaine et réunissent habitat, infrastructures et valeur à long terme.", statement: "Une présence construite avec la ville." },
    araguari: { intro: "Des projets résidentiels et industriels conçus pour les prochains cycles de développement de la ville.", statement: "Un espace pour écrire de nouvelles histoires." },
    sacramento: { intro: "Des lotissements liés à la croissance locale, avec des images aériennes récentes et un accompagnement direct.", statement: "Un développement respectueux de son environnement." },
  },
  de: {
    uberlandia: { intro: "Projekte im Einklang mit dem städtischen Wachstum, die Wohnen, Infrastruktur und langfristigen Wert verbinden.", statement: "Eine Präsenz, die gemeinsam mit der Stadt gewachsen ist." },
    araguari: { intro: "Wohn- und Industrieprojekte für die nächsten Entwicklungsphasen der Stadt.", statement: "Raum für neue Geschichten." },
    sacramento: { intro: "Flächenentwicklungen im Einklang mit lokalem Wachstum, aktuellen Luftaufnahmen und direkter Beratung.", statement: "Entwicklung mit Respekt für den Standort." },
  },
  zh: {
    uberlandia: { intro: "顺应城市扩张，将住宅、基础设施与长期价值相连接。", statement: "与城市共同成长。" },
    araguari: { intro: "面向城市下一阶段发展的住宅和工业项目。", statement: "为新的生活与事业创造空间。" },
    sacramento: { intro: "与当地发展相连接的土地项目，并提供最新航拍资料与直接咨询。", statement: "尊重当地环境的开发理念。" },
  },
};

const projectLabels: Record<Locale, Record<string, string>> = {
  pt: {},
  en: { "Condomínio residencial": "Residential community", "Empreendimento residencial": "Residential development", "Desenvolvimento urbano": "Urban development", "Área urbana": "Urban area", "Loteamento residencial": "Residential land development", "Loteamentos residenciais": "Residential land developments", "Desenvolvimento industrial": "Industrial development" },
  es: { "Condomínio residencial": "Condominio residencial", "Empreendimento residencial": "Proyecto residencial", "Desenvolvimento urbano": "Desarrollo urbano", "Área urbana": "Área urbana", "Loteamento residencial": "Urbanización residencial", "Loteamentos residenciais": "Urbanizaciones residenciales", "Desenvolvimento industrial": "Desarrollo industrial" },
  fr: { "Condomínio residencial": "Résidence privée", "Empreendimento residencial": "Projet résidentiel", "Desenvolvimento urbano": "Développement urbain", "Área urbana": "Zone urbaine", "Loteamento residencial": "Lotissement résidentiel", "Loteamentos residenciais": "Lotissements résidentiels", "Desenvolvimento industrial": "Développement industriel" },
  de: { "Condomínio residencial": "Wohnanlage", "Empreendimento residencial": "Wohnprojekt", "Desenvolvimento urbano": "Stadtentwicklung", "Área urbana": "Städtische Fläche", "Loteamento residencial": "Wohnbaulandentwicklung", "Loteamentos residenciais": "Wohnbaulandentwicklungen", "Desenvolvimento industrial": "Industrieentwicklung" },
  zh: { "Condomínio residencial": "住宅社区", "Empreendimento residencial": "住宅开发项目", "Desenvolvimento urbano": "城市开发", "Área urbana": "城市区域", "Loteamento residencial": "住宅土地开发", "Loteamentos residenciais": "住宅土地开发项目", "Desenvolvimento industrial": "工业开发" },
};

export function getCopy(locale: Locale) {
  return dictionary[locale];
}

export function getHtmlLang(locale: Locale) {
  return languageOptions.find((item) => item.code === locale)?.htmlLang ?? "pt-BR";
}

export function localePath(locale: Locale, path = "/") {
  if (locale === "pt") return path;
  const [pathname, hash] = path.split("#");
  const suffix = pathname === "/" ? "" : pathname;
  return `/${locale}${suffix}${hash ? `#${hash}` : ""}`;
}

export function getLocalizedCity(city: City, locale: Locale): City {
  return { ...city, ...cityTranslations[locale][city.slug] };
}

function fill(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce((value, [key, replacement]) => value.replaceAll(`{${key}}`, replacement), template);
}

export function getLocalizedProject(project: Project, cityName: string, locale: Locale): Project {
  if (locale === "pt") return project;
  const copy = dictionary[locale].internationalProject;
  return {
    ...project,
    label: projectLabels[locale][project.label] ?? project.label,
    summary: fill(copy.summary, { name: project.name, city: cityName }),
    description: fill(copy.description, { name: project.name, city: cityName }),
    features: [...copy.features],
  };
}

export function getWhatsAppUrl(locale: Locale, projectName?: string, cityName?: string) {
  const general: Record<Locale, string> = {
    pt: "Olá, vim pelo site da Pro-Tops e quero conhecer os empreendimentos.",
    en: "Hello, I visited the Pro-Tops website and would like to learn more about the developments.",
    es: "Hola, visité el sitio web de Pro-Tops y me gustaría conocer los proyectos.",
    fr: "Bonjour, j’ai consulté le site de Pro-Tops et je souhaite en savoir plus sur les projets.",
    de: "Guten Tag, ich habe die Pro-Tops-Website besucht und möchte mehr über die Projekte erfahren.",
    zh: "您好，我浏览了 Pro-Tops 网站，希望进一步了解开发项目。",
  };
  const projectMessage: Record<Locale, string> = {
    pt: `Olá, tenho interesse no ${projectName}, em ${cityName}.`,
    en: `Hello, I am interested in ${projectName}, in ${cityName}.`,
    es: `Hola, estoy interesado en ${projectName}, en ${cityName}.`,
    fr: `Bonjour, je suis intéressé par ${projectName}, à ${cityName}.`,
    de: `Guten Tag, ich interessiere mich für ${projectName} in ${cityName}.`,
    zh: `您好，我对位于 ${cityName} 的 ${projectName} 项目感兴趣。`,
  };
  const message = projectName && cityName ? projectMessage[locale] : general[locale];
  return `https://wa.me/553432310800?text=${encodeURIComponent(message)}`;
}

export function formatCount(template: string, count: number) {
  return template.replace("{count}", String(count));
}
