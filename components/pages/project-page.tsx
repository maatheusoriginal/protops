import Link from "next/link";
import { ArrowLeft, ArrowUpRight, CalendarDays, Check, Eye, MapPin, MessageCircle, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectGallery } from "@/components/project-gallery";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { cmsCityToSiteCity, cmsProjectToSiteProject } from "@/lib/cms-model";
import { getPublicCmsCity, getPublicCmsProject, getPublicCmsProjectsByCity } from "@/lib/firebase/public-data";
import { getCity, getCityProjects, getProject } from "@/lib/site-data";
import { getCopy, getLocalizedCity, getLocalizedProject, getWhatsAppUrl, localePath, type Locale } from "@/lib/i18n";

const detailCopy: Record<Locale, {
  details: string;
  profile: string;
  location: string;
  archive: string;
  availability: string;
  lotSize: string;
  videoEyebrow: string;
  videoTitle: string;
  images: (count: number) => string;
  onRequest: string;
  galleryEyebrow: string;
  galleryTitle: string;
  galleryText: string;
  galleryLabels: { open: string; close: string; previous: string; next: string; image: string };
  pathEyebrow: string;
  pathTitle: string;
  steps: Array<[string, string]>;
}> = {
  pt: {
    details: "Informações do empreendimento", profile: "Perfil", location: "Localização", archive: "Acervo visual", availability: "Disponibilidade", lotSize: "Área dos lotes", videoEyebrow: "Sobrevoo do empreendimento", videoTitle: "Veja o projeto em movimento.",
    images: (count) => `${count} imagens`, onRequest: "Sob consulta",
    galleryEyebrow: "Explore cada ângulo", galleryTitle: "Uma visão mais completa antes da sua visita.", galleryText: "Imagens reais de drone mostram a implantação, os acessos e a relação do empreendimento com o entorno.",
    galleryLabels: { open: "Abrir galeria", close: "Fechar galeria", previous: "Imagem anterior", next: "Próxima imagem", image: "imagem" },
    pathEyebrow: "Próximo passo", pathTitle: "Da primeira impressão à visita ao empreendimento.",
    steps: [["Explore o acervo", "Veja imagens reais e entenda melhor a escala e o entorno."], ["Converse com a equipe", "Receba informações atualizadas sobre disponibilidade e condições."], ["Agende uma visita", "Conheça o empreendimento de perto com atendimento orientado."]],
  },
  en: {
    details: "Development information", profile: "Profile", location: "Location", archive: "Visual archive", availability: "Availability", lotSize: "Lot size", videoEyebrow: "Aerial tour", videoTitle: "See the development in motion.",
    images: (count) => `${count} images`, onRequest: "On request",
    galleryEyebrow: "Explore every angle", galleryTitle: "A clearer view before your visit.", galleryText: "Real drone imagery shows the site, access routes and how the development connects with its surroundings.",
    galleryLabels: { open: "Open gallery", close: "Close gallery", previous: "Previous image", next: "Next image", image: "image" },
    pathEyebrow: "Next step", pathTitle: "From first impression to an on-site visit.",
    steps: [["Explore the archive", "Review real imagery and understand the scale and surroundings."], ["Talk to our team", "Receive current availability and commercial information."], ["Schedule a visit", "Experience the development with guided assistance."]],
  },
  es: {
    details: "Información del proyecto", profile: "Perfil", location: "Ubicación", archive: "Archivo visual", availability: "Disponibilidad", lotSize: "Área de los lotes", videoEyebrow: "Recorrido aéreo", videoTitle: "Vea el proyecto en movimiento.",
    images: (count) => `${count} imágenes`, onRequest: "A consultar",
    galleryEyebrow: "Explore cada ángulo", galleryTitle: "Una visión más completa antes de su visita.", galleryText: "Imágenes reales de dron muestran el área, los accesos y la relación del proyecto con su entorno.",
    galleryLabels: { open: "Abrir galería", close: "Cerrar galería", previous: "Imagen anterior", next: "Siguiente imagen", image: "imagen" },
    pathEyebrow: "Próximo paso", pathTitle: "De la primera impresión a la visita presencial.",
    steps: [["Explore el archivo", "Vea imágenes reales y comprenda la escala y el entorno."], ["Hable con el equipo", "Reciba información actualizada sobre disponibilidad y condiciones."], ["Programe una visita", "Conozca el proyecto de cerca con atención personalizada."]],
  },
  fr: {
    details: "Informations sur le projet", profile: "Profil", location: "Localisation", archive: "Archives visuelles", availability: "Disponibilité", lotSize: "Surface des lots", videoEyebrow: "Vue aérienne", videoTitle: "Découvrez le projet en mouvement.",
    images: (count) => `${count} images`, onRequest: "Sur demande",
    galleryEyebrow: "Explorez chaque angle", galleryTitle: "Une vision plus complète avant votre visite.", galleryText: "Des images réelles par drone présentent le site, les accès et son intégration dans l’environnement.",
    galleryLabels: { open: "Ouvrir la galerie", close: "Fermer la galerie", previous: "Image précédente", next: "Image suivante", image: "image" },
    pathEyebrow: "Prochaine étape", pathTitle: "De la première impression à la visite sur place.",
    steps: [["Explorez les images", "Découvrez le projet, son échelle et son environnement."], ["Échangez avec l’équipe", "Recevez les disponibilités et conditions actualisées."], ["Planifiez une visite", "Découvrez le projet sur place avec un accompagnement dédié."]],
  },
  de: {
    details: "Projektinformationen", profile: "Profil", location: "Standort", archive: "Bildarchiv", availability: "Verfügbarkeit", lotSize: "Grundstücksgröße", videoEyebrow: "Luftaufnahme", videoTitle: "Erleben Sie das Projekt in Bewegung.",
    images: (count) => `${count} Bilder`, onRequest: "Auf Anfrage",
    galleryEyebrow: "Jede Perspektive entdecken", galleryTitle: "Ein umfassender Eindruck vor Ihrem Besuch.", galleryText: "Aktuelle Drohnenbilder zeigen das Areal, die Zufahrten und die Einbindung in die Umgebung.",
    galleryLabels: { open: "Galerie öffnen", close: "Galerie schließen", previous: "Vorheriges Bild", next: "Nächstes Bild", image: "Bild" },
    pathEyebrow: "Nächster Schritt", pathTitle: "Vom ersten Eindruck bis zum Besuch vor Ort.",
    steps: [["Bilder entdecken", "Erhalten Sie einen realen Eindruck von Größe und Umgebung."], ["Team kontaktieren", "Erhalten Sie aktuelle Angaben zu Verfügbarkeit und Konditionen."], ["Besuch vereinbaren", "Lernen Sie das Projekt mit persönlicher Begleitung kennen."]],
  },
  zh: {
    details: "项目资料", profile: "项目类型", location: "位置", archive: "影像资料", availability: "供应情况", lotSize: "地块面积", videoEyebrow: "航拍视频", videoTitle: "通过动态影像了解项目。",
    images: (count) => `${count} 张图片`, onRequest: "欢迎咨询",
    galleryEyebrow: "多角度探索", galleryTitle: "实地考察前，更全面地了解项目。", galleryText: "真实无人机影像展示项目区域、交通条件及其与周边环境的联系。",
    galleryLabels: { open: "打开图库", close: "关闭图库", previous: "上一张", next: "下一张", image: "图片" },
    pathEyebrow: "下一步", pathTitle: "从初步了解，到实地考察。",
    steps: [["浏览影像", "通过真实影像了解项目规模和周边环境。"], ["联系团队", "获取最新供应情况及商务条件。"], ["预约考察", "在专业团队陪同下实地了解项目。"]],
  },
};

