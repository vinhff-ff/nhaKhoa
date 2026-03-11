import { useState } from "react";
import { Rate } from "antd";

const Slide5 = () => {
    const patients = [
        {
            id: 1,
            name: "Nguyễn Văn Minh",
            disease: "Cận thị 6 độ",
            review:
                "Sau khi phẫu thuật, thị lực của tôi cải thiện rất rõ rệt. Bác sĩ tư vấn tận tình và quá trình điều trị diễn ra rất nhanh chóng.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: 2,
            name: "Trần Thị Lan",
            disease: "Loạn thị 3 độ",
            review:
                "Tôi rất hài lòng với dịch vụ tại trung tâm. Trang thiết bị hiện đại và đội ngũ bác sĩ rất chuyên nghiệp.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: 3,
            name: "Lê Quốc Bảo",
            disease: "Cận thị 8 độ",
            review:
                "Sau phẫu thuật tôi có thể nhìn rõ mà không cần kính. Trải nghiệm khám và chăm sóc rất tốt.",
            image: "https://randomuser.me/api/portraits/men/51.jpg"
        },
        {
            id: 4,
            name: "Phạm Thu Hà",
            disease: "Cận + loạn thị",
            review:
                "Đội ngũ bác sĩ rất tận tâm và chuyên nghiệp. Tôi cảm thấy yên tâm ngay từ lần khám đầu tiên.",
            image: "https://randomuser.me/api/portraits/women/65.jpg"
        }
    ];

    const [activePatient, setActivePatient] = useState(patients[0]);

    return (
        <div style={{ background: "#F5F5F5" }}>
            <div className="slide5">
                <h1>Cảm nhận của bệnh nhân</h1>

                <div className="review-card">

                    <div className="avatar">
                        <img src={activePatient.image} alt={activePatient.name} />
                    </div>

                    <div className="chat-bubble">

                        <div className="patient-info">
                            <h3>{activePatient.name}</h3>
                            <span>Bệnh: {activePatient.disease}</span>
                        </div>

                        <Rate disabled defaultValue={5} />

                        <p className="review-text">
                            {activePatient.review}
                        </p>

                    </div>

                </div>

                <div className="slide5-thumbnails">
                    {patients.map((p) => (
                        <div
                            key={p.id}
                            className={`thumb ${activePatient.id === p.id ? "active" : ""}`}
                            onClick={() => setActivePatient(p)}
                        >
                            <img src={p.image} alt={p.name} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Slide5;