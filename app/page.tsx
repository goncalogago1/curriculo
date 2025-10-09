// app/page.tsx
import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  return (
    <main>
      {/* TOP BAR */}
      <header className="topbar" role="banner">
        <div className="container topbar__inner">
          <div className="brand">Gonçalo Gago</div>
          <nav className="topnav" aria-label="Primary">
            <a href="#work">Experience</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* BARRA COMPLETA DO PAPEL */}
      <div className="roleband" aria-label="Role">
        <div className="container roleband__inner">
          <span className="roleband__text">AI &amp; Data Consultant</span>
        </div>
      </div>

      {/* TOP CARD (substitui a “caixa” antiga e sobe para o topo) */}
      <section className="topcard" aria-label="Quick actions">
        <div className="container">
          <div className="topcard__wrap">
            <span className="pill">AI &amp; Data Consultant</span>
            <div className="topcard__meta">
              <span>📍 Lisbon, Portugal</span>
              <span>• Open to projects & interviews</span>
            </div>
            <div className="topcard__actions">
              <a className="btn btn--primary" href="/chat">Talk to my assistant</a>
              <a className="btn btn--ghost" href="/cv.pdf" download>Download CV (PDF)</a>
            </div>
          </div>
        </div>
      </section>

      {/* HERO — FOTO À ESQUERDA (ainda mais pequena) */}
      <section className="hero" aria-labelledby="title">
        <div className="container pro__grid">
          {/* Foto / painel esquerdo */}
          <aside className="profile-pane" aria-label="Profile photo">
            <div className="profile-photo" aria-hidden="true">
              <Image
                src="/1690800862967.jpeg"
                alt="Gonçalo Gago"
                fill
                sizes="(max-width: 1024px) 90vw, 220px"
                priority
              />
            </div>
          </aside>

          {/* Conteúdo (direita) */}
          <div className="hero__content">
            <h1 id="title">I build data products that drive decisions.</h1>
            <p className="lede subtitle">
              I transform complex data into actionable insights through <b>Analytics</b>, <b>Data Engineering</b> and production-grade <b>LLM/RAG</b>.
              Experienced in <b>Collibra</b>, <b>MicroStrategy</b>, <b>Power BI</b>, <b>SQL Server</b> and <b>Python</b>.
            </p>

            <div className="chips" role="group" aria-label="Expertise">
              <span className="chip chip--blue">Analytics</span>
              <span className="chip chip--teal">Engineering</span>
              <span className="chip chip--violet">AI / RAG</span>
            </div>

            <div className="links" aria-label="Links">
              <a href="https://www.linkedin.com/in/goncalo-gago/" target="_blank" rel="noreferrer">LinkedIn</a>
              <span>•</span>
              <a id="contact" href="mailto:goncalogago@gmail.com">Contact</a>
            </div>

            <div className="stats">
              <div className="stats__inner">
                <div className="stat">
                  <span className="stat__num">+30</span>
                  <span className="stat__label">Dashboards shipped</span>
                </div>
                <div className="stat">
                  <span className="stat__num">ETL</span>
                  <span className="stat__label">SQL Server pipelines</span>
                </div>
                <div className="stat">
                  <span className="stat__num">RAG</span>
                  <span className="stat__label">OpenAI + pgvector</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="section" aria-labelledby="cap-title">
        <div className="container">
          <h2 id="cap-title" className="section-title gradient-underline">Capabilities</h2>
          <div className="grid three">
            <div className="card tone--blue">
              <h3>Analytics</h3>
              <p>Trusted metrics, semantic layers and executive dashboards with MicroStrategy &amp; Power BI.</p>
            </div>
            <div className="card tone--teal">
              <h3>Data Engineering</h3>
              <p>End-to-end ETL and integration flows on SQL Server &amp; Python for KPI monitoring.</p>
            </div>
            <div className="card tone--violet">
              <h3>Data Governance</h3>
              <p>Collibra setup, lineage and workflow automation (Edge, REST APIs).</p>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="work" className="section" aria-labelledby="exp-title">
        <div className="container">
          <h2 id="exp-title" className="section-title gradient-underline">Professional Experience</h2>

          <div className="timeline">
            <article className="role">
              <header>
                <h4>Deloitte — Tech Consultant · Data &amp; AI</h4>
                <span>Jun 2023 – Present · Lisbon</span>
              </header>
              <ul className="bullets">
                <li>Projects across Governance, Engineering and Analytics for large organizations.</li>
                <li>Implemented and optimized <b>Collibra</b> (catalog, lineage, workflows) with Java/Python/REST.</li>
                <li>Designed ETL pipelines on <b>SQL Server</b> feeding KPIs in <b>Power BI</b>/<b>MicroStrategy</b>.</li>
                <li>Custom JS visualisations; Python performance improvements for data loads.</li>
              </ul>
            </article>

            <article className="role">
              <header>
                <h4>Miles in the Sky — AI Course Developer</h4>
                <span>Apr 2023 – May 2023 · Lisbon</span>
              </header>
              <ul className="bullets">
                <li>Automated course generation using <b>Python</b> + <b>OpenAI API</b>.</li>
              </ul>
            </article>

            <article className="role">
              <header>
                <h4>Autoeuropa Volkswagen — Logistics Planning Intern</h4>
                <span>May 2022 – Nov 2022 · Palmela</span>
              </header>
              <ul className="bullets">
                <li>Analysed AGV intra-logistics in <b>Qlik Sense</b>; recommended reallocation of unused robot.</li>
              </ul>
            </article>

            <article className="role">
              <header>
                <h4>Novo Banco — Engineering Intern</h4>
                <span>Feb 2020 – Mar 2020 · Lisbon</span>
              </header>
              <ul className="bullets">
                <li>Corporate IT &amp; data management exposure; stronger <b>Excel</b> and <b>SQL</b> foundations.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* EDUCATION + CERTS */}
      <section className="section" aria-labelledby="edu-title">
        <div className="container">
          <h2 id="edu-title" className="section-title gradient-underline">Education &amp; Certifications</h2>
          <div className="grid two">
            <div className="card">
              <h3>Education</h3>
              <ul className="bullets">
                <li><b>Postgraduate, Applied AI &amp; ML</b> — ISEG (2024–2025). Final project: company chatbot with LLM/NLP.</li>
                <li><b>Integrated Master’s, E&amp;CE</b> — FCT NOVA (2017–2023). Thesis on analytics for AGV planning.</li>
                <li><b>Erasmus</b> — AGH University, Kraków (2021–2022).</li>
                <li><b>High School Diploma</b> — Keyser HS, WV, USA (2016–2017).</li>
              </ul>
            </div>
            <div className="card">
              <h3>Certifications</h3>
              <ul className="bullets">
                <li>MicroStrategy Developer &amp; Departmental Analyst (2025)</li>
                <li>AWS Certified Cloud Practitioner (2023)</li>
                <li>Collibra Solution Architect (2023)</li>
                <li>Qlik Data Analytics (2023)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section" aria-labelledby="proj-title">
        <div className="container">
          <h2 id="proj-title" className="section-title gradient-underline">Personal Projects &amp; Activities</h2>
        <div className="grid two">
            <div className="card">
              <h3>Crypto Market Analysis — (ongoing)</h3>
              <p>Python tool that pulls Binance data and analyses pair correlations, z-score and hedge ratio.</p>
            </div>
            <div className="card">
              <h3>Volunteering &amp; Exchanges</h3>
              <p>Missão País, Just a Change, Banco Alimentar, Projeto +; international camps in Norway, Iceland, Luxembourg.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section className="section" aria-labelledby="skills-title">
        <div className="container">
          <h2 id="skills-title" className="section-title gradient-underline">Skills &amp; Languages</h2>
          <div className="grid two">
            <div className="card">
              <h3>Skills</h3>
              <p><b>Programming:</b> Python, SQL, VBA, Java, JavaScript, HTML/CSS, Groovy, C/C++</p>
              <p><b>Tools:</b> MicroStrategy, Power BI, Qlik, AWS, Airflow, Spark, Postman, Git, Excel, Collibra, Databricks, Confluence, Jira</p>
              <p><b>Engineering:</b> SQL Server, ETL pipelines, performance tuning</p>
              <p><b>AI:</b> OpenAI API, RAG (pgvector/Supabase)</p>
            </div>
            <div className="card">
              <h3>Languages</h3>
              <p>Portuguese (Native) · English (Fluent) · Spanish (Elementary)</p>
              <div className="cta">
                <a className="btn btn--primary" href="mailto:goncalogago@gmail.com">Work with me</a>
                <a className="btn btn--ghost" href="/chat">Ask the assistant</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" role="contentinfo">
        <div className="container footer__inner">
          <span>© {new Date().getFullYear()} Gonçalo Gago</span>
          <nav className="footer__nav" aria-label="Footer">
            <a href="/chat">Assistant</a>
            <a href="/cv.pdf" download>CV (PDF)</a>
            <a href="mailto:goncalogago@gmail.com">Contact</a>
          </nav>
        </div>
      </footer>

      {/* CHAT */}
      <ChatWidget />
    </main>
  );
}
