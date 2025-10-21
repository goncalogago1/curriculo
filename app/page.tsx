// app/page.tsx
import Image from "next/image";
import ChatWidget from "@/components/ChatWidget";
import ProTimeline, { TLItem } from "@/components/ProTimeline";

/** EXPERIENCE **/
const career: TLItem[] = [
  {
    id: "deloitte",
    title: "Tech Consultant (Data & AI)",
    company: "Deloitte Portugal",
    start: "2023-06-01", // Jun 2023 — Present
    // ongoing → no end
    tags: ["Collibra", "Power BI", "MicroStrategy", "SQL Server", "Python"],
    color: "#8b5cf6",
  },
  {
    id: "mts",
    title: "AI Course Developer",
    company: "Miles in the Sky",
    start: "2023-04-01", // Apr 2023 — May 2023
    end:   "2023-05-31",
    tags: ["OpenAI", "Python"],
    color: "#06b6d4",
  },
  {
    id: "autoeuropa",
    title: "Logistics Planning Intern",
    company: "Autoeuropa Volkswagen",
    start: "2022-05-01", // May 2022 — Nov 2022
    end:   "2022-11-30",
    tags: ["Qlik Sense", "Analytics", "AGV"],
    color: "#22c55e",
  },
  {
    id: "novobanco",
    title: "Engineering Intern",
    company: "Novo Banco",
    start: "2020-02-01", // Feb 2020 — Mar 2020
    end:   "2020-03-31",
    tags: ["Excel", "SQL"],
    color: "#f59e0b",
  },
  {
    id: "iseg",
    title: "Postgraduate · Applied AI & ML",
    company: "ISEG Executive Education — Univ. Lisbon",
    start: "2024-03-01", // Mar 2024 — Feb 2025
    end:   "2025-02-28",
    tags: ["Python", "ML/DL", "GenAI"],
    color: "#60a5fa",
  },
  {
    id: "fct",
    title: "Integrated Master’s · EEE/CE",
    company: "FCT NOVA",
    start: "2017-10-01", // Oct 2017 — Mar 2023
    end:   "2023-03-31",
    tags: ["Thesis: AGV Analytics"],
    color: "#34d399",
  },
  {
    id: "agh",
    title: "Erasmus Exchange",
    company: "AGH University of Science and Technology",
    start: "2021-09-01", // Sep 2021 — Feb 2022
    end:   "2022-02-28",
    tags: ["Intercultural", "MSc year"],
    color: "#a78bfa",
  },
  {
    id: "keyser",
    title: "High School Diploma",
    company: "Keyser High School (WV, USA)",
    start: "2016-08-01", // Aug 2016 — Jun 2017
    end:   "2017-06-30",
    tags: ["AFS Exchange"],
    color: "#f87171",
  },
];

