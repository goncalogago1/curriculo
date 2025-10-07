
# Portfolio + Chatbot (RAG) — Overlay

Este pacote adiciona **chatbot com RAG** ao seu projeto **Next.js (App Router)**.

## Como usar (passo a passo)

### 1) Criar o projeto base (se ainda não criou)
```bash
npx create-next-app@latest meu-portfolio --ts --eslint --app --src-dir=false --import-alias "@/*"
cd meu-portfolio
```

### 2) Copiar este overlay
Descompacte o conteúdo deste ZIP **na raiz** do projeto (permita mesclar pastas).

Estrutura adicionada:
```
app/api/chat/route.ts
app/chat/page.tsx
app/page.tsx
lib/supabase.ts
lib/rag.ts
scripts/ingest.ts
sql/pgvector_setup.sql
public/PUT_YOUR_CV_HERE.txt
.env.example
```

### 3) Instalar dependências
```bash
npm i openai @supabase/supabase-js pdf-parse
npm i -D ts-node @types/node @types/pdf-parse
```

### 4) Supabase
1. Crie um projeto em https://supabase.com e obtenha:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
2. No **SQL Editor**, cole o conteúdo de `sql/pgvector_setup.sql` e execute.
   - Isso cria a extensão `pgvector`, a tabela `documents`, índices e a função RPC `match_documents`.

> Nota: para MVP, pode deixar **RLS desativado** na tabela `documents`. Guarde as chaves de Supabase **apenas no backend** (route handler).

### 5) Variáveis de ambiente
Crie um arquivo `.env.local` (baseado em `.env.example`):
```
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://xxxxxxxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

### 6) Adicionar o seu CV
Coloque o ficheiro `cv.pdf` em `public/cv.pdf` (substitui o marcador).

### 7) Ingestão do CV (embeddings)
```bash
npx ts-node scripts/ingest.ts
```
Se preferir, adicione no `package.json`:
```json
{
  "scripts": {
    "ingest": "ts-node scripts/ingest.ts"
  }
}
```
e rode:
```bash
npm run ingest
```

### 8) Rodar localmente
```bash
npm run dev
# abra http://localhost:3000
# teste o chat em /chat
```

### 9) Deploy na Vercel
- Crie um repositório no GitHub e faça `git push`.
- Em https://vercel.com, **Import Project** → selecione o repo.
- Em **Settings → Environment Variables**, insira as mesmas variáveis do `.env.local`.
- Deploy. Acesse `https://SEUAPP.vercel.app/chat`.

### 10) Dicas rápidas
- Mantenha o `systemPrompt` estrito (“responder apenas com base nas fontes”).
- Não suba PII na tabela. Redija ou oculte dados sensíveis.
- Pode adicionar LinkedIn/Projetos criando novos scripts de ingestão (mesmo fluxo).
- Para melhorar relevância, aumente K no retrieve ou adicione re-ranker.

Bom trabalho! 🚀
