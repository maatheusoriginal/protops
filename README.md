# Pro-Tops Empreendimentos

Site institucional e comercial multilíngue da Pro-Tops, com páginas específicas para cidades, empreendimentos e a operação internacional Pro-Tops Capital Partners.

## Site publicado

[protops-empreendimentos.cpcley-100.chatgpt.site](https://protops-empreendimentos.cpcley-100.chatgpt.site)

## Principais recursos

- Página inicial com vídeo aéreo otimizado
- Portfólio por cidade: Uberlândia, Araguari e Sacramento
- Página individual para cada empreendimento
- Área institucional da Pro-Tops Capital Partners
- Seletor de idioma que mantém o visitante na mesma página
- Português, inglês, espanhol, francês, alemão e mandarim simplificado
- Links de WhatsApp contextualizados por idioma e empreendimento
- Layout responsivo para computador, tablet e celular
- Imagens em WebP e vídeo preparado para carregamento na web
- Painel administrativo protegido em `/admin`
- Cadastro de cidades e empreendimentos com 6 idiomas
- Upload de imagens para Firebase Storage
- Publicação em tempo real por meio do Cloud Firestore

## Rotas e idiomas

O português usa as rotas principais:

```text
/uberlandia
/araguari
/sacramento
/capital-partners
```

Os demais idiomas recebem um prefixo:

```text
/en/uberlandia
/es/uberlandia
/fr/uberlandia
/de/uberlandia
/zh/uberlandia
```

## Tecnologias

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Vinext e Cloudflare Workers
- Firebase Authentication, Cloud Firestore e Storage
- Radix UI / shadcn
- pnpm

## Ativação do Firebase sem terminal

O Web SDK já está configurado para o projeto `protops-uberlandia`. A ativação inicial é feita somente pelo [Console do Firebase](https://console.firebase.google.com/), sem Firebase CLI:

1. Em **Authentication → Sign-in method**, ative **E-mail/senha**.
2. Em **Authentication → Users**, crie o primeiro usuário administrador e copie o UID dele.
3. Crie o banco **Cloud Firestore** no modo de produção e ative o **Storage**.
4. Em **Firestore Database → Rules**, publique o conteúdo de `firestore.rules`.
5. Em **Storage → Rules**, publique o conteúdo de `storage.rules`.
6. No Firestore, crie a coleção `admins`; use o UID copiado como ID do documento e adicione os campos `active` (booleano `true`) e `role` (texto `admin`).
7. Acesse `/admin/login`. No primeiro acesso autorizado, o painel cria automaticamente as cidades e os empreendimentos iniciais no banco.

As configurações públicas do Web SDK não concedem acesso administrativo. Login, permissões e tipos de arquivo são validados pelas regras incluídas no projeto.

Os arquivos `firebase.json`, `firestore.indexes.json`, `firestore.rules` e `storage.rules` também ficam prontos para um deploy futuro por CI/CD, caso a equipe adote esse fluxo.

## Executar localmente

Requisitos:

- Node.js 22.13 ou superior
- pnpm 11

Instale as dependências:

```bash
pnpm install
```

Inicie o ambiente de desenvolvimento:

```bash
pnpm dev
```

Gere a versão de produção:

```bash
pnpm build
```

## Estrutura importante

```text
app/                         Páginas e rotas por idioma
components/pages/            Estruturas compartilhadas das páginas
components/admin/            Login e painel administrativo
components/language-switcher.tsx
lib/i18n.ts                  Traduções e configuração de idiomas
lib/site-data.ts             Cidades e empreendimentos
lib/firebase/                SDK, sincronização e leitura pública
public/media/                Logos, imagens WebP e vídeo otimizado
```

## Mídias

O repositório contém as versões otimizadas utilizadas no site. Os arquivos brutos de drone permanecem no acervo original e não precisam ser incluídos no deploy.

## Observação comercial

Disponibilidade, delimitações, preços, condições e informações de cada empreendimento devem ser confirmados com a equipe Pro-Tops.
