import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__left">
            <span className="pill">AI & Data Consultant</span>
            <h1>Gonçalo Gago</h1>
            <p className="subtitle">
              Construo soluções de <b>Data Governance</b>, <b>Engenharia de Dados</b> e <b>Analytics</b>.
              Experiência com <b>Collibra</b>, <b>MicroStrategy</b>, <b>SQL Server</b>, <b>Python</b> e projetos com LLM/RAG.
            </p>
            <div className="cta">
              <a className="btn btn--primary" href="/chat">Falar com meu assistente</a>
              <a className="btn btn--ghost" href="/cv.pdf" download>Baixar CV</a>
            </div>
            <div className="links">
              <a href="https://www.linkedin.com/in/goncalo-gago/" target="_blank" rel="noreferrer">LinkedIn</a>
              <span>•</span>
              <a href="https://github.com/SEU-GITHUB" target="_blank" rel="noreferrer">GitHub</a>
              <span>•</span>
              <a href="mailto:goncalogago@gmail.com">Contacto</a>
            </div>
          </div>
          <div className="hero__right">
            <div className="profile-card">
              <Image
                src="/1690800862967.jpeg"  // ou /foto-perfil.jpeg se renomeou
                alt="Fotografia de perfil de Gonçalo Gago"
                width={140}
                height={140}
                className="avatar"
                priority
              />
              <div className="profile-card__info">
                <p><b>Disponível</b> para projetos e entrevistas</p>
                <ul>
                  <li>Data Governance (Collibra)</li>
                  <li>BI & Visualização (MicroStrategy)</li>
                  <li>Pipelines & SQL (SQL Server)</li>
                  <li>LLMs & RAG (OpenAI + pgvector)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="hero__bg" />
      </section>

      {/* HIGHLIGHTS */}
      <section className="section">
        <div className="container grid">
          <div className="card">
            <h3>Governança de Dados</h3>
            <p>Catálogo, linhagem, políticas e automação com Collibra (Edge, APIs, Workflows).</p>
          </div>
          <div className="card">
            <h3>Data Products & BI</h3>
            <p>Métricas confiáveis, semantic layer e dashboards performáticos em MicroStrategy.</p>
          </div>
          <div className="card">
            <h3>AI Aplicada</h3>
            <p>Chatbots RAG com OpenAI, Supabase/pgvector e guardrails, focados em valor de negócio.</p>
          </div>
        </div>
      </section>

      {/* PROJETOS */}
      <section className="section">
        <div className="container">
          <h2>Projetos em Destaque</h2>
          <div className="grid projects">
            <a className="proj" href="#" target="_blank" rel="noreferrer">
              <div className="proj__badge">RAG</div>
              <h4>Assistente de Conhecimento Interno</h4>
              <p>Query semântico sobre documentação técnica (OpenAI + Next.js + pgvector).</p>
            </a>
            <a className="proj" href="#" target="_blank" rel="noreferrer">
              <div className="proj__badge">Collibra</div>
              <h4>Linhas de Dados Automatizadas</h4>
              <p>Integrações Edge, extração de metadados e workflows para curadoria.</p>
            </a>
            <a className="proj" href="#" target="_blank" rel="noreferrer">
              <div className="proj__badge">BI</div>
              <h4>Finance Semantic Model</h4>
              <p>Modelo financeiro com métricas certificadas e dashboards executivos.</p>
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} Gonçalo Gago</span>
          <nav className="footer__nav">
            <a href="/chat">Assistente</a>
            <a href="/cv.pdf" download>CV</a>
            <a href="mailto:seu.email@dominio.com">Contacto</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
