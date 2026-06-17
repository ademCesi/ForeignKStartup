import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { withGlossary } from "./GlossaryTerm";
import { getStepPath } from "../utils/stepRouting";
import "../styles/AddressGuide.scss";

// ─── Icons ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
    briefcase: (
        <>
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
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
    award: (
        <>
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </>
    ),
    home: (
        <>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
        </>
    ),
    alert: (
        <>
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
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
    "map-pin": (
        <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </>
    ),
    "refresh-cw": (
        <>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
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

const AddressGuide = () => {
    const { i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState(0);
    const data = i18n.getResourceBundle(i18n.language, "translation")?.roadmap?.step3?.addressGuide;

    if (!data) return null;

    const { comparison, checklist } = data;
    const activeItem = comparison?.items?.[activeTab];

    return (
        <div className="address-guide">

            {/* Comparison */}
            {comparison && (
                <section className="address-guide__section">
                    <div className="address-guide__section-header">
                        <span className="address-guide__section-badge">01</span>
                        <div>
                            <p className="address-guide__eyebrow">{comparison.eyebrow}</p>
                            <h2 className="address-guide__title">{comparison.title}</h2>
                            <p className="address-guide__subtitle">{comparison.subtitle}</p>
                        </div>
                    </div>

                    <div className="address-tabs">
                        <div className="address-tabs__nav">
                            {comparison.items.map((item, index) => (
                                <button
                                    key={index}
                                    className={`address-tabs__tab ${index === activeTab ? "address-tabs__tab--active" : ""}`}
                                    onClick={() => setActiveTab(index)}
                                >
                                    <span className="address-tabs__tab-icon">
                                        <Icon name={item.icon} />
                                    </span>
                                    <span className="address-tabs__tab-name">{item.name}</span>
                                </button>
                            ))}
                        </div>

                        {activeItem && (
                            <div className="address-tabs__panel">
                                <div className="address-tabs__panel-header">
                                    <div className="address-tabs__panel-icon">
                                        <Icon name={activeItem.icon} />
                                    </div>
                                    <div className="address-tabs__panel-title-row">
                                        <h3>{activeItem.name}</h3>
                                        <span className="address-tabs__tag">{activeItem.tag}</span>
                                    </div>
                                </div>

                                <div className="address-tabs__panel-body">
                                    <div className="address-tabs__field">
                                        <h4>{comparison.costLabel}</h4>
                                        <p>{withGlossary(activeItem.cost)}</p>
                                    </div>
                                    <div className="address-tabs__field">
                                        <h4>{comparison.includesLabel}</h4>
                                        <p>{withGlossary(activeItem.includes)}</p>
                                    </div>
                                    <div className="address-tabs__field">
                                        <h4>{comparison.idealForLabel}</h4>
                                        <p>{withGlossary(activeItem.idealFor)}</p>
                                    </div>
                                </div>

                                <div className="address-tabs__watchout">
                                    <Icon name="alert" />
                                    <span>{withGlossary(activeItem.watchOut)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Checklist */}
            {checklist && (
                <section className="address-guide__section">
                    <div className="address-guide__section-header">
                        <span className="address-guide__section-badge">02</span>
                        <div>
                            <p className="address-guide__eyebrow">{checklist.eyebrow}</p>
                            <h2 className="address-guide__title">{checklist.title}</h2>
                            <p className="address-guide__subtitle">{checklist.subtitle}</p>
                        </div>
                    </div>

                    <div className="address-checklist">
                        {checklist.items.map((item, index) => (
                            <div className="address-checklist-card" key={index}>
                                <div className="address-checklist-card__icon">
                                    <Icon name={item.icon} />
                                </div>
                                <h4>{withGlossary(item.title)}</h4>
                                <p>{withGlossary(item.description)}</p>
                                {item.stepLink && (
                                    <Link to={getStepPath(item.stepLink, i18n.t.bind(i18n))} className="address-checklist-card__link">
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

export default AddressGuide;
