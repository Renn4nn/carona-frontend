# AGENTS.md

Guia para agentes e colaboradores que forem alterar o frontend da aplicação
**Carona Universitária**.

Este arquivo deve ser lido antes de qualquer mudança. Ele define a arquitetura 
esperada, os limites entre servidor e cliente, os padrões de interface,
formulários, validação, consumo da API, estado, tabelas, estilos, acessibilidade
e os critérios de conclusão do frontend.

## 1. Contexto do projeto

A Carona Universitária conecta estudantes que desejam oferecer ou solicitar
caronas relacionadas à rotina acadêmica.

Objetivos do MVP:

- cadastro, login, renovação de sessão e logout;
- perfil pessoal e acadêmico;
- cadastro e gerenciamento de veículos;
- publicação e busca de caronas;
- solicitação de vagas;
- aprovação ou recusa de passageiros;
- cancelamento e conclusão de viagens;
- avaliações entre participantes;
- interface preparada para um painel administrativo futuro.

Pagamentos não serão processados pela aplicação no MVP. O valor da carona é
apenas informativo.

## 2. Stack e situação atual

Stack já presente:

- Next.js 16 com App Router;
- React 19;
- TypeScript em modo `strict`;
- Tailwind CSS 4;
- shadcn/ui com Base UI;
- Zod;
- React Hook Form;
- Axios;
- next-themes;
- Lucide React;
- class-variance-authority;
- clsx e tailwind-merge;
- pnpm.

Stack definida para as próximas features:

- TanStack Query;
- Zustand;
- TanStack Table para Data Table.

Essas dependências planejadas ainda podem não estar instaladas. Antes de
utilizá-las, verificar `package.json` e instalar apenas o necessário com pnpm,
sem substituir bibliotecas existentes.

Estado atual relevante:

- rotas `/login` e `/cadastro`;
- grupo de rotas `app/(auth)`;
- componentes shadcn em `components/ui`;
- `ThemeProvider` com temas claro e escuro;
- tokens semânticos em `app/globals.css`;
- alias `@/*` configurado;
- schemas Zod compartilhados em `lib/schemas`;
- algumas telas atuais ainda usam cores hexadecimais diretamente.

Ao encontrar divergência entre este documento e o código, preservar o
comportamento funcional, aplicar o padrão novo apenas no escopo solicitado e
apontar a divergência.

## 3. Regras gerais

Ao gerar ou modificar código:

1. Não alterar a arquitetura sem necessidade.
2. Não criar funcionalidades que não foram solicitadas.
3. Não adicionar dependências sem verificar se já existe solução no projeto.
4. Usar TypeScript com tipos explícitos nas fronteiras da aplicação.
5. Nunca usar `any`. Usar `unknown` somente com narrowing ou validação.
6. Evitar casts; validar dados externos com Zod.
7. Usar nomes de arquivos, funções, componentes, hooks e variáveis em inglês.
8. Usar textos, mensagens e validações visíveis em português do Brasil.
9. Usar imports pelo alias `@/` e `import type` para imports apenas de tipos.
10. Manter regras de negócio fora dos componentes visuais.
11. Não expor tokens, segredos, stack traces ou dados sensíveis.
12. Não acessar `window`, `document`, `localStorage` ou `navigator` no servidor.
13. Não adicionar `"use client"` por conveniência.
14. Não criar abstrações genéricas prematuramente.
15. Reutilizar schemas, componentes, hooks, serviços e chaves de query.
16. Não editar componentes de `components/ui` para uma necessidade exclusiva de
    uma tela; preferir composição.
17. Não usar componentes HTML improvisados quando um componente shadcn adequado
    já estiver disponível.
18. Preservar responsividade, acessibilidade e navegação por teclado.
19. Não entregar pseudocódigo, TODOs ou mocks no lugar da implementação pedida.
20. Consultar a documentação local desta versão do Next.js antes de usar uma API
    cuja assinatura ou comportamento possa ter mudado.

## 4. Server Components, Client Components e `"use server"`

### Server Components por padrão

Todos os componentes do App Router são Server Components por padrão. Manter
pages, layouts e componentes no servidor sempre que não precisarem de:

- hooks de cliente;
- eventos como `onClick`, `onChange` ou `onSubmit`;
- APIs do navegador;
- bibliotecas exclusivamente client-side;
- estado interativo local.

Server Components devem ser preferidos para:

- buscar dados iniciais;
- validar sessão;
- ler cookies e headers;
- proteger rotas e redirecionar;
- renderizar conteúdo estático;
- manter segredos fora do bundle;
- reduzir JavaScript enviado ao navegador.

