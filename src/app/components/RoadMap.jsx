import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../styles/RoadMap.scss";

const STEP_COUNT = 8;

const RoadMapStep = ({ step, index, isLeft }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.2 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            id={`step-${step.number}`}
            ref={ref}
            className={`roadmap__step ${isLeft ? "roadmap__step--left" : "roadmap__step--right"} ${visible ? "roadmap__step--visible" : ""}`}
            style={{ transitionDelay: `${index * 0.1}s` }}
        >
            {/* Card */}
            <div
                className="roadmap__card"
                onClick={() => navigate(`/step/${parseInt(step.number, 10)}`)}
            >
                <span className="roadmap__card-number">{step.number}</span>
                <h3 className="roadmap__card-title">{step.title}</h3>
                <p className="roadmap__card-description">{step.description}</p>
            </div>

            {/* Center dot */}
            <div className="roadmap__dot">
                <div className="roadmap__dot-inner" />
            </div>
        </div>
    );
};

const RoadMap = () => {
    const { t } = useTranslation();

    const steps = Array.from({ length: STEP_COUNT }, (_, i) => ({
        number: String(i + 1).padStart(2, "0"),
        title: t(`roadmap.step${i + 1}.title`),
        description: t(`roadmap.step${i + 1}.description`),
    }));

    return (
        <section className="roadmap">
            <div className="roadmap__container">

                {/* Header */}
                <div className="roadmap__header">
                    <p className="roadmap__eyebrow">{t("roadmap.eyebrow")}</p>
                    <h2 className="roadmap__title">{t("roadmap.title")}</h2>
                    <p className="roadmap__subtitle">{t("roadmap.subtitle")}</p>
                </div>

                {/* Timeline */}
                <div className="roadmap__timeline">
                    <div className="roadmap__line" />
                    {steps.map((step, index) => (
                        <RoadMapStep
                            key={step.number}
                            step={step}
                            index={index}
                            isLeft={index % 2 === 0}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
};

export default RoadMap;