export default function Home() {
  return (
    <main>
      {/* TOP BAR */}
      <header className="topbar" role="banner">
        <div className="container topbar__inner">
          <div className="brand">Gonçalo Gago</div>
          <nav className="topnav" aria-label="Primary">
            <a href="#timeline">Timeline</a>
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
          {/* Top strip with CTAs */}
          <div className="profile-topbar" aria-label="Intro actions">
            <span className="loc">Lisbon, Portugal 🇵🇹  </span>
            <span className="loc">   Open to projects & interviews</span>
            <div className="actions">
              <a className="btn btn--primary" href="/chat">Talk to my assistant</a>
              <a className="btn btn--ghost" href="/cv.pdf" download>Download CV (PDF)</a>
            </div>
          </div>

          {/* PHOTO — circular with ring */}
          <aside className="profile-pane" aria-label="Profile">
            <div className="profile-photo profile-photo--round" aria-hidden="true">
              <Image
                src="/1690800862967.jpeg"
                alt="Gonçalo Gago"
                fill
                sizes="(max-width: 1024px) 90vw, 240px"
                priority
              />
            </div>
          </aside>

          {/* CONTENT */}
          <div className="hero__content">
            <h1 id="title">I build data products that drive decisions.</h1>

            <div className="chips" role="group" aria-label="Expertise">
              <span className="chip chip--blue">Analytics</span>
              <span className="chip chip--teal">Data Engineering</span>
              <span className="chip chip--violet">AI / RAG</span>
              <span className="chip chip--green">Data Governance</span>
            </div>
            <div className="links" aria-label="Links" style={{ marginBottom: 16 }}>
              <a href="https://www.linkedin.com/in/goncalo-gago/" target="_blank" rel="noreferrer">LinkedIn</a>
              <span>•</span>
              <a id="contact" href="mailto:goncalogago@gmail.com">Contact</a>
            </div>

            {/* Quick stats */}
            <div className="stats">
              <div className="stats__inner">
                <div className="stat">
                  <span className="stat__num">ETL</span>
                  <span className="stat__label">Scalable SQL Server pipelines</span>
                </div>
                <div className="stat">
                  <span className="stat__num">AI / RAG</span>
                  <span className="stat__label">Applied AI assistants</span>
                </div>
                <div className="stat">
                  <span className="stat__num">Governance</span>
                  <span className="stat__label">Automated lineage & metadata</span>
                </div>
              </div>
            </div>
          </div>

          {/* LEDE (full width) */}
          <p className="lede lede--full">
            I’m a Data &amp; AI Consultant focused on translating complex data into clear, defensible decisions.
            I design and deliver scalable solutions across <b>Analytics</b>, <b>Data Engineering</b>, and <b>Data Governance</b>,
            always anchored on measurable business outcomes. Hands-on with <b>MicroStrategy</b>, <b>Power BI</b>,
            <b> SQL Server</b>, <b>Python</b>, and <b>Collibra</b>, I’ve built automated metadata pipelines, production-grade
            reporting, and AI copilots that meaningfully reduce manual effort and accelerate decision velocity.
          </p>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="capabilities" className="section section--tight" aria-labelledby="cap-title">
        <div className="container">
          <h2 id="cap-title" className="section-title">Core Capabilities</h2>
          <div className="grid three">
            <div className="card">
              <h3>Analytics & Business Intelligence</h3>
              <p>
                Design and delivery of semantic data models, KPIs, and dashboards 
                using <b>MicroStrategy</b> and <b>Power BI</b>. Skilled in data modeling, DAX optimization, and 
                data storytelling to support strategic decision-making at scale. Proven ability to turn complex 
                datasets into actionable insights through performance-driven visual analytics.
              </p>
            </div>

            <div className="card">
              <h3>Data Engineering & Automation</h3>
              <p>
                End-to-end development of <b>ETL pipelines</b> on <b>SQL Server</b> and <b>Python</b>, ensuring high data quality,
                consistency, and scalability. Experience in integrating APIs, automating data ingestion and transformation,
                and optimizing query performance for enterprise-grade analytics. 
              </p>
            </div>

            <div className="card">
              <h3>Data Governance & Metadata Management</h3>
              <p>
                Specialized in <b>Collibra</b> implementation and enablement, from metadata catalog rollout and 
                workflow automation to <b>lineage orchestration</b> across complex data ecosystems (SAP, Power BI, Dremio). 
                Proficient in REST API integration and Python-based ingestion frameworks.

              </p>
            </div>
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
                <li>Delivered end-to-end projects across <b>Data Governance</b>, <b>Engineering</b>, and <b>Analytics</b> for large-scale organizations.</li>
                <li>Implemented and optimized <b>Collibra</b> for metadata cataloging, workflow automation, and <b>lineage orchestration</b> across SAP, Dremio, and Power BI ecosystems.</li>
                <li>Developed <b>ETL pipelines</b> on <b>SQL Server</b> and <b>Python</b>, automating ingestion and transformation for KPI monitoring in Power BI and MicroStrategy.</li>
                <li>Created custom <b>JavaScript visualizations</b> to extend MicroStrategy capabilities and improve data storytelling.</li>
                <li>Enhanced data loading performance with Python scripts and optimized models for large-scale reporting.</li>
              </ul>
            </article>

            <article className="role card--horizontal">
              <header>
                <h4>Miles in the Sky — AI Course Builder</h4>
                <span>Apr 2023 – May 2023 · Lisbon</span>
              </header>
              <ul className="bullets">
                <li>Developed an <b>AI-powered course generation tool</b> integrating <b>OpenAI APIs</b> with Python for automated content creation.</li>
                <li>Applied prompt engineering to generate personalized and optimized learning experiences at scale.</li>
              </ul>
            </article>

            <article className="role">
              <header>
                <h4>Autoeuropa Volkswagen — Logistics Planning Intern</h4>
                <span>May 2022 – Nov 2022 · Palmela</span>
              </header>
              <ul className="bullets">
                <li>Analyzed operational data from 120 <b>Automated Guided Vehicles (AGVs)</b> using Qlik Sense dashboards to support logistics optimization.</li>
                <li>Identified underutilized robots and proposed reallocation, improving resource utilization and production efficiency.</li>
              </ul>
            </article>

            <article className="role">
              <header>
                <h4>Novo Banco — Engineering Intern</h4>
                <span>Feb 2020 – Mar 2020 · Lisbon</span>
              </header>
              <ul className="bullets">
                <li>Gained practical experience in <b>corporate IT</b> and <b>data management</b> within a banking environment.</li>
                <li>Supported internal teams with <b>Excel</b> and <b>SQL</b> process improvements, enhancing reporting accuracy and efficiency.</li>
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

      {/* EDUCATION + CERTS + FINAL PROJECT (SRIJ) */}
      <section id="education" className="section" aria-labelledby="edu-title">
        <div className="container">
          <h2 id="edu-title" className="section-title">Education &amp; Certifications</h2>
          <div className="grid two">
            <div className="card">
              <h3>Education</h3>
              <ul className="bullets">
                <li><b>Postgraduate, Applied AI &amp; ML</b> — ISEG Exec. Education (2024–2025) with AWS. 140h hands-on (ML, DL, GenAI, deployment).</li>
                <li><b>Integrated Master’s, Electrical &amp; Computer Eng.</b> — FCT NOVA (2017–2023). Thesis on analytics for AGV planning.</li>
                <li><b>Erasmus</b> — AGH University, Kraków (2021–2022).</li>
              </ul>
            </div>
            <div className="card">
              <h3>Final Project — SRIJ Regulatory Chatbot</h3>
              <ul className="bullets">
                <li>Domain-specific chatbot for the Portuguese Gaming Authority.</li>
                <li>Reverse-engineered Q&amp;A from legislation PDFs and official docs.</li>
                <li>RAG grounding + LLaMA fine-tuning for legal accuracy and traceability.</li>
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

          {/* Horizontal featured project */}
          <article className="card card--horizontal">
            <div className="card__body">
              <h3>This Website — Portfolio &amp; AI Assistant</h3>
              <ul className="bullets">
                <li>Next.js 15 + React 19 (App Router), accessible and performance-minded.</li>
                <li>Clean, responsive UI with optimized media and semantic HTML.</li>
                <li>RAG chat (OpenAI + Supabase/pgvector) with CV/document ingestion.</li>
              </ul>
            </div>
          </article>

          {/* Two items below */}
          <div className="grid two" style={{ marginTop: 12 }}>
            <article className="card">
              <h3>Crypto Market Analysis — ongoing</h3>
              <ul className="bullets">
                <li>Python + Binance API for high-frequency ingestion and time-series modelling.</li>
                <li>Correlation across coin pairs; z-score &amp; hedge ratio for mean-reversion.</li>
                <li>Exploratory visualizations (Pandas, NumPy, Matplotlib) for strategy tests.</li>
              </ul>
            </article>

            <article className="card">
              <h3>Volunteering &amp; Exchanges</h3>
              <p>Missão País, Just a Change, Banco Alimentar, Projeto +; international camps in Norway, Iceland, and Luxembourg.</p>
            </article>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section id="timeline" className="section" aria-labelledby="timeline-title">
        <div className="container">
          <h2 id="timeline-title" className="section-title">Timeline</h2>
          <ProTimeline items={career} height={520} />
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="section" aria-labelledby="contact">
        <div className="container">
          <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <h3 style={{ marginBottom: 6 }}>Let’s build something valuable with your data.</h3>
              <p className="muted">Available for consulting, projects, and interviews.</p>
            </div>
            <div className="cta">
              <a className="btn btn--primary" href="mailto:goncalogago@gmail.com">Work with me</a>
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
    </main>
  );
}
