import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero" aria-labelledby="site-title">
        <div className="container hero__inner">
          <div className="hero__left">
            <span className="pill">AI & Data Consultant</span>
            <h1 id="site-title">Gonçalo Gago</h1>
            <p className="subtitle">
              I help organizations turn data into decisions—combining{" "}
              <b>Data Governance</b>, <b>Data Engineering</b> and <b>Analytics</b>.
              Hands-on with <b>Collibra</b>, <b>MicroStrategy</b>, <b>SQL Server</b>, <b>Python</b>, and{" "}
              LLM/RAG solutions for real business impact.
            </p>

            <div className="cta" role="group" aria-label="Primary actions">
              <a className="btn btn--primary" href="/chat" aria-label="Talk to my assistant">
                Talk to my assistant
              </a>
              <a className="btn btn--ghost" href="/cv.pdf" download aria-label="Download my resume">
                Download résumé
              </a>
            </div>

            <div className="links" aria-label="Social links">
              <a href="https://www.linkedin.com/in/goncalo-gago/" target="_blank" rel="noreferrer">LinkedIn</a>
              <span>•</span>
              <a href="https://github.com/SEU-GITHUB" target="_blank" rel="noreferrer">GitHub</a>
              <span>•</span>
              <a href="mailto:goncalogago@gmail.com">Contact</a>
            </div>
          </div>

          <div className="hero__right">
            <div className="profile-card">
              <Image
                src="/1690800862967.jpeg"
                alt="Portrait photo of Gonçalo Gago"
                width={140}
                height={140}
                className="avatar"
                priority
              />
              <div className="profile-card__info">
                <p><b>Open</b> to projects and interviews</p>
                <ul>
                  <li>Data Governance (Collibra)</li>
                  <li>BI & Visualisation (MicroStrategy)</li>
                  <li>Pipelines & SQL (SQL Server)</li>
                  <li>LLMs & RAG (OpenAI + pgvector)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stats">
          <div className="container stats__inner">
            <div className="stat"><span className="stat__num">+</span><span className="stat__label">Data projects delivered</span></div>
            <div className="stat"><span className="stat__num">ETL</span><span className="stat__label">Pipelines & Governance</span></div>
            <div className="stat"><span className="stat__num">RAG</span><span className="stat__label">LLM assistants in production</span></div>
          </div>
        </div>

        <div className="hero__bg" />
      </section>

      {/* CAPABILITIES */}
      <section className="section" aria-labelledby="capabilities">
        <div className="container">
          <h2 id="capabilities" className="section-title">Capabilities</h2>
        </div>
        <div className="container grid">
          <div className="card">
            <h3>Data Governance</h3>
            <p>Catalog, lineage, policies and automation with Collibra (Edge, REST APIs, workflows).</p>
          </div>
          <div className="card">
            <h3>Data Products & BI</h3>
            <p>Trusted metrics, semantic layers and executive dashboards with performance best-practices.</p>
          </div>
          <div className="card">
            <h3>Applied AI</h3>
            <p>LLM/RAG assistants with OpenAI, Supabase/pgvector and guardrails—focused on business outcomes.</p>
          </div>
        </div>
      </section>

      {/* SELECTED PROJECTS */}
      <section className="section" aria-labelledby="projects">
        <div className="container">
          <h2 id="projects" className="section-title">Selected Projects</h2>
          <div className="grid projects">
            <a className="proj" href="#" target="_blank" rel="noreferrer" aria-label="Internal Knowledge Assistant">
              <div className="proj__badge">RAG</div>
              <h4>Internal Knowledge Assistant</h4>
              <p>Semantic search over technical documentation (Next.js + OpenAI + pgvector).</p>
            </a>
            <a className="proj" href="#" target="_blank" rel="noreferrer" aria-label="Automated Data Lineage">
              <div className="proj__badge">Collibra</div>
              <h4>Automated Data Lineage</h4>
              <p>Edge integrations, metadata ingestion and curation workflows.</p>
            </a>
            <a className="proj" href="#" target="_blank" rel="noreferrer" aria-label="Finance Semantic Model">
              <div className="proj__badge">BI</div>
              <h4>Finance Semantic Model</h4>
              <p>Certified metrics with executive reporting and self-service analytics.</p>
            </a>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="section cta-banner" aria-label="Work with me">
        <div className="container cta-banner__inner">
          <div>
            <h3>Need help with Governance, BI or an AI Assistant?</h3>
            <p className="muted">Let’s design something practical, measurable and maintainable.</p>
          </div>
          <div className="cta">
            <a className="btn btn--primary" href="mailto:goncalogago@gmail.com">Get in touch</a>
            <a className="btn btn--ghost" href="/chat">Ask the assistant</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" role="contentinfo">
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} Gonçalo Gago</span>
          <nav className="footer__nav" aria-label="Footer">
            <a href="/chat">Assistant</a>
            <a href="/cv.pdf" download>Résumé</a>
            <a href="mailto:goncalogago@gmail.com">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
