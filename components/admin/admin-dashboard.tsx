"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import {
  Archive,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Copy,
  Eye,
  Globe2,
  ImageIcon,
  Images,
  LayoutDashboard,
  Languages,
  LoaderCircle,
  LogOut,
  MapPinned,
  Menu,
  Pencil,
  PlayCircle,
  Plus,
  Save,
  Search,
  Settings,
  Sparkles,
  Star,
  Trash2,
  UploadCloud,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  cmsLocales,
  emptyCmsCity,
  emptyCmsProject,
  seedCmsCities,
  seedCmsProjects,
  slugify,
  type CmsCity,
  type CmsProject,
  type CmsProjectStatus,
} from "@/lib/cms-model";
import {
  ensureSeedCmsData,
  removeCmsProject,
  saveCmsCity,
  saveCmsProject,
  subscribeCmsData,
  translateCityContent,
  translateProjectContent,
  uploadProjectImages,
} from "@/lib/firebase/admin-cms";
import { firebaseAuth } from "@/lib/firebase/client";

type AdminView = "overview" | "projects" | "cities" | "media" | "settings";

const statusLabels: Record<CmsProjectStatus, string> = {
  published: "Publicado",
  draft: "Rascunho",
  archived: "Arquivado",
};

const navItems: Array<{ id: AdminView; label: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Visão geral", icon: LayoutDashboard },
  { id: "projects", label: "Empreendimentos", icon: Building2 },
  { id: "cities", label: "Cidades", icon: MapPinned },
  { id: "media", label: "Biblioteca de mídia", icon: Images },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function AdminDashboard() {
  const [view, setView] = useState<AdminView>("overview");
  const [projects, setProjects] = useState<CmsProject[]>(seedCmsProjects);
  const [cities, setCities] = useState<CmsCity[]>(seedCmsCities);
  const [editing, setEditing] = useState<CmsProject | null>(null);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [syncState, setSyncState] = useState<"connecting" | "connected" | "error">("connecting");
  const [syncError, setSyncError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    let unsubscribe = () => {};

    async function connect() {
      try {
        await ensureSeedCmsData();
        if (!active) return;
        unsubscribe = subscribeCmsData(
          (nextProjects) => { setProjects(nextProjects); setSyncState("connected"); },
          (nextCities) => { setCities(nextCities); setSyncState("connected"); },
          (error) => { setSyncState("error"); setSyncError(error.message); },
        );
      } catch (error) {
        if (!active) return;
        setSyncState("error");
        setSyncError(error instanceof Error ? error.message : "Não foi possível conectar ao Firebase.");
      }
    }

    connect();
    return () => { active = false; unsubscribe(); };
  }, []);

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const name = project.translations.pt?.name ?? project.slug;
    const matchesSearch = `${name} ${project.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (cityFilter === "all" || project.citySlug === cityFilter) && (statusFilter === "all" || project.status === statusFilter);
  }), [projects, search, cityFilter, statusFilter]);

  const galleryCount = projects.reduce((total, project) => total + project.gallery.length + (project.heroImage ? 1 : 0), 0);
  const publishedCount = projects.filter((project) => project.status === "published").length;

  async function persistProject(project: CmsProject) {
    const ptName = project.translations.pt?.name.trim() ?? "";
    const slug = project.slug || slugify(ptName);
    const id = project.id || `${project.citySlug}__${slug}`;
    const next = { ...project, id, slug, updatedAt: new Date().toISOString() };
    setSaving(true);
    try {
      await saveCmsProject(next);
      setProjects((current) => current.some((item) => item.id === id) ? current.map((item) => item.id === id ? next : item) : [next, ...current]);
      setEditing(null);
      setView("projects");
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível salvar o empreendimento.");
    } finally {
      setSaving(false);
    }
  }

  function duplicateProject(project: CmsProject) {
    const copyName = `${project.translations.pt?.name ?? project.slug} — cópia`;
    setEditing({
      ...project,
      id: "",
      slug: `${project.slug}-copia`,
      status: "draft",
      translations: { pt: { ...(project.translations.pt ?? { summary: "", description: "", name: "" }), name: copyName } },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async function deleteProject(project: CmsProject) {
    const name = project.translations.pt?.name ?? project.slug;
    if (!window.confirm(`Excluir “${name}”? Esta ação removerá o empreendimento do painel.`)) return;
    try {
      await removeCmsProject(project.id);
      setProjects((current) => current.filter((item) => item.id !== project.id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível excluir o empreendimento.");
    }
  }

  async function persistCity(city: CmsCity) {
    try {
      const saved = await saveCmsCity(city);
      setCities((current) => current.some((item) => item.id === saved.id) ? current.map((item) => item.id === saved.id ? saved : item) : [...current, saved]);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível salvar a cidade.");
      throw error;
    }
  }

  function changeView(nextView: AdminView) {
    setView(nextView);
    setSidebarOpen(false);
  }

  return (
    <div className="admin-app">
      <aside className={`admin-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="admin-brand"><img src="/media/logo-protops.png" alt="Pro-Tops" /><button type="button" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu"><X /></button></div>
        <nav>{navItems.map((item) => { const Icon = item.icon; return <button type="button" key={item.id} className={view === item.id ? "active" : ""} onClick={() => changeView(item.id)}><Icon aria-hidden="true" /> {item.label}</button>; })}</nav>
        <div className="admin-sidebar-footer"><div><span>Administrador</span><strong>{firebaseAuth.currentUser?.email ?? "Equipe Pro-Tops"}</strong></div><button type="button" aria-label="Sair" onClick={() => signOut(firebaseAuth)}><LogOut /></button></div>
      </aside>

      {sidebarOpen && <button type="button" className="admin-sidebar-scrim" onClick={() => setSidebarOpen(false)} aria-label="Fechar menu" />}

      <div className="admin-main">
        <header className="admin-topbar"><button type="button" className="admin-menu-button" onClick={() => setSidebarOpen(true)} aria-label="Abrir menu"><Menu /></button><div><p>Painel administrativo</p><strong>Gestão do portfólio</strong></div><div className="admin-topbar-actions"><span className={`admin-sync-status ${syncState}`}><i /> {syncState === "connected" ? "Firebase sincronizado" : syncState === "error" ? "Erro de sincronização" : "Conectando ao Firebase"}</span><Button asChild variant="outline"><Link href="/" target="_blank"><Eye aria-hidden="true" /> Ver site</Link></Button></div></header>

        <main className="admin-content">
          {syncState === "error" && <div className="admin-system-alert"><strong>O painel não conseguiu sincronizar com o Firebase.</strong><span>{syncError} Verifique se Authentication e Firestore estão ativados e se as regras foram publicadas.</span></div>}
          {editing ? <ProjectEditor project={editing} cities={cities} onCancel={() => setEditing(null)} onSave={persistProject} onUpload={uploadProjectImages} saving={saving} /> : (
            <>
              {view === "overview" && <Overview projects={projects} cities={cities} galleryCount={galleryCount} publishedCount={publishedCount} onCreate={() => setEditing(emptyCmsProject(cities[0]?.slug))} onViewAll={() => setView("projects")} onEdit={setEditing} />}
              {view === "projects" && <ProjectsView projects={filteredProjects} cities={cities} search={search} cityFilter={cityFilter} statusFilter={statusFilter} onSearch={setSearch} onCityFilter={setCityFilter} onStatusFilter={setStatusFilter} onCreate={() => setEditing(emptyCmsProject(cities[0]?.slug))} onEdit={setEditing} onDuplicate={duplicateProject} onDelete={deleteProject} />}
              {view === "cities" && <CitiesView cities={cities} projectCounts={Object.fromEntries(cities.map((city) => [city.slug, projects.filter((project) => project.citySlug === city.slug).length]))} onSave={persistCity} />}
              {view === "media" && <MediaView projects={projects} />}
              {view === "settings" && <SettingsView syncState={syncState} syncError={syncError} />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

function PageTitle({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="admin-page-title"><div><p>{eyebrow}</p><h1>{title}</h1><span>{text}</span></div>{action}</div>;
}

function Overview({ projects, cities, galleryCount, publishedCount, onCreate, onViewAll, onEdit }: { projects: CmsProject[]; cities: CmsCity[]; galleryCount: number; publishedCount: number; onCreate: () => void; onViewAll: () => void; onEdit: (project: CmsProject) => void }) {
  const stats = [
    ["Empreendimentos", projects.length, Building2],
    ["Publicados", publishedCount, CheckCircle2],
    ["Cidades ativas", cities.filter((city) => city.active).length, MapPinned],
    ["Fotos no acervo", galleryCount, ImageIcon],
  ] as const;
  return <>
    <PageTitle eyebrow="Visão geral" title="Bom dia, equipe Pro-Tops." text="Acompanhe e atualize o portfólio exibido no site." action={<Button className="admin-primary" onClick={onCreate}><Plus /> Novo empreendimento</Button>} />
    <section className="admin-stats-grid">{stats.map(([label, value, Icon], index) => <article key={label}><div><span>{String(index + 1).padStart(2, "0")}</span><Icon /></div><strong>{value}</strong><p>{label}</p></article>)}</section>
    <section className="admin-panel"><div className="admin-panel-heading"><div><p>Atualizações recentes</p><h2>Empreendimentos</h2></div><button type="button" onClick={onViewAll}>Ver todos <ArrowUpRight /></button></div><div className="admin-recent-list">{projects.slice(0, 6).map((project) => <button type="button" key={project.id} onClick={() => onEdit(project)}><img src={project.heroImage} alt="" /><div><strong>{project.translations.pt?.name}</strong><span>{cities.find((city) => city.slug === project.citySlug)?.name} · {project.category}</span></div><StatusBadge status={project.status} /><Pencil /></button>)}</div></section>
  </>;
}

function ProjectsView({ projects, cities, search, cityFilter, statusFilter, onSearch, onCityFilter, onStatusFilter, onCreate, onEdit, onDuplicate, onDelete }: { projects: CmsProject[]; cities: CmsCity[]; search: string; cityFilter: string; statusFilter: string; onSearch: (value: string) => void; onCityFilter: (value: string) => void; onStatusFilter: (value: string) => void; onCreate: () => void; onEdit: (project: CmsProject) => void; onDuplicate: (project: CmsProject) => void; onDelete: (project: CmsProject) => void }) {
  return <>
    <PageTitle eyebrow="Conteúdo" title="Empreendimentos" text="Cadastre, publique e organize os projetos por cidade." action={<Button className="admin-primary" onClick={onCreate}><Plus /> Novo empreendimento</Button>} />
    <div className="admin-filters"><label><Search /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Buscar empreendimento..." /></label><select value={cityFilter} onChange={(event) => onCityFilter(event.target.value)}><option value="all">Todas as cidades</option>{cities.map((city) => <option key={city.id} value={city.slug}>{city.name}</option>)}</select><select value={statusFilter} onChange={(event) => onStatusFilter(event.target.value)}><option value="all">Todos os status</option><option value="published">Publicado</option><option value="draft">Rascunho</option><option value="archived">Arquivado</option></select></div>
    <section className="admin-project-table"><div className="admin-table-head"><span>Empreendimento</span><span>Cidade</span><span>Status</span><span>Atualização</span><span>Ações</span></div>{projects.map((project) => <article key={project.id}><div className="admin-project-name"><img src={project.heroImage} alt="" /><div><strong>{project.translations.pt?.name}</strong><span>/{project.citySlug}/{project.slug}</span></div></div><span>{cities.find((city) => city.slug === project.citySlug)?.name}</span><StatusBadge status={project.status} /><span>{new Intl.DateTimeFormat("pt-BR").format(new Date(project.updatedAt))}</span><div className="admin-row-actions"><button type="button" onClick={() => onEdit(project)} aria-label="Editar"><Pencil /></button><button type="button" onClick={() => onDuplicate(project)} aria-label="Duplicar"><Copy /></button><button type="button" onClick={() => onDelete(project)} aria-label="Excluir"><Trash2 /></button></div></article>)}{projects.length === 0 && <div className="admin-empty"><Search /><strong>Nenhum empreendimento encontrado</strong><span>Ajuste os filtros ou cadastre um novo projeto.</span></div>}</section>
  </>;
}

const automaticLocales = cmsLocales.filter((item) => item.code !== "pt");

function contentFingerprint(value: unknown) {
  return JSON.stringify(value ?? {});
}

function ProjectEditor({ project, cities, onCancel, onSave, onUpload, saving }: { project: CmsProject; cities: CmsCity[]; onCancel: () => void; onSave: (project: CmsProject) => Promise<void>; onUpload: (project: Pick<CmsProject, "id" | "citySlug" | "slug">, files: File[]) => Promise<string[]>; saving: boolean }) {
  const [form, setForm] = useState<CmsProject>(project);
  const [pendingMedia, setPendingMedia] = useState<string[]>([]);
  const [translating, setTranslating] = useState(false);
  const projectHasTranslations = automaticLocales.every((item) => Boolean(project.translations[item.code]?.description));
  const [translatedSource, setTranslatedSource] = useState(projectHasTranslations ? contentFingerprint(project.translations.pt) : "");
  const translation = form.translations.pt ?? { name: "", summary: "", description: "" };
  const translationsCurrent = translatedSource === contentFingerprint(translation) && automaticLocales.every((item) => Boolean(form.translations[item.code]?.name));

  function updateTranslation(field: keyof typeof translation, value: string) {
    setForm((current) => ({ ...current, translations: { ...current.translations, pt: { ...(current.translations.pt ?? { name: "", summary: "", description: "" }), [field]: value } } }));
  }

  async function addAutomaticTranslations(current: CmsProject) {
    const source = current.translations.pt ?? { name: "", summary: "", description: "" };
    if (!source.name.trim()) throw new Error("Preencha o nome do empreendimento antes de traduzir.");
    const generated = await translateProjectContent(source);
    const next = { ...current, translations: { pt: source, ...generated } };
    setTranslatedSource(contentFingerprint(source));
    setForm(next);
    return next;
  }

  async function handleTranslate() {
    setTranslating(true);
    try {
      await addAutomaticTranslations(form);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível gerar as traduções.");
    } finally {
      setTranslating(false);
    }
  }

  async function handleMedia(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files);
    setPendingMedia(selected.map((file) => file.name));
    try {
      const urls = await onUpload(form, selected);
      setForm((current) => ({
        ...current,
        heroImage: current.heroImage || urls[0] || "",
        gallery: [...current.gallery, ...(current.heroImage ? urls : urls.slice(1))],
      }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível enviar as imagens.");
    } finally {
      setPendingMedia([]);
    }
  }

  function setGalleryImageAsCover(index: number) {
    setForm((current) => {
      const selected = current.gallery[index];
      const remaining = current.gallery.filter((_, itemIndex) => itemIndex !== index);
      return { ...current, heroImage: selected, gallery: current.heroImage ? [current.heroImage, ...remaining] : remaining };
    });
  }

  function removeCover() {
    setForm((current) => ({ ...current, heroImage: current.gallery[0] ?? "", gallery: current.gallery.slice(1) }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const name = form.translations.pt?.name.trim();
    if (!name || !form.citySlug) return;
    setTranslating(true);
    try {
      let next = { ...form, slug: form.slug || slugify(name) };
      if (!translationsCurrent) next = await addAutomaticTranslations(next);
      await onSave(next);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível preparar o empreendimento.");
    } finally {
      setTranslating(false);
    }
  }

  const busy = saving || translating || pendingMedia.length > 0;

  return <form className="admin-editor" onSubmit={submit}>
    <div className="admin-editor-top"><div><button type="button" onClick={onCancel}>Empreendimentos</button><span>/</span><strong>{project.id ? "Editar" : "Novo"}</strong></div><div><Button type="button" variant="outline" onClick={onCancel} disabled={busy}>Cancelar</Button><Button type="submit" className="admin-primary" disabled={busy}>{busy ? <LoaderCircle className="admin-spin" /> : <Save />} {translating ? "Traduzindo…" : saving ? "Salvando…" : pendingMedia.length ? "Enviando fotos…" : "Salvar empreendimento"}</Button></div></div>
    <div className="admin-editor-grid"><div className="admin-editor-main"><section className="admin-form-card"><div className="admin-form-heading"><span>01</span><div><h2>Informações principais</h2><p>Organize o empreendimento, a URL e a forma de publicação.</p></div></div><div className="admin-field-grid"><label className="admin-field admin-field-wide"><span>Nome do empreendimento *</span><input value={form.translations.pt?.name ?? ""} onChange={(event) => { updateTranslation("name", event.target.value); if (!form.id) setForm((current) => ({ ...current, slug: slugify(event.target.value) })); }} placeholder="Ex.: Residencial Horizonte" required /></label><label className="admin-field"><span>Slug da página</span><input value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} placeholder="residencial-horizonte" /></label><label className="admin-field"><span>Cidade *</span><select value={form.citySlug} onChange={(event) => setForm({ ...form, citySlug: event.target.value })} required>{cities.filter((city) => city.active).map((city) => <option value={city.slug} key={city.id}>{city.name}</option>)}</select></label><label className="admin-field"><span>Categoria</span><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} placeholder="Ex.: Loteamento residencial" /></label><label className="admin-field"><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as CmsProjectStatus })}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select></label><label className="admin-switch-row"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /><span><strong>Destacar na página inicial</strong><small>Exibe este projeto na seleção principal do site.</small></span></label></div></section>

      <section className="admin-form-card"><div className="admin-form-heading"><span>02</span><div><h2>Conteúdo em português</h2><p>Você escreve uma vez; o painel gera automaticamente os outros cinco idiomas.</p></div></div><div className="admin-field-grid"><label className="admin-field admin-field-wide"><span>Nome exibido no site</span><input value={translation.name} onChange={(event) => updateTranslation("name", event.target.value)} placeholder="Nome oficial do empreendimento" /></label><label className="admin-field admin-field-wide"><span>Resumo comercial</span><textarea rows={3} value={translation.summary} onChange={(event) => updateTranslation("summary", event.target.value)} placeholder="Uma frase curta e vendável para o card e o topo da página." /></label><label className="admin-field admin-field-wide"><span>Descrição completa</span><textarea rows={7} value={translation.description} onChange={(event) => updateTranslation("description", event.target.value)} placeholder="Conte a proposta, localização, infraestrutura e diferenciais do empreendimento." /></label></div><div className={`admin-translation-box ${translationsCurrent ? "is-ready" : ""}`}><div><Languages /><span><strong>{translationsCurrent ? "Traduções atualizadas" : "Tradução automática pendente"}</strong><small>{translationsCurrent ? "O conteúdo está pronto nos seis idiomas do site." : "Ao salvar, inglês, espanhol, francês, alemão e chinês serão gerados automaticamente."}</small></span></div><div className="admin-translation-locales">{automaticLocales.map((item) => <span key={item.code} className={form.translations[item.code]?.name && translationsCurrent ? "complete" : ""}>{item.code.toUpperCase()}</span>)}</div><Button type="button" variant="outline" onClick={handleTranslate} disabled={busy}><Sparkles /> {translating ? "Traduzindo…" : "Traduzir agora"}</Button></div></section>

      <section className="admin-form-card"><div className="admin-form-heading"><span>03</span><div><h2>Detalhes comerciais</h2><p>Informações que ajudam o visitante a decidir pelo contato.</p></div></div><div className="admin-field-grid"><label className="admin-field"><span>Condição ou preço</span><input value={form.priceLabel} onChange={(event) => setForm({ ...form, priceLabel: event.target.value })} placeholder="Ex.: A partir de R$ 120 mil" /></label><label className="admin-field"><span>Área dos lotes</span><input value={form.lotSize} onChange={(event) => setForm({ ...form, lotSize: event.target.value })} placeholder="Ex.: A partir de 250 m²" /></label><label className="admin-field admin-field-wide"><span>Endereço ou referência</span><input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Bairro, avenida ou ponto de referência" /></label><label className="admin-field admin-field-wide"><span>Diferenciais — um por linha</span><textarea rows={5} value={form.features.join("\n")} onChange={(event) => setForm({ ...form, features: event.target.value.split("\n").map((item) => item.trim()).filter(Boolean) })} placeholder={"Infraestrutura completa\nAcesso facilitado\nCondições especiais"} /></label><label className="admin-field admin-field-wide"><span>Link do mapa</span><input value={form.mapUrl} onChange={(event) => setForm({ ...form, mapUrl: event.target.value })} placeholder="https://maps.google.com/..." /></label></div></section>
    </div>

    <aside className="admin-editor-side"><section className="admin-form-card admin-media-card"><div className="admin-form-heading"><span>04</span><div><h2>Fotos e vídeo</h2><p>Monte a capa, a galeria e o vídeo do empreendimento.</p></div></div><label className={`admin-upload-zone ${pendingMedia.length ? "is-uploading" : ""}`}>{pendingMedia.length ? <LoaderCircle className="admin-spin" /> : <UploadCloud />}<strong>{pendingMedia.length ? "Enviando para a Cloudinary…" : "Adicionar fotos"}</strong><span>Selecione várias imagens · JPG, PNG ou WebP · até 15 MB cada</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={pendingMedia.length > 0} onChange={(event) => { handleMedia(event.target.files); event.currentTarget.value = ""; }} /></label>{pendingMedia.length > 0 && <p className="admin-pending-media">Otimizando e enviando {pendingMedia.length} arquivo(s).</p>}<label className="admin-field"><span>Ou cole uma URL de capa</span><input value={form.heroImage} onChange={(event) => setForm({ ...form, heroImage: event.target.value })} placeholder="https://.../imagem.webp" /></label><div className="admin-video-input"><label className="admin-field"><span>Vídeo do empreendimento</span><input value={form.videoUrl} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} placeholder="Link do YouTube, Vimeo ou MP4" /></label>{form.videoUrl && <a href={form.videoUrl} target="_blank" rel="noreferrer"><PlayCircle /> Testar vídeo</a>}</div><div className="admin-media-preview">{form.heroImage && <figure className="admin-media-cover"><img src={form.heroImage} alt="Prévia da capa" /><figcaption>Capa principal</figcaption><button type="button" onClick={removeCover} aria-label="Remover imagem de capa"><X /></button></figure>}{form.gallery.map((image, index) => <figure key={`${image.slice(0, 60)}-${index}`}><img src={image} alt={`Galeria ${index + 1}`} /><div className="admin-media-actions"><button type="button" onClick={() => setGalleryImageAsCover(index)} aria-label="Usar como capa"><Star /></button><button type="button" onClick={() => setForm((current) => ({ ...current, gallery: current.gallery.filter((_, itemIndex) => itemIndex !== index) }))} aria-label="Remover imagem"><X /></button></div></figure>)}</div>{form.gallery.length > 0 && <p className="admin-media-count">{form.gallery.length} foto(s) na galeria. Use a estrela para trocar a capa.</p>}</section>
      <section className="admin-form-card admin-publish-card"><Globe2 /><div><h3>Publicação</h3><p>Ao salvar, o conteúdo é traduzido e sincronizado com todas as versões do site.</p></div><StatusBadge status={form.status} /></section>
    </aside></div>
  </form>;
}

function CitiesView({ cities, projectCounts, onSave }: { cities: CmsCity[]; projectCounts: Record<string, number>; onSave: (city: CmsCity) => Promise<void> }) {
  const [editing, setEditing] = useState<CmsCity | null>(null);
  const [busy, setBusy] = useState(false);
  const [translatedSource, setTranslatedSource] = useState("");
  const translation = editing?.translations.pt ?? { name: "", intro: "", statement: "" };

  function startNew() { setTranslatedSource(""); setEditing(emptyCmsCity()); }
  function startEdit(city: CmsCity) {
    const complete = automaticLocales.every((item) => Boolean(city.translations[item.code]?.intro));
    setTranslatedSource(complete ? contentFingerprint(city.translations.pt) : "");
    setEditing(city);
  }
  function updateTranslation(field: keyof typeof translation, value: string) {
    if (!editing) return;
    const translations = { ...editing.translations, pt: { ...(editing.translations.pt ?? { name: "", intro: "", statement: "" }), [field]: value } };
    const next = { ...editing, translations };
    if (field === "name") { next.name = value; if (!editing.id) next.slug = slugify(value); }
    if (field === "intro") next.intro = value;
    if (field === "statement") next.statement = value;
    setEditing(next);
  }

  async function addCityTranslations(city: CmsCity) {
    const source = city.translations.pt ?? { name: "", intro: "", statement: "" };
    if (!source.name.trim()) throw new Error("Preencha o nome da cidade antes de traduzir.");
    const generated = await translateCityContent(source);
    const next = { ...city, translations: { pt: source, ...generated } };
    setTranslatedSource(contentFingerprint(source));
    setEditing(next);
    return next;
  }

  async function handleCityTranslate() {
    if (!editing) return;
    setBusy(true);
    try {
      await addCityTranslations(editing);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível traduzir a cidade.");
    } finally {
      setBusy(false);
    }
  }

  async function submitCity(event: React.FormEvent) {
    event.preventDefault();
    if (!editing?.translations.pt?.name) return;
    const slug = editing.slug || slugify(editing.translations.pt.name);
    setBusy(true);
    try {
      let next = { ...editing, id: editing.id || slug, slug, name: editing.translations.pt.name, intro: editing.translations.pt.intro, statement: editing.translations.pt.statement, updatedAt: new Date().toISOString() };
      const translationsCurrent = translatedSource === contentFingerprint(next.translations.pt) && automaticLocales.every((item) => Boolean(next.translations[item.code]?.name));
      if (!translationsCurrent) next = await addCityTranslations(next);
      await onSave(next);
      setEditing(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Não foi possível preparar a cidade.");
    } finally { setBusy(false); }
  }
  return <><PageTitle eyebrow="Organização" title="Cidades" text="Crie novas áreas regionais e organize os empreendimentos." action={<Button className="admin-primary" onClick={startNew}><Plus /> Nova cidade</Button>} />
    <section className="admin-city-grid">{cities.map((city) => <article key={city.id}><img src={city.heroImage} alt="" /><div><span>{city.state}</span><h2>{city.name}</h2><p>{projectCounts[city.slug] ?? 0} empreendimento(s)</p><button type="button" onClick={() => startEdit(city)}><Pencil /> Editar cidade</button></div><i className={city.active ? "active" : ""}>{city.active ? "Ativa" : "Oculta"}</i></article>)}</section>
    {editing && <div className="admin-modal"><form onSubmit={submitCity}><div className="admin-modal-heading"><div><p>Cidade</p><h2>{editing.id ? "Editar cidade" : "Nova cidade"}</h2></div><button type="button" onClick={() => setEditing(null)}><X /></button></div><div className="admin-field-grid"><label className="admin-field"><span>Nome da cidade *</span><input value={translation.name} onChange={(event) => updateTranslation("name", event.target.value)} required /></label><label className="admin-field"><span>Estado</span><input value={editing.state} onChange={(event) => setEditing({ ...editing, state: event.target.value })} /></label><label className="admin-field admin-field-wide"><span>Slug da página</span><input value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: slugify(event.target.value) })} /></label><label className="admin-field admin-field-wide"><span>Frase principal em português</span><input value={translation.statement} onChange={(event) => updateTranslation("statement", event.target.value)} placeholder="Ex.: Uma presença construída junto com a cidade." /></label><label className="admin-field admin-field-wide"><span>Texto de apresentação em português</span><textarea rows={4} value={translation.intro} onChange={(event) => updateTranslation("intro", event.target.value)} /></label><label className="admin-field admin-field-wide"><span>Imagem de capa (URL)</span><input value={editing.heroImage} onChange={(event) => setEditing({ ...editing, heroImage: event.target.value })} /></label><label className="admin-switch-row"><input type="checkbox" checked={editing.active} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} /><span><strong>Cidade ativa</strong><small>Permite exibição no site e cadastro de projetos.</small></span></label></div><div className="admin-city-translation"><Languages /><div><strong>Tradução automática</strong><span>Os outros cinco idiomas serão atualizados ao salvar.</span></div><Button type="button" variant="outline" onClick={handleCityTranslate} disabled={busy}><Sparkles /> Traduzir agora</Button></div><div className="admin-modal-actions"><Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={busy}>Cancelar</Button><Button type="submit" className="admin-primary" disabled={busy}>{busy ? <LoaderCircle className="admin-spin" /> : <Save />} {busy ? "Traduzindo e salvando…" : "Salvar cidade"}</Button></div></form></div>}
  </>;
}

