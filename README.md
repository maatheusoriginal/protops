# Pro-Tops Empreendimentos

Site institucional e comercial multilíngue da Pro-Tops, com páginas específicas para cidades, empreendimentos e a operação internacional Pro-Tops Capital Partners.

## Publicação

O repositório está conectado à Vercel. Cada atualização da branch `main` gera um novo deploy.

## Principais recursos

- Página inicial com vídeo aéreo otimizado
- Portfólio por cidade: Uberlândia, Araguari e Sacramento
- Página individual para cada empreendimento
- Área institucional da Pro-Tops Capital Partners
- Seletor de idioma que mantém o visitante na mesma página
- Português, inglês, espanhol, francês, alemão e mandarim simplificado
- Botão flutuante de WhatsApp em todas as páginas, contextualizado por idioma, cidade e empreendimento
- Layout responsivo para computador, tablet e celular
- Imagens em WebP e vídeo preparado para carregamento na web
- Painel administrativo protegido em `/admin`
- Cadastro em português com tradução automática para os outros 5 idiomas
- Upload assinado de imagens para a Cloudinary
- Vídeos por empreendimento via YouTube, Vimeo ou MP4
- Preços estruturados com conversão automática de BRL para USD, EUR e CNY
- Cálculo automático da área do lote por largura e comprimento
- Consulta oficial de CEP pelo ViaCEP e busca de endereço pelo OpenStreetMap
- Mapa interativo no cadastro, com pino ajustável para marcar o ponto exato do lote
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
- Firebase Authentication e Cloud Firestore
- Cloudinary para imagens
- DeepL API Free para tradução automática
- Frankfurter para cotações diárias, sem chave de API
- ViaCEP para consulta oficial de CEP, sem chave de API
- OpenStreetMap, Nominatim e Leaflet para endereços e mapas, sem chave de API
- Radix UI / shadcn
- pnpm

## Ativação do Firebase sem terminal

O Web SDK já está configurado para o projeto `protops-uberlandia`. A ativação inicial é feita somente pelo [Console do Firebase](https://console.firebase.google.com/), sem Firebase CLI:

1. Em **Authentication → Sign-in method**, ative **E-mail/senha**.
2. Em **Authentication → Users**, crie o primeiro usuário administrador e copie o UID dele.
3. Crie o banco **Cloud Firestore** no modo de produção.
4. Em **Firestore Database → Rules**, publique o conteúdo de `firestore.rules`.
5. No Firestore, crie a coleção `admins`; use o UID copiado como ID do documento e adicione os campos `active` (booleano `true`) e `role` (texto `admin`).
6. Acesse `/admin/login`. No primeiro acesso autorizado, o painel cria automaticamente as cidades e os empreendimentos iniciais no banco.

As configurações públicas do Web SDK não concedem acesso administrativo. Login e permissões são validados pelas regras incluídas no projeto.

Os arquivos `firebase.json`, `firestore.indexes.json` e `firestore.rules` também ficam prontos para um deploy futuro por CI/CD, caso a equipe adote esse fluxo.

## Variáveis da Vercel

Cadastre em **Settings → Environment Variables** para Production, Preview e Development:

```text
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
DEEPL_API_KEY
```

As integrações de câmbio, CEP e mapa não exigem chave. Opcionalmente, `NOMINATIM_BASE_URL` permite trocar o servidor de geocodificação no futuro sem alterar o painel.

O ViaCEP confirma logradouro, bairro, cidade e estado. Como bases gratuitas nem sempre possuem cada número de imóvel, o painel identifica quando o resultado corresponde apenas ao trecho da rua e permite arrastar o pino — ou tocar no mapa — até a posição exata do empreendimento.

A chave gratuita pode ser criada em [DeepL for Developers](https://www.deepl.com/pro-api). O plano API Free disponibiliza até 500 mil caracteres traduzidos por mês.
Nunca exponha `CLOUDINARY_API_SECRET` ou `DEEPL_API_KEY` com o prefixo `NEXT_PUBLIC_`.

O painel autentica o administrador antes de gerar a assinatura da Cloudinary ou solicitar traduções. As fotos são enviadas diretamente à Cloudinary e somente suas URLs são salvas no Firestore. O Firebase Storage não é utilizado.

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
