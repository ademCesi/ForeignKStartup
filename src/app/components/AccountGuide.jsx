import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { withGlossary } from "./GlossaryTerm";
import "../styles/AccountGuide.scss";

// ─── Icons ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
    globe: (
        <>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
    ),
    "map-pin": (
        <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </>
    ),
    link: (
        <>
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </>
    ),
    award: (
        <>
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    "dollar-sign": (
        <>
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </>
    ),
    "file-text": (
        <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </>
    ),
    lock: (
        <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </>
    ),
    flag: (
        <>
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
            <line x1="4" y1="22" x2="4" y2="15" />
        </>
    ),
    "arrow-right": (
        <>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
        </>
    ),
};

const Icon = ({ name }) => {
    const path = ICON_PATHS[name];
    if (!path) return null;
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            {path}
        </svg>
    );
};

const AccountGuide = () => {
    const { i18n } = useTranslation();
    const [activeStep, setActiveStep] = useState(0);
    const data = i18n.getResourceBundle(i18n.language, "translation")?.roadmap?.step5?.accountGuide;

    if (!data) return null;

    const { banks, timeline } = data;

    return (
        <div className="account-guide">

            {/* Banks */}
            {banks && (
                <section className="account-guide__section">
                    <div className="account-guide__section-header">
                        <span className="account-guide__section-badge">01</span>
                        <div>
                            <p className="account-guide__eyebrow">{banks.eyebrow}</p>
                            <h2 className="account-guide__title">{banks.title}</h2>
                            <p className="account-guide__subtitle">{banks.subtitle}</p>
                        </div>
                    </div>

                    <div className="account-banks">
                        {banks.items.map((bank, index) => (
                            <div className="account-bank-card" key={index}>
                                <div className="account-bank-card__header">
                                    <div className="account-bank-card__icon">
                                        <Icon name={bank.icon} />
                                    </div>
                                    <div>
                                        <h3>{bank.name}</h3>
                                        <span className="account-bank-card__tag">{bank.tag}</span>
                                    </div>
                                </div>
                                <p className="account-bank-card__description">{withGlossary(bank.description)}</p>
                                <ul className="account-bank-card__points">
                                    {bank.points.map((point, pointIndex) => (
                                        <li key={pointIndex}>
                                            <Icon name="check" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Timeline */}
            {timeline && (
                <section className="account-guide__section">
                    <div className="account-guide__section-header">
                        <span className="account-guide__section-badge">02</span>
                        <div>
                            <p className="account-guide__eyebrow">{timeline.eyebrow}</p>
                            <h2 className="account-guide__title">{timeline.title}</h2>
                            <p className="account-guide__subtitle">{timeline.subtitle}</p>
                        </div>
                    </div>

                    <div className="account-timeline-tabs">
                        <div className="account-timeline-tabs__track">
                            <div className="account-timeline-tabs__line" />
                            {timeline.items.map((item, index) => (
                                <button
                                    key={index}
                                    className={[
                                        "account-timeline-tabs__step",
                                        activeStep === index ? "account-timeline-tabs__step--active" : "",
                                        activeStep > index ? "account-timeline-tabs__step--past" : "",
                                    ].join(" ")}
                                    onClick={() => setActiveStep(index)}
                                >
                                    <div className="account-timeline-tabs__step-dot">
                                        <Icon name={item.icon} />
                                    </div>
                                    <span className="account-timeline-tabs__step-label">{item.marker}</span>
                                </button>
                            ))}
                        </div>

                        {(() => {
                            const item = timeline.items[activeStep];
                            return (
                                <div className="account-timeline-tabs__panel">
                                    <div className="account-timeline-tabs__panel-header">
                                        <div className="account-timeline-tabs__panel-icon">
                                            <Icon name={item.icon} />
                                        </div>
                                        <div>
                                            <span className="account-timeline-tabs__panel-marker">{item.marker}</span>
                                            <h4>{withGlossary(item.title)}</h4>
                                        </div>
                                    </div>
                                    <p>{withGlossary(item.description)}</p>
                                    {item.stepLink && (
                                        <Link to={`/step/${item.stepLink}`} className="account-timeline-tabs__panel-link">
                                            <span>{item.stepLinkLabel}</span>
                                            <Icon name="arrow-right" />
                                        </Link>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </section>
            )}

        </div>
    );
};

export default AccountGuide;
