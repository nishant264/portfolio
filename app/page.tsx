"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  GitBranch as Github, Link as Linkedin, Mail, ExternalLink, Download, Menu, X,
  Terminal, Cpu, Database, Code2, Zap, ArrowRight, ChevronRight,
  Play, Star, GitFork, Eye, MessageSquare, Clock,
  CheckCircle2, Circle, BookOpen, Send, MapPin, Briefcase,
  ArrowUpRight, Sparkles, Globe, Shield
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

const SKILLS = {
  "AI & Agents": {
    color: "#6366F1",
    icon: Cpu,
    items: ["LangGraph", "LangChain", "RAG Pipelines", "Prompt Engineering", "Gemini API", "OpenAI API"],
  },
  "Frontend & UI": {
    color: "#06B6D4",
    icon: Globe,
    items: ["React", "Next.js", "Tailwind CSS", "TypeScript", "Streamlit", "JavaScript"],
  },
  "Dev Tools": {
    color: "#8B5CF6",
    icon: Terminal,
    items: ["Git", "Docker", "Linux", "VS Code", "Vercel"],
  },
  "Vector & Data": {
    color: "#10B981",
    icon: Database,
    items: ["ChromaDB", "FAISS", "Pandas", "NumPy", "Matplotlib"],
  },
};

const PROJECTS = [
  {
    id: 1,
    title: "AI Customer Support Platform",
    tagline: "Multi-agent system that handles 80% of queries autonomously",
    description:
      "A production-grade customer support platform powered by LangGraph multi-agent workflows. Routes queries intelligently across specialized agents for FAQ, billing, and escalation — with full audit trails and human-in-the-loop fallback.",
    stack: ["LangGraph", "FastAPI", "ChromaDB", "Gemini API", "PostgreSQL", "Docker"],
    color: "#6366F1",
    accent: "from-indigo-500 to-violet-600",
    github: "https://github.com/nishant264",
    demo: "#",
    stats: { stars: 24, forks: 8 },
    challenges: [
      "Designing deterministic agent routing without hallucination",
      "Streaming partial responses to the UI under 200ms",
      "Managing context windows across multi-turn sessions",
    ],
    arch: ["User Query", "Router Agent", "FAQ Agent / Billing Agent / Escalation Agent", "ChromaDB + PostgreSQL", "Response"],
  },
  {
    id: 2,
    title: "Corrective RAG Agent",
    tagline: "Self-correcting RAG system with document grading & web search fallback",
    description:
      "A multi-stage Retrieval-Augmented Generation system powered by LangGraph. Grades retrieved document relevance using Claude 4.5 Sonnet, transforms query intent when needed, and dynamically falls back to Tavily web search when vector data is insufficient.",
    stack: ["LangGraph", "LangChain", "Qdrant", "Claude 4.5", "OpenAI Embeddings", "Tavily", "Streamlit"],
    color: "#10B981",
    accent: "from-emerald-500 to-teal-600",
    github: "https://github.com/nishant264/Corrective-_RAG",
    demo: "#",
    stats: { stars: 14, forks: 5 },
    challenges: [
      "Implementing deterministic relevance grading to eliminate hallucinations",
      "Orchestrating smooth transitions between Qdrant vector store and Tavily web search",
      "Building an interactive Streamlit UI showing real-time multi-agent decision steps",
    ],
    arch: ["User Query", "Qdrant Vector Store", "Claude 4.5 Relevance Grader", "Query Rewriter / Tavily Search", "Response Generator"],
  },
  {
    id: 3,
    title: "Gemini + MCP Playground",
    tagline: "Secure AI agent querying SQL databases via Model Context Protocol",
    description:
      "Full-stack AI data agent combining Google Gemini, Agno framework, and a custom Model Context Protocol (MCP) server. Executes natural language queries against SQLite with strict read-only security guardrails and single-click multi-format data exports.",
    stack: ["Google Gemini", "MCP Protocol", "Agno", "SQLite", "Python", "Streamlit"],
    color: "#F59E0B",
    accent: "from-amber-500 to-orange-600",
    github: "https://github.com/nishant264/MCP-Server-data-",
    demo: "#",
    stats: { stars: 16, forks: 6 },
    challenges: [
      "Enforcing SQL keyword blocking and multi-statement validation for read-only safety",
      "Building a custom local MCP server without third-party Docker or API bottlenecks",
      "Enabling instant agent-driven export to CSV, JSON, and Markdown formats",
    ],
    arch: ["Natural Language Input", "Streamlit Web App", "Gemini AI Agent (Agno)", "Custom MCP Server (Guardrails)", "SQLite Database"],
  },
];

