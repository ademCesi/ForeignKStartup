import React from "react";
import { useTranslation } from "react-i18next";
import { GLOSSARY, withGlossary } from "./GlossaryTerm";
import "../styles/RegistrationGuide.scss";

// ─── Icons ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
    "dollar-sign": (
        <>
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </>
    ),
    search: (
        <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
    check: <polyline points="20 6 9 17 4 12" />,
    "check-circle": (
        <>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </>
    ),
    "external-link": (
        <>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </>
    ),
    "map-pin": (
        <>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
        </>
    ),
    globe: (
        <>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </>
    ),
    "id-card": (
        <>
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </>
    ),
    stamp: (
        <>
            <path d="M9 2h6a1 1 0 0 1 1 1v5a3 3 0 0 1-3 3h0a3 3 0 0 1-3-3V3a1 1 0 0 1 1-1z" />
            <path d="M4 21v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
            <line x1="2" y1="21" x2="22" y2="21" />
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

const RegistrationGuide = () => {
    const { i18n } = useTranslation();
    const data = i18n.getResourceBundle(i18n.language, "translation")?.roadmap?.step4?.registrationGuide;

    if (!data) return null;

    const { phases, documents, outcome } = data;

    return (
        <div className="registration-guide">

            {/* Phases */}
            {phases && (
                <section className="registration-guide__section">
                    <div className="registration-guide__section-header">
                        <span className="registration-guide__section-badge">01</span>
                        <div>
                            <p className="registration-guide__eyebrow">{phases.eyebrow}</p>
                            <h2 className="registration-guide__title">{phases.title}</h2>
                            <p className="registration-guide__subtitle">{phases.subtitle}</p>
                        </div>
                    </div>

                    <div className="registration-phases">
                        {phases.items.map((phase, index) => {
                            const portalEntry = phase.portal && GLOSSARY[phase.portal.label];
                            return (
                                <div className="registration-phase" key={index}>
                                    <div className="registration-phase__header">
                                        <div className="registration-phase__icon">
                                            <Icon name={phase.icon} />
                                        </div>
                                        <div>
                                            <p className="registration-phase__step-label">Étape {index + 1}</p>
                                            <h3>{withGlossary(phase.title)}</h3>
                                        </div>
                                    </div>
                                    <p className="registration-phase__description">{withGlossary(phase.description)}</p>
                                    <ul className="registration-phase__documents">
                                        {phase.documents.map((doc, docIndex) => (
                                            <li key={docIndex}>
                                                <Icon name="check" />
                                                <span>{withGlossary(doc)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {portalEntry && (
                                        <a
                                            href={portalEntry.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="registration-phase__portal"
                                            title={portalEntry.definition}
                                        >
                                            <Icon name="external-link" />
                                            <span>{phase.portal.linkLabel}</span>
                                            <strong>{phase.portal.label}</strong>
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Documents */}
            {documents && (
                <section className="registration-guide__section">
                    <div className="registration-guide__section-header">
                        <span className="registration-guide__section-badge">02</span>
                        <div>
                            <p className="registration-guide__eyebrow">{documents.eyebrow}</p>
                            <h2 className="registration-guide__title">{documents.title}</h2>
                            <p className="registration-guide__subtitle">{documents.subtitle}</p>
                        </div>
                    </div>

                    <div className="registration-documents">
                        {documents.columns.map((column, index) => (
                            <div className="registration-documents__column" key={index}>
                                <div className="registration-documents__column-header">
                                    <div className="registration-documents__column-icon">
                                        <Icon name={column.icon} />
                                    </div>
                                    <h3>{column.title}</h3>
                                </div>
                                <ul>
                                    {column.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            <Icon name="check-circle" />
                                            <span>{withGlossary(item)}</span>
                                        </li>
                                    ))}
                                </ul>
                                {column.note && (
                                    <p className="registration-documents__note">{withGlossary(column.note)}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Outcome */}
            {outcome && (
                <section className="registration-guide__section">
                    <div className="registration-guide__section-header">
                        <span className="registration-guide__section-badge">03</span>
                        <div>
                            <p className="registration-guide__eyebrow">{outcome.eyebrow}</p>
                            <h2 className="registration-guide__title">{outcome.title}</h2>
                            <p className="registration-guide__subtitle">{outcome.subtitle}</p>
                        </div>
                    </div>

                    <div className="registration-outcome">
                        {outcome.items.map((item, index) => (
                            <div className="registration-outcome__card" key={index}>
                                <div className="registration-outcome__icon">
                                    <Icon name={item.icon} />
                                </div>
                                <span className="registration-outcome__code">{item.code}</span>
                                <h3>{item.name}</h3>
                                <p>{withGlossary(item.description)}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
};

export default RegistrationGuide;
