import Image from "next/image";

export default function Home() {
  return (
    <main>
      {/* HERO */}
      <section className="hero" aria-labelledby="title">
        <div className="container hero__inner">
          <div className="hero__left">
            <span className="pill">AI & Data Consultant</span>
            <h1 id="title">Gonçalo Gago</h1>
            <p className="subtitle">
              I turn data into decisions through <b>Analytics</b>, <b>Data Engineering</b> and production-grade <b>LLM/RAG</b>.
              Hands-on with <b>MicroStrategy</b>, <b>Power BI</b>, <b>SQL Server</b>, <b>Python</b>, and Collibra.
            </p>

            <div className="cta" role="group" aria-label="Actions">
              <a className="btn btn--primary" href="/chat">Talk to my assistant</a>
              <a className="btn btn--ghost" href="/cv.pdf" download>Download résumé (PDF)</a>
            </div>

            <div className="links" aria-label="Links">
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
                width={180}
                height={180}
                className="avatar"
                priority
              />
              <div className="profile-card__info">
                <p><b>Open</b> to projects and interviews</p>
                <ul>
                  <li>BI & Visualisation (MicroStrategy, Power BI)</li>
                  <li>Pipelines & SQL (SQL Server, Python)</li>
                  <li>LLMs & RAG (OpenAI + pgvector)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* vibrant highlight strip */}
        <div className="stats">
          <div className="container stats__inner">
            <div className="stat"><span className="stat__num">Analytics</span><span className="stat__label">Semantic models & exec dashboards</span></div>
            <div className="stat"><span className="stat__num">Engineering</span><span className="stat__label">ETL pipelines & SQL Server</span></div>
            <div className="stat"><span className="stat__num">AI</span><span className="stat__label">RAG assistants in production</span></div>
          </div>
        </div>

        <div className="hero__bg" />
      </section>

      {/* CAPABILITIES — Governance por último */}
      <section className="section" aria-labelledby="capabilities">
        <div className="container">
          <h2 id="capabilities" className="section-title">Capabilities</h2>
        </div>
        <div className="container grid three">
          <div className="card card--glow">
            <h3>Analytics</h3>
            <p>Trusted metrics, semantic layers and executive dashboards with MicroStrategy & Power BI.</p>
          </div>
          <div className="card card--glow">
            <h3>Data Engineering</h3>
            <p>End-to-end ETL and integration flows on SQL Server and Python for KPI monitoring.</p>
          </div>
          <div className="card card--glow">
            <h3>Data Governance</h3>
            <p>Collibra setup, lineage and workflow automation via Edge & REST APIs.</p>
          </div>
        </div>
      </section>

      {/* EXPERIENCE — do CV */}
      <section className="section" aria-labelledby="experience">
        <div className="container">
          <h2 id="experience" className="section-title">Professional Experience</h2>
          <div className="timeline">
            <div className="role">
              <header>
                <h4>Deloitte — Tech Consultant · Data & AI</h4>
                <span>Jun 2023 – Present · Lisbon</span>
              </header>
              <ul>
                <li>Delivered projects in Governance, Engineering and Analytics for large organizations. :contentReference[oaicite:1]{index=1}</li>
                <li>Implemented and optimized <b>Collibra</b> for catalog, lineage and workflows (Java/Python/REST). :contentReference[oaicite:2]{index=2}</li>
                <li>Designed ETL pipelines on <b>SQL Server</b> feeding <b>Power BI</b>/<b>MicroStrategy</b> KPIs. :contentReference[oaicite:3]{index=3}</li>
                <li>Built custom JavaScript visualisations; improved pipeline performance with Python. :contentReference[oaicite:4]{index=4}</li>
              </ul>
            </div>

            <div className="role">
              <header>
                <h4>Miles in the Sky — AI Course Developer</h4>
                <span>Apr 2023 – May 2023 · Lisbon</span>
              </header>
              <ul>
                <li>Automated course generation using <b>Python</b> + <b>OpenAI API</b>. :contentReference[oaicite:5]{index=5}</li>
              </ul>
            </div>

            <div className="role">
              <header>
                <h4>Autoeuropa Volkswagen — Logistics Planning Intern</h4>
                <span>May 2022 – Nov 2022 · Palmela</span>
              </header>
              <ul>
                <li>Analysed AGV intra-logistics in <b>Qlik Sense</b>; recommended reallocation of unused robot. :contentReference[oaicite:6]{index=6}</li>
              </ul>
            </div>

            <div className="role">
              <header>
                <h4>Novo Banco — Engineering Intern</h4>
                <span>Feb 2020 – Mar 2020 · Lisbon</span>
              </header>
              <ul>
                <li>Corporate IT & data management exposure; strengthened <b>Excel</b> and <b>SQL</b> foundations. :contentReference[oaicite:7]{index=7}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* EDUCATION + CERTS */}
      <section className="section" aria-labelledby="education">
        <div className="container">
          <h2 id="education" className="section-title">Education & Certifications</h2>
          <div className="grid two">
            <div className="card">
              <h3>Education</h3>
              <ul className="bullets">
                <li><b>Postgraduate, Applied AI & ML</b> — ISEG Exec. Education, Univ. Lisbon (Mar 2024 – Feb 2025). Final project: custom company chatbot with LLM/NLP. :contentReference[oaicite:8]{index=8}</li>
                <li><b>Integrated Master’s, Electrical & Computer Eng.</b> — FCT NOVA (2017 – 2023). Thesis on analytics for AGV planning. :contentReference[oaicite:9]{index=9}</li>
                <li><b>Erasmus</b> — AGH Univ., Kraków (Sep 2021 – Feb 2022). :contentReference[oaicite:10]{index=10}</li>
                <li><b>High School Diploma</b> — Keyser High School, WV, USA (2016 – 2017). :contentReference[oaicite:11]{index=11}</li>
              </ul>
            </div>
            <div className="card">
              <h3>Certifications</h3>
              <ul className="bullets">
                <li>MicroStrategy Developer & Departmental Analyst (2025) :contentReference[oaicite:12]{index=12}</li>
                <li>AWS Certified Cloud Practitioner (2023) :contentReference[oaicite:13]{index=13}</li>
                <li>Collibra Solution Architect (2023) :contentReference[oaicite:14]{index=14}</li>
                <li>Qlik Data Analytics (2023) :contentReference[oaicite:15]{index=15}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS & ACTIVITIES */}
      <section className="section" aria-labelledby="projects">
        <div className="container">
          <h2 id="projects" className="section-title">Personal Projects & Activities</h2>
          <div className="grid two">
            <div className="card">
              <h3>Crypto Market Analysis — (ongoing)</h3>
              <p>Python tool that pulls Binance data, analyses pair correlations, z-score and hedge ratio. :contentReference[oaicite:16]{index=16}</p>
            </div>
            <div className="card">
              <h3>Volunteering & Exchanges</h3>
              <p>Missão País, Just a Change, Banco Alimentar, Projeto +; international camps in Norway, Iceland, Luxembourg. :contentReference[oaicite:17]{index=17}</p>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS & LANGUAGES */}
      <section className="section" aria-labelledby="skills">
        <div className="container">
          <h2 id="skills" className="section-title">Skills & Languages</h2>
          <div className="grid two">
            <div className="card">
              <h3>Skills</h3>
              <p><b>Programming:</b> Python, SQL, VBA, Java, JavaScript, HTML/CSS, Groovy</p>
              <p><b>Tools/Platforms:</b> MicroStrategy, Power BI, Qlik Sense, AWS, Airflow, Spark, Postman, Git, Excel, Collibra, Databricks, Confluence, Jira</p>
              <p><b>Data Engineering:</b> SQL Server, ETL pipelines, performance tuning</p>
              <p><b>AI:</b> OpenAI API, RAG with pgvector/Supabase</p>
              <p className="muted">Source: résumé. :contentReference[oaicite:18]{index=18}</p>
            </div>
            <div className="card">
              <h3>Languages</h3>
              <p>Portuguese (Native) · English (Fluent) · Spanish (Elementary) :contentReference[oaicite:19]{index=19}</p>
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
            <a href="/cv.pdf" download>Résumé (PDF)</a>
            <a href="mailto:goncalogago@gmail.com">Contact</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
