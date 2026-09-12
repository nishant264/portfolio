"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  GitBranch as Github, Link as Linkedin, Mail, ExternalLink, Download, Menu, X,
  Terminal, Cpu, Database, Code2, Zap, ArrowRight, ChevronRight,
  CheckCircle2, BookOpen, Send, MapPin, Briefcase,
  ArrowUpRight, Sparkles, Globe
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

const SKILLS = {
  "AI & Agents": {
    color: "#6366F1",
    icon: Cpu,
    items: ["LangGraph", "LangChain", "Agency Swarm", "Agno", "RAG Pipelines", "Prompt Engineering", "Groq API", "Gemini API", "OpenAI API"],
  },
  "Frontend & UI": {
    color: "#06B6D4",
    icon: Globe,
    items: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Streamlit", "JavaScript"],
  },
  "Backend & APIs": {
    color: "#8B5CF6",
    icon: Code2,
    items: ["Python", "FastAPI", "REST APIs", "Pydantic", "PostgreSQL", "Prisma", "SQLite", "Stripe API"],
  },
  "Vector & Data": {
    color: "#10B981",
    icon: Database,
    items: ["ChromaDB", "Qdrant", "FAISS", "OpenAI Embeddings", "Pandas", "NumPy", "Matplotlib"],
  },
  "Developer Workflow": {
    color: "#F59E0B",
    icon: Terminal,
    items: ["Git", "GitHub", "Docker", "Linux", "Vercel", "Streamlit Cloud", "pytest"],
  },
};const PROJECTS = [
  {
    id: 1,
    title: "AI Revenue Recovery Agent",
    tagline: "Autonomous agent that detects, diagnoses, and recovers at-risk payment revenue",
    description:
      "Built for the Razorpay Buildathon (Track 03): an agent pipeline — Detect → Diagnose → Decide → Gate → Execute → Verify → Report — that catches failing payment revenue, forms an LLM root-cause hypothesis, picks one bounded recovery action, and hard-blocks fraud-flagged cases from ever being auto-retried. Only two stages touch an LLM; every safety boundary is deterministic code. On a 100-scenario synthetic batch it recovered ₹1.66 Cr at a 71.1% recovery rate with a 100% fraud hold-back rate and zero agent errors.",
    stack: ["Groq (Llama 3.3 70B)", "Python", "LLM Orchestration", "Deterministic Guardrails", "Synthetic Data Eval"],
    color: "#F43F5E",
    github: "https://github.com/nishant264/ai-revenue-recovery-agent-",
    year: "2026",
    badge: "Razorpay Buildathon",
    highlights: [
      "71.1% revenue recovered on a 100-scenario eval",
      "100% fraud hold-back rate — policy gate overrides the LLM",
      "Full per-case audit trail with 0% agent error",
    ],
    arch: ["At-Risk Payment Data", "Detect (deterministic)", "Diagnose (Groq LLM)", "Decide + Policy Gate", "Execute → Verify → Audit Report"],
  },
  {
    id: 2,
    title: "AI Mock Interview Coach",
    tagline: "Adaptive multi-agent interview simulator that coaches you like a real interviewer",
    description:
      "Four specialized LLM agents (interviewer, prober, scorer, report writer) coordinated by a deterministic orchestrator run an adaptive 5–7 question interview that probes weak answers and escalates strong ones. Every agent contract is validated JSON with one-retry repair, a code-level scoring guard keeps small models honest, and live sessions degrade gracefully instead of failing — ending in a structured coaching report with a 7-day practice plan.",
    stack: ["Groq", "OpenAI API", "Python", "Streamlit", "pytest"],
    color: "#6366F1",
    github: "https://github.com/nishant264/ai-mock-interview-coach",
    demo: "https://ai-mock-interview-coach-jrwlojurutjeshj69zutyz.streamlit.app/",
    year: "2026",
    highlights: [
      "4 specialized agents + deterministic orchestrator",
      "Validated JSON agent contracts with retry repair",
      "24 passing tests · live on Streamlit Cloud",
    ],
    arch: ["Candidate Answer", "Interviewer Agent", "Prober / Scorer Agents", "Deterministic Orchestrator", "Coaching Report + 7-Day Plan"],
  },
  {
    id: 3,
    title: "Autonomous Backend Architecture Swarm",
    tagline: "Multi-agent system that autonomously generates complete backend plans from a product idea",
    description:
      "A three-agent AI system powered by Agency Swarm that takes a product idea and autonomously produces a complete backend plan — from feature requirements through system architecture to deployment infrastructure. Features structured multi-agent orchestration with dependency-gated task handoffs between Product Manager, Systems Architect, and DevOps Engineer agents, plus shared context state and full conversation logging.",
    stack: ["Agency Swarm", "Python", "Pydantic", "OpenAI API", "Streamlit"],
    color: "#8B5CF6",
    github: "https://github.com/nishant264/agentic_service",
    year: "2026",
    highlights: [
      "Dependency-gated task handoffs between 3 agents",
      "Pydantic-validated tools with shared context state",
      "Structured persona + constraints prompt architecture",
    ],
    arch: ["Product Idea", "Product Manager (DefineRequirements)", "Systems Architect (DesignArchitecture)", "DevOps Engineer (PlanDeployment)", "Complete Backend Spec"],
  },
  {
    id: 4,
    title: "Corrective RAG Agent",
    tagline: "Self-correcting RAG system with document grading & web search fallback",
    description:
      "A multi-stage Retrieval-Augmented Generation system powered by LangGraph. Grades retrieved document relevance using Llama 3.3 70B via Groq, transforms query intent when needed, and dynamically falls back to Tavily web search when vector data is insufficient.",
    stack: ["LangGraph", "LangChain", "Qdrant", "Groq (Llama 3.3 70B)", "HuggingFace", "Tavily", "Streamlit"],
    color: "#10B981",
    github: "https://github.com/nishant264/Corrective-_RAG",
    year: "2026",
    highlights: [
      "Deterministic relevance grading to eliminate hallucinations",
      "Smooth Qdrant → Tavily web search fallback",
      "Streamlit UI showing real-time agent decision steps",
    ],
    arch: ["User Query", "Qdrant Vector Store", "Groq (Llama 3.3 70B) Relevance Grader", "Query Rewriter / Tavily Search", "Response Generator"],
  },
  {
    id: 5,
    title: "Groq + MCP Playground",
    tagline: "Secure AI agent querying SQL databases via Model Context Protocol",
    description:
      "Full-stack AI data agent combining Groq (Llama 3.3 70B), Agno framework, and direct database tools. Executes natural language queries against SQLite with strict read-only security guardrails and single-click multi-format data exports.",
    stack: ["Groq", "Agno", "SQLite", "Python", "Streamlit"],
    color: "#F59E0B",
    github: "https://github.com/nishant264/MCP-Server-data-",
    year: "2026",
    highlights: [
      "SQL keyword blocking + multi-statement validation",
      "Strict read-only security guardrails on every tool",
      "Agent-driven export to CSV, JSON, and Markdown",
    ],
    arch: ["Natural Language Input", "Streamlit Web App", "Groq AI Agent (Agno)", "Database Tools (Guardrails)", "SQLite Database"],
  },
  {
    id: 6,
    title: "OpenClaw-lite — Data Analysis Agent",
    tagline: "Agentic AI that turns plain English into Python that cleans and analyzes your data",
    description:
      "A lightweight autonomous agent powered by Google Gemini 2.5 Flash that takes natural-language instructions and executes them on real files: it writes and runs Python (pandas/numpy) on the fly, reads CSVs and datasets, and writes back cleaned data and analysis reports. A clean three-tool action loop (run_python / read_file / write_file) with JSON-routed decisions keeps the agent predictable.",
    stack: ["Google Gemini", "Python", "Pandas", "NumPy", "JSON Tooling"],
    color: "#06B6D4",
    github: "https://github.com/nishant264/agentic_ai",
    year: "2026",
    highlights: [
      "Natural language → executed Python scripts",
      "Three-tool action loop with JSON-routed decisions",
      "Reads CSVs, writes reports and cleaned datasets",
    ],
    arch: ["Natural Language Input", "Gemini 2.5 Flash (JSON Decision)", "Tool Router", "run_python / read_file / write_file", "Report / Cleaned Data"],
  },
  {
    id: 7,
    title: "AI Resume Analyzer",
    tagline: "NLP resume analysis and ATS scoring against any job description — fully local",
    description:
      "Upload a PDF resume and get an instant spaCy-powered analysis: section extraction, skill matching against a curated database, resume strength and skill scores, and qualitative strengths/weaknesses. Paste a job description and it computes ATS-style matching with TF-IDF + cosine similarity, a blended ATS score, and a skill-gap analysis with recommendations. Runs entirely locally — no paid APIs.",
    stack: ["spaCy", "Python", "Streamlit", "PyPDF2", "scikit-learn"],
    color: "#EC4899",
    github: "https://github.com/nishant264/AI_resumeanalyzer",
    year: "2026",
    highlights: [
      "TF-IDF + cosine similarity JD matching",
      "ATS score: 60% match + 40% keyword coverage",
      "100% local — no paid APIs, with a test suite",
    ],
    arch: ["PDF Resume Upload", "PyPDF2 Text Extraction", "spaCy NLP Analysis Engine", "JD Matcher (TF-IDF)", "Scores + Skill Gap Report"],
  },
  {
    id: 8,
    title: "NextStore — Full-Stack eCommerce",
    tagline: "Production-grade eCommerce platform with Stripe payments and admin analytics",
    description:
      "A complete Next.js 16 eCommerce build: persistent guest + authenticated carts, multi-step Stripe checkout with webhooks, full order lifecycle, NextAuth v5 credentials + Google OAuth, verified-purchase reviews, coupons, and an admin dashboard with revenue charts and inventory tracking. Hardened with rate limiting, CSP headers, CSRF protection, and input validation; deployable on Vercel or Docker.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Prisma", "PostgreSQL", "Stripe", "NextAuth v5", "Tailwind CSS"],
    color: "#3B82F6",
    github: "https://github.com/nishant264/nextstore",
    year: "2026",
    highlights: [
      "Stripe Payment Intents + webhooks",
      "NextAuth v5 — credentials + Google OAuth",
      "Admin dashboard with revenue analytics",
      "Rate limiting, CSP & CSRF protection",
    ],
    arch: ["Storefront (Next.js 16)", "NextAuth v5 / API Routes", "Stripe Checkout + Webhooks", "Prisma ORM", "PostgreSQL 16"],
  },
  {
    id: 9,
    title: "Agentic Data Analyst",
    tagline: "A LangGraph build: an autonomous data analyst with state, tools, and reflection",
    description:
      "A ground-up LangGraph agent built to master core agentic concepts: typed agent state, LLM integration, tool calling, graph nodes and conditional edges, plus a reflection loop where the agent checks and corrects its own analysis before answering. Structured as a learn-by-building project with every concept mapped to a single file.",
    stack: ["LangGraph", "Python", "LLM Tool Calling"],
    color: "#14B8A6",
    github: "https://github.com/nishant264/junior_data-analyst",
    year: "2026",
    highlights: [
      "LangGraph state, nodes & conditional edges",
      "Self-reflection loop for error correction",
      "Every agentic concept mapped to a file",
    ],
    arch: ["Question / Dataset", "LLM Node (Plan)", "Tool Node (Act)", "Reflect Node (Self-Check)", "Analysis Answer"],
  },
];


