"use client";

import { useState, useCallback } from "react";

const ACCESS_KEY = "0dadb358-30e7-46e2-b387-c51124d63136";
const TOTAL_STEPS = 4;

export default function MultiStepForm({ t }) {
  const f = t.form;
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState(null); // null | sending | done | err
  const [data, setData] = useState({
    service: [],
    propertyType: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const toggleService = (s) => {
    setData((d) => {
      const has = d.service.includes(s);
      return {
        ...d,
        service: has ? d.service.filter((x) => x !== s) : [...d.service, s],
      };
    });
  };

  const canProceed = () => {
    if (step === 0) return data.service.length > 0;
    if (step === 1) return data.propertyType !== "";
    if (step === 2) return data.name.trim() && /\S+@\S+\.\S+/.test(data.email);
    return true;
  };

  const next = () => setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const submit = useCallback(async () => {
    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "Nový dopyt z webu Kusov Digital",
          from_name: "Kusov Digital web",
          "Služba": data.service.join(", "),
          "Typ nehnuteľnosti": data.propertyType,
          name: data.name,
          email: data.email,
          phone: data.phone || "—",
          message: data.message || "—",
        }),
      });
      const json = await res.json();
      if (json.success) setStatus("done");
      else setStatus("err");
    } catch {
      setStatus("err");
    }
  }, [data]);

  if (status === "done") {
    return (
      <div className="form-card">
        <div className="form-done">
          <div className="tick">✓</div>
          <h3>{f.doneTitle}</h3>
          <p>{f.doneText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card">
      <div className="form-progress">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <div key={i} className={`seg ${i <= step ? "done" : ""}`}>
            <div className="fill" />
          </div>
        ))}
      </div>

      <div className="step-count">
        {f.stepOf} {step + 1} / {TOTAL_STEPS}
      </div>

      <div className="step-body" key={step}>
        {step === 0 && (
          <>
            <div className="step-q">{f.step1Q}</div>
            <div className="step-help">{f.step1Help}</div>
            <div className="opt-grid">
              {f.services.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`opt ${data.service.includes(s) ? "selected" : ""}`}
                  onClick={() => toggleService(s)}
                >
                  <span className="check" />
                  {s}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <div className="step-q">{f.step2Q}</div>
            <div className="step-help">{f.step2Help}</div>
            <div className="opt-grid">
              {f.propertyTypes.map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`opt ${data.propertyType === p ? "selected" : ""}`}
                  onClick={() => setData((d) => ({ ...d, propertyType: p }))}
                >
                  <span className="check" />
                  {p}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="step-q">{f.step3Q}</div>
            <div className="step-help">{f.step3Help}</div>
            <div className="fld">
              <label>{f.name}</label>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
              />
            </div>
            <div className="fld">
              <label>{f.email}</label>
              <input
                type="email"
                value={data.email}
                onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
              />
            </div>
            <div className="fld">
              <label>{f.phone}</label>
              <input
                type="tel"
                value={data.phone}
                onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
              />
            </div>
            <div className="fld">
              <label>{f.message}</label>
              <textarea
                value={data.message}
                placeholder={f.messagePh}
                onChange={(e) =>
                  setData((d) => ({ ...d, message: e.target.value }))
                }
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="step-q">{f.step4Q}</div>
            <div className="step-help">{f.step4Help}</div>
            <div className="summary">
              <div className="row">
                <span className="k">{f.summaryService}</span>
                <span className="v">{data.service.join(", ") || "—"}</span>
              </div>
              <div className="row">
                <span className="k">{f.summaryType}</span>
                <span className="v">{data.propertyType || "—"}</span>
              </div>
              <div className="row">
                <span className="k">{f.summaryName}</span>
                <span className="v">{data.name || "—"}</span>
              </div>
              <div className="row">
                <span className="k">{f.summaryEmail}</span>
                <span className="v">{data.email || "—"}</span>
              </div>
              <div className="row">
                <span className="k">{f.summaryPhone}</span>
                <span className="v">{data.phone || "—"}</span>
              </div>
            </div>
            {status === "err" && <div className="form-err-msg">{f.errText}</div>}
          </>
        )}
      </div>

      <div className="form-nav">
        {step > 0 ? (
          <button className="btn-back" type="button" onClick={back}>
            ← {f.back}
          </button>
        ) : (
          <span />
        )}
        {step < TOTAL_STEPS - 1 ? (
          <button
            className="btn-next"
            type="button"
            onClick={next}
            disabled={!canProceed()}
          >
            {f.next} →
          </button>
        ) : (
          <button
            className="btn-next"
            type="button"
            onClick={submit}
            disabled={status === "sending"}
          >
            {status === "sending" ? f.sending : f.submit}
          </button>
        )}
      </div>
    </div>
  );
}
