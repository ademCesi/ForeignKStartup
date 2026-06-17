import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GLOSSARY, withGlossary } from "./GlossaryTerm";
import "../styles/FundingGuide.scss";

// ─── Icons ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
    globe: (
        <>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
    ),
    cpu: (
        <>
            <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
        </>
    ),
    "credit-card": (
        <>
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    "external-link": (
        <>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    calendar: (
        <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </>
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </>
    ),
    users: (
        <>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

const FundingGuide = () => {
    const { i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const data = i18n.getResourceBundle(i18n.language, "translation")?.roadmap?.step7?.fundingGuide;

    if (!data) return null;

    const { pathways, checklist } = data;
    const activePathway = pathways?.items?.[activeTab];
    const portalEntry = activePathway?.portal && GLOSSARY[activePathway.portal.label];

    return (
        <div className="funding-guide">

            {/* Funding pathways */}
            {pathways && (
                <section className="funding-guide__section">
                    <div className="funding-guide__section-header">
                        <span className="funding-guide__section-badge">01</span>
                        <div>
                            <p className="funding-guide__eyebrow">{pathways.eyebrow}</p>
                            <h2 className="funding-guide__title">{pathways.title}</h2>
                            <p className="funding-guide__subtitle">{pathways.subtitle}</p>
                        </div>
                    </div>

                    <div className="funding-tabs">
                        <div className="funding-tabs__nav">
                            {pathways.items.map((item, index) => (
                                <button
                                    key={index}
                                    className={`funding-tabs__tab funding-tabs__tab--${item.type}${activeTab === index ? " funding-tabs__tab--active" : ""}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    <span className="funding-tabs__tab-icon"><Icon name={item.icon} /></span>
                                    <span className="funding-tabs__tab-label">{item.tag}</span>
                                </button>
                            ))}
                        </div>

                        {activePathway && (
                            <div className={`funding-tabs__panel funding-tabs__panel--${activePathway.type}`}>
                                <div className="funding-tabs__panel-header">
                                    <div className="funding-tabs__panel-icon">
                                        <Icon name={activePathway.icon} />
                                    </div>
                                    <div>
                                        <h3>{withGlossary(activePathway.name)}</h3>
                                        <span className="funding-tabs__panel-tag">{activePathway.tag}</span>
                                    </div>
                                </div>
                                <p className="funding-tabs__panel-description">{withGlossary(activePathway.description)}</p>
                                <ul className="funding-tabs__panel-points">
                                    {activePathway.points.map((point, i) => (
                                        <li key={i}>
                                            <Icon name="check" />
                                            <span>{withGlossary(point)}</span>
                                        </li>
                                    ))}
                                </ul>
                                {portalEntry && (
                                    <a
                                        href={portalEntry.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="funding-tabs__panel-portal"
                                        title={portalEntry.definition}
                                    >
                                        <Icon name="external-link" />
                                        <span>{activePathway.portal.linkLabel}</span>
                                        <strong>{activePathway.portal.label}</strong>
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Eligibility checklist */}
            {checklist && (
                <section className="funding-guide__section">
                    <div className="funding-guide__section-header">
                        <span className="funding-guide__section-badge">02</span>
                        <div>
                            <p className="funding-guide__eyebrow">{checklist.eyebrow}</p>
                            <h2 className="funding-guide__title">{checklist.title}</h2>
                            <p className="funding-guide__subtitle">{checklist.subtitle}</p>
                        </div>
                    </div>

                    <div className="funding-criteria">
                        {checklist.items.map((item, index) => (
                            <div className="funding-criteria__card" key={index}>
                                <div className="funding-criteria__icon">
                                    <Icon name={item.icon} />
                                </div>
                                <h4>{withGlossary(item.title)}</h4>
                                <p>{withGlossary(item.description)}</p>
                                {item.stepLink && (
                                    <Link to={`/step/${item.stepLink}`} className="funding-criteria__link">
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

export default FundingGuide;
