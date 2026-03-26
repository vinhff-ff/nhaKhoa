import { useState, useEffect } from "react";
import { Rate } from "antd";
import { useNavigate } from "react-router-dom";
import { getTopFeedbacks } from "../../api/api";

interface Feedback {
    id: number;
    fullName: string;
    sick: string;
    text: string;
    evaluate: number;
    gmail: string;
    createdAt: string | null;
    imageUrl?: string;
}

const Slide5 = () => {
    const navigate = useNavigate();
    const [patients, setPatients] = useState<Feedback[]>([]);
    const [activePatient, setActivePatient] = useState<Feedback | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const data = await getTopFeedbacks();
                setPatients(data);
                if (data && data.length > 0) {
                    setActivePatient(data[0]);
                }
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                // Fallback to empty state if API fails
                setPatients([]);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);

    if (loading) {
        return <div style={{ background: "#F5F5F5", padding: "60px 20px" }}>Đang tải...</div>;
    }

    if (!activePatient) {
        return <div style={{ background: "#F5F5F5", padding: "60px 20px" }}>Không có dữ liệu đánh giá</div>;
    }

    return (
        <div style={{ background: "#F5F5F5" }}>
            <div className="slide5">
                <h1>Cảm nhận của bệnh nhân</h1>

                <div className="review-card">

                    <div className="avatar">
                        <img src={activePatient.imageUrl || `https://randomuser.me/api/portraits/men/1.jpg`} alt={activePatient.fullName} />
                    </div>

                    <div className="chat-bubble">

                        <div className="patient-info">
                            <h3>{activePatient.fullName}</h3>
                            <span>Bệnh: {activePatient.sick}</span>
                        </div>

                        <Rate disabled defaultValue={activePatient.evaluate} />

                        <p className="review-text">
                            {activePatient.text}
                        </p>

                        {activePatient.createdAt && (
                            <p style={{ fontSize: "12px", color: "#94a3b8", marginTop: "12px" }}>
                                {new Date(activePatient.createdAt).toLocaleDateString('vi-VN', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        )}

                    </div>

                </div>

                <div className="slide5-thumbnails">
                    {patients.map((p) => (
                        <div
                            key={p.id}
                            className={`thumb ${activePatient.id === p.id ? "active" : ""}`}
                            onClick={() => setActivePatient(p)}
                        >
                            <img src={p.imageUrl || `https://randomuser.me/api/portraits/men/1.jpg`} alt={p.fullName} />
                        </div>
                    ))}
                    <button
                        className="feedback-btn"
                        onClick={() => navigate("/feedback")}
                        title="Gửi đánh giá"
                    >
                        <span className="feedback-icon">⭐</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Slide5;