const BLOGS = [
  {
    title: "Building a Multi-Agent Customer Support System with LangGraph",
    excerpt: "How I designed deterministic agent routing and avoided the top 5 hallucination failure modes in production.",
    date: "Jun 2025",
    readTime: "8 min",
    tag: "LangGraph",
    tagColor: "#6366F1",
    link: "#",
  },
  {
    title: "RAG vs Fine-tuning: A Practical Guide for Application Developers",
    excerpt: "Real benchmarks comparing RAG pipelines and fine-tuned models across latency, cost, and accuracy — with code.",
    date: "May 2025",
    readTime: "11 min",
    tag: "RAG",
    tagColor: "#06B6D4",
    link: "#",
  },
  {
    title: "Text-to-SQL at Scale: Lessons from Building an AI Data Analyst",
    excerpt: "Schema-aware prompting, join inference, and keeping hallucinations below 2% on a real production dataset.",
    date: "Apr 2025",
    readTime: "7 min",
    tag: "NLP",
    tagColor: "#8B5CF6",
    link: "#",
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
    ["Multi-Agent Workflows.", "RAG Pipelines.", "LLM Applications.", "Intelligent Automation."],
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
          AI & DS student @ JECRC Foundation. I build agentic AI systems that actually ship — from RAG
          pipelines to multi-agent orchestration.
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
          <a href="https://linkedin.com/in/nishant-sanwaria" className="btn-ghost" target="_blank" rel="noopener noreferrer">
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
            { label: "Projects Shipped", value: "6+" },
            { label: "GitHub Stars", value: "73+" },
            { label: "AI APIs Integrated", value: "4" },
            { label: "LLM Frameworks", value: "3" },
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
              I'm a B.Tech AI & DS student at JECRC Foundation, Jaipur, passionate about building practical
              AI systems that go beyond demos. I work with multi-agent orchestration, RAG pipelines, and
              LLM-backed APIs — focusing on reliability, latency, and real-world deployability.
            </motion.p>
            <motion.p
              variants={fadeUp}
              style={{ color: "var(--text-muted)", lineHeight: 1.75, fontSize: 15, marginBottom: 32 }}
            >
              When I'm not shipping side projects, I'm preparing for campus placements,
              writing technical blogs, and contributing to open-source AI tooling.
            </motion.p>
            <motion.div variants={fadeUp} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { icon: MapPin, text: "Jaipur, Rajasthan, India" },
                { icon: Briefcase, text: "Open to full-time / internship roles" },
                { icon: BookOpen, text: "B.Tech AI & DS — JECRC Foundation (2025)" },
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
            ].map((card, i) => (
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
          {Object.entries(SKILLS).map(([category, { color, icon: Icon, items }], ci) => (
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
  const [activeProject, setActiveProject] = useState<number | null>(null);

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
              onClick={() => setActiveProject(activeProject === project.id ? null : project.id)}
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
                      <Zap size={11} color={project.color} />
                      <span style={{ fontSize: 11, color: project.color, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                        AI Project {String(i + 1).padStart(2, "0")}
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
                    <p style={{ fontSize: 14, color: project.color, fontWeight: 500, marginBottom: 14 }}>
                      {project.tagline}
                    </p>
                    <p style={{ fontSize: 14.5, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 640 }}>
                      {project.description}
                    </p>
                  </div>

                  {/* Stats */}
                  <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 13 }}>
                      <Star size={13} />
                      {project.stats.stars}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, color: "var(--text-muted)", fontSize: 13 }}>
                      <GitFork size={13} />
                      {project.stats.forks}
                    </div>
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
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ padding: "7px 14px", fontSize: 13 }}
                  >
                    <Github size={14} /> Code
                  </a>
                  <a
                    href={project.demo}
                    onClick={(e) => e.stopPropagation()}
                    className="btn-primary"
                    style={{ padding: "7px 14px", fontSize: 13 }}
                  >
                    <Play size={13} /> Live Demo
                  </a>
                  <button
                    style={{
                      marginLeft: "auto",
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                      fontSize: 13,
                    }}
                  >
                    {activeProject === project.id ? "Show less" : "Architecture & challenges"}
                    <ChevronRight
                      size={14}
                      style={{ transform: activeProject === project.id ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                    />
                  </button>
                </div>
              </div>

              {/* Expandable section */}
              <AnimatePresence>
                {activeProject === project.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                    style={{ overflow: "hidden" }}
                  >
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

                      {/* Challenges */}
                      <div>
                        <p className="label" style={{ marginBottom: 16 }}>Engineering challenges</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {project.challenges.map((c, ci) => (
                            <div key={ci} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                              <div className="timeline-dot" style={{ marginTop: 4 }} />
                              <span style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.6 }}>{c}</span>
                            </div>
                          ))}
                        </div>

                        {/* Placeholder screenshot zone */}
                        <div style={{
                          marginTop: 20,
                          background: "var(--bg)",
                          border: "1px dashed var(--border)",
                          borderRadius: 12,
                          padding: "24px",
                          textAlign: "center",
                          color: "var(--text-muted)",
                          fontSize: 13,
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        }}>
                          <Eye size={14} />
                          Screenshots / demo video
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BlogSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="blog" className="section" style={{ padding: "6rem 24px", background: "rgba(255,255,255,0.01)" }}>
      <div ref={ref} style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}
        >
          <div>
            <p className="label-accent" style={{ marginBottom: 12 }}>Writing</p>
            <h2 style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.4rem)", fontWeight: 700, letterSpacing: "-0.04em" }}>
              From the blog
            </h2>
          </div>
          <a href="#" className="btn-ghost" style={{ fontSize: 13, padding: "8px 16px" }}>
            All posts <ArrowUpRight size={14} />
          </a>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}
        >
          {BLOGS.map((post, i) => (
            <motion.a
              key={post.title}
              href={post.link}
              variants={fadeUp}
              className="blog-card"
              style={{ textDecoration: "none", display: "block" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8 }}>
                <span style={{
                  padding: "3px 10px",
                  background: `${post.tagColor}12`,
                  border: `1px solid ${post.tagColor}25`,
                  borderRadius: 6,
                  fontSize: 11,
                  color: post.tagColor,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  {post.tag}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 12, color: "var(--text-muted)", fontSize: 12 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={12} /> {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
              </div>

              <h3 style={{
                fontSize: 15.5,
                fontWeight: 650,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: 10,
                lineHeight: 1.4,
              }}>
                {post.title}
              </h3>
              <p style={{ fontSize: 13.5, color: "var(--text-muted)", lineHeight: 1.65 }}>
                {post.excerpt}
              </p>

              <div style={{
                display: "flex", alignItems: "center", gap: 5,
                color: post.tagColor, fontSize: 13, fontWeight: 500, marginTop: 18,
              }}>
                Read article <ArrowRight size={13} />
              </div>
            </motion.a>
          ))}
        </motion.div>
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
            Let's build something together
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
              { icon: Mail, label: "Email", value: "nishant@example.com", href: "mailto:nishant@example.com", color: "#6366F1" },
              { icon: Linkedin, label: "LinkedIn", value: "/in/nishant-sanwaria", href: "https://linkedin.com/in/nishant-sanwaria", color: "#06B6D4" },
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
                    Sent! I'll get back to you within 24 hours.
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
          <a href="#" target="_blank" rel="noopener noreferrer" className="footer-link">LinkedIn</a>
          <a href="mailto:nishant@example.com" className="footer-link">Email</a>
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
        <SkillsSection />
        <ProjectsSection />
        <BlogSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
