// app/page.tsx
import Image from "next/image";
import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/ChatWidget"), { ssr: false });

export default function Home() {
  return (
    <main id="main">
      {/* Skip link (a11y) */}
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3"
      >
        Skip to content
      </a>

      {/* TOP BAR */}
      <header className="topbar" role="banner">
        <div className="container topbar__inner">
          <div className="brand">Gonçalo Gago</div>
          <nav className="topnav" aria-label="Primary">
            <a href="#work">Experience</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#cases">Case Studies</a>
            <a href="#stack">Tech Stack</a>
            <a href="#education">Education</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" aria-labelledby="title">
        <div className="container pro__grid">
          {/* Barra superior com CTAs */}
          <div className="profile-topbar" aria-label="Intro actions">
            <span className="loc">Lisbon, Portugal</span>
            <span className="loc">• Open to projects & interviews</span>
            <div className="actions">
              <a className="btn btn--primary" href="/chat">Talk to my assistant</a>
              <a className="btn btn--ghost" href="/cv.pdf" download>Download CV (PDF)</a>
            </div>
          </div>

          {/* FOTO — pequena, à esquerda */}
          <aside className="profile-pane" aria-label="Profile">
            <div className="profile-photo" aria-hidden="true">
              <Image
                src="/1690800862967.jpeg"
                alt="Gonçalo Gago"
                fill
                sizes="(max-width: 1024px) 90vw, 240px"
                priority
                placeholder="blur"
                blurDataURL="data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICwAAADQAgCdASoQAAkAAUAmJYwCdAEAP7Gq..."
              />
            </div>
          </aside>

          {/* CONTEÚDO */}
          <div className="hero__content">
            <h1 id="title">I build data products that drive decisions.</h1>

            <div className="chips" role="group" aria-label="Expertise">
              <span className="chip chip--blue">Analytics</span>
              <span className="chip chip--teal">Data Engineering</span>
              <span className="chip chip--violet">AI / RAG</span>
            </div>

            <div className="links" aria-label="Links" style={{ marginBottom: 16 }}>
              <a
                href="https://www.linkedin.com/in/goncalo-gago/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <span>•</span>
              <a id="contact" href="mailto:goncalogago@gmail.com">Contact</a>
            </div>

            {/* Stats (reforçadas com AI + Pós-graduação) */}
            <div className="stats">
              <div className="stats__inner">
                <div className="stat">
                  <span className="stat__num">AI</span>
                  <span className="stat__label">Applied AI & RAG assistants</span>
                </div>
                <div className="stat">
                  <span className="stat__num">Postgrad</span>
                  <span className="stat__label">Applied AI & ML (ISEG/AWS)</span>
                </div>
                <div className="stat">
                  <span className="stat__num">ETL</span>
                  <span className="stat__label">Scalable SQL Server pipelines</span>
                </div>
              </div>
            </div>
          </div>

          {/* LEDE LONGA (full width) */}
          <p className="lede lede--full">
            I’m a Data &amp; AI Consultant dedicated to turning complex data into clear,
            actionable insight. I design and ship scalable solutions across <b>Analytics</b>,
            <b> Data Engineering</b>, and <b>Data Governance</b> to unlock measurable business impact.
            I combine a strong technical foundation with a pragmatic, product mindset. Hands-on with
            <b> MicroStrategy</b>, <b>Power BI</b>, <b>SQL Server</b>, <b>Python</b>, and <b>Collibra</b>,
            I’ve built automated metadata pipelines, scalable reporting, and AI-powered assistants
            that reduce manual effort and improve decision velocity across the business.
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="section section--tight" aria-labelledby="cap-title">
        <div className="container">
          <h2 id="cap-title" className="section-title">Capabilities</h2>
          <div className="grid three">
            <div className="card">
              <h3>Analytics</h3>
              <p>Semantic models, certified metrics, and executive dashboards (MicroStrategy, Power BI).</p>
            </div>
            <div className="card">
              <h3>Data Engineering</h3>
              <p>ETL pipelines, performance tuning, data products on SQL Server &amp; Python.</p>
            </div>
            <div className="card">
              <h3>Data Governance</h3>
              <p>Collibra rollout, lineage automation, workflows (Edge, REST APIs).</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED CASE STUDIES */}
      <section id="cases" className="section" aria-labelledby="cases-title">
        <div className="container">
          <h2 id="cases-title" className="section-title">Featured Case Studies</h2>
          <div className="grid three">
            <article className="card" id="case-collibra">
              <h3>Energy Client — Collibra at Scale</h3>
              <ul className="bullets">
                <li>Implemented Collibra ingestion, workflows, and lineage automation.</li>
                <li>Integrated SAP, Dremio, and Power BI via REST APIs + Python scripts.</li>
                <li>Improved governance discoverability and reduced manual curation time.</li>
              </ul>
              <div className="cta"><a className="btn btn--ghost" href="#education">Learn more</a></div>
            </article>

            <article className="card">
              <h3>DataHub &amp; Power BI — 1,300+ PDFs</h3>
              <ul className="bullets">
                <li>PoC proving scalable reporting for high-volume data.</li>
                <li>Optimized data model &amp; report generation pipeline.</li>
                <li>Thousands of PDFs produced automatically in a fraction of time.</li>
              </ul>
              <div className="cta"><a className="btn btn--ghost" href="#projects">Learn more</a></div>
            </article>

            <article className="card">
              <h3>MicroStrategy &amp; ETL — Internal</h3>
              <ul className="bullets">
                <li>Developed dashboards and optimized end-to-end pipelines.</li>
                <li>Python-driven automations to reduce refresh time.</li>
                <li>Faster, always-up-to-date exec views for decision-makers.</li>
              </ul>
              <div className="cta"><a className="btn btn--ghost" href="#work">Learn more</a></div>
            </article>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL EXPERIENCE */}
      <section id="work" className="section" aria-labelledby="exp-title">
        <div className="container">
          <h2 id="exp-title" className="section-title">Professional Experience</h2>

          <div className="timeline">
            <article className="role">
              <header>
                <h4>Deloitte — Tech Consultant · Data &amp; AI</h4>
                <span>Jun 2023 – Present · Lisbon</span>
              </header>
              <ul className="bullets">
                <li>Governance, Engineering &amp; Analytics projects for large organizations.</li>
                <li><b>Collibra</b> rollout: catalog, lineage, workflows (REST/Python).</li>
                <li>ETL on <b>SQL Server</b> feeding <b>Power BI</b>/<b>MicroStrategy</b> KPIs.</li>
                <li>JS visualizations; Python performance gains on data loads.</li>
              </ul>
            </article>

            <article className="role">
              <header>
                <h4>Miles in the Sky — AI Course Builder</h4>
                <span>Apr 2023 – May 2023 · Lisbon</span>
              </header>
              <ul className="bullets">
                <li>OpenAI-powered content generation with robust prompt design in Python.</li>
              </ul>
            </article>

            <article className="role">
              <header>
                <h4>Autoeuropa Volkswagen — Logistics Planning Intern</h4>
                <span>May 2022 – Nov 2022 · Palmela</span>
              </header>
              <ul className="bullets">
                <li>Qlik Sense analysis on 120 AGVs; identified underutilization and proposed reallocation.</li>
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section id="stack" className="section" aria-labelledby="stack-title">
        <div className="container">
          <h2 id="stack-title" className="section-title">Technical Toolbox</h2>
          <div className="grid three">
            <div className="card">
              <h3>Languages</h3>
              <p>Python, SQL, JavaScript/TypeScript, Java, C/C++, VBA</p>
            </div>
            <div className="card">
              <h3>Analytics &amp; BI</h3>
              <p>MicroStrategy, Power BI, Qlik Sense</p>
            </div>
            <div className="card">
              <h3>Data &amp; Infra</h3>
              <p>SQL Server, Airflow, Spark, AWS, Git, Postman</p>
            </div>
            <div className="card">
              <h3>Governance</h3>
              <p>Collibra (Edge, REST, workflows), lineage automation</p>
            </div>
            <div className="card">
              <h3>AI</h3>
              <p>OpenAI API, RAG (pgvector/Supabase), prompt engineering</p>
            </div>
            <div className="card">
              <h3>Collab &amp; PM</h3>
              <p>Confluence, Jira, Excel</p>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION + CERTS + FINAL PROJECT */}
      <section id="education" className="section" aria-labelledby="edu-title">
        <div className="container">
          <h2 id="edu-title" className="section-title">Education &amp; Certifications</h2>
          <div className="grid two">
            <div className="card">
              <h3>Education</h3>
              <ul className="bullets">
                <li><b>Postgraduate, Applied AI &amp; ML</b> — ISEG Exec. Education (2024–2025), in partnership with AWS. 140h hands-on program (ML, DL, GenAI, deployment).</li>
                <li><b>Integrated Master’s, Electrical &amp; Computer Eng.</b> — FCT NOVA (2017–2023). Thesis on analytics for AGV planning.</li>
                <li><b>Erasmus</b> — AGH University, Kraków (2021–2022).</li>
              </ul>
            </div>
            <div className="card">
              <h3>Final Project — SRIJ Regulatory Chatbot</h3>
              <ul className="bullets">
                <li>Domain-specific chatbot for the Portuguese Gaming Authority.</li>
                <li>Reverse-engineered Q&amp;A from legislation PDFs and official docs.</li>
                <li>RAG grounding + LLaMA fine-tuning for legal accuracy &amp; traceability.</li>
              </ul>
            </div>
          </div>

          <div className="grid two" style={{ marginTop: 12 }}>
            <div className="card">
              <h3>Certifications</h3>
              <ul className="bullets">
                <li>MicroStrategy Developer &amp; Departmental Analyst (2025)</li>
                <li>AWS Certified Cloud Practitioner (2023)</li>
                <li>Collibra Solution Architect (2023)</li>
                <li>Qlik Data Analytics (2023)</li>
              </ul>
            </div>
            <div className="card">
              <h3>Languages</h3>
              <p>Portuguese (Native) · English (Fluent) · Spanish (Elementary)</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section" aria-labelledby="proj-title">
        <div className="container">
          <h2 id="proj-title" className="section-title">Personal Projects &amp; Activities</h2>
          <div className="grid two">
            <article className="card">
              <h3>Crypto Market Analysis — ongoing</h3>
              <ul className="bullets">
                <li>Python + Binance API for high-frequency data ingestion and time-series modeling.</li>
                <li>Correlation analysis across coin pairs; z-score &amp; hedge ratio for mean-reversion.</li>
                <li>Exploratory visualizations (Pandas, NumPy, Matplotlib) for strategy testing.</li>
              </ul>
            </article>
            <article className="card">
              <h3>Volunteering &amp; Exchanges</h3>
              <p>Missão País, Just a Change, Banco Alimentar, Projeto +; international camps in Norway, Iceland, and Luxembourg.</p>
            </article>
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section" aria-labelledby="contact">
        <div className="container">
          <div
            className="card"
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
          >
            <div>
              <h3 style={{ marginBottom: 6 }}>Let’s build something valuable with your data.</h3>
              <p className="muted">Available for consulting, projects, and interviews.</p>
            </div>
            <div className="cta">
              <a
                className="btn btn--primary"
                href={`mailto:goncalogago@gmail.com?subject=Data%20%26%20AI%20Consulting%20Inquiry&body=Hi%20Gon%C3%A7alo%2C%0A%0AWe'd%20like%20help%20with...`}
              >
                Work with me
              </a>
              <a className="btn btn--ghost" href="/chat">Ask the assistant</a>
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

      {/* SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Gonçalo Gago",
            jobTitle: "Data & AI Consultant",
            address: { "@type": "PostalAddress", addressLocality: "Lisbon", addressCountry: "PT" },
            url: "https://goncalogago.pt",
            sameAs: ["https://www.linkedin.com/in/goncalo-gago/"],
            knowsAbout: [
              "Analytics","Data Engineering","Data Governance","Collibra",
              "MicroStrategy","Power BI","SQL Server","Python","RAG","OpenAI"
            ],
          }),
        }}
      />
    </main>
  );
}
