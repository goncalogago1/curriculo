
-- Habilitar extensão pgvector
create extension if not exists vector;

-- Tabela de documentos/chunks
create table if not exists documents (
  id bigserial primary key,
  source text not null,            -- "cv", "linkedin", "github", etc.
  title text,
  url text,
  content text not null,
  tokens int,
  embedding vector(3072),
  metadata jsonb default '{}'
);

-- Índice por similaridade (cosine)
create index if not exists documents_embedding_idx
  on documents
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists documents_source_idx on documents (source);

-- Função RPC para match por similaridade
create or replace function match_documents(
  query_embedding vector(3072),
  match_count int,
  filter_source text default null
)
returns table (
  id bigint,
  source text,
  title text,
  url text,
  content text,
  metadata jsonb,
  similarity float
)
language sql stable as $$
  select
    d.id, d.source, d.title, d.url, d.content, d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity
  from documents d
  where (filter_source is null or d.source = filter_source)
  order by d.embedding <=> query_embedding
  limit match_count;
$$;