Adicionar `"use client"` somente no menor componente interativo possível. Não
transformar uma page ou layout inteiro em Client Component quando apenas um
formulário, botão, modal ou Data Table precisa de interatividade.

### Prioridade para `"use server"`

Sempre que possível e adequado, usar Server Actions com `"use server"` para:

- submissões e mutações originadas por formulários;
- login, cadastro e logout;
- escrita ou remoção de cookies;
- chamadas que dependam de tokens ou segredos disponíveis apenas no servidor;
- revalidação com `revalidatePath` ou `revalidateTag`;
- redirecionamentos após mutações;
- intermediar chamadas sensíveis ao backend.

Regras:

- colocar ações em arquivos próprios, normalmente `actions.ts`;
- o arquivo de ações pode ter `"use server"` no topo;
- nunca colocar `"use server"` em componentes;
- nunca importar uma função server-only dentro de código que precise executar no
  navegador, exceto pelo mecanismo suportado de Server Actions;
- validar novamente a entrada da action com o schema Zod compartilhado;
- tratar autorização no backend como fonte final de verdade;
- não confiar em campos ocultos para ownership ou permissão;
- retornar estado serializável e previsível quando o formulário precisar exibir
  erros;
- usar `redirect`, `revalidatePath` e `revalidateTag` apenas no servidor.

`"use server"` não deve ser forçado quando a interação exige cache,
refetch, polling, paginação ou atualização otimista no cliente. Nesses casos,
usar TanStack Query e endpoints do backend.

### APIs assíncronas do Next.js 16

Confirmar as assinaturas na documentação local. Tratar `params`,
`searchParams`, `cookies()` e `headers()` conforme a versão instalada, incluindo
`await` quando exigido.

Ao usar `useSearchParams`, o componente deve ser Client Component e estar sob
uma boundary de `Suspense`.

## 5. Estrutura recomendada

Respeitar a estrutura existente e evoluir por feature:

```text
app/
  (auth)/
    _components/
    login/
      actions.ts
      page.tsx
    cadastro/
      actions.ts
      page.tsx
  (private)/
    layout.tsx
    rides/
      _components/
      actions.ts
      loading.tsx
      error.tsx
      page.tsx

components/
  ui/
  shared/

features/
  auth/
    components/
    hooks/
    queries/
    schemas/
    services/
    types/
  rides/
    components/
    hooks/
    queries/
    schemas/
    services/
    types/

lib/
  api/
  schemas/
  query/
  stores/
  utils.ts

providers/
hooks/
```

Não criar todas essas pastas antecipadamente. Criá-las quando houver conteúdo
real. Componentes exclusivos de uma rota podem ficar em `_components` junto da
rota. Código reutilizado por várias rotas deve migrar para a feature ou para
`components/shared`.

## 6. Modularização e limite de tamanho

Arquivos com mais de 150 linhas devem ser revisados e, sempre que a separação
melhorar legibilidade e coesão, modularizados.

Possíveis extrações:

- seções visuais para componentes;
- schemas para `*.schema.ts`;
- tipos para `*.types.ts`;
- ações para `actions.ts`;
- chamadas HTTP para `*.service.ts`;
- queries e mutations para `*.queries.ts`;
- colunas de tabela para `columns.tsx`;
- estado global para `*.store.ts`;
- lógica reutilizável para hooks.

O limite de 150 linhas é uma regra de revisão, não autorização para fragmentar
componentes simples em arquivos sem significado. Cada extração deve possuir
responsabilidade clara, nome específico e possibilidade real de leitura,
manutenção ou reutilização independente.

Evitar:

- pages monolíticas;
- componentes que misturam fetching, formulário, tabela e layout;
- arquivos genéricos como `helpers.ts` ou `utils.ts` dentro de toda feature;
- componentes de uma ou duas linhas criados apenas para reduzir contagem.

## 7. Zod como fonte de verdade

Todo dado externo deve ser tratado como não confiável:

- payload de formulário;
- parâmetros de rota;
- query string;
- respostas do backend;
- dados recuperados de storage;
- variáveis de ambiente.

Regras:

- reutilizar o mesmo schema Zod no React Hook Form, Server Action e fronteira da
  API sempre que o contrato for o mesmo;
