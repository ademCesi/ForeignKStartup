import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/LegalPage.scss";

const EmailPrivacyPage = () => {
    const { t } = useTranslation();
    const noticeBullets = t("emailPrivacyPage.notice.bullets", { returnObjects: true });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <NavBar />
            <main className="legal-page">
                <div className="legal-page__hero">
                    <div className="legal-page__hero-inner">
                        <p className="legal-page__eyebrow">{t("emailPrivacyPage.eyebrow")}</p>
                        <h1 className="legal-page__title">{t("emailPrivacyPage.title")}</h1>
                        <p className="legal-page__subtitle">{t("emailPrivacyPage.subtitle")}</p>
                    </div>
                </div>

                <div className="legal-page__container">
                    <div className="legal-page__body">
                        <p className="legal-page__intro">{t("emailPrivacyPage.intro")}</p>

                        <section className="legal-page__section">
                            <p>{t("emailPrivacyPage.body")}</p>

                            <div className="legal-page__notice">
                                <h2 className="legal-page__section-title">{t("emailPrivacyPage.notice.title")}</h2>
                                <p className="legal-page__notice-subtitle">{t("emailPrivacyPage.notice.subtitle")}</p>
                                <ul className="legal-page__list">
                                    {noticeBullets.map((item, index) => (
                                        <li key={`notice-bullet-${index}`}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="legal-page__callout">
                                <p>
                                    {t("emailPrivacyPage.callout.beforePhone")}
                                    <strong>1336</strong>
                                    {t("emailPrivacyPage.callout.afterPhoneBeforeLink")}
                                    <a href="https://www.spamcop.or.kr" target="_blank" rel="noreferrer" className="legal-page__link">
                                        www.spamcop.or.kr
                                    </a>
                                    {t("emailPrivacyPage.callout.afterLink")}
                                </p>
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default EmailPrivacyPage;