/* ── Animation variants ────────────────────────────────────── */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fadeUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

/* ── Hooks ─────────────────────────────────────────────────── */
function useTypewriter(texts: string[], speed = 60, pause = 2000) {
  const [displayText, setDisplayText] = useState("");
  const [textIdx, setTextIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[textIdx];
    const timeout = setTimeout(
      () => {
        if (!deleting) {
          if (charIdx < current.length) {
            setDisplayText(current.slice(0, charIdx + 1));
            setCharIdx((c) => c + 1);
          } else {
            setTimeout(() => setDeleting(true), pause);
          }
        } else {
          if (charIdx > 0) {
            setDisplayText(current.slice(0, charIdx - 1));
            setCharIdx((c) => c - 1);
          } else {
            setDeleting(false);
            setTextIdx((i) => (i + 1) % texts.length);
          }
        }
      },
      deleting ? speed / 2 : speed
    );
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return displayText;
}

/* ── Sub-components ────────────────────────────────────────── */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: "0 24px",
          height: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
          transition: "background 0.3s, backdrop-filter 0.3s, border-color 0.3s",
          maxWidth: "100vw",
        }}
      >
        {/* Logo */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #6366F1, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={16} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            nishant.dev
          </span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: 32, alignItems: "center" }} className="hidden-mobile">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }} className="hidden-mobile">
          <a href="#contact" className="btn-primary" style={{ padding: "8px 16px", fontSize: 13 }}>
            Hire Me <ArrowRight size={14} />
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: 4 }}
          className="show-mobile"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mobile-menu"
            style={{
              position: "fixed",
              top: 60,
              left: 0,
              right: 0,
              zIndex: 99,
              padding: "16px 24px 24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  style={{
                    padding: "12px 0",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: 500,
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  {l.label}
                </a>
              ))}
              <a href="#contact" className="btn-primary" style={{ marginTop: 16, justifyContent: "center" }}>
                Hire Me <ArrowRight size={14} />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (min-width: 769px) { .show-mobile { display: none !important; } }
        @media (max-width: 768px) { .hidden-mobile { display: none !important; } }
      `}</style>
    </>
  );
}

function HeroSection() {
  const typed = useTypewriter(
    ["Agentic AI Systems.", "RAG Pipelines.", "Multi-Agent Orchestration.", "Full-Stack AI Products."],
    55,
    1800
  );

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "0 24px",
        paddingTop: 80,
      }}
    >
      {/* Ambient orbs */}
      <div
        className="orb"
        style={{
          width: 600, height: 600,
          background: "radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)",
          top: "10%", left: "50%", transform: "translateX(-50%)",
        }}
      />
      <div
        className="orb"
        style={{
          width: 400, height: 400,
          background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          bottom: "20%", right: "-10%",
        }}
      />
      <div
        className="orb"
        style={{
          width: 300, height: 300,
          background: "radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)",
          top: "30%", left: "-5%",
        }}
      />

      {/* Grid lines background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)",
        backgroundSize: "80px 80px",
      }} />

      <div style={{ maxWidth: 860, width: "100%", textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: 99,
            marginBottom: 32,
          }}
        >
          <span style={{ position: "relative", display: "inline-flex" }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#10B981",
              display: "inline-block",
            }} />
            <span
              className="ping-slow"
              style={{
                position: "absolute", inset: 0, width: 8, height: 8,
                borderRadius: "50%", background: "#10B981",
              }}
            />
          </span>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: "#10B981" }}>
            Available for full-time roles
          </span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 1.08,
            marginBottom: 12,
            color: "var(--text-primary)",
          }}
        >
          Nishant Sanwaria
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          style={{
            fontSize: "clamp(1.5rem, 4vw, 2.6rem)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            marginBottom: 24,
            color: "var(--text-secondary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 0,
            flexWrap: "wrap",
          }}
        >
          <span style={{ marginRight: 8 }}>Building</span>
          <span className="gradient-text-2" style={{ minWidth: "min(520px, 90vw)", textAlign: "left" }}>
            {typed}
          </span>
          <span className="cursor-blink" />
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          style={{
            fontSize: "clamp(15px, 2vw, 17px)",
            color: "var(--text-muted)",
            maxWidth: 560,
            margin: "0 auto 40px",
            lineHeight: 1.65,
            letterSpacing: "0.01em",
          }}
        >
          AI & DS undergrad @ JECRC Foundation. I build agentic AI systems that actually ship — from
          deterministic-guardrailed agent pipelines to full-stack AI products.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}
        >
          <a href="/resume.pdf" className="btn-primary" download>
            <Download size={15} /> Resume
          </a>
          <a href="https://github.com/nishant264" className="btn-ghost" target="_blank" rel="noopener noreferrer">
            <Github size={15} /> GitHub
          </a>
          <a href="https://www.linkedin.com/in/nishantsanwaria/" className="btn-ghost" target="_blank" rel="noopener noreferrer">
            <Linkedin size={15} /> LinkedIn
          </a>
          <a href="#contact" className="btn-ghost">
            <Mail size={15} /> Contact
          </a>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          style={{
            display: "flex",
            gap: 0,
            justifyContent: "center",
            marginTop: 64,
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "Projects Shipped", value: "9" },
            { label: "AI Agents Built", value: "15+" },
            { label: "Live Demos Deployed", value: "2" },
            { label: "LLM Frameworks", value: "4" },
          ].map((s, i) => (
            <div
              key={s.label}
              style={{
                padding: "20px 32px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
                textAlign: "center",
              }}
            >
              <div className="stat-number">{s.value}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, letterSpacing: "0.05em" }}>
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          color: "var(--text-muted)", fontSize: 11, letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronRight size={16} style={{ transform: "rotate(90deg)" }} />
        </motion.div>
      </motion.div>
    </section>
  );
}

function AboutSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="section" style={{ padding: "6rem 24px" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 48,
            alignItems: "center",
          }}
        >
          {/* Left */}
          <div>
            <motion.p variants={fadeUp} className="label-accent" style={{ marginBottom: 16 }}>
              About me
            </motion.p>
            <motion.h2
              variants={fadeUp}
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.6rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                marginBottom: 24,
                lineHeight: 1.1,
              }}
            >
              Turning LLMs into<br />
              <span className="gradient-text">production systems</span>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              style={{ color: "var(--text-secondary)", lineHeight: 1.75, fontSize: 15.5, marginBottom: 20 }}
            >
              I&apos;m a B.Tech AI &amp; DS student at JECRC Foundation, Jaipur, focused on building agentic AI
              systems that survive contact with production. Recent work spans deterministic-guardrailed
              agent pipelines, corrective RAG, and a full-stack eCommerce platform — always with evals,
              guardrails, and deployability in mind.
            </motion.p>
            <motion.p
              variants={fadeUp}
              style={{ color: "var(--text-muted)", lineHeight: 1.75, fontSize: 15, marginBottom: 32 }}
            >
              When I&apos;m not shipping side projects, I&apos;m preparing for campus placements,
              writing technical blogs, and contributing to open-source AI tooling.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: MapPin, text: "Jaipur, Rajasthan, India" },
                { icon: Briefcase, text: "Open to full-time / internship roles" },
                { icon: BookOpen, text: "B.Tech AI & DS — JECRC Foundation (2023–2027)" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-muted)", fontSize: 14 }}>
                  <Icon size={15} color="#6366F1" />
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                icon: Cpu,
                title: "AI Agent Developer",
                desc: "Specialising in LangGraph multi-agent systems with deterministic routing and human-in-the-loop fallback.",
                color: "#6366F1",
              },
              {
                icon: Database,
                title: "RAG Architect",
                desc: "Designing retrieval pipelines over real documents — chunking strategies, embedding models, FAISS & ChromaDB.",
                color: "#06B6D4",
              },
              {
                icon: Globe,
                title: "Frontend & UI Developer",
                desc: "Creating responsive web interfaces and interactive AI dashboards using React, Next.js, and Streamlit.",
                color: "#8B5CF6",
              },
            ].map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                className="glass"
                style={{ padding: "20px 24px", display: "flex", gap: 16, alignItems: "flex-start" }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${card.color}18`,
                  border: `1px solid ${card.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  <card.icon size={18} color={card.color} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14.5, marginBottom: 6, color: "var(--text-primary)" }}>
                    {card.title}
                  </div>
                  <div style={{ color: "var(--text-muted)", fontSize: 13.5, lineHeight: 1.6 }}>
                    {card.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SkillsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="section" style={{ padding: "6rem 24px", background: "rgba(255,255,255,0.01)" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p className="label-accent" style={{ marginBottom: 12 }}>Technical skills</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.04em" }}>
            Tools of the trade
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 20,
          }}
        >
          {Object.entries(SKILLS).map(([category, { color, icon: Icon, items }]) => (
            <motion.div
              key={category}
              variants={fadeUp}
              className="glass"
              style={{ padding: "28px 24px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: `${color}18`, border: `1px solid ${color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} color={color} />
                </div>
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)" }}>{category}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {items.map((item) => (
                  <span key={item} className="skill-chip">{item}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ArchDiagram({ nodes, color }: { nodes: string[]; color: string }) {
  return (
    <div style={{
      background: "var(--bg)",
      borderRadius: 12,
      padding: "20px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 6,
      alignItems: "center",
    }}>
      {nodes.map((node, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: "100%" }}>
          {node.includes("/") ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              {node.split("/").map((n) => (
                <div key={n} className="arch-node" style={{ borderColor: `${color}30`, flex: 1 }}>{n.trim()}</div>
              ))}
            </div>
          ) : (
            <div
              className="arch-node"
              style={{
                width: "100%",
                borderColor: i === 0 || i === nodes.length - 1 ? `${color}50` : "rgba(99,102,241,0.2)",
                background: i === 0 || i === nodes.length - 1 ? `${color}12` : "var(--bg-card-2)",
                color: i === 0 || i === nodes.length - 1 ? color : "var(--text-secondary)",
              }}
            >
              {node}
            </div>
          )}
          {i < nodes.length - 1 && (
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 1, height: 14, background: `${color}40` }} />
              <ChevronRight size={12} color={color} style={{ transform: "rotate(90deg)" }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ProjectsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id="projects" className="section" style={{ padding: "6rem 24px" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p className="label-accent" style={{ marginBottom: 12 }}>Featured work</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.04em" }}>
            Projects that ship
          </h2>
          <p style={{ color: "var(--text-muted)", marginTop: 12, fontSize: 15 }}>
            Production-ready AI systems, not just hackathon prototypes.
          </p>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.55, ease: "easeOut" }}
              className="project-card"
            >
              {/* Card header */}
              <div style={{ padding: "28px 32px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "3px 10px",
                      background: `${project.color}12`,
                      border: `1px solid ${project.color}25`,
                      borderRadius: 6,
                      marginBottom: 12,
                    }}>
                      <Zap size={12} color={project.color} />
                      <span style={{ fontSize: 12, color: project.color, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        {project.badge ?? `AI Project ${String(i + 1).padStart(2, "0")}`}
                      </span>
                    </div>

                    <h3 style={{
                      fontSize: "clamp(1.2rem, 2.5vw, 1.55rem)",
                      fontWeight: 700,
                      letterSpacing: "-0.03em",
                      marginBottom: 8,
                      color: "var(--text-primary)",
                    }}>
                      {project.title}
                    </h3>
                    <p style={{ fontSize: 15.5, color: project.color, fontWeight: 500, marginBottom: 14 }}>
                      {project.tagline}
                    </p>
                    <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.75, maxWidth: 640 }}>
                      {project.description}
                    </p>
                  </div>

                  {/* Highlights */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 7,
                      alignItems: "flex-start",
                      minWidth: 220,
                      flexShrink: 0,
                    }}
                  >
                    {project.highlights.map((h) => (
                      <div key={h} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                        <CheckCircle2 size={15} color={project.color} style={{ marginTop: 2, flexShrink: 0 }} />
                        <span style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.55 }}>{h}</span>
                      </div>
                    ))}
                    <span
                      style={{
                        marginTop: 2,
                        fontSize: 12,
                        color: "var(--text-muted)",
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        fontWeight: 600,
                      }}
                    >
                      {project.year}
                    </span>
                  </div>
                </div>

                {/* Tech stack */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 20 }}>
                  {project.stack.map((t) => (
                    <span key={t} className="tech-badge">{t}</span>
                  ))}
                </div>

                {/* Action row */}
                <div style={{ display: "flex", gap: 10, marginTop: 20, alignItems: "center", flexWrap: "wrap" }}>
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ padding: "8px 16px", fontSize: 14 }}
                  >
                    <Github size={14} /> GitHub
                  </a>
                  {project.demo && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                      style={{ padding: "8px 16px", fontSize: 14 }}
                    >
                      <ExternalLink size={14} /> Live Demo
                    </a>
                  )}
                </div>
              </div>

              {/* Expandable section */}
              <div>
                    <div style={{
                      borderTop: "1px solid var(--border)",
                      padding: "28px 32px",
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                      gap: 32,
                    }}>
                      {/* Architecture */}
                      <div>
                        <p className="label" style={{ marginBottom: 16 }}>Architecture</p>
                        <ArchDiagram nodes={project.arch} color={project.color} />
                      </div>

                      {/* Engineering notes */}
                      <div>
                        <p className="label" style={{ marginBottom: 16 }}>Engineering notes</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {project.highlights.map((c: string, ci: number) => (
                            <div key={ci} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                              <div className="timeline-dot" style={{ marginTop: 4 }} />
                              <span style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.65 }}>{c}</span>
                            </div>
                          ))}
                        </div>

                    </div>
                    </div>
                  </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="section" style={{ padding: "6rem 24px" }}>
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ textAlign: "center", marginBottom: 56 }}
        >
          <p className="label-accent" style={{ marginBottom: 12 }}>Get in touch</p>
          <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.04em", marginBottom: 14 }}>
            Let&apos;s build something together
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: 15, maxWidth: 480, margin: "0 auto" }}>
            Open to full-time roles, internships, and interesting projects. I respond within 24 hours.
          </p>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {/* Contact links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: 14 }}
          >
            <p style={{ color: "var(--text-secondary)", fontSize: 14.5, lineHeight: 1.7, marginBottom: 8 }}>
              Whether you have a role to fill, a project idea, or just want to talk AI —
              my inbox is always open.
            </p>

            {[
              { icon: Mail, label: "Email", value: "sanwarianishant@gmail.com", href: "mailto:sanwarianishant@gmail.com", color: "#6366F1" },
              { icon: Linkedin, label: "LinkedIn", value: "/in/nishantsanwaria", href: "https://www.linkedin.com/in/nishantsanwaria/", color: "#06B6D4" },
              { icon: Github, label: "GitHub", value: "github.com/nishant264", href: "https://github.com/nishant264", color: "#8B5CF6" },
            ].map(({ icon: Icon, label, value, href, color }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="glass"
                style={{
                  padding: "16px 18px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: `${color}14`, border: `1px solid ${color}25`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={17} color={color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2, letterSpacing: "0.04em" }}>{label}</div>
                  <div style={{ fontSize: 13.5, color: "var(--text-primary)", fontWeight: 500 }}>{value}</div>
                </div>
                <ArrowUpRight size={14} color="var(--text-muted)" style={{ marginLeft: "auto" }} />
              </a>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="glass"
            style={{ padding: "28px 28px", borderRadius: 20 }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input
                className="contact-input"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="contact-input"
                placeholder="Email address"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <textarea
                className="contact-input"
                placeholder="Tell me about your project or role..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
              <AnimatePresence mode="wait">
                {sent ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "12px 16px",
                      background: "rgba(16,185,129,0.1)",
                      border: "1px solid rgba(16,185,129,0.25)",
                      borderRadius: 10,
                      color: "#10B981",
                      fontSize: 14,
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle2 size={16} />
                    Sent! I&apos;ll get back to you within 24 hours.
                  </motion.div>
                ) : (
                  <motion.button
                    key="btn"
                    className="btn-primary"
                    onClick={handleSubmit}
                    style={{ justifyContent: "center", padding: "12px" }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Send size={15} /> Send message
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "28px 24px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 7,
            background: "linear-gradient(135deg, #6366F1, #06B6D4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            Nishant Sanwaria · {new Date().getFullYear()}
          </span>
        </div>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <a href="https://github.com/nishant264" target="_blank" rel="noopener noreferrer" className="footer-link">GitHub</a>
          <a href="https://www.linkedin.com/in/nishantsanwaria/" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="mailto:sanwarianishant@gmail.com" className="footer-link">Email</a>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
            Built with Next.js + Tailwind
          </span>
        </div>
      </div>
    </footer>
  );
}

/* ── Main export ───────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
