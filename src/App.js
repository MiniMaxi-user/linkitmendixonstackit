import { useState, useEffect, useCallback } from "react";

// ── LINKIT BRAND ─────────────────────────────────────────────────
const BRAND = {
  blue: "#1A4F8A",
  blueLight: "#D6E4F0",
  blueMid: "#2E86C1",
  accent: "#E8F0F9",
  white: "#FFFFFF",
  gray50: "#F5F7FA",
  gray100: "#E8EEF4",
  gray300: "#BBCAD8",
  gray500: "#6B8099",
  gray700: "#334D66",
  green: "#2E6B3E",
  greenLight: "#E8F5ED",
  purple: "#5B3A8A",
  purpleLight: "#EDE8F5",
  text: "#1A2B3C",
  danger: "#C0392B",
  dangerLight: "#FDECEA",
};

// ── LINKIT SVG LOGO ───────────────────────────────────────────────
function LinkitLogo({ size = 32 }) {
  return (
    <svg width={size * 3.2} height={size} viewBox="0 0 128 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="6" fill={BRAND.blue} />
      <path d="M10 30V10h5v16h9v4H10z" fill="white" />
      <path d="M26 14a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" fill={BRAND.blueMid} />
      <rect x="23.5" y="15" width="5" height="15" rx="1" fill="white" />
      <text x="48" y="27" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="18" fill={BRAND.blue}>LINKIT</text>
    </svg>
  );
}

// ── QUESTION DATA ─────────────────────────────────────────────────
const PART_A = {
  id: "A",
  label: "Part A",
  title: "Current landscape",
  subtitle: "Deviations from Mendix Cloud standard",
  color: BRAND.blue,
  colorLight: BRAND.accent,
  description: "Apps are running on Mendix Cloud. By default, 3 environments are available (development, test, production), the database is PostgreSQL, and file storage is handled by Mendix. The questions below focus exclusively on deviations or additions to this standard.",
  sections: [
    {
      id: "A1", title: "Environments",
      questions: [
        "Are there apps with more than 3 environments (e.g. a separate acceptance environment)?",
        "Are there environments with a non-standard scaling plan (e.g. extra memory or dedicated resources)?",
        "Are there apps shared across multiple Mendix projects or teams?",
      ],
    },
    {
      id: "A2", title: "Custom domains & SSL",
      questions: [
        "Are custom domains in use (not the default mendixcloud.com subdomain)?",
        "Are custom SSL certificates configured, or is Mendix-managed SSL used?",
        "Are any redirects or aliases configured on the current domains?",
      ],
    },
    {
      id: "A3", title: "Authentication & SSO",
      questions: [
        "Do apps use SSO (SAML or OIDC)? If so, which identity provider?",
        "Are there apps still using local Mendix user accounts (no SSO)?",
        "Are specific certificates configured for the SAML/OIDC integration?",
      ],
    },
    {
      id: "A4", title: "Network & connectivity",
      questions: [
        "Are there connections to on-premise systems running via a fixed route or VPN?",
        "Are IP whitelists used for outbound or inbound traffic?",
        "Are there integrations that depend on the fixed IP address of Mendix Cloud?",
      ],
    },
    {
      id: "A5", title: "Scheduled events & background processes",
      questions: [
        "Are there scheduled events that are enabled or disabled per environment in Mendix Cloud?",
        "Are there long-running processes that exceed the default Mendix Cloud timeout?",
        "Are there nightly or periodic batch jobs with specific time window requirements?",
      ],
    },
    {
      id: "A6", title: "Compliance & data residency",
      questions: [
        "Are there requirements on where data is stored (outside EU, or strictly within NL/DE)?",
        "Do specific compliance standards currently affect the Mendix Cloud configuration (BIO, ISO 27001, GDPR)?",
      ],
    },
  ],
};

