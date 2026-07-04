"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { COPY } from "../components/copy";

const FRAME_COUNT = 66;
const framePath = (i) =>
  `/frames/frame_${String(i + 1).padStart(3, "0")}.jpg`;

/* ---------- Reveal on scroll ---------- */
function Reveal({ children, className = "", as: Tag = "div", delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("in"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
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

/* ---------- Hero with canvas scrubbing ---------- */
function Hero({ t }) {
  const canvasRef = useRef(null);
  const sectionRef = useRef(null);
  const imagesRef = useRef([]);
  const stateRef = useRef({ current: 0, target: 0 });
  const [phase, setPhase] = useState(0);
  const [heroActive, setHeroActive] = useState(true);

  useEffect(() => {
    // Preload frames
    const imgs = [];
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      imgs.push(img);
    }
    imagesRef.current = imgs;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = (index) => {
      const img = imagesRef.current[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;
      // cover-fit
      const cw = canvas.width;
      const ch = canvas.height;
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

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      let progress = total > 0 ? -rect.top / total : 0;
      progress = Math.min(Math.max(progress, 0), 1);
      stateRef.current.target = progress * (FRAME_COUNT - 1);

      // phases: 0-33% / 33-66% / 66-100%
      const p = progress < 0.3 ? 0 : progress < 0.68 ? 1 : 2;
      setPhase(p);
      setHeroActive(rect.bottom > window.innerHeight * 0.5);
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
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // expose hero state to nav via body class
  useEffect(() => {
    document.body.dataset.hero = heroActive ? "1" : "0";
    window.dispatchEvent(new CustomEvent("herostate", { detail: heroActive }));
  }, [heroActive]);

  return (
    <section className="hero-section" ref={sectionRef} id="hore">
      <div className="hero-sticky">
        <canvas ref={canvasRef} className="hero-canvas" />
        <div className="hero-shade" />
        {t.hero.phases.map((ph, i) => (
          <div key={i} className={`hero-phase ${phase === i ? "visible" : ""}`}>
            <div className="kicker">{ph.kicker}</div>
            {i === 0 ? (
              <h1>{ph.title}</h1>
            ) : (
              <div className="phase-title">{ph.title}</div>
            )}
            <p className="phase-sub">{ph.sub}</p>
          </div>
        ))}
        <div className="hero-scroll-hint">↓ {t.hero.hint}</div>
      </div>
    </section>
  );
}

/* ---------- Nav ---------- */
function Nav({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [onHero, setOnHero] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    const onHeroState = (e) => setOnHero(e.detail);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("herostate", onHeroState);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("herostate", onHeroState);
    };
  }, []);

  return (
    <div
      className={`nav ${scrolled && !onHero ? "scrolled" : ""} ${
        onHero ? "on-hero" : ""
      }`}
    >
      <div className="wrap nav-inner">
        <a href="#hore" className="nav-logo">
          Kusov<em>.</em>Digital
        </a>
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

/* ---------- Contact form (Web3Forms) ---------- */
function ContactForm({ t }) {
  const [status, setStatus] = useState(null); // null | 'sending' | 'ok' | 'err'
  const f = t.contact.form;

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus("sending");
      const formData = new FormData(e.target);
      formData.append("access_key", "0dadb358-30e7-46e2-b387-c51124d63136");
      formData.append("subject", "Nový dopyt z webu Kusov Digital");
      try {
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setStatus("ok");
          e.target.reset();
        } else {
          setStatus("err");
        }
      } catch {
        setStatus("err");
      }
    },
    []
  );

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">{f.name}</label>
          <input id="name" name="name" type="text" required />
        </div>
        <div className="field">
          <label htmlFor="email">{f.email}</label>
          <input id="email" name="email" type="email" required />
        </div>
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="phone">{f.phone}</label>
          <input id="phone" name="phone" type="tel" />
        </div>
        <div className="field">
          <label htmlFor="type">{f.type}</label>
          <select id="type" name="property_type" defaultValue={f.typeOptions[0]}>
            {f.typeOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="message">{f.message}</label>
        <textarea
          id="message"
          name="message"
          placeholder={f.messagePh}
          required
        />
      </div>
      {status === "ok" && <div className="form-status ok">{f.ok}</div>}
      {status === "err" && <div className="form-status err">{f.err}</div>}
      <button className="submit-btn" type="submit" disabled={status === "sending"}>
        {status === "sending" ? f.sending : f.submit}
      </button>
    </form>
  );
}

/* ---------- Page ---------- */
export default function Page() {
  const [lang, setLang] = useState("sk");
  const t = COPY[lang];

  return (
    <>
      <Nav lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />

      <section className="block" id="sluzby">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">{t.services.eyebrow}</div>
            <h2>{t.services.title}</h2>
            <p className="lead">{t.services.lead}</p>
          </Reveal>
          <div className="services-grid">
            {t.services.cards.map((c, i) => (
              <Reveal key={i} delay={i * 120} className="service-card">
                <span className="service-num">{c.num}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
                <ul>
                  {c.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="proces">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">{t.process.eyebrow}</div>
            <h2>{t.process.title}</h2>
          </Reveal>
          <div className="steps">
            {t.process.steps.map((s, i) => (
              <Reveal key={i} delay={i * 120} className="step">
                <span className="step-num">{s.num}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="block" id="kontakt">
        <div className="wrap">
          <Reveal>
            <div className="eyebrow">{t.contact.eyebrow}</div>
            <h2>{t.contact.title}</h2>
            <p className="lead">{t.contact.lead}</p>
          </Reveal>
          <div className="contact-grid">
            <Reveal className="contact-info">
              <h3>{t.contact.infoTitle}</h3>
              <a href="mailto:peter@kusovdigital.com" className="contact-line">
                peter@kusovdigital.com
              </a>
              <a href="tel:+421910740347" className="contact-line">
                +421 910 740 347
              </a>
              <p className="contact-note">{t.contact.note}</p>
            </Reveal>
            <Reveal delay={120}>
              <ContactForm t={t} />
            </Reveal>
          </div>
        </div>
      </section>

      <footer>
        <div className="wrap footer-inner">
          <div>© 2026 Kusov Digital — {t.footer.tagline}</div>
          <div>
            <a href="mailto:peter@kusovdigital.com">peter@kusovdigital.com</a>
            {" · "}
            <a href="tel:+421910740347">+421 910 740 347</a>
          </div>
        </div>
      </footer>
    </>
  );
}
