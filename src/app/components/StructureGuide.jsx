import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { withGlossary } from "./GlossaryTerm";
import "../styles/StructureGuide.scss";

// ─── Icons ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
    rocket: (
        <>
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </>
    ),
    shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    star: (
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    ),
    "id-card": (
        <>
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </>
    ),
    document: (
        <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </>
    ),
    target: (
        <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </>
    ),
    check: <polyline points="20 6 9 17 4 12" />,
    "check-circle": (
        <>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </>
    ),
    alert: (
        <>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
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

const StructureGuide = () => {
    const { i18n } = useTranslation();
    const data = i18n.getResourceBundle(i18n.language, "translation")?.roadmap?.step2?.structureGuide;
    const [activeTab, setActiveTab] = useState(0);

    if (!data) return null;

    const { tabs, checklist } = data;
    const activeItem = tabs?.items?.[activeTab];

    return (
        <div className="structure-guide">

            {/* Tabs comparison */}
            {tabs && activeItem && (
                <section className="structure-guide__section">
                    <div className="structure-guide__section-header">
                        <span className="structure-guide__section-badge">01</span>
                        <div>
                            <p className="structure-guide__eyebrow">{tabs.eyebrow}</p>
                            <h2 className="structure-guide__title">{tabs.title}</h2>
                            <p className="structure-guide__subtitle">{tabs.subtitle}</p>
                        </div>
                    </div>

                    <div className="structure-tabs">
                        <div className="structure-tabs__nav" role="tablist">
                            {tabs.items.map((item, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    role="tab"
                                    aria-selected={index === activeTab}
                                    className={`structure-tabs__tab ${index === activeTab ? "structure-tabs__tab--active" : ""}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    <span className="structure-tabs__tab-code">{item.code}</span>
                                    <span className="structure-tabs__tab-name">{item.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="structure-tabs__panel" role="tabpanel">
                            <div className="structure-tabs__panel-header">
                                <div className="structure-tabs__panel-icon">
                                    <Icon name={activeItem.icon} />
                                </div>
                                <div>
                                    <div className="structure-tabs__panel-title-row">
                                        <h3>{activeItem.name}</h3>
                                        <span className="structure-tabs__tag">{activeItem.tag}</span>
                                    </div>
                                    <p className="structure-tabs__summary">{withGlossary(activeItem.summary)}</p>
                                </div>
                            </div>

                            <div className="structure-tabs__panel-body">
                                <div className="structure-tabs__column">
                                    <h4>{tabs.idealForLabel}</h4>
                                    <p className="structure-tabs__ideal-for">{withGlossary(activeItem.idealFor)}</p>

                                    <h4>{tabs.advantagesLabel}</h4>
                                    <ul className="structure-tabs__list">
                                        {activeItem.advantages.map((advantage, index) => (
                                            <li key={index}>
                                                <Icon name="check-circle" />
                                                <span>{withGlossary(advantage)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="structure-tabs__column">
                                    <h4>{tabs.requirementsLabel}</h4>
                                    <ul className="structure-tabs__list">
                                        {activeItem.requirements.map((requirement, index) => (
                                            <li key={index}>
                                                <Icon name="check" />
                                                <span>{withGlossary(requirement)}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="structure-tabs__watchout">
                                        <Icon name="alert" />
                                        <span>{withGlossary(activeItem.watchOut)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Checklist */}
            {checklist && (
                <section className="structure-guide__section">
                    <div className="structure-guide__section-header">
                        <span className="structure-guide__section-badge">02</span>
                        <div>
                            <p className="structure-guide__eyebrow">{checklist.eyebrow}</p>
                            <h2 className="structure-guide__title">{checklist.title}</h2>
                            <p className="structure-guide__subtitle">{checklist.subtitle}</p>
                        </div>
                    </div>
                    <div className="structure-guide__checklist">
                        {checklist.items.map((item, index) => (
                            <div className="structure-checklist-card" key={index}>
                                <div className="structure-checklist-card__icon">
                                    <Icon name={item.icon} />
                                </div>
                                <h4>{withGlossary(item.title)}</h4>
                                <p>{withGlossary(item.description)}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default StructureGuide;
