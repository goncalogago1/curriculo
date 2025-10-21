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
    tags: [
      "Analytics Engineering", "Data Governance", "Metadata Management", "Lineage Automation",
      "REST APIs", "Python", "SQL Server", "ETL Pipelines", "Power BI", "MicroStrategy",
      "Data Modeling",  "Agile Delivery"
    ],
    color: "#8b5cf6",
  },
  {
    id: "mts",
    title: "AI Course Developer",
    company: "Miles in the Sky",
    start: "2023-04-01", // Apr 2023 — May 2023
    end: "2023-05-31",
    tags: [
      "Generative AI", "OpenAI API", "Prompt Engineering", "NLP", "Python",
      "Course Design", "API Integration"
    ],
    color: "#06b6d4",
  },
  {
    id: "autoeuropa",
    title: "Logistics Planning Intern",
    company: "Autoeuropa Volkswagen",
    start: "2022-05-01", // May 2022 — Nov 2022
    end: "2022-11-30",
    tags: [
      "Qlik Sense", "Data Visualization", "AGV Analytics",
      "Operational Efficiency", "KPI Dashboards", "Logistics Data", "Automation"
    ],
    color: "#22c55e",
  },
  {
    id: "novobanco",
    title: "Engineering Intern",
    company: "Novo Banco",
    start: "2020-02-01", // Feb 2020 — Mar 2020
    end: "2020-03-31",
    tags: [
      "SQL", "Excel", "Reporting", "Banking IT"
    ],
    color: "#f59e0b",
  },
  {
    id: "iseg",
    title: "Postgraduate · Applied AI & ML",
    company: "ISEG Executive Education — Univ. Lisbon (AWS Partnership)",
    start: "2024-03-01", // Mar 2024 — Feb 2025
    end: "2025-02-28",
    tags: [
      "Machine Learning", "Deep Learning", "Generative AI", "RAG", "LLaMA Fine-tuning",
      "Python", "Time-Series Forecasting", "Model Deployment", "AWS",
      "LLMs", "Data Preprocessing"
    ],
    color: "#60a5fa",
  },
  {
    id: "fct",
    title: "Integrated Master’s · Electrical & Computer Eng.",
    company: "FCT NOVA — Nova School of Science and Technology",
    start: "2017-10-01", // Oct 2017 — Mar 2023
    end: "2023-03-31",
    tags: [
      "Thesis: AGV Analytics", "Automation", "Data Processing", "Engineering Systems",
      "Data Analytics", "Control Systems", "Software Engineering", "Research"
    ],
    color: "#34d399",
  },
  {
    id: "agh",
    title: "Erasmus Exchange",
    company: "AGH University of Science and Technology (Poland)",
    start: "2021-09-01", // Sep 2021 — Feb 2022
    end: "2022-02-28",
    tags: [
      "Intercultural Experience", "MSc Coursework",
      "Academic Exchange", "STEM Mobility", "Cultural Adaptability"
    ],
    color: "#a78bfa",
  },
  {
    id: "keyser",
    title: "High School Diploma",
    company: "Keyser High School (West Virginia, USA)",
    start: "2016-08-01", // Aug 2016 — Jun 2017
    end: "2017-06-30",
    tags: [
      "AFS Exchange", "Cultural Immersion", "Leadership", "Teamwork",
      "English Proficiency", "Adaptability"
    ],
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
                Design and delivery of semantic models, KPIs, and dashboards 
                using <b>MicroStrategy</b> and <b>Power BI</b>. Skilled in data modeling, DAX, and 
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
            <p>Python, SQL, JavaScript/TypeScript, Java, VBA, Groovy, HTML/CSS</p>
          </div>

          <div className="card">
            <h3>Analytics &amp; BI</h3>
            <p>MicroStrategy, Power BI, Qlik Sense · KPI models, DAX, data storytelling</p>
          </div>

          <div className="card">
            <h3>Data Engineering</h3>
            <p>SQL Server, Databricks, Spark, Airflow — scalable ETL pipelines, orchestration & optimization.</p>
          </div>

          <div className="card">
            <h3>Data Governance</h3>
            <p>Collibra (Edge, REST, workflows) — lineage automation & metadata management across SAP, Dremio, Power BI.</p>
          </div>

          <div className="card">
            <h3>AI &amp; Machine Learning</h3>
            <p> Generative AI, LLaMA fine-tuning, time-series forecasting, model deployment & monitoring, OpenAI API, RAG (Supabase/pgvector),</p>
          </div>

          <div className="card">
            <h3>Cloud &amp; Collaboration</h3>
            <p>AWS, Git, Postman, Confluence, Jira — Agile delivery & version-controlled data products.</p>
          </div>

        </div>
      </div>
    </section>


      {/* EDUCATION + CERTIFICATIONS + FINAL PROJECT (SRIJ) */}
      <section id="education" className="section" aria-labelledby="edu-title">
        <div className="container">
          <h2 id="edu-title" className="section-title">Education &amp; Certifications</h2>

          <div className="grid two">
            <div className="card">
              <h3>Education</h3>
              <ul className="bullets">
                <li>
                  <b>Postgraduate in Applied Artificial Intelligence &amp; Machine Learning</b> 
                  ISEG Executive Education (2024–2025), in partnership with AWS. 
                  140-hour program combining ML, DL, Generative AI, time-series forecasting, 
                  and end-to-end model deployment &amp; monitoring.
                </li>
                <li>
                  <b>Integrated Master’s in Electrical &amp; Computer Engineering</b> — 
                  FCT NOVA (2017–2023). Thesis on data analytics for automated guided vehicle (AGV) planning.
                </li>
                <li>
                  <b>Erasmus Exchange</b> — AGH University of Science &amp; Technology, Kraków (2021–2022).
                </li>
              </ul>
            </div>

            <div className="card">
              <h3>Postgraduate Final Project — Regulatory Chatbot (SRIJ)</h3>
              <ul className="bullets">
                <li>Developed a <b>domain-specific Generative AI chatbot</b> for the Portuguese Gaming Authority (SRIJ).</li>
                <li>Extracted and structured legal knowledge from Portuguese gaming legislation and regulatory documents.</li>
                <li>Built a <b>Retrieval-Augmented Generation (RAG)</b> pipeline with <b>LLaMA fine-tuning</b> to ensure accuracy, compliance, and traceability of responses.</li>
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
                <li>Qlik Data Analytics Certification (2023)</li>
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

          {/* Featured AI Project */}
          <article className="card card--horizontal">
            <div className="card__body">
              <h3>AI Assistant &amp; Portfolio Website</h3>
              <ul className="bullets">
                <li>End-to-end project combining <b>Generative AI</b>, <b>RAG architecture</b>, and <b>Next.js 15 + React 19</b>.</li>
                <li>Developed an <b>interactive AI assistant</b> capable of answering questions about my CV and experience, using <b>OpenAI embeddings</b> stored in <b>Supabase (pgvector)</b>.</li>
                <li>Implemented document ingestion, chunking, and semantic search pipelines for accurate retrieval and contextual responses.</li>
                <li>Deployed a responsive and performant portfolio site with semantic HTML, reusable components, and SEO optimization.</li>
              </ul>
            </div>
          </article>

          {/* Two projects below */}
          <div className="grid two" style={{ marginTop: 12 }}>
            <article className="card">
              <h3>Crypto Market Analysis — Ongoing</h3>
              <ul className="bullets">
                <li>Python-based quantitative analytics using <b>Binance API</b> for real-time and historical market data ingestion.</li>
                <li>Applied <b>statistical modeling</b>, correlation matrices, z-score, and hedge ratio to detect mean-reversion patterns.</li>
                <li>Visualized results through <b>time-series dashboards</b> built with Pandas, NumPy, and Matplotlib.</li>
              </ul>
            </article>

            <article className="card">
              <h3>Volunteering &amp; International Exchanges</h3>
              <ul className="bullets">
                <li>Contributed to social impact initiatives: <b>Missão País</b>, <b>Just a Change</b>, <b>Banco Alimentar</b>, and <b>Projeto +</b>.</li>
                <li>Participated in intercultural exchange programs across <b>Norway</b>, <b>Iceland</b>, and <b>Luxembourg</b>, developing leadership and collaboration skills.</li>
              </ul>
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
