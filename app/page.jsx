"use client";

import { useEffect, useRef, useState } from "react";
import { COPY } from "../components/copy";
import MultiStepForm from "../components/MultiStepForm";

const FRAME_COUNT = 66;
const framePath = (i) => `/frames/frame_${String(i + 1).padStart(3, "0")}.jpg`;

/* ---------- reveal ---------- */
function Reveal({ children, className = "", as: Tag = "div", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add("in"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}

/* ---------- nav ---------- */
function Nav({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", on, { passive: true });
    on();
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <div className={`nav ${scrolled ? "scrolled" : ""}`}>
      <div className="wrap nav-inner">
        <a href="#top" className="nav-logo">
          Kusov<span className="dot" />Digital
        </a>
        <div className="nav-menu">
          <a href="#sluzby" className="link">{t.nav.services}</a>
          <a href="#proces" className="link">{t.nav.work}</a>
          <a href="#kontakt" className="link">{t.nav.contact}</a>
        </div>
        <div className="nav-right">
          <a href="tel:+421910740347" className="nav-phone">
            +421 910 740 347
          </a>
          <div className="lang-switch">
            {["sk", "en"].map((l) => (
              <button
                key={l}
                className={`lang-btn ${lang === l ? "active" : ""}`}
                onClick={() => setLang(l)}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="#kontakt" className="nav-cta">
            {t.nav.cta}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- scrub showcase ---------- */
function ScrubShowcase({ t }) {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const stateRef = useRef({ current: 0, target: 0 });
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const imgs = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const setSize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * window.devicePixelRatio;
      canvas.height = r.height * window.devicePixelRatio;
    };
    setSize();
    window.addEventListener("resize", setSize);

    const draw = (index) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      const cw = canvas.width,
        ch = canvas.height;
      const ir = img.naturalWidth / img.naturalHeight;
      const cr = cw / ch;
      let dw, dh, dx, dy;
      if (ir > cr) {
        dh = ch;
        dw = ch * ir;
        dx = (cw - dw) / 2;
        dy = 0;
      } else {
        dw = cw;
        dh = cw / ir;
        dx = 0;
        dy = (ch - dh) / 2;
      }
      ctx.drawImage(img, dx, dy, dw, dh);
    };
    imgs[0].onload = () => draw(0);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const sec = sectionRef.current;
        if (sec) {
          const rect = sec.getBoundingClientRect();
          const total = sec.offsetHeight - window.innerHeight;
          let p = total > 0 ? -rect.top / total : 0;
          p = Math.min(Math.max(p, 0), 1);
          stateRef.current.target = p * (FRAME_COUNT - 1);
          setStage(p < 0.34 ? 0 : p < 0.7 ? 1 : 2);
        }
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    let raf;
    const loop = () => {
      const s = stateRef.current;
      s.current += (s.target - s.current) * 0.16;
      draw(Math.round(Math.min(Math.max(s.current, 0), FRAME_COUNT - 1)));
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", setSize);
      cancelAnimationFrame(raf);
    };
  }, []);

  const s = t.showcase;
  return (
    <section
      className="section section-line"
      ref={sectionRef}
      style={{ paddingTop: 0, paddingBottom: 0, height: "260vh" }}
    >
      <div style={{ position: "sticky", top: 0, minHeight: "100vh", display: "flex", alignItems: "center" }}>
        <div className="wrap" style={{ width: "100%", padding: "80px 32px" }}>
          <div className="showcase">
            <div className="showcase-media">
              <div className="scrub-frame">
                <canvas ref={canvasRef} />
                <div className="scrub-badge">
                  <span className="live" /> {s.badge}
                </div>
                <div className="scrub-label">
                  <span className="stage">{s.stages[stage]}</span>
                  <span>{String(stage + 1).padStart(2, "0")} / 03</span>
                </div>
              </div>
              <div className="scrub-hint">{s.hint}</div>
            </div>

            <div className="showcase-copy">
              <div className="tag">{s.tag}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul className="points">
                {s.points.map((p, i) => (
                  <li key={i}>
                    <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                    <span className="txt">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* icons */
const icons = [
  <svg key="a" className="svc-icon" viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="28" rx="2"/><path d="M6 18h36M12 14h.01M16 14h.01"/></svg>,
  <svg key="b" className="svc-icon" viewBox="0 0 48 48"><rect x="6" y="12" width="28" height="24" rx="2"/><path d="M42 16l-8 6 8 6V16z"/></svg>,
  <svg key="c" className="svc-icon" viewBox="0 0 48 48"><path d="M8 40V22l16-12 16 12v18"/><rect x="18" y="28" width="12" height="12"/></svg>,
];

/* ---------- page ---------- */
export default function Page() {
  const [lang, setLang] = useState("sk");
  const t = COPY[lang];
  const h = t.hero;

  return (
    <div id="top">
      <Nav lang={lang} setLang={setLang} t={t} />

      {/* HERO */}
      <header className="hero">
        <div className="hero-glow" />
        <div className="wrap hero-content">
          <div className="hero-eyebrow">
            <span className="pulse" />
            {h.eyebrow}
          </div>
          <h1>
            {h.title.map((line, i) => (
              <span key={i}>
                <span className={i === h.titleMuted ? "muted" : ""}>{line}</span>
                {i < h.title.length - 1 && <br />}
              </span>
            ))}
          </h1>
          <p className="hero-sub">{h.sub}</p>
          <div className="hero-actions">
            <a href="#kontakt" className="btn btn-solid">
              {h.ctaPrimary} →
            </a>
            <a href="#sluzby" className="btn btn-ghost">
              {h.ctaSecondary}
            </a>
          </div>
          <div className="hero-stats">
            {h.stats.map((st, i) => (
              <div className="hero-stat" key={i}>
                <div className="num">{st.num}</div>
                <div className="lbl">{st.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* SHOWCASE with scrub */}
      <ScrubShowcase t={t} />

      {/* SERVICES */}
      <section className="section section-line" id="sluzby">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow">{t.services.eyebrow}</div>
            <h2>{t.services.title}</h2>
            <p className="lead">{t.services.lead}</p>
          </Reveal>
          <Reveal className="svc-grid">
            {t.services.cards.map((c, i) => (
              <div className="svc" key={i}>
                <span className="svc-num">{c.num}</span>
                {icons[i]}
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <div className="svc-meta">
                  {c.meta.map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section section-line" id="proces">
        <div className="wrap">
          <Reveal className="section-head">
            <div className="eyebrow">{t.process.eyebrow}</div>
            <h2>{t.process.title}</h2>
          </Reveal>
          <div className="proc">
            {t.process.steps.map((s, i) => (
              <Reveal className="proc-step" key={i} delay={i * 100}>
                <span className="pnum">{s.num}</span>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="section section-line" id="kontakt">
        <div className="wrap">
          <div className="contact-shell">
            <Reveal className="contact-aside">
              <div className="eyebrow">{t.contact.eyebrow}</div>
              <h2>{t.contact.title}</h2>
              <p className="lead">{t.contact.lead}</p>
              <div className="contact-direct">
                <a href="mailto:peter@kusovdigital.com">
                  peter@kusovdigital.com <span className="arr">→</span>
                </a>
                <a href="tel:+421910740347">
                  +421 910 740 347 <span className="arr">→</span>
                </a>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <MultiStepForm t={t.contact} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap">
          <div className="footer-top">
            <div className="footer-brand">{t.footer.tagline}</div>
            <div className="footer-cols">
              <div className="footer-col">
                <h5>{t.footer.colServices}</h5>
                {t.footer.services.map((s) => (
                  <a href="#sluzby" key={s}>{s}</a>
                ))}
              </div>
              <div className="footer-col">
                <h5>{t.footer.colContact}</h5>
                <a href="mailto:peter@kusovdigital.com">peter@kusovdigital.com</a>
                <a href="tel:+421910740347">+421 910 740 347</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Kusov Digital</span>
            <span>{t.footer.rights}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