- não duplicar manualmente tipos já inferíveis;
- inferir tipos com `z.infer<typeof schema>`;
- usar `z.strictObject` para payloads;
- aplicar `trim`, limites e mensagens em português;
- usar coerção apenas quando a entrada realmente exigir;
- não aceitar campos gerados pelo backend;
- não permitir `role`, `roleId`, status administrativos ou ownership em
  formulários comuns;
- separar schemas de entrada dos schemas de resposta quando os contratos forem
  diferentes;
- validar a resposta do backend antes de entregá-la à UI quando a fronteira não
  for garantida.

Exemplo de organização:

```ts
export const signInSchema = z.strictObject({
  login: z
    .string({ error: "Campo Login é obrigatório" })
    .trim()
    .min(3, "Login deve ter pelo menos 3 caracteres"),
  password: z
    .string({ error: "Campo Senha é obrigatório" })
    .min(6, "Senha deve ter pelo menos 6 caracteres"),
})

export type SignInInput = z.infer<typeof signInSchema>
```

Schemas do frontend devem refletir os contratos reais do backend, mas não devem
ser importados diretamente do repositório backend por caminho de filesystem.
Compartilhamento entre aplicações só deve ser criado como pacote de contratos
quando solicitado e planejado.

## 8. Formulários com React Hook Form

Usar React Hook Form para formulários interativos com validação Zod por
`zodResolver`.

Padrão:

- schema Zod compartilhado;
- `useForm` tipado pelo tipo inferido;
- `defaultValues` explícitos;
- componentes shadcn para campos e mensagens;
- erros próximos ao campo;
- `aria-invalid` e `aria-describedby`;
- botão desabilitado durante submissão;
- feedback de sucesso e erro;
- foco no primeiro campo inválido quando possível;
- não manter os mesmos valores simultaneamente em Zustand e React Hook Form.

Preferir formulários progressivamente aprimorados com Server Actions quando o
fluxo permitir. Usar Client Component quando React Hook Form, validação imediata
ou interação dinâmica forem necessários; esse componente pode chamar uma
Server Action.

Não usar `useEffect` para sincronizar valores derivados do formulário. Usar
`watch`, `useWatch`, `setValue` ou valores calculados conforme a necessidade.

## 9. shadcn/ui e sistema visual

`components/ui` contém primitives compartilhadas. Antes de criar um componente
base, verificar se existe um componente shadcn adequado.

Regras:

- adicionar componentes por meio do CLI do shadcn quando necessário;
- preservar o padrão Base UI já configurado;
- usar `cn` para composição de classes;
- usar CVA para componentes com variantes reais;
- usar Lucide React para ícones;
- não misturar bibliotecas de ícones sem necessidade;
- não editar uma primitive global para resolver uma exceção local;
- compor componentes de feature sobre primitives de `components/ui`;
- manter estados hover, focus-visible, disabled, loading e error;
- diálogos devem controlar foco e oferecer fechamento acessível;
- ações destrutivas devem pedir confirmação proporcional ao risco.

Para adicionar novos components da lib shadcn use: pnpm dlx shadcn@latest add {{components}}

## 10. Tailwind CSS e tokens de cor

Toda cor de interface deve usar tokens semânticos definidos em
`app/globals.css`.

Usar classes como:

```text
bg-background
text-foreground
bg-card
text-card-foreground
bg-primary
text-primary-foreground
bg-secondary
text-muted-foreground
border-border
ring-ring
text-destructive
```

Não usar em componentes:

- hexadecimais como `text-[#1d1c1b]`;
- RGB/HSL arbitrários;
- `text-white`, `bg-black` ou cores de paleta quando um token semântico
  representar a intenção;
- sombras com cores hardcoded quando puderem ser derivadas de tokens.

As cores-base devem ser alteráveis centralmente em `:root` e `.dark`, mudando o
sistema inteiro sem editar componentes. Novos tokens devem expressar intenção,
não uma cor específica. Preferir `--success`, `--warning` e `--info` a nomes
como `--green` ou `--yellow`.

Ao tocar nas telas atuais que possuem cores hardcoded, migrar somente o trecho
em escopo para tokens semânticos, sem realizar refatoração visual ampla não
solicitada.

Manter contraste adequado nos temas claro e escuro. Não depender apenas de cor
para comunicar estado.

## 11. Data Table

Listagens administrativas ou operacionais com ordenação, filtros, paginação,
seleção ou ações devem usar o padrão Data Table do shadcn com TanStack Table.

Organização sugerida:

```text
_components/
  data-table.tsx
  columns.tsx
  data-table-toolbar.tsx
  data-table-pagination.tsx
```

Regras:

- tipar `ColumnDef<T>`;
- separar definição de colunas quando a tabela crescer;
- usar paginação, busca, filtros e ordenação server-side para conjuntos
  potencialmente grandes;
- sincronizar filtros compartilháveis com a URL;
- não buscar todos os registros para paginar apenas no navegador;
- fornecer estado vazio, loading skeleton e erro;
- garantir cabeçalhos e ações acessíveis;
- manter ações por linha em menu apropriado;
- confirmar ações destrutivas;
- não armazenar toda a tabela em Zustand;
- usar TanStack Query para cache remoto quando a tabela for client-side;
- usar Server Component para carga inicial quando possível.

## 12. Axios e contrato da API

Centralizar Axios em `lib/api` e não chamar `axios` diretamente em componentes.

Separar quando necessário:

- cliente server-side, capaz de ler cookies/headers;
- cliente browser-side, configurado com `withCredentials`;
- normalização de erros;
- funções de serviço por recurso.

Regras:

- configurar a URL base por variável de ambiente;
- validar variáveis públicas e privadas;
- respeitar o formato de sucesso do backend:

```ts
type ApiSuccessResponse<T> = {
  data: T
}
```

- nunca registrar senha, access token ou refresh token;
- não expor secret do backend por variável `NEXT_PUBLIC_*`;
- enviar `withCredentials: true` quando o refresh cookie precisar acompanhar a
  requisição;
- evitar múltiplos interceptors registrados por renderização;
- impedir loops infinitos de refresh;
- coordenar requisições concorrentes durante renovação do token;
- transformar falhas em um formato previsível para a UI;
- respeitar cancelamento de requisições quando aplicável;
- não esconder erros de autorização.

O refresh token do backend está em cookie `httpOnly` e não deve ser lido pelo
JavaScript do navegador. O access token não deve ser persistido em
`localStorage`. Preferir sessão/cookies seguros e mediação server-side conforme
a arquitetura de autenticação definida para o frontend.

## 13. TanStack Query

TanStack Query gerencia estado remoto no cliente. Usá-lo para:

- cache de requisições client-side;
- refetch;
- paginação;
- polling;
- mutations;
- invalidação;
- atualizações otimistas;
- deduplicação de chamadas.

Não usar TanStack Query automaticamente para dados que podem permanecer em um
Server Component sem interação cliente.

Regras:

- manter um `QueryClientProvider` client-side pequeno;
- centralizar query keys por feature;
- criar hooks específicos, como `useRidesQuery`;
- nunca usar arrays e strings de query key espalhados;
- configurar `staleTime` de acordo com o domínio;
- invalidar apenas as queries afetadas;
- tratar loading, error, empty e success;
- reverter optimistic updates em caso de falha;
- não copiar dados da query para Zustand ou `useState`;
- considerar hidratação/dehydration apenas quando trouxer benefício real;
- não duplicar a mesma mutação em Server Action e `useMutation` sem uma razão
  arquitetural clara.

## 14. Zustand

Zustand é reservado para estado global do cliente que não pertence à URL, ao
servidor, ao formulário ou a uma query remota.

Usos adequados:

- estado visual compartilhado entre áreas distantes;
- preferências temporárias de interface;
- estado de um fluxo multi-etapas que precise sobreviver à troca de componentes;
- filtros locais não compartilháveis por URL.

Não usar Zustand para:

- respostas da API;
- autenticação sensível ou tokens;
- valores de um único componente;
- dados derivados;
- valores de React Hook Form;
- filtros que devem ser compartilháveis por link;
- substituir TanStack Query.

Criar stores pequenas, tipadas e por domínio. Usar selectors para evitar
renderizações desnecessárias e ações nomeadas com clareza. Persistência só deve
ser adicionada quando houver requisito explícito; nunca persistir segredo.

## 15. Autenticação e autorização

Fluxo esperado do backend:

- `POST /auth/signup`;
- `POST /auth/signin`;
- `POST /auth/refresh`;
- `POST /auth/logout`;
- access token para acessar rotas privadas;
- refresh token rotacionado em cookie `httpOnly`;
- roles `USER` e `ADMIN`.

Regras:

- páginas privadas devem validar sessão no servidor sempre que possível;
- redirecionar usuário não autenticado com `redirect`;
- não confiar apenas em ocultar botões;
- autorização real continua sendo responsabilidade do backend;
- não aceitar role em cadastro comum;
- não armazenar refresh token no Zustand, localStorage ou estado React;
- não expor tokens em logs, mensagens ou HTML;
- limpar estado/cache sensível no logout;
- diferenciar visualmente sessão expirada de falha genérica sem revelar
  detalhes internos;
