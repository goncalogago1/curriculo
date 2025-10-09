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
              <b>Data Governance</b>, <b>Data Engineering</b>, and <b>Analytics</b>.
              Hands-on with <b>Collibra</b>, <b>MicroStrategy</b>, <b>SQL Server</b>, <b>Python</b>, and
              production-grade <b>LLM/RAG</b>.
            </p>

            <div className="cta" role="group" aria-label="Primary actions">
              <a className="btn btn--primary" href="/chat" aria-label="Talk to my assistant">
                Talk to my assistant
              </a>
              <a className="btn btn--ghost" href="/cv.pdf" download aria-label="Download my résumé">
                Download résumé
              </a>
            </div>

            <div className="links" aria-label="Social links">
              <a href="https://www.linkedin.com/in/goncalo-gago/" target="_blank" rel="noreferrer">LinkedIn</a>
              <span>•</span>
              <a href="https://github.com/goncalogago1" target="_blank" rel="noreferrer">GitHub</a>
              <span>•</span>
              <a href="mailto:goncalogago@gmail.com">Contact</a>
            </div>
          </div>

          <div className="hero__right">
            <div className="profile-card">
              <Image
                src="/1690800862967.jpeg"
                alt="Portrait photo of Gonçalo Gago"
                width={160}
                height={160}
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

        {/* highlight strip */}
        <div className="stats">
          <div className="container stats__inner">
            <div className="stat">
              <span className="stat__num">Governance</span>
              <span className="stat__label">Catalog · Lineage · Workflows</span>
            </div>
            <div className="stat">
              <span className="stat__num">Analytics</span>
              <span className="stat__label">Semantic models & dashboards</span>
            </div>
            <div className="stat">
              <span className="stat__num">AI</span>
              <span className="stat__label">LLM/RAG assistants in prod</span>
            </div>
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
          <div className="card card--glow">
            <h3>Data Governance</h3>
            <p>Collibra setup, metadata ingestion, lineage and workflow automation via Edge & REST APIs.</p>
          </div>
          <div className="card card--glow">
            <h3>Data Products & BI</h3>
            <p>Trusted metrics, semantic layer and executive dashboards with MicroStrategy & Power BI.</p>
          </div>
          <div className="card card--glow">
            <h3>Applied AI</h3>
            <p>RAG assistants with OpenAI + pgvector/Supabase, guardrails and measurable business KPIs.</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="section" aria-labelledby="experience">
        <div className="container">
          <h2 id="experience" className="section-title">Experience</h2>
          <div className="timeline">
            <div className="role">
              <header>
                <h4>Deloitte — Tech Consultant · Data & AI</h4>
                <span>Jun 2023 – Present · Lisbon</span>
              </header>
              <ul>
                <li>Implemented & optimized <b>Collibra</b> for catalog, governance, lineage and workflow automation (Java, Python, REST APIs).</li>
                <li>Designed and deployed end-to-end <b>ETL pipelines</b> on <b>SQL Server</b> for KPI monitoring feeding <b>MicroStrategy</b>/<b>Power BI</b>.</li>
                <li>Built custom JS visualisations and improved data loading performance in Python; Agile delivery with Jira/Git/Confluence.</li>
              </ul>
            </div>

            <div className="role">
              <header>
                <h4>Miles in the Sky — AI Course Developer</h4>
                <span>Apr 2023 – May 2023 · Lisbon</span>
              </header>
              <ul>
                <li>Automated course generation using <b>Python</b> + <b>OpenAI API</b> with personalized learning flows.</li>
              </ul>
            </div>

            <div className="role">
              <header>
                <h4>Autoeuropa Volkswagen — Logistics Planning Intern</h4>
                <span>May 2022 – Nov 2022 · Palmela</span>
              </header>
              <ul>
                <li>Analysed AGV intra-logistics data with <b>Qlik Sense</b>, driving recommendations and resource reallocation.</li>
              </ul>
            </div>

            <div className="role">
              <header>
                <h4>Novo Banco — Engineering Intern</h4>
                <span>Feb 2020 – Mar 2020 · Lisbon</span>
              </header>
              <ul>
                <li>Hands-on exposure to corporate IT and data management; strengthened <b>Excel</b> and <b>SQL</b> foundations.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION & CERTIFICATIONS */}
      <section className="section" aria-labelledby="education">
        <div className="container">
          <h2 id="education" className="section-title">Education & Certifications</h2>

          <div className="grid two">
            <div className="card">
              <h3>Education</h3>
              <ul className="bullets">
                <li><b>Postgraduate, Applied AI & ML</b> — ISEG Executive Education, Univ. Lisbon (Mar 2024 – Feb 2025)</li>
                <li><b>Integrated Master’s, Electrical & Computer Eng.</b> — FCT NOVA (2017 – 2023)</li>
                <li><b>Erasmus</b> — AGH University of Science and Technology, Kraków (2021 – 2022)</li>
              </ul>
            </div>
            <div className="card">
              <h3>Certifications</h3>
              <ul className="bullets">
                <li>MicroStrategy Developer & Departmental Analyst (2025)</li>
                <li>AWS Certified Cloud Practitioner (2023)</li>
                <li>Collibra Solution Architect (2023)</li>
                <li>Qlik Data Analytics (2023)</li>
              </ul>
            </div>
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
