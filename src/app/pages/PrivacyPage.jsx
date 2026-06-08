import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/LegalPage.scss";

const PrivacyPage = () => {
    const { t } = useTranslation();
    const intro = t("privacyPage.intro", { returnObjects: true });
    const section1Paragraphs = t("privacyPage.section1.paragraphs", { returnObjects: true });
    const section1Bullets = t("privacyPage.section1.bullets", { returnObjects: true });
    const section1DataItems = t("privacyPage.section1.dataItems", { returnObjects: true });
    const section2Paragraphs = t("privacyPage.section2.paragraphs", { returnObjects: true });
    const section3Paragraphs = t("privacyPage.section3.paragraphs", { returnObjects: true });
    const section3Table = t("privacyPage.section3.table", { returnObjects: true });
    const section3DestroyMethods = t("privacyPage.section3.destroyMethods", { returnObjects: true });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <NavBar />
            <main className="legal-page">
                <div className="legal-page__hero">
                    <div className="legal-page__hero-inner">
                        <p className="legal-page__eyebrow">{t("privacyPage.eyebrow")}</p>
                        <h1 className="legal-page__title">{t("privacyPage.title")}</h1>
                        <p className="legal-page__subtitle">{t("privacyPage.subtitle")}</p>
                    </div>
                </div>

                <div className="legal-page__container">
                    <div className="legal-page__body">
                        {intro.map((paragraph, index) => (
                            <p key={`intro-${index}`} className={index === 0 ? "legal-page__intro" : undefined}>
                                {paragraph}
                            </p>
                        ))}

                        <section className="legal-page__section">
                            <h2 className="legal-page__section-title">{t("privacyPage.section1.title")}</h2>
                            {section1Paragraphs.map((paragraph, index) => (
                                <p key={`section1-paragraph-${index}`}>{paragraph}</p>
                            ))}
                            <ul className="legal-page__list">
                                {section1Bullets.map((item, index) => (
                                    <li key={`section1-bullet-${index}`}>{item}</li>
                                ))}
                            </ul>

                            <h3 className="legal-page__subsection-title">{t("privacyPage.section1.dataTitle")}</h3>
                            <ul className="legal-page__list">
                                {section1DataItems.map((item, index) => (
                                    <li key={`section1-data-${index}`}>
                                        <strong>{item.label}</strong>
                                        {" : "}
                                        {item.purpose}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="legal-page__section">
                            <h2 className="legal-page__section-title">{t("privacyPage.section2.title")}</h2>
                            {section2Paragraphs.map((paragraph, index) => (
                                <p key={`section2-paragraph-${index}`}>{paragraph}</p>
                            ))}
                        </section>

                        <section className="legal-page__section">
                            <h2 className="legal-page__section-title">{t("privacyPage.section3.title")}</h2>
                            {section3Paragraphs.map((paragraph, index) => (
                                <p key={`section3-paragraph-${index}`}>{paragraph}</p>
                            ))}

                            <div className="legal-page__table">
                                {section3Table.map((row, index) => (
                                    <div key={`section3-row-${index}`} className="legal-page__table-row">
                                        <span className="legal-page__table-key">{row.key}</span>
                                        <span className="legal-page__table-value">{row.value}</span>
                                    </div>
                                ))}
                            </div>

                            <h3 className="legal-page__subsection-title">{t("privacyPage.section3.destroyTitle")}</h3>
                            <ul className="legal-page__list">
                                {section3DestroyMethods.map((item, index) => (
                                    <li key={`section3-destroy-${index}`}>{item}</li>
                                ))}
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default PrivacyPage;