- ações administrativas devem exigir `ADMIN` também no backend.

## 16. Estado e URL

Escolher uma única fonte de verdade:

| Tipo de estado | Ferramenta |
| --- | --- |
| Dados iniciais e conteúdo server-rendered | Server Component |
| Mutação server-first | Server Action |
| Cache remoto interativo | TanStack Query |
| Estado do formulário | React Hook Form |
| Filtros, busca, ordenação e página compartilháveis | URL/search params |
| Estado global exclusivamente visual | Zustand |
| Estado local simples | `useState` |
| Tema | next-themes |

Não duplicar o mesmo dado entre essas camadas.

## 17. Navegação e rotas

- usar App Router;
- usar `Link` para navegação interna;
- usar `redirect` em Server Components e Server Actions;
- usar `useRouter` apenas em Client Components que realmente precisem de
  navegação imperativa;
- não usar `window.location` para navegação interna;
- usar route groups para organização sem alterar a URL;
- manter componentes exclusivos da rota em pastas iniciadas por `_`;
- criar `loading.tsx`, `error.tsx` e `not-found.tsx` quando o fluxo exigir;
- usar rotas dinâmicas no nível mais simples compatível com a URL;
- usar metadata API do App Router, nunca `next/head`;
- não criar Route Handler apenas para fazer proxy de uma função que uma Server
  Action ou Server Component pode executar diretamente.

### Requisições e Actions

- toda requisição ao backend deve ser iniciada por uma Server Action;
- todas as Server Actions devem ficar na pasta raiz `actions/`, separadas por
  domínio;
- componentes e páginas não devem importar a instância Axios diretamente;
- helpers server-only podem ser usados pelas Actions, mas não substituem a
  fronteira pública em `actions/`;
- mocks não são requisições e devem permanecer centralizados em `mock/`.

## 18. Tratamento de loading, vazio e erro

Toda tela de dados deve considerar:

- carregamento;
- erro;
- lista vazia;
- sucesso;
- ausência de permissão;
- sessão expirada.

Usar:

- `loading.tsx` ou `Suspense` para streaming;
- skeletons compatíveis com o layout final;
- `error.tsx` para boundaries de rota;
- mensagens em português;
- toast para feedback transitório;
- mensagem inline para erro que exige correção do usuário.

Não mostrar stack trace, objeto Axios bruto, código interno ou resposta sensível.
Não usar apenas toast para erro de campo.

## 19. Acessibilidade

- usar elementos semânticos;
- associar `Label` e input;
- manter ordem de tabulação;
- mostrar foco com `focus-visible`;
- fornecer nome acessível para botões somente com ícone;
- usar `aria-invalid` e `aria-describedby`;
- informar estados assíncronos com `aria-live` quando apropriado;
- não usar `div` clicável no lugar de button ou link;
- garantir navegação por teclado em menus, dialogs e tabelas;
- respeitar `prefers-reduced-motion`;
- usar `alt` significativo ou vazio em imagens decorativas;
- manter contraste nos temas claro e escuro.

## 20. Responsividade e experiência

- toda tela deve ser responsiva e utilizável em mobile, tablet, notebook e
  desktop, sem quebra, sobreposição ou perda de ações;
- validar no mínimo as larguras de 320, 390, 768, 1024 e 1440 pixels;
- desenvolver mobile-first;
- evitar larguras e alturas rígidas sem necessidade;
- testar telas pequenas e grandes;
- evitar `h-screen` quando `min-h-dvh` ou `h-dvh` representar melhor o caso;
- impedir overflow horizontal acidental;
- manter alvos de toque confortáveis;
- preservar conteúdo e ações essenciais em mobile;
- não criar duas árvores completas de UI apenas para desktop e mobile quando CSS
  responsivo resolver.

## 21. Performance

- manter Client Components pequenos;
- evitar `useEffect` para data fetching;
- não usar `useState` para valores derivados;
- paralelizar chamadas independentes com `Promise.all`;
- usar Suspense para partes lentas;
- usar `next/image` para imagens de conteúdo;
- usar `next/font`;
- importar bibliotecas pesadas apenas onde necessárias;
- não aplicar memoização sem evidência;
- usar virtualização somente para listas realmente grandes;
- evitar providers globais desnecessários;
- não enviar schemas, configurações ou dados server-only ao bundle do cliente.

## 22. Testes

