import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { withGlossary } from "./GlossaryTerm";
import "../styles/InsuranceGuide.scss";

// ─── Icons ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
    "trending-up": (
        <>
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </>
    ),
    heart: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />,
    briefcase: (
        <>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </>
    ),
    "alert-triangle": (
        <>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
        </>
    ),
    "dollar-sign": (
        <>
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </>
    ),
    package: (
        <>
            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

const InsuranceGuide = () => {
    const { i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const data = i18n.getResourceBundle(i18n.language, "translation")?.roadmap?.step8?.insuranceGuide;

    if (!data) return null;

    const { contributions, facts } = data;
    const activeInsurance = contributions?.items?.[activeTab];

    return (
        <div className="insurance-guide">

            {/* Contribution breakdown */}
            {contributions && (
                <section className="insurance-guide__section">
                    <div className="insurance-guide__section-header">
                        <span className="insurance-guide__section-badge">01</span>
                        <div>
                            <p className="insurance-guide__eyebrow">{contributions.eyebrow}</p>
                            <h2 className="insurance-guide__title">{contributions.title}</h2>
                            <p className="insurance-guide__subtitle">{contributions.subtitle}</p>
                        </div>
                    </div>

                    <div className="insurance-tabs">
                        <div className="insurance-tabs__nav">
                            {contributions.items.map((item, index) => (
                                <button
                                    key={index}
                                    className={`insurance-tabs__tab${activeTab === index ? " insurance-tabs__tab--active" : ""}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    <span className="insurance-tabs__tab-icon"><Icon name={item.icon} /></span>
                                    <span className="insurance-tabs__tab-label">{item.name.split(" (")[0]}</span>
                                </button>
                            ))}
                        </div>

                        {activeInsurance && (
                            <div className="insurance-tabs__panel">
                                <div className="insurance-tabs__panel-header">
                                    <div className="insurance-tabs__panel-icon">
                                        <Icon name={activeInsurance.icon} />
                                    </div>
                                    <div>
                                        <h3>{withGlossary(activeInsurance.name)}</h3>
                                        <span className="insurance-tabs__panel-tag">{activeInsurance.rate}</span>
                                    </div>
                                </div>
                                <div className="insurance-tabs__panel-body">
                                    <div className="insurance-tabs__column">
                                        <h4>{activeInsurance.employerLabel}</h4>
                                        <p className="insurance-tabs__share-value">{activeInsurance.employerShare}</p>
                                    </div>
                                    <div className="insurance-tabs__column">
                                        <h4>{activeInsurance.employeeLabel}</h4>
                                        <p className="insurance-tabs__share-value">{activeInsurance.employeeShare}</p>
                                    </div>
                                </div>
                                <p className="insurance-tabs__panel-note">{withGlossary(activeInsurance.note)}</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Key facts */}
            {facts && (
                <section className="insurance-guide__section">
                    <div className="insurance-guide__section-header">
                        <span className="insurance-guide__section-badge">02</span>
                        <div>
                            <p className="insurance-guide__eyebrow">{facts.eyebrow}</p>
                            <h2 className="insurance-guide__title">{facts.title}</h2>
                            <p className="insurance-guide__subtitle">{facts.subtitle}</p>
                        </div>
                    </div>

                    <div className="insurance-facts">
                        {facts.items.map((item, index) => (
                            <div className="insurance-fact" key={index}>
                                <div className="insurance-fact__icon">
                                    <Icon name={item.icon} />
                                </div>
                                <span className="insurance-fact__value">{item.value}</span>
                                <h4>{item.label}</h4>
                                <p>{withGlossary(item.description)}</p>
                                {item.stepLink && (
                                    <Link to={`/step/${item.stepLink}`} className="insurance-fact__link">
                                        <span>{item.stepLinkLabel}</span>
                                        <Icon name="arrow-right" />
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default InsuranceGuide;
