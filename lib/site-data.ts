export type CitySlug = string;

export type Project = {
  slug: string;
  name: string;
  city: CitySlug;
  label: string;
  image: string;
  gallery: string[];
  summary: string;
  description: string;
  features: string[];
};

export type City = {
  slug: CitySlug;
  name: string;
  state: string;
  image: string;
  intro: string;
  statement: string;
};

export const whatsappUrl =
  "https://wa.me/553432310800?text=Olá%2C%20vim%20pelo%20site%20da%20Pro-Tops%20e%20quero%20conhecer%20os%20empreendimentos.";

export const cities: City[] = [
  {
    slug: "uberlandia",
    name: "Uberlândia",
    state: "Minas Gerais",
    image: "/media/golden-village.webp",
    intro: "Empreendimentos que acompanham a expansão urbana e conectam moradia, infraestrutura e valorização.",
    statement: "Uma presença construída junto com a cidade.",
  },
  {
    slug: "araguari",
    name: "Araguari",
    state: "Minas Gerais",
    image: "/media/bonanza.webp",
    intro: "Projetos residenciais e industriais pensados para novos ciclos de desenvolvimento da cidade.",
    statement: "Espaço para construir novas histórias.",
  },
  {
    slug: "sacramento",
    name: "Sacramento",
    state: "Minas Gerais",
    image: "/media/vila-bela.webp",
    intro: "Loteamentos conectados ao crescimento local, com registros aéreos recentes e atendimento direto.",
    statement: "Desenvolvimento que respeita o lugar.",
  },
];

