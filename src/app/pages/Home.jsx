import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ImageSlider from '../components/ImagesSlider';
import RoadMap from '../components/RoadMap';
import Footer from "../components/Footer";

const Home = () => {
    const location = useLocation();
    const roadmapRef = useRef(null);

    // Scroll back to roadmap step when returning from StepPage
    useEffect(() => {
        if (location.state?.scrollTo === 'roadmap') {
            const stepId = location.state?.stepId;
            setTimeout(() => {
                if (stepId) {
                    const el = document.getElementById(`step-${stepId}`);
                    if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        return;
                    }
                }
                roadmapRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }, [location.state]);

    return (
        <div>
            <NavBar />
            <ImageSlider />
            <div id="roadmap" ref={roadmapRef}>
                <RoadMap />
            </div>
            <Footer />
        </div>
    );
};

export default Home;