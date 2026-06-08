import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import "../styles/StepPage.scss";

const STEP_COUNT = 8;

const StepPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const stepIndex = parseInt(id, 10);
    const isValid = stepIndex >= 1 && stepIndex <= STEP_COUNT;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    const handleBack = () => {
        navigate("/", { state: { scrollTo: "roadmap", stepId: id } });
    };

    const handlePrev = () => {
        if (stepIndex > 1) navigate(`/step/${stepIndex - 1}`);
    };

    const handleNext = () => {
        if (stepIndex < STEP_COUNT) navigate(`/step/${stepIndex + 1}`);
    };

    if (!isValid) {
        return (
            <>
                <NavBar />
                <div className="step-page step-page--not-found">
                    <p>{t("stepPage.notFound")}</p>
                    <button onClick={handleBack}>{t("stepPage.back")}</button>
                </div>
            </>
        );
    }

    const number = String(stepIndex).padStart(2, "0");
    const title = t(`roadmap.step${stepIndex}.title`);
    const description = t(`roadmap.step${stepIndex}.description`);
    const details = t(`roadmap.step${stepIndex}.details`, { defaultValue: "" });

    return (
        <>
            <NavBar />
            <main className="step-page">

                {/* Hero */}
                <div className="step-page__hero">
                    <div className="step-page__hero-inner">
                        <span className="step-page__number">{number}</span>
                        <div className="step-page__hero-text">
                            <p className="step-page__eyebrow">{t("stepPage.eyebrow")} {number}</p>
                            <h1 className="step-page__title">{title}</h1>
                            <p className="step-page__lead">{description}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="step-page__content">
                    <div className="step-page__body">
                        {details ? (
                            <p>{details}</p>
                        ) : (
                            <p className="step-page__placeholder">{t("stepPage.comingSoon")}</p>
                        )}
                    </div>

                    {/* Step navigation */}
                    <div className="step-page__nav">
                        <button
                            className="step-page__nav-btn step-page__nav-btn--prev"
                            onClick={handlePrev}
                            disabled={stepIndex === 1}
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {stepIndex > 1 && (
                                <span>{t(`roadmap.step${stepIndex - 1}.title`)}</span>
                            )}
                        </button>

                        <div className="step-page__nav-dots">
                            {Array.from({ length: STEP_COUNT }, (_, i) => (
                                <button
                                    key={i}
                                    className={`step-page__nav-dot ${i + 1 === stepIndex ? "step-page__nav-dot--active" : ""}`}
                                    onClick={() => navigate(`/step/${i + 1}`)}
                                    aria-label={`Step ${i + 1}`}
                                />
                            ))}
                        </div>

                        <button
                            className="step-page__nav-btn step-page__nav-btn--next"
                            onClick={handleNext}
                            disabled={stepIndex === STEP_COUNT}
                        >
                            {stepIndex < STEP_COUNT && (
                                <span>{t(`roadmap.step${stepIndex + 1}.title`)}</span>
                            )}
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Back button — sticky until it reaches its natural position */}
                    <div className="step-page__back-wrapper">
                        <button className="step-page__back-btn" onClick={handleBack}>
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M11 14L6 9L11 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {t("stepPage.backLabel")}
                        </button>
                    </div>
                </div>

            </main>
            <Footer />
        </>
    );
};

export default StepPage;