import { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { getDoctor } from "../../api/admin";

interface Doctor {
  id: number;
  name: string;
  specialized: string;
  information: string;
  lever: string;
  img: string | null;
}

const LEVER_MAP: Record<string, string> = {
  "TIẾN SĨ": "Tiến sĩ - Bác sĩ",
  "THẠC SĨ": "Thạc sĩ - Bác sĩ",
  "BÁC SĨ": "Bác sĩ",
};

const Slide2 = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getDoctor();
        const list: Doctor[] = Array.isArray(res) ? res : res?.data ?? [];
        setDoctors(list);
        if (list.length > 0) setActiveDoctor(list[0]);
      } catch (err) {
        console.error("Lỗi tải bác sĩ:", err);
      }
    };
    fetch();
  }, []);

  if (!activeDoctor) return null;

  return (
    <div className="slide2">
      <Row gutter={40} align="stretch">

        <Col xs={24} md={12}>
          <div className="slide2-main-img">
            {activeDoctor.img ? (
              <img src={activeDoctor.img} alt={activeDoctor.name} />
            ) : (
              <div className="slide2-avatar-placeholder">
                {activeDoctor.name.charAt(0)}
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="slide2-content">
            <span className="doctor-title">
              {LEVER_MAP[activeDoctor.lever] ?? activeDoctor.lever}
            </span>
            <h2 className="doctor-name">{activeDoctor.name}</h2>
            <p className="doctor-school">{activeDoctor.specialized}</p>
            <div className="doctor-desc-wrapper">
              <div className="doctor-desc-box">
                <p>{activeDoctor.information}</p>
              </div>
            </div>
          </div>
        </Col>

      </Row>

      <div className="slide2-thumbnails">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className={`thumb ${activeDoctor.id === doc.id ? "active" : ""}`}
            onClick={() => setActiveDoctor(doc)}
          >
            {doc.img ? (
              <img src={doc.img} alt={doc.name} />
            ) : (
              <div className="slide2-thumb-placeholder">
                {doc.name.charAt(0)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slide2;