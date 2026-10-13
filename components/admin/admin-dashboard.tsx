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
  LoaderCircle,
  LogOut,
  MapPinned,
  Menu,
  Pencil,
  Plus,
  Save,
  Search,
  Settings,
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
  uploadProjectImages,
} from "@/lib/firebase/admin-cms";
import { firebaseAuth } from "@/lib/firebase/client";
import type { Locale } from "@/lib/i18n";

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
      translations: { ...project.translations, pt: { ...(project.translations.pt ?? { summary: "", description: "", name: "" }), name: copyName } },
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
          {syncState === "error" && <div className="admin-system-alert"><strong>O painel não conseguiu sincronizar com o Firebase.</strong><span>{syncError} Verifique se Authentication, Firestore e Storage estão ativados e se as regras foram publicadas.</span></div>}
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

function ProjectEditor({ project, cities, onCancel, onSave, onUpload, saving }: { project: CmsProject; cities: CmsCity[]; onCancel: () => void; onSave: (project: CmsProject) => Promise<void>; onUpload: (project: Pick<CmsProject, "id" | "citySlug" | "slug">, files: File[]) => Promise<string[]>; saving: boolean }) {
  const [form, setForm] = useState<CmsProject>(project);
  const [locale, setLocale] = useState<Locale>("pt");
  const [pendingMedia, setPendingMedia] = useState<string[]>([]);
  const translation = form.translations[locale] ?? { name: "", summary: "", description: "" };

  function updateTranslation(field: keyof typeof translation, value: string) {
    setForm((current) => ({ ...current, translations: { ...current.translations, [locale]: { ...(current.translations[locale] ?? { name: "", summary: "", description: "" }), [field]: value } } }));
  }

  async function handleMedia(files: FileList | null) {
    if (!files?.length) return;
    const selected = Array.from(files);
    setPendingMedia((current) => [...current, ...selected.map((file) => file.name)]);
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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const name = form.translations.pt?.name.trim();
    if (!name || !form.citySlug) return;
    await onSave({ ...form, slug: form.slug || slugify(name) });
  }

  return <form className="admin-editor" onSubmit={submit}>
    <div className="admin-editor-top"><div><button type="button" onClick={onCancel}>Empreendimentos</button><span>/</span><strong>{project.id ? "Editar" : "Novo"}</strong></div><div><Button type="button" variant="outline" onClick={onCancel} disabled={saving}>Cancelar</Button><Button type="submit" className="admin-primary" disabled={saving}>{saving ? <LoaderCircle className="admin-spin" /> : <Save />} {saving ? "Salvando…" : "Salvar empreendimento"}</Button></div></div>
    <div className="admin-editor-grid"><div className="admin-editor-main"><section className="admin-form-card"><div className="admin-form-heading"><span>01</span><div><h2>Informações principais</h2><p>Dados usados nos cards, URLs e filtros do site.</p></div></div><div className="admin-field-grid"><label className="admin-field admin-field-wide"><span>Nome do empreendimento *</span><input value={form.translations.pt?.name ?? ""} onChange={(event) => { updateTranslation("name", event.target.value); if (!form.id) setForm((current) => ({ ...current, slug: slugify(event.target.value) })); }} placeholder="Ex.: Residencial Horizonte" required /></label><label className="admin-field"><span>Slug da página</span><input value={form.slug} onChange={(event) => setForm({ ...form, slug: slugify(event.target.value) })} placeholder="residencial-horizonte" /></label><label className="admin-field"><span>Cidade *</span><select value={form.citySlug} onChange={(event) => setForm({ ...form, citySlug: event.target.value })} required>{cities.filter((city) => city.active).map((city) => <option value={city.slug} key={city.id}>{city.name}</option>)}</select></label><label className="admin-field"><span>Categoria</span><input value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} /></label><label className="admin-field"><span>Status</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as CmsProjectStatus })}><option value="draft">Rascunho</option><option value="published">Publicado</option><option value="archived">Arquivado</option></select></label><label className="admin-switch-row"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /><span><strong>Destacar na página inicial</strong><small>Exibe este projeto na seleção principal do site.</small></span></label></div></section>

      <section className="admin-form-card"><div className="admin-form-heading"><span>02</span><div><h2>Conteúdo e idiomas</h2><p>Português é obrigatório; os demais idiomas usam português como fallback.</p></div></div><div className="admin-language-tabs">{cmsLocales.map((item) => <button type="button" className={locale === item.code ? "active" : ""} onClick={() => setLocale(item.code)} key={item.code}>{item.label}<i className={form.translations[item.code]?.description ? "complete" : ""} /></button>)}</div><div className="admin-field-grid"><label className="admin-field admin-field-wide"><span>Nome em {cmsLocales.find((item) => item.code === locale)?.label}</span><input value={translation.name} onChange={(event) => updateTranslation("name", event.target.value)} placeholder="Nome exibido neste idioma" /></label><label className="admin-field admin-field-wide"><span>Resumo comercial</span><textarea rows={3} value={translation.summary} onChange={(event) => updateTranslation("summary", event.target.value)} placeholder="Uma frase curta e vendável para o card e o topo da página." /></label><label className="admin-field admin-field-wide"><span>Descrição completa</span><textarea rows={7} value={translation.description} onChange={(event) => updateTranslation("description", event.target.value)} placeholder="Conte a proposta, localização, infraestrutura e diferenciais do empreendimento." /></label></div></section>

      <section className="admin-form-card"><div className="admin-form-heading"><span>03</span><div><h2>Detalhes comerciais</h2><p>Informações que ajudam o visitante a decidir pelo contato.</p></div></div><div className="admin-field-grid"><label className="admin-field"><span>Condição ou preço</span><input value={form.priceLabel} onChange={(event) => setForm({ ...form, priceLabel: event.target.value })} placeholder="Ex.: A partir de R$ 120 mil" /></label><label className="admin-field"><span>Área dos lotes</span><input value={form.lotSize} onChange={(event) => setForm({ ...form, lotSize: event.target.value })} placeholder="Ex.: A partir de 250 m²" /></label><label className="admin-field admin-field-wide"><span>Endereço ou referência</span><input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} placeholder="Bairro, avenida ou ponto de referência" /></label><label className="admin-field admin-field-wide"><span>Diferenciais — um por linha</span><textarea rows={5} value={form.features.join("\n")} onChange={(event) => setForm({ ...form, features: event.target.value.split("\n").filter(Boolean) })} placeholder={"Infraestrutura completa\nAcesso facilitado\nCondições especiais"} /></label><label className="admin-field admin-field-wide"><span>Link do mapa</span><input value={form.mapUrl} onChange={(event) => setForm({ ...form, mapUrl: event.target.value })} placeholder="https://maps.google.com/..." /></label></div></section>
    </div>

    <aside className="admin-editor-side"><section className="admin-form-card admin-media-card"><div className="admin-form-heading"><span>04</span><div><h2>Fotos e vídeo</h2><p>Envie o material que aparecerá na galeria.</p></div></div><label className={`admin-upload-zone ${pendingMedia.length ? "is-uploading" : ""}`}>{pendingMedia.length ? <LoaderCircle className="admin-spin" /> : <UploadCloud />}<strong>{pendingMedia.length ? "Enviando para o Storage…" : "Enviar fotos"}</strong><span>JPG, PNG ou WebP · várias de uma vez · até 15 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={pendingMedia.length > 0} onChange={(event) => handleMedia(event.target.files)} /></label>{pendingMedia.length > 0 && <p className="admin-pending-media">Enviando {pendingMedia.length} arquivo(s) com segurança.</p>}<label className="admin-field"><span>Imagem de capa (URL)</span><input value={form.heroImage} onChange={(event) => setForm({ ...form, heroImage: event.target.value })} placeholder="/media/capa.webp" /></label><label className="admin-field"><span>Vídeo do empreendimento</span><input value={form.videoUrl} onChange={(event) => setForm({ ...form, videoUrl: event.target.value })} placeholder="YouTube, Vimeo ou arquivo MP4" /></label><div className="admin-media-preview">{form.heroImage && <figure><img src={form.heroImage} alt="Prévia da capa" /><figcaption>Capa</figcaption></figure>}{form.gallery.slice(0, 5).map((image, index) => <figure key={`${image.slice(0, 40)}-${index}`}><img src={image} alt="" /><button type="button" onClick={() => setForm({ ...form, gallery: form.gallery.filter((_, itemIndex) => itemIndex !== index) })} aria-label="Remover imagem"><X /></button></figure>)}</div></section>
      <section className="admin-form-card admin-publish-card"><Globe2 /><div><h3>Publicação</h3><p>Projetos publicados aparecem imediatamente na cidade escolhida após a sincronização.</p></div><StatusBadge status={form.status} /></section>
    </aside></div>
  </form>;
}