export const projects: Project[] = [
  {
    slug: "golden-village", name: "Golden Village", city: "uberlandia", label: "Condomínio residencial",
    image: "/media/golden-village.webp", summary: "Um endereço consolidado em uma região de expansão qualificada.",
    description: "O Golden Village integra arquitetura, vias estruturadas e proximidade com a dinâmica urbana de Uberlândia. O acervo aéreo mostra a ocupação do empreendimento e sua relação com a cidade.",
    features: ["Registro aéreo recente", "Área de lazer documentada", "Informações comerciais sob consulta"],
    gallery: ["/media/projects/golden-village/1.webp", "/media/projects/golden-village/2.webp", "/media/projects/golden-village/3.webp"],
  },
  {
    slug: "park-sul", name: "Park Sul", city: "uberlandia", label: "Empreendimento residencial",
    image: "/media/park-sul.webp", summary: "Planejamento urbano em um dos vetores de crescimento da cidade.",
    description: "O Park Sul faz parte do portfólio Pro-Tops em Uberlândia. Fotos e vídeos de drone apresentam o empreendimento, seu entorno e a conexão com a malha urbana.",
    features: ["Fotos e vídeos em alta resolução", "Visão completa do entorno", "Disponibilidade sob consulta"],
    gallery: ["/media/projects/park-sul/1.webp", "/media/projects/park-sul/2.webp", "/media/projects/park-sul/3.webp"],
  },
  {
    slug: "pinheiros", name: "Condomínio Pinheiros", city: "uberlandia", label: "Condomínio residencial",
    image: "/media/pinheiros.webp", summary: "Uma leitura aérea do condomínio e de sua inserção urbana.",
    description: "O Condomínio Pinheiros reúne um acervo atualizado de imagens aéreas para apresentar o empreendimento com clareza, escala e contexto.",
    features: ["Acervo de drone atualizado", "Atendimento com a equipe Pro-Tops", "Detalhes sob consulta"],
    gallery: ["/media/projects/pinheiros/1.webp", "/media/projects/pinheiros/2.webp", "/media/projects/pinheiros/3.webp"],
  },
  {
    slug: "victoria", name: "Condomínio Victoria", city: "uberlandia", label: "Condomínio residencial",
    image: "/media/victoria.webp", summary: "Um empreendimento apresentado por uma perspectiva ampla e real.",
    description: "O Condomínio Victoria integra o portfólio de Uberlândia. O material aéreo permite conhecer a implantação e o entorno antes de uma visita.",
    features: ["Imagens reais do empreendimento", "Visita orientada", "Condições sob consulta"],
    gallery: ["/media/projects/victoria/1.webp", "/media/projects/victoria/2.webp", "/media/projects/victoria/3.webp"],
  },
  {
    slug: "rio-acima", name: "Rio Acima", city: "uberlandia", label: "Desenvolvimento urbano",
    image: "/media/rio-acima.webp", summary: "Natureza, cidade e novas possibilidades de desenvolvimento.",
    description: "O Rio Acima é apresentado por imagens que mostram sua paisagem e a proximidade com áreas urbanizadas de Uberlândia.",
    features: ["Paisagem documentada por drone", "Contexto urbano e ambiental", "Informações sob consulta"],
    gallery: ["/media/projects/rio-acima/1.webp", "/media/projects/rio-acima/2.webp", "/media/projects/rio-acima/3.webp"],
  },
  {
    slug: "jardim-confidencia", name: "Jardim Confidência", city: "uberlandia", label: "Empreendimento residencial",
    image: "/media/jardim-confidencia.webp", summary: "Uma localização inserida no tecido urbano de Uberlândia.",
    description: "O Jardim Confidência conta com registros aéreos recentes que apresentam o empreendimento e sua integração com a cidade.",
    features: ["Captação aérea recente", "Apresentação do entorno", "Atendimento personalizado"],
    gallery: ["/media/projects/jardim-confidencia/1.webp", "/media/projects/jardim-confidencia/2.webp", "/media/projects/jardim-confidencia/3.webp"],
  },
  {
    slug: "vigilato-pereira", name: "Vigilato Pereira", city: "uberlandia", label: "Área urbana",
    image: "/media/vigilato-pereira.webp", summary: "Localização conectada a uma região urbana consolidada.",
    description: "O material de drone do Vigilato Pereira oferece uma visão objetiva da área, dos acessos e da ocupação ao redor.",
    features: ["Leitura aérea da área", "Acessos visíveis", "Detalhes comerciais sob consulta"],
    gallery: ["/media/projects/vigilato-pereira/1.webp", "/media/projects/vigilato-pereira/2.webp", "/media/projects/vigilato-pereira/3.webp"],
  },
  {
    slug: "aeroporto", name: "Aeroporto", city: "uberlandia", label: "Desenvolvimento urbano",
    image: "/media/aeroporto.webp", summary: "Uma área estratégica registrada em diferentes ângulos.",
    description: "O projeto Aeroporto integra o portfólio Pro-Tops em Uberlândia, com fotos e vídeos aéreos que contextualizam a área e seus acessos.",
    features: ["Fotos e vídeos de drone", "Visão dos acessos", "Informações sob consulta"],
    gallery: ["/media/projects/aeroporto/1.webp", "/media/projects/aeroporto/2.webp", "/media/projects/aeroporto/3.webp"],
  },
  {
    slug: "bonanza", name: "Residencial Bonanza", city: "araguari", label: "Loteamento residencial",
    image: "/media/bonanza.webp", summary: "Infraestrutura pronta para quem quer construir um novo capítulo.",
    description: "O Residencial Bonanza é um loteamento em Araguari com infraestrutura implantada e lotes prontos para construir. Valores, condições e disponibilidade devem ser confirmados com a equipe comercial.",
    features: ["Infraestrutura implantada", "Pronto para construir", "Condições atualizadas no atendimento"],
    gallery: ["/media/projects/bonanza/1.webp", "/media/projects/bonanza/2.webp", "/media/projects/bonanza/3.webp"],
  },
  {
    slug: "parques-verdes", name: "Parques Verdes 1 e 2", city: "araguari", label: "Loteamentos residenciais",
    image: "/media/parques-verdes.webp", summary: "Duas etapas de um projeto conectado ao crescimento de Araguari.",
    description: "Parques Verdes 1 e 2 fazem parte do portfólio residencial da Pro-Tops em Araguari. O acervo aéreo apresenta implantação, vias e entorno.",
    features: ["Etapas 1 e 2", "Acervo aéreo completo", "Disponibilidade sob consulta"],
    gallery: ["/media/projects/parques-verdes/1.webp", "/media/projects/parques-verdes/2.webp", "/media/projects/parques-verdes/3.webp"],
  },
  {
    slug: "industrial", name: "Industrial", city: "araguari", label: "Desenvolvimento industrial",
    image: "/media/industrial.webp", summary: "Uma área com vocação produtiva e visão de longo prazo.",
    description: "O projeto Industrial amplia a atuação da Pro-Tops em Araguari e apresenta uma área conectada à dinâmica produtiva da cidade.",
    features: ["Visão territorial ampla", "Material aéreo atualizado", "Informações técnicas sob consulta"],
    gallery: ["/media/projects/industrial/1.webp", "/media/projects/industrial/2.webp", "/media/projects/industrial/3.webp"],
  },
  {
    slug: "vila-bela", name: "Vila Bela", city: "sacramento", label: "Loteamento residencial",
    image: "/media/vila-bela.webp", summary: "Um novo endereço integrado à paisagem de Sacramento.",
    description: "O Vila Bela integra o portfólio Pro-Tops em Sacramento. Fotos e vídeos aéreos mostram a área, a vizinhança e o desenvolvimento urbano ao redor.",
    features: ["12 registros fotográficos aéreos", "Vídeos em 4K", "Informações comerciais sob consulta"],
    gallery: ["/media/projects/vila-bela/1.webp", "/media/projects/vila-bela/2.webp", "/media/projects/vila-bela/3.webp"],
  },
  {
    slug: "mora-da-colina", name: "Mora da Colina", city: "sacramento", label: "Loteamento residencial",
    image: "/media/mora-da-colina.webp", summary: "Paisagem aberta e potencial para novos projetos de vida.",
    description: "O Mora da Colina é apresentado em um acervo de fotos e vídeos que oferece uma leitura completa da área e de sua relação com Sacramento.",
    features: ["11 fotografias aéreas", "13 vídeos de drone", "Detalhes sob consulta"],
    gallery: ["/media/projects/mora-da-colina/1.webp", "/media/projects/mora-da-colina/2.webp", "/media/projects/mora-da-colina/3.webp"],
  },
];

export const getCity = (slug: string) => cities.find((city) => city.slug === slug);
export const getCityProjects = (city: string) => projects.filter((project) => project.city === city);
export const getProject = (city: string, slug: string) => projects.find((project) => project.city === city && project.slug === slug);