const PART_B_SECTIONS = [
  {
    id: "B1", title: "App identification",
    questions: [
      "What is the functional name and purpose of the app?",
      "What is the current Mendix version (Studio Pro)?",
      "On which platform is the app currently running (Mendix Cloud, on-premise, other cloud)?",
      "Which environments are active for this app (dev / test / acceptance / production)?",
      "How many environments are required in the new STACKIT setup for this app?",
      "How many active users are there (and what is the expected peak load)?",
    ],
  },
  {
    id: "B2", title: "Database",
    questions: [
      "Which database engine is used (PostgreSQL, SQL Server, other)?",
      "Is the database currently on-premise, in the cloud, or managed?",
      "Will the database migrate to STACKIT or remain external?",
      "What is the current database size (indicative, in GB)?",
      "What are the backup frequency and retention requirements for this app?",
    ],
  },
  {
    id: "B3", title: "File storage",
    questions: [
      "Is file storage used in this app (attachments, documents, exports)?",
      "Which storage solution is currently used (local disk, S3, Azure Blob)?",
      "What is the total storage volume (indicative)?",
      "Will file storage migrate to STACKIT Object Storage or remain external?",
    ],
  },
  {
    id: "B4", title: "Integrations",
    questions: [
      "Which external systems does this app call?",
      "Which protocols are used (REST, SOAP, OData, message broker)?",
      "Are there connections to on-premise systems that require special routing?",
      "Are certificates or mTLS used for integrations?",
      "Are there inbound webhooks or callbacks that require a fixed IP or hostname?",
    ],
  },
  {
    id: "B5", title: "Scheduled events & background processes",
    questions: [
      "Are there scheduled events configured? If so, which ones and how frequently?",
      "Are there long-running microflows or batch processes?",
      "Are there maintenance windows during which the app must not be unavailable?",
    ],
  },
  {
    id: "B6", title: "Availability & scalability",
    questions: [
      "What are the SLA requirements for this app (uptime %, RTO, RPO)?",
      "Is horizontal scaling required (multiple runtime pods)?",
      "What are the current resource settings in Mendix Cloud (memory, cores)?",
      "Are there peak periods (daily, monthly, seasonal)?",
    ],
  },
  {
    id: "B7", title: "Custom configuration & runtime settings",
    questions: [
      "Are there app-specific constants that differ per environment?",
      "Are there custom runtime settings (JVM parameters, Mendix runtime settings)?",
      "Are third-party modules or custom widgets in use (incl. licences)?",
      "Are specific certificates or truststores required for this app?",
      "Are custom HTTP headers required (e.g. security headers, CORS, X-Frame-Options)?",
    ],
  },
];

const PART_C = {
  id: "C",
  label: "Part C",
  title: "Architecture decisions",
  subtitle: "For the new environment",
  color: BRAND.purple,
  colorLight: BRAND.purpleLight,
  description: "Discuss Part C after Parts A and B have been completed. The answers form the input for the technical design.",
  sections: [
    {
      id: "C1", title: "Cluster setup",
      questions: [
        "How many clusters will be provisioned (one shared cluster or per app/team)?",
        "Which Kubernetes version and update strategy?",
        "How will namespaces be structured (per app, per environment, combination)?",
        "Which ingress controller is preferred (NGINX, Traefik, other)?",
        "Are there requirements for node pools (dedicated nodes per app or environment)?",
      ],
    },
    {
      id: "C2", title: "Backup & disaster recovery",
      questions: [
        "What is the desired backup strategy for databases on STACKIT?",
        "Will Velero be used for cluster-level backups?",
        "What are the RTO and RPO targets in the new situation?",
        "Is multi-zone or multi-region availability required?",
      ],
    },
    {
      id: "C3", title: "Migration strategy & planning",
      questions: [
        "What is the desired migration order (which app first)?",
        "Will migration be big-bang or phased per app?",
        "Is a freeze period or migration window available?",
        "How will the cutover be organised (DNS switch, blue-green, other)?",
        "What is the rollback strategy if the migration fails?",
      ],
    },
    {
      id: "C4", title: "Source control & repository",
      questions: [
        "Which Git environment is preferred (Azure DevOps, GitHub, GitLab, Bitbucket)?",
        "How will repositories be structured (one repo per app, monorepo, separate infra repo)?",
        "What is the desired branching strategy (Gitflow, trunk-based, other)?",
        "How will the Mendix Team Server (SVN) be connected to the Git pipeline?",
      ],
    },
    {
      id: "C5", title: "Monitoring & logging",
      questions: [
        "Which monitoring tool is preferred (Prometheus + Grafana, Datadog, STACKIT Observability, other)?",
        "How will logging be centralised (Loki, EFK/ELK, Azure Monitor)?",
        "Which metrics are the minimum requirement (app health, JVM, database, custom business metrics)?",
        "Via which channel will alerts be sent (email, Teams, PagerDuty)?",
        "Are there audit logging requirements from compliance?",
      ],
    },
    {
      id: "C6", title: "Database structure & management",
      questions: [
        "Will a single shared database instance be used for multiple apps, or one instance per app?",
        "Will STACKIT Database-as-a-Service be used, or a self-managed database on the cluster?",
        "How will database migrations be executed (Mendix automatic, Liquibase, manual)?",
        "Who owns the database backups and how will restore procedures be tested?",
      ],
    },
    {
      id: "C7", title: "Pipeline configuration",
      questions: [
        "Which CI/CD tooling will be used (Azure Pipelines, GitHub Actions, GitLab CI, Jenkins)?",
        "Will GitOps be used for cluster deployments (ArgoCD or Flux)?",
        "How will promotion between environments work (automatic, manual, with approval gate)?",
        "How will environment-specific values (constants, secrets) be managed in the pipeline (Vault, K8s Secrets, pipeline variables)?",
        "Is there a need for automated testing as part of the pipeline (unit, smoke, integration)?",
      ],
    },
  ],
};