const stepIcons = [Eye, MessageCircle, CalendarDays];

function videoEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v") ?? url.pathname.split("/").filter(Boolean).at(-1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (url.hostname === "youtu.be") return `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`;
    if (url.hostname.includes("vimeo.com")) return `https://player.vimeo.com/video/${url.pathname.split("/").filter(Boolean).at(-1)}`;
  } catch {}
  return null;
}

export async function ProjectPage({ locale, citySlug, projectSlug }: { locale: Locale; citySlug: string; projectSlug: string }) {
  const [remoteProject, remoteCity, remoteRelated] = await Promise.all([
    getPublicCmsProject(citySlug, projectSlug),
    getPublicCmsCity(citySlug),
    getPublicCmsProjectsByCity(citySlug),
  ]);
  const baseProject = getProject(citySlug, projectSlug);
  const baseCity = getCity(citySlug);
  if (remoteProject === null || remoteCity === null || (remoteProject === undefined && !baseProject) || (remoteCity === undefined && !baseCity)) notFound();

  const copy = getCopy(locale);
  const details = detailCopy[locale];
  const city = remoteCity ? cmsCityToSiteCity(remoteCity, locale) : getLocalizedCity(baseCity!, locale);
  const project = remoteProject ? cmsProjectToSiteProject(remoteProject, city.name, locale) : getLocalizedProject(baseProject!, city.name, locale);
  const galleryImages = [project.image, ...project.gallery];
  const related = (remoteRelated === undefined
    ? getCityProjects(city.slug).map((item) => getLocalizedProject(item, city.name, locale))
    : remoteRelated.map((item) => cmsProjectToSiteProject(item, city.name, locale)))
    .filter((item) => item.slug !== project.slug)
    .slice(0, 3);
  const projectWhatsapp = getWhatsAppUrl(locale, project.name, city.name);
  const currentPath = `/${city.slug}/${project.slug}`;
  const embedUrl = remoteProject?.videoUrl ? videoEmbedUrl(remoteProject.videoUrl) : null;
  const thirdFact = remoteProject?.lotSize
    ? { label: details.lotSize, value: remoteProject.lotSize }
    : { label: details.archive, value: details.images(galleryImages.length) };

  return (
    <main className="project-page"><SiteHeader locale={locale} currentPath={currentPath} />
      <section className="project-hero"><img src={project.image} alt={`${copy.common.projectImage} ${project.name}`} /><div className="page-hero-shade" /><div className="site-shell project-hero-content"><Link href={localePath(locale, `/${city.slug}`)} className="back-link"><ArrowLeft aria-hidden="true" /> {copy.project.back} {city.name}</Link><p className="eyebrow eyebrow-light">{project.label}</p><h1>{project.name}</h1><p className="project-hero-location"><MapPin aria-hidden="true" /> {city.name}, {copy.common.state}</p></div></section>

      <section className="section project-overview"><div className="site-shell project-overview-grid"><div><p className="eyebrow">{copy.project.overview}</p><h2>{project.summary}</h2></div><div className="project-description"><p>{project.description}</p><ul>{project.features.map((feature) => <li key={feature}><Check aria-hidden="true" /> {feature}</li>)}</ul><Button asChild size="lg" className="button-red"><a href={projectWhatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.project.request}</a></Button></div></div></section>

      <section className="project-facts-section"><div className="site-shell"><p className="eyebrow">{details.details}</p><div className="project-facts-grid"><article><span>01</span><small>{details.profile}</small><strong>{project.label}</strong></article><article><span>02</span><small>{details.location}</small><strong>{remoteProject?.address || `${city.name}, MG`}</strong></article><article><span>03</span><small>{thirdFact.label}</small><strong>{thirdFact.value}</strong></article><article><span>04</span><small>{details.availability}</small><strong>{remoteProject?.priceLabel || details.onRequest}</strong></article></div>{remoteProject?.mapUrl && <a className="project-map-link" href={remoteProject.mapUrl} target="_blank" rel="noreferrer"><MapPin /> Abrir localização no mapa <ArrowUpRight /></a>}</div></section>

      {remoteProject?.videoUrl && <section className="section project-video-section"><div className="site-shell"><div className="section-heading split-heading"><div><p className="eyebrow">{details.videoEyebrow}</p><h2>{details.videoTitle}</h2></div><PlayCircle aria-hidden="true" /></div><div className="project-video-frame">{embedUrl ? <iframe src={embedUrl} title={`${details.videoTitle} ${project.name}`} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /> : <video src={remoteProject.videoUrl} controls playsInline preload="metadata" poster={project.image} />}</div></div></section>}

      <section className="section project-gallery-section"><div className="site-shell"><div className="section-heading split-heading"><div><p className="eyebrow">{details.galleryEyebrow}</p><h2>{details.galleryTitle}</h2></div><p>{details.galleryText}</p></div><ProjectGallery images={galleryImages} projectName={project.name} labels={details.galleryLabels} /><p className="media-note">{copy.project.note}</p></div></section>

      <section className="section project-path"><div className="site-shell"><div className="project-path-heading"><p className="eyebrow eyebrow-light">{details.pathEyebrow}</p><h2>{details.pathTitle}</h2></div><div className="project-path-grid">{details.steps.map(([title, text], index) => { const Icon = stepIcons[index]; return <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{text}</p></article>; })}</div><Button asChild size="lg" className="button-light project-path-cta"><a href={projectWhatsapp} target="_blank" rel="noreferrer"><MessageCircle aria-hidden="true" /> {copy.project.request}</a></Button></div></section>

      {related.length > 0 && <section className="section related-section"><div className="site-shell"><div className="section-heading inline-heading"><div><p className="eyebrow">{copy.project.continue}</p><h2>{copy.project.others} {city.name}</h2></div><Link href={localePath(locale, `/${city.slug}`)}>{copy.project.all} <ArrowUpRight aria-hidden="true" /></Link></div><div className="projects-grid">{related.map((item) => <ProjectCard project={item} locale={locale} key={item.slug} />)}</div></div></section>}

      <a href={projectWhatsapp} target="_blank" rel="noreferrer" className="project-mobile-cta"><MessageCircle aria-hidden="true" /> {copy.project.request}</a>
      <SiteFooter locale={locale} />
    </main>
  );
}
