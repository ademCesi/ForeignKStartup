import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { GLOSSARY, withGlossary } from "./GlossaryTerm";
import { getStepPath } from "../utils/stepRouting";
import "../styles/TaxGuide.scss";

// ─── Icons ──────────────────────────────────────────────────────────────────
const ICON_PATHS = {
    "file-text": (
        <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
        </>
    ),
    "user-check": (
        <>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
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
    percent: (
        <>
            <line x1="19" y1="5" x2="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </>
    ),
    "trending-down": (
        <>
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
            <polyline points="17 18 23 18 23 12" />
        </>
    ),
    calendar: (
        <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
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

const TaxGuide = () => {
    const { i18n } = useTranslation();
    const data = i18n.getResourceBundle(i18n.language, "translation")?.roadmap?.step6?.taxGuide;

    if (!data) return null;

    const { formalities, brackets, stats } = data;

    return (
        <div className="tax-guide">

            {/* Formalities */}
            {formalities && (
                <section className="tax-guide__section">
                    <div className="tax-guide__section-header">
                        <span className="tax-guide__section-badge">01</span>
                        <div>
                            <p className="tax-guide__eyebrow">{formalities.eyebrow}</p>
                            <h2 className="tax-guide__title">{formalities.title}</h2>
                            <p className="tax-guide__subtitle">{formalities.subtitle}</p>
                        </div>
                    </div>

                    <div className="tax-formalities">
                        {formalities.columns.map((column, index) => {
                            const portalEntry = column.portal && GLOSSARY[column.portal.label];
                            return (
                                <div className="tax-formalities__column" key={index}>
                                    <div className="tax-formalities__header">
                                        <div className="tax-formalities__icon">
                                            <Icon name={column.icon} />
                                        </div>
                                        <h3>{withGlossary(column.title)}</h3>
                                    </div>
                                    <p className="tax-formalities__description">{withGlossary(column.description)}</p>
                                    <ul>
                                        {column.items.map((item, itemIndex) => (
                                            <li key={itemIndex}>
                                                <Icon name="check" />
                                                <span>{withGlossary(item)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    {portalEntry && (
                                        <a
                                            href={portalEntry.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="tax-formalities__portal"
                                            title={portalEntry.definition}
                                        >
                                            <Icon name="external-link" />
                                            <span>{column.portal.linkLabel}</span>
                                            <strong>{column.portal.label}</strong>
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Tax brackets */}
            {brackets && (
                <section className="tax-guide__section">
                    <div className="tax-guide__section-header">
                        <span className="tax-guide__section-badge">02</span>
                        <div>
                            <p className="tax-guide__eyebrow">{brackets.eyebrow}</p>
                            <h2 className="tax-guide__title">{brackets.title}</h2>
                            <p className="tax-guide__subtitle">{brackets.subtitle}</p>
                        </div>
                    </div>

                    <div className="tax-brackets">
                        {brackets.items.map((item, index) => (
                            <div className={`tax-bracket ${item.highlight ? "tax-bracket--highlight" : ""}`} key={index}>
                                <span className="tax-bracket__rate">{item.rate}</span>
                                <div className="tax-bracket__body">
                                    <p className="tax-bracket__range">{item.range}</p>
                                    {item.note && <p className="tax-bracket__note">{item.note}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                    {brackets.note && <p className="tax-brackets__footnote">{brackets.note}</p>}
                </section>
            )}

            {/* Key stats */}
            {stats && (
                <section className="tax-guide__section">
                    <div className="tax-guide__section-header">
                        <span className="tax-guide__section-badge">03</span>
                        <div>
                            <p className="tax-guide__eyebrow">{stats.eyebrow}</p>
                            <h2 className="tax-guide__title">{stats.title}</h2>
                            <p className="tax-guide__subtitle">{stats.subtitle}</p>
                        </div>
                    </div>

                    <div className="tax-stats">
                        {stats.items.map((item, index) => (
                            <div className="tax-stat-card" key={index}>
                                <div className="tax-stat-card__icon">
                                    <Icon name={item.icon} />
                                </div>
                                <span className="tax-stat-card__value">{item.value}</span>
                                <h4>{item.label}</h4>
                                <p>{withGlossary(item.description)}</p>
                                {item.stepLink && (
                                    <Link to={getStepPath(item.stepLink, i18n.t.bind(i18n))} className="tax-stat-card__link">
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

export default TaxGuide;