function MediaView({ projects }: { projects: CmsProject[] }) {
  const media = projects.flatMap((project) => [project.heroImage, ...project.gallery].filter(Boolean).map((image) => ({ image, name: project.translations.pt?.name ?? project.slug })));
  return <><PageTitle eyebrow="Acervo" title="Biblioteca de mídia" text={`${media.length} imagens vinculadas aos empreendimentos.`} /><section className="admin-media-library">{media.map((item, index) => <figure key={`${item.image}-${index}`}><img src={item.image} alt={item.name} loading="lazy" /><figcaption><strong>{item.name}</strong><span>Imagem {index + 1}</span></figcaption></figure>)}</section></>;
}

function SettingsView({ syncState, syncError }: { syncState: "connecting" | "connected" | "error"; syncError: string }) {
  return <><PageTitle eyebrow="Sistema" title="Configurações" text="Status das integrações do painel administrativo." /><section className="admin-settings-grid"><article><div><Globe2 /><span>Integração</span></div><h2>{syncState === "connected" ? "Conectado" : syncState === "error" ? "Ação necessária" : "Conectando"}</h2><p>{syncState === "error" ? syncError || "Confira os serviços e regras no Console do Firebase." : "Login e dados sincronizados com o projeto protops-uberlandia."}</p><ul><li><CheckCircle2 /> Firebase Authentication protegido</li><li><CheckCircle2 /> Cloud Firestore em tempo real</li><li><CheckCircle2 /> Fotos enviadas pela Cloudinary</li><li><CheckCircle2 /> Sem dependência do Firebase Storage</li></ul></article><article><div><Languages /><span>Conteúdo internacional</span></div><h2>6 idiomas</h2><p>O português é a fonte principal e os demais idiomas são gerados automaticamente no cadastro.</p><ul><li><CheckCircle2 /> Inglês e espanhol</li><li><CheckCircle2 /> Francês e alemão</li><li><CheckCircle2 /> Chinês simplificado</li><li><CheckCircle2 /> Publicação sincronizada</li></ul></article></section></>;
}

function StatusBadge({ status }: { status: CmsProjectStatus }) {
  return <span className={`admin-status admin-status-${status}`}>{status === "published" ? <CheckCircle2 /> : status === "draft" ? <Clock3 /> : <Archive />}{statusLabels[status]}</span>;
}