function CitiesView({ cities, projectCounts, onSave }: { cities: CmsCity[]; projectCounts: Record<string, number>; onSave: (city: CmsCity) => Promise<void> }) {
  const [editing, setEditing] = useState<CmsCity | null>(null);
  const [locale, setLocale] = useState<Locale>("pt");
  const [busy, setBusy] = useState(false);
  const translation = editing?.translations[locale] ?? { name: "", intro: "", statement: "" };
  function startNew() { setLocale("pt"); setEditing(emptyCmsCity()); }
  function updateTranslation(field: keyof typeof translation, value: string) {
    if (!editing) return;
    const translations = { ...editing.translations, [locale]: { ...(editing.translations[locale] ?? { name: "", intro: "", statement: "" }), [field]: value } };
    const next = { ...editing, translations };
    if (locale === "pt") {
      if (field === "name") { next.name = value; if (!editing.id) next.slug = slugify(value); }
      if (field === "intro") next.intro = value;
      if (field === "statement") next.statement = value;
    }
    setEditing(next);
  }
  async function submitCity(event: React.FormEvent) {
    event.preventDefault();
    if (!editing?.translations.pt?.name) return;
    const slug = editing.slug || slugify(editing.translations.pt.name);
    const next = { ...editing, id: editing.id || slug, slug, name: editing.translations.pt.name, intro: editing.translations.pt.intro, statement: editing.translations.pt.statement, updatedAt: new Date().toISOString() };
    setBusy(true);
    try { await onSave(next); setEditing(null); } finally { setBusy(false); }
  }
  return <><PageTitle eyebrow="Organização" title="Cidades" text="Crie novas áreas regionais e organize os empreendimentos." action={<Button className="admin-primary" onClick={startNew}><Plus /> Nova cidade</Button>} />
    <section className="admin-city-grid">{cities.map((city) => <article key={city.id}><img src={city.heroImage} alt="" /><div><span>{city.state}</span><h2>{city.name}</h2><p>{projectCounts[city.slug] ?? 0} empreendimento(s)</p><button type="button" onClick={() => setEditing(city)}><Pencil /> Editar cidade</button></div><i className={city.active ? "active" : ""}>{city.active ? "Ativa" : "Oculta"}</i></article>)}</section>
    {editing && <div className="admin-modal"><form onSubmit={submitCity}><div className="admin-modal-heading"><div><p>Cidade</p><h2>{editing.id ? "Editar cidade" : "Nova cidade"}</h2></div><button type="button" onClick={() => setEditing(null)}><X /></button></div><div className="admin-language-tabs">{cmsLocales.map((item) => <button type="button" className={locale === item.code ? "active" : ""} onClick={() => setLocale(item.code)} key={item.code}>{item.label}<i className={editing.translations[item.code]?.intro ? "complete" : ""} /></button>)}</div><div className="admin-field-grid"><label className="admin-field"><span>Nome em {cmsLocales.find((item) => item.code === locale)?.label} *</span><input value={translation.name} onChange={(event) => updateTranslation("name", event.target.value)} required={locale === "pt"} /></label><label className="admin-field"><span>Estado</span><input value={editing.state} onChange={(event) => setEditing({ ...editing, state: event.target.value })} /></label><label className="admin-field admin-field-wide"><span>Slug da página</span><input value={editing.slug} onChange={(event) => setEditing({ ...editing, slug: slugify(event.target.value) })} /></label><label className="admin-field admin-field-wide"><span>Frase principal</span><input value={translation.statement} onChange={(event) => updateTranslation("statement", event.target.value)} placeholder="Ex.: Uma presença construída junto com a cidade." /></label><label className="admin-field admin-field-wide"><span>Texto de apresentação</span><textarea rows={4} value={translation.intro} onChange={(event) => updateTranslation("intro", event.target.value)} /></label><label className="admin-field admin-field-wide"><span>Imagem de capa (URL)</span><input value={editing.heroImage} onChange={(event) => setEditing({ ...editing, heroImage: event.target.value })} /></label><label className="admin-switch-row"><input type="checkbox" checked={editing.active} onChange={(event) => setEditing({ ...editing, active: event.target.checked })} /><span><strong>Cidade ativa</strong><small>Permite exibição no site e cadastro de projetos.</small></span></label></div><div className="admin-modal-actions"><Button type="button" variant="outline" onClick={() => setEditing(null)} disabled={busy}>Cancelar</Button><Button type="submit" className="admin-primary" disabled={busy}>{busy ? <LoaderCircle className="admin-spin" /> : <Save />} {busy ? "Salvando…" : "Salvar cidade"}</Button></div></form></div>}
  </>;
}