Quando testes entrarem no escopo, preferir:

- Vitest para testes unitários;
- React Testing Library para comportamento de componentes;
- Playwright para fluxos end-to-end;
- Mock Service Worker quando mocks HTTP forem necessários.

Testar comportamento visível, validação, estados de erro, autorização e fluxos
críticos. Evitar snapshots grandes e testes acoplados à implementação.

Não adicionar toda a stack de testes sem solicitação ou necessidade real.

## 23. Convenções

Arquivos:

```text
ride-card.tsx
ride-form.tsx
ride.schema.ts
ride.types.ts
ride.service.ts
ride.queries.ts
ride.store.ts
actions.ts
columns.tsx
```

Componentes:

```text
RideCard
RideForm
RideDataTable
```

Hooks:

```text
useRidesQuery
useCreateRideMutation
useRideFilters
```

Funções:

```text
findRides
findRideById
createRide
cancelRide
formatRideDate
```

Evitar nomes vagos como `handleData`, `process`, `manage`, `doAction`,
`Component1` e `utils2`.

Handlers locais de evento podem usar `handleSubmit`, `handleClick` e similares
quando o contexto estiver claro.

## 24. Fluxo para implementar uma feature

1. Ler este arquivo.
2. Consultar a documentação local do Next.js relevante.
3. Inspecionar rotas, componentes, schemas, API clients e padrões existentes.
4. Confirmar o contrato atual do backend.
5. Definir o que fica no servidor e o que precisa do cliente.
6. Criar ou reutilizar schema Zod.
7. Criar tipos inferidos.
8. Criar serviço Axios na fronteira apropriada.
9. Criar Server Action ou query/mutation conforme o fluxo.
10. Criar formulário com React Hook Form quando necessário.
11. Compor UI com shadcn e tokens semânticos.
12. Separar arquivos maiores que 150 linhas quando houver divisões coesas.
13. Implementar loading, vazio, erro e sucesso.
14. Verificar acessibilidade e responsividade.
15. Validar lint, tipos e build.

## 25. Validação antes de concluir

Executar:

```bash
pnpm lint
pnpm check-types
pnpm build
```

Quando houver alteração de formatação relevante:

```bash
pnpm format
```

Não considerar concluído se:

- houver erro de lint, tipo ou build;
- uma rota privada ficar acessível sem validação;
- dados externos não forem validados;
- o formulário não exibir erros;
- cores novas estiverem hardcoded;
- houver `"use client"` desnecessário;
- a mesma informação estiver duplicada entre Query, Zustand, form e URL;
- faltar estado de loading, erro ou vazio;
- o componente não funcionar por teclado;
- arquivos grandes permanecerem monolíticos sem justificativa.

## 26. Critérios de conclusão

Uma feature está concluída quando:

- segue o contrato real do backend;
- usa Server Component e Server Action sempre que apropriado;
- limita Client Components à parte interativa;
- reutiliza schemas Zod;
- usa React Hook Form nos formulários complexos;
- usa shadcn e tokens semânticos;
- usa TanStack Query apenas para estado remoto client-side;
- usa Zustand apenas para estado global do cliente;
- possui tipos seguros e não usa `any`;
- trata loading, erro, vazio e sucesso;
- é responsiva e acessível;
- não expõe dados sensíveis;
- está modularizada de forma coerente;
- lint, typecheck e build passam.

## 27. Orientações finais ao Codex

Ao receber uma tarefa:

1. Ler este arquivo completamente antes de alterar o frontend.
2. Ler a documentação relevante em `node_modules/next/dist/docs/`.
3. Analisar arquivos existentes relacionados.
4. Informar quais arquivos serão criados ou alterados.
5. Fazer somente as mudanças necessárias.
6. Preservar código funcional e mudanças do usuário.
7. Não substituir a arquitetura inteira para implementar uma feature pequena.
8. Não instalar dependências sem verificar `package.json`.
9. Não criar primitives duplicadas do shadcn.
10. Não espalhar chamadas Axios em componentes.
11. Não duplicar schemas ou tipos inferíveis.
12. Não usar cores hardcoded em novo código.
13. Não transformar pages e layouts em Client Components sem necessidade.
14. Priorizar `"use server"` para mutações e operações sensíveis quando
    tecnicamente adequado.
15. Revisar arquivos acima de 150 linhas e modularizar quando houver separação
    coesa.
16. Apontar divergências relevantes entre documentação, frontend e backend.
17. Entregar resumo objetivo e informar as validações executadas.