// ── STORAGE HELPERS ───────────────────────────────────────────────
const STORAGE_KEY = "linkit_stackit_projects";

function loadProjects() {
  try {
    const raw = window.storage ? null : localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveProjects(projects) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch {}
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function makeProject(name, client) {
  return {
    id: makeId(),
    name,
    client,
    createdAt: new Date().toISOString(),
    answersA: {},
    apps: [],
    answersC: {},
  };
}

function makeApp(name) {
  return { id: makeId(), name, answers: {} };
}

// ── PROGRESS HELPERS ──────────────────────────────────────────────
function calcProgress(answers, sections) {
  let total = 0, filled = 0;
  sections.forEach(s => s.questions.forEach(q => {
    total++;
    const key = `${s.id}_${q.slice(0, 30)}`;
    if (answers[key] && answers[key].trim()) filled++;
  }));
  return total === 0 ? 0 : Math.round((filled / total) * 100);
}

function sectionProgress(answers, section) {
  let total = section.questions.length, filled = 0;
  section.questions.forEach(q => {
    const key = `${section.id}_${q.slice(0, 30)}`;
    if (answers[key] && answers[key].trim()) filled++;
  });
  return { filled, total };
}

// ── STYLES ────────────────────────────────────────────────────────
const S = {
  app: {
    fontFamily: "Arial, sans-serif",
    minHeight: "100vh",
    background: BRAND.gray50,
    color: BRAND.text,
  },
  topbar: {
    background: BRAND.white,
    borderBottom: `1px solid ${BRAND.gray100}`,
    padding: "0 28px",
    height: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  topbarLeft: { display: "flex", alignItems: "center", gap: 16 },
  breadcrumb: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: BRAND.gray500 },
  breadcrumbSep: { color: BRAND.gray300 },
  breadcrumbActive: { color: BRAND.text, fontWeight: 600 },
  main: { maxWidth: 960, margin: "0 auto", padding: "32px 24px 80px" },
  pageTitle: { fontSize: 22, fontWeight: 700, color: BRAND.blue, marginBottom: 4 },
  pageSubtitle: { fontSize: 14, color: BRAND.gray500, marginBottom: 28 },
  card: {
    background: BRAND.white,
    border: `1px solid ${BRAND.gray100}`,
    borderRadius: 10,
    padding: "20px 24px",
    marginBottom: 16,
  },
  cardHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: 700, color: BRAND.text },
  cardMeta: { fontSize: 12, color: BRAND.gray500 },
  btn: {
    display: "inline-flex", alignItems: "center", gap: 6,
    padding: "8px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600,
    cursor: "pointer", border: "none", transition: "opacity .15s",
  },
  btnPrimary: { background: BRAND.blue, color: BRAND.white },
  btnSecondary: { background: BRAND.gray100, color: BRAND.gray700 },
  btnDanger: { background: BRAND.dangerLight, color: BRAND.danger },
  btnGhost: { background: "transparent", color: BRAND.blue, border: `1px solid ${BRAND.blueLight}` },
  btnGreen: { background: BRAND.green, color: BRAND.white },
  input: {
    width: "100%", boxSizing: "border-box",
    padding: "9px 12px", fontSize: 14, borderRadius: 6,
    border: `1px solid ${BRAND.gray300}`, outline: "none",
    fontFamily: "Arial, sans-serif", color: BRAND.text,
    background: BRAND.white,
  },
  textarea: {
    width: "100%", boxSizing: "border-box",
    padding: "9px 12px", fontSize: 14, borderRadius: 6,
    border: `1px solid ${BRAND.gray300}`, outline: "none",
    fontFamily: "Arial, sans-serif", color: BRAND.text,
    background: BRAND.white, resize: "vertical", minHeight: 72,
  },
  label: { fontSize: 13, fontWeight: 600, color: BRAND.gray700, marginBottom: 5, display: "block" },
  progressBar: { height: 6, borderRadius: 3, background: BRAND.gray100, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3, transition: "width .4s ease", background: BRAND.blue },
  sectionChip: {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
    letterSpacing: .3,
  },
  stepIndicator: {
    display: "flex", gap: 0, marginBottom: 28,
    borderRadius: 8, overflow: "hidden",
    border: `1px solid ${BRAND.gray100}`,
  },
  step: {
    flex: 1, padding: "10px 14px", fontSize: 13, fontWeight: 600,
    textAlign: "center", cursor: "pointer",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
  },
  stepLabel: { fontSize: 11, fontWeight: 400, opacity: .75 },
  badge: {
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    minWidth: 20, height: 20, borderRadius: 10, fontSize: 11, fontWeight: 700, padding: "0 6px",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 },
  divider: { border: "none", borderTop: `1px solid ${BRAND.gray100}`, margin: "16px 0" },
  emptyState: {
    textAlign: "center", padding: "48px 24px",
    color: BRAND.gray500, fontSize: 14,
  },
  tag: {
    display: "inline-block", padding: "2px 8px", borderRadius: 4,
    fontSize: 11, fontWeight: 600,
  },
};

// ── COMPONENTS ────────────────────────────────────────────────────

function ProgressBar({ pct, color = BRAND.blue }) {
  return (
    <div style={S.progressBar}>
      <div style={{ ...S.progressFill, width: `${pct}%`, background: color }} />
    </div>
  );
}

function SectionChip({ id, color, colorLight }) {
  return (
    <span style={{ ...S.sectionChip, background: colorLight, color }}>
      {id}
    </span>
  );
}

function Btn({ children, variant = "primary", onClick, style = {}, disabled }) {
  const base = variant === "primary" ? S.btnPrimary
    : variant === "secondary" ? S.btnSecondary
    : variant === "danger" ? S.btnDanger
    : variant === "green" ? S.btnGreen
    : S.btnGhost;
  return (
    <button
      style={{ ...S.btn, ...base, ...style, opacity: disabled ? .5 : 1 }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,30,60,.45)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999,
    }}>
      <div style={{
        background: BRAND.white, borderRadius: 12, padding: 28,
        width: 440, maxWidth: "90vw", boxShadow: "0 8px 40px rgba(0,0,0,.18)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: BRAND.text }}>{title}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: BRAND.gray500, lineHeight: 1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── QUESTION FORM ─────────────────────────────────────────────────
function QuestionForm({ sections, answers, onChange, partColor }) {
  const [openSection, setOpenSection] = useState(sections[0]?.id);

  return (
    <div>
      {sections.map((section) => {
        const { filled, total } = sectionProgress(answers, section);
        const isOpen = openSection === section.id;
        return (
          <div key={section.id} style={{ ...S.card, padding: 0, overflow: "hidden" }}>
            <div
              style={{
                padding: "14px 20px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 12,
                background: isOpen ? BRAND.accent : BRAND.white,
                borderBottom: isOpen ? `1px solid ${BRAND.gray100}` : "none",
              }}
              onClick={() => setOpenSection(isOpen ? null : section.id)}
            >
              <span style={{
                ...S.sectionChip,
                background: partColor + "22",
                color: partColor,
                minWidth: 36, justifyContent: "center",
              }}>
                {section.id}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: BRAND.text, flex: 1 }}>
                {section.title}
              </span>
              <span style={{ fontSize: 12, color: BRAND.gray500, marginRight: 8 }}>
                {filled}/{total}
              </span>
              <div style={{ width: 80 }}>
                <ProgressBar pct={total === 0 ? 0 : Math.round(filled / total * 100)} color={partColor} />
              </div>
              <span style={{ fontSize: 16, color: BRAND.gray500, marginLeft: 8 }}>
                {isOpen ? "▲" : "▼"}
              </span>
            </div>
            {isOpen && (
              <div style={{ padding: "16px 20px 20px" }}>
                {section.questions.map((q, qi) => {
                  const key = `${section.id}_${q.slice(0, 30)}`;
                  return (
                    <div key={qi} style={{ marginBottom: 16 }}>
                      <label style={S.label}>
                        <span style={{ color: BRAND.gray500, fontWeight: 400, marginRight: 6 }}>{qi + 1}.</span>
                        {q}
                      </label>
                      <textarea
                        style={S.textarea}
                        value={answers[key] || ""}
                        placeholder="Enter your answer…"
                        onChange={e => onChange(key, e.target.value)}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── PROJECT LIST VIEW ─────────────────────────────────────────────
function ProjectList({ projects, onSelect, onCreateProject, onDeleteProject }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [client, setClient] = useState("");

  function handleCreate() {
    if (!name.trim()) return;
    onCreateProject(name.trim(), client.trim());
    setName(""); setClient(""); setShowModal(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={S.pageTitle}>Mendix on STACKIT</h1>
          <p style={S.pageSubtitle}>Intake workshop questionnaire · Manage projects</p>
        </div>
        <Btn onClick={() => setShowModal(true)}>+ New project</Btn>
      </div>

      {projects.length === 0 ? (
        <div style={{ ...S.card, ...S.emptyState }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: BRAND.text, marginBottom: 6 }}>No projects yet</div>
          <div style={{ marginBottom: 20 }}>Create a project to start a new migration intake.</div>
          <Btn onClick={() => setShowModal(true)}>+ Create first project</Btn>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {projects.map(p => {
            const progA = calcProgress(p.answersA, PART_A.sections);
            const progC = calcProgress(p.answersC, PART_C.sections);
            const appCount = p.apps.length;
            const appsComplete = p.apps.filter(a =>
              calcProgress(a.answers, PART_B_SECTIONS) === 100
            ).length;
            return (
              <div key={p.id} style={{ ...S.card, cursor: "pointer" }}
                onClick={() => onSelect(p.id)}>
                <div style={S.cardHeader}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 700, color: BRAND.text }}>{p.name}</div>
                    {p.client && <div style={{ fontSize: 13, color: BRAND.gray500 }}>{p.client}</div>}
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ fontSize: 12, color: BRAND.gray500 }}>
                      {new Date(p.createdAt).toLocaleDateString("en-GB")}
                    </span>
                    <button
                      style={{ ...S.btn, ...S.btnDanger, padding: "5px 10px", fontSize: 12 }}
                      onClick={e => { e.stopPropagation(); onDeleteProject(p.id); }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: BRAND.gray500, marginBottom: 4, fontWeight: 600 }}>PART A · Platform</div>
                    <ProgressBar pct={progA} color={BRAND.blue} />
                    <div style={{ fontSize: 11, color: BRAND.gray500, marginTop: 3 }}>{progA}% complete</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: BRAND.gray500, marginBottom: 4, fontWeight: 600 }}>PART B · Apps ({appCount})</div>
                    <ProgressBar pct={appCount === 0 ? 0 : Math.round(appsComplete / appCount * 100)} color={BRAND.green} />
                    <div style={{ fontSize: 11, color: BRAND.gray500, marginTop: 3 }}>{appsComplete}/{appCount} apps complete</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: BRAND.gray500, marginBottom: 4, fontWeight: 600 }}>PART C · Architecture</div>
                    <ProgressBar pct={progC} color={BRAND.purple} />
                    <div style={{ fontSize: 11, color: BRAND.gray500, marginTop: 3 }}>{progC}% complete</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <Modal title="New project" onClose={() => setShowModal(false)}>
          <div style={{ marginBottom: 14 }}>
            <label style={S.label}>Project name *</label>
            <input style={S.input} value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Acme Corp — STACKIT Migration"
              onKeyDown={e => e.key === "Enter" && handleCreate()} autoFocus />
          </div>
          <div style={{ marginBottom: 22 }}>
            <label style={S.label}>Client / organisation</label>
            <input style={S.input} value={client} onChange={e => setClient(e.target.value)}
              placeholder="e.g. Acme Corp" />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancel</Btn>
            <Btn onClick={handleCreate} disabled={!name.trim()}>Create project</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── PROJECT DETAIL ────────────────────────────────────────────────
function ProjectDetail({ project, onUpdate, onBack }) {
  // activePart: "A" | "B" | "C" | "B_<appId>"
  const [activePart, setActivePart] = useState("A");
  const [showAddApp, setShowAddApp] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [deleteAppId, setDeleteAppId] = useState(null);

  const progA = calcProgress(project.answersA, PART_A.sections);
  const progC = calcProgress(project.answersC, PART_C.sections);

  function handleAnswerA(key, val) {
    onUpdate({ ...project, answersA: { ...project.answersA, [key]: val } });
  }

  function handleAnswerC(key, val) {
    onUpdate({ ...project, answersC: { ...project.answersC, [key]: val } });
  }

  function handleAnswerB(appId, key, val) {
    const apps = project.apps.map(a =>
      a.id === appId ? { ...a, answers: { ...a.answers, [key]: val } } : a
    );
    onUpdate({ ...project, apps });
  }

  function addApp() {
    if (!newAppName.trim()) return;
    const apps = [...project.apps, makeApp(newAppName.trim())];
    onUpdate({ ...project, apps });
    setNewAppName(""); setShowAddApp(false);
  }

  function deleteApp(id) {
    const apps = project.apps.filter(a => a.id !== id);
    onUpdate({ ...project, apps });
    if (activePart === `B_${id}`) setActivePart("B");
    setDeleteAppId(null);
  }

  // Determine current view
  const isAppView = activePart.startsWith("B_");
  const activeApp = isAppView ? project.apps.find(a => a.id === activePart.slice(2)) : null;

  const overallSteps = [
    { id: "A", label: "Part A", sub: "Platform", prog: progA, color: BRAND.blue },
    { id: "B", label: "Part B", sub: "Per app", prog: project.apps.length === 0 ? 0 : Math.round(project.apps.filter(a => calcProgress(a.answers, PART_B_SECTIONS) === 100).length / project.apps.length * 100), color: BRAND.green },
    { id: "C", label: "Part C", sub: "Architecture", prog: progC, color: BRAND.purple },
  ];

  return (
    <div>
      {/* Breadcrumb in topbar is handled by parent */}

      {/* Step progress indicator */}
      <div style={S.stepIndicator}>
        {overallSteps.map((step, i) => {
          const isActive = activePart === step.id || (step.id === "B" && isAppView);
          return (
            <div
              key={step.id}
              style={{
                ...S.step,
                background: isActive ? step.color : BRAND.white,
                color: isActive ? BRAND.white : BRAND.gray500,
                borderRight: i < 2 ? `1px solid ${BRAND.gray100}` : "none",
                cursor: "pointer",
              }}
              onClick={() => setActivePart(step.id)}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>{step.label}</span>
                <span style={{
                  ...S.badge,
                  background: isActive ? "rgba(255,255,255,.25)" : BRAND.gray100,
                  color: isActive ? BRAND.white : BRAND.gray500,
                  fontSize: 10,
                }}>
                  {step.prog}%
                </span>
              </div>
              <span style={{ ...S.stepLabel, color: isActive ? "rgba(255,255,255,.75)" : BRAND.gray500 }}>
                {step.sub}
              </span>
            </div>
          );
        })}
      </div>

      {/* PART A */}
      {activePart === "A" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <h2 style={{ ...S.pageTitle, fontSize: 18 }}>Part A — Current landscape</h2>
              <p style={S.pageSubtitle}>Deviations from Mendix Cloud standard · platform-wide (once only)</p>
            </div>
            <div style={{
              ...S.sectionChip,
              background: BRAND.accent, color: BRAND.blue, fontSize: 13,
            }}>
              {progA}% complete
            </div>
          </div>
          <div style={{ ...S.card, background: BRAND.accent, border: "none", marginBottom: 20, fontSize: 13, color: BRAND.gray700 }}>
            {PART_A.description}
          </div>
          <QuestionForm
            sections={PART_A.sections}
            answers={project.answersA}
            onChange={handleAnswerA}
            partColor={BRAND.blue}
          />
          <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={() => setActivePart("B")}>Continue to Part B →</Btn>
          </div>
        </div>
      )}

      {/* PART B — app list */}
      {activePart === "B" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <h2 style={{ ...S.pageTitle, fontSize: 18 }}>Part B — Per-app inventory</h2>
              <p style={S.pageSubtitle}>Repeat for each Mendix app · add apps below</p>
            </div>
            <Btn variant="green" onClick={() => setShowAddApp(true)}>+ Add app</Btn>
          </div>

          {project.apps.length === 0 ? (
            <div style={{ ...S.card, ...S.emptyState }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📦</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: BRAND.text, marginBottom: 6 }}>No apps added yet</div>
              <div style={{ marginBottom: 18 }}>Add each Mendix app to complete the per-app inventory.</div>
              <Btn variant="green" onClick={() => setShowAddApp(true)}>+ Add first app</Btn>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {project.apps.map(app => {
                const prog = calcProgress(app.answers, PART_B_SECTIONS);
                return (
                  <div
                    key={app.id}
                    style={{ ...S.card, cursor: "pointer" }}
                    onClick={() => setActivePart(`B_${app.id}`)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 8,
                        background: BRAND.greenLight, display: "flex",
                        alignItems: "center", justifyContent: "center",
                        fontSize: 18, flexShrink: 0,
                      }}>
                        📦
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.text, marginBottom: 6 }}>
                          {app.name}
                        </div>
                        <ProgressBar pct={prog} color={BRAND.green} />
                        <div style={{ fontSize: 11, color: BRAND.gray500, marginTop: 3 }}>
                          {prog}% complete
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        {prog === 100 && (
                          <span style={{ ...S.tag, background: BRAND.greenLight, color: BRAND.green }}>
                            ✓ Done
                          </span>
                        )}
                        <button
                          style={{ ...S.btn, ...S.btnDanger, padding: "5px 10px", fontSize: 12 }}
                          onClick={e => { e.stopPropagation(); setDeleteAppId(app.id); }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
            <Btn variant="secondary" onClick={() => setActivePart("A")}>← Back to Part A</Btn>
            <Btn onClick={() => setActivePart("C")}>Continue to Part C →</Btn>
          </div>
        </div>
      )}

      {/* PART B — app detail */}
      {isAppView && activeApp && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <button
              style={{ ...S.btn, ...S.btnGhost, padding: "5px 12px", fontSize: 12 }}
              onClick={() => setActivePart("B")}
            >
              ← All apps
            </button>
            <div>
              <h2 style={{ ...S.pageTitle, fontSize: 18 }}>
                {activeApp.name}
              </h2>
              <p style={S.pageSubtitle}>Part B — per-app inventory</p>
            </div>
            <div style={{ marginLeft: "auto" }}>
              <span style={{
                ...S.sectionChip,
                background: BRAND.greenLight, color: BRAND.green, fontSize: 13,
              }}>
                {calcProgress(activeApp.answers, PART_B_SECTIONS)}% complete
              </span>
            </div>
          </div>
          <QuestionForm
            sections={PART_B_SECTIONS}
            answers={activeApp.answers}
            onChange={(key, val) => handleAnswerB(activeApp.id, key, val)}
            partColor={BRAND.green}
          />
          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
            <Btn variant="secondary" onClick={() => setActivePart("B")}>← Back to apps</Btn>
            {project.apps.indexOf(activeApp) < project.apps.length - 1 ? (
              <Btn variant="green"
                onClick={() => setActivePart(`B_${project.apps[project.apps.indexOf(activeApp) + 1].id}`)}>
                Next app →
              </Btn>
            ) : (
              <Btn onClick={() => setActivePart("C")}>Continue to Part C →</Btn>
            )}
          </div>
        </div>
      )}

      {/* PART C */}
      {activePart === "C" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <h2 style={{ ...S.pageTitle, fontSize: 18, color: BRAND.purple }}>Part C — Architecture decisions</h2>
              <p style={S.pageSubtitle}>For the new STACKIT environment · complete after Parts A and B</p>
            </div>
            <div style={{
              ...S.sectionChip,
              background: BRAND.purpleLight, color: BRAND.purple, fontSize: 13,
            }}>
              {progC}% complete
            </div>
          </div>
          <div style={{ ...S.card, background: BRAND.purpleLight, border: "none", marginBottom: 20, fontSize: 13, color: BRAND.gray700 }}>
            {PART_C.description}
          </div>
          <QuestionForm
            sections={PART_C.sections}
            answers={project.answersC}
            onChange={handleAnswerC}
            partColor={BRAND.purple}
          />
          <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between" }}>
            <Btn variant="secondary" onClick={() => setActivePart("B")}>← Back to Part B</Btn>
            <Btn variant="green">✓ Mark as complete</Btn>
          </div>
        </div>
      )}

      {/* Add app modal */}
      {showAddApp && (
        <Modal title="Add app" onClose={() => setShowAddApp(false)}>
          <div style={{ marginBottom: 20 }}>
            <label style={S.label}>App name *</label>
            <input style={S.input} value={newAppName}
              onChange={e => setNewAppName(e.target.value)}
              placeholder="e.g. Customer Portal"
              onKeyDown={e => e.key === "Enter" && addApp()}
              autoFocus />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setShowAddApp(false)}>Cancel</Btn>
            <Btn variant="green" onClick={addApp} disabled={!newAppName.trim()}>Add app</Btn>
          </div>
        </Modal>
      )}

      {/* Delete app confirm */}
      {deleteAppId && (
        <Modal title="Remove app?" onClose={() => setDeleteAppId(null)}>
          <p style={{ fontSize: 14, color: BRAND.gray700, marginBottom: 20 }}>
            This will permanently remove the app and all its answers. This cannot be undone.
          </p>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <Btn variant="secondary" onClick={() => setDeleteAppId(null)}>Cancel</Btn>
            <Btn variant="danger" onClick={() => deleteApp(deleteAppId)}>Remove app</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── ROOT APP ──────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState(() => loadProjects());
  const [activeProjectId, setActiveProjectId] = useState(null);

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  function createProject(name, client) {
    const p = makeProject(name, client);
    const updated = [...projects, p];
    setProjects(updated);
    setActiveProjectId(p.id);
  }

  function updateProject(updated) {
    setProjects(projects.map(p => p.id === updated.id ? updated : p));
  }

  function deleteProject(id) {
    setProjects(projects.filter(p => p.id !== id));
    if (activeProjectId === id) setActiveProjectId(null);
  }

  return (
    <div style={S.app}>
      {/* Top bar */}
      <div style={S.topbar}>
        <div style={S.topbarLeft}>
          <LinkitLogo size={28} />
          <div style={{ width: 1, height: 24, background: BRAND.gray100 }} />
          <div style={S.breadcrumb}>
            <span
              style={{ cursor: activeProject ? "pointer" : "default", color: activeProject ? BRAND.blue : BRAND.gray500, fontWeight: activeProject ? 500 : 400 }}
              onClick={() => setActiveProjectId(null)}
            >
              Projects
            </span>
            {activeProject && (
              <>
                <span style={S.breadcrumbSep}>›</span>
                <span style={S.breadcrumbActive}>{activeProject.name}</span>
              </>
            )}
          </div>
        </div>
        <div style={{ fontSize: 12, color: BRAND.gray500, fontWeight: 600, letterSpacing: .5 }}>
          MENDIX ON STACKIT
        </div>
      </div>

      {/* Main content */}
      <div style={S.main}>
        {!activeProject ? (
          <ProjectList
            projects={projects}
            onSelect={setActiveProjectId}
            onCreateProject={createProject}
            onDeleteProject={deleteProject}
          />
        ) : (
          <ProjectDetail
            project={activeProject}
            onUpdate={updateProject}
            onBack={() => setActiveProjectId(null)}
          />
        )}
      </div>
    </div>
  );
}
