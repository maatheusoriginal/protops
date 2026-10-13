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
- Radix UI / shadcn
- pnpm

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
components/language-switcher.tsx
lib/i18n.ts                  Traduções e configuração de idiomas
lib/site-data.ts             Cidades e empreendimentos
public/media/                Logos, imagens WebP e vídeo otimizado
```

## Mídias

O repositório contém as versões otimizadas utilizadas no site. Os arquivos brutos de drone permanecem no acervo original e não precisam ser incluídos no deploy.

## Observação comercial

Disponibilidade, delimitações, preços, condições e informações de cada empreendimento devem ser confirmados com a equipe Pro-Tops.