function MediaView({ projects }: { projects: CmsProject[] }) {
  const media = projects.flatMap((project) => [project.heroImage, ...project.gallery].filter(Boolean).map((image) => ({ image, name: project.translations.pt?.name ?? project.slug })));
  return <><PageTitle eyebrow="Acervo" title="Biblioteca de mídia" text={`${media.length} imagens vinculadas aos empreendimentos.`} /><section className="admin-media-library">{media.map((item, index) => <figure key={`${item.image}-${index}`}><img src={item.image} alt={item.name} loading="lazy" /><figcaption><strong>{item.name}</strong><span>Imagem {index + 1}</span></figcaption></figure>)}</section></>;
}

function SettingsView({ syncState, syncError }: { syncState: "connecting" | "connected" | "error"; syncError: string }) {
  return <><PageTitle eyebrow="Sistema" title="Configurações" text="Status da integração do painel com o Firebase." /><section className="admin-settings-grid"><article><div><Globe2 /><span>Integração</span></div><h2>{syncState === "connected" ? "Conectado" : syncState === "error" ? "Ação necessária" : "Conectando"}</h2><p>{syncState === "error" ? syncError || "Confira os serviços e regras no Console do Firebase." : "Authentication, banco de dados e armazenamento de mídia no projeto protops-uberlandia."}</p><ul><li><CheckCircle2 /> Firebase Web SDK configurado</li><li><CheckCircle2 /> Login administrativo protegido</li><li><CheckCircle2 /> Cloud Firestore em tempo real</li><li><CheckCircle2 /> Upload para Firebase Storage</li></ul></article><article><div><Archive /><span>Modelo de dados</span></div><h2>Portfólio</h2><p>Cidades, empreendimentos, traduções e mídia administrados em uma única interface.</p><ul><li><CheckCircle2 /> Conteúdo em 6 idiomas</li><li><CheckCircle2 /> Publicação, rascunho e arquivo</li><li><CheckCircle2 /> Galerias ordenadas</li><li><CheckCircle2 /> Destaques da página inicial</li></ul></article></section></>;
}

function StatusBadge({ status }: { status: CmsProjectStatus }) {
  return <span className={`admin-status admin-status-${status}`}>{status === "published" ? <CheckCircle2 /> : status === "draft" ? <Clock3 /> : <Archive />}{statusLabels[status]}</span>;
}
