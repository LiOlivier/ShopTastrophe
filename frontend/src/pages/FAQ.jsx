import { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import "./FAQ.css";

export default function FAQ() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(() => new Array(8).fill(false));
  const toggle = (i) => setOpen((s) => s.map((v, idx) => (idx === i ? !v : v)));

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') }
  ];

  return (
    <section className="faq-container">
      <h1 className="faq-title">{t('faq.title')}</h1>
      <div className="faq-list" role="list">
        {faqs.map((item, i) => {
          const panelId = `faq-panel-${i}`;
          const btnId = `faq-btn-${i}`;
          const isOpen = open[i];
          return (
            <div className={`faq-item${isOpen ? " open" : ""}`} key={i} role="listitem">
              <button
                id={btnId}
                className="faq-q"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
              >
                <span className="q-text">{item.q}</span>
                <span className="chev" aria-hidden>▾</span>
              </button>
              <div
                id={panelId}
                className="faq-a"
                role="region"
                aria-labelledby={btnId}
              >
                <p>{item.a}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
