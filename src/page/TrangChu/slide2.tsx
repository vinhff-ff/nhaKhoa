import { useState } from "react";
import { Row, Col } from "antd";

const Slide2 = () => {
  const doctors = [
    {
      id: 1,
      name: "LÊ THỊ THU HÀ",
      school: "TRƯỞNG KHOA KHÚC XẠ - BỆNH VIỆN MẮT QUỐC TẾ DND SÀI GÒN",
      desc1:
        "Với hơn 12 năm kinh nghiệm trong lĩnh vực điều trị và phẫu thuật khúc xạ, ThS.BS Lê Thị Thu Hà là chuyên gia uy tín trong kiểm soát tiến triển cận thị và các phẫu thuật khúc xạ hiện đại.",
      desc2:
        "Tốt nghiệp Thạc sĩ Nhãn khoa – Đại học Y Hà Nội, BS đã thực hiện hàng nghìn ca phẫu thuật thành công, giúp nhiều bệnh nhân lấy lại thị lực và chất lượng sống tốt hơn.",
      desc3:
        "Luôn cập nhật các kỹ thuật tiên tiến như LASIK, ReLEx SMILE, Femto-Pro và được bệnh nhân yêu mến bởi sự tận tâm trong từng ca điều trị.",
      image: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      name: "TRẦN MINH HUY",
      school: "BÁC SĨ CHUYÊN KHOA NỘI - BỆNH VIỆN ĐẠI HỌC Y HÀ NỘI",
      desc1:
        "Hơn 10 năm kinh nghiệm trong khám và điều trị các bệnh lý nội khoa tổng quát, đặc biệt là tim mạch và huyết áp.",
      desc2:
        "Tốt nghiệp Đại học Y Hà Nội và từng tham gia nhiều chương trình đào tạo chuyên sâu về tim mạch tại các bệnh viện lớn.",
      desc3:
        "Bác sĩ được bệnh nhân đánh giá cao bởi phong cách khám nhẹ nhàng, tư vấn chi tiết và theo dõi sát sao quá trình điều trị.",
      image: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      name: "PHẠM THỊ LAN",
      school: "BÁC SĨ NHI KHOA - BỆNH VIỆN NHI ĐỒNG TP.HCM",
      desc1:
        "Chuyên gia trong lĩnh vực nhi khoa với hơn 9 năm kinh nghiệm khám và điều trị các bệnh thường gặp ở trẻ em.",
      desc2:
        "Tốt nghiệp Đại học Y Dược TP.HCM, BS Lan có nhiều kinh nghiệm trong tư vấn dinh dưỡng và chăm sóc sức khỏe toàn diện cho trẻ.",
      desc3:
        "Luôn đặt sự an toàn và phát triển khỏe mạnh của trẻ lên hàng đầu trong quá trình khám và điều trị.",
      image: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      id: 4,
      name: "LÊ VĂN HẢI",
      school: "BÁC SĨ NỘI KHOA - BỆNH VIỆN TRUNG ƯƠNG HUẾ",
      desc1:
        "Có hơn 11 năm kinh nghiệm trong khám và điều trị các bệnh lý nội khoa, đặc biệt về tiêu hóa và gan mật.",
      desc2:
        "Tốt nghiệp Đại học Y Huế và từng tham gia nhiều hội thảo chuyên ngành trong và ngoài nước.",
      desc3:
        "Bác sĩ luôn chú trọng phương pháp điều trị cá nhân hóa, giúp bệnh nhân đạt hiệu quả điều trị tốt nhất.",
      image: "https://randomuser.me/api/portraits/men/51.jpg"
    }
  ];

  const [activeDoctor, setActiveDoctor] = useState(doctors[0]);

  return (
    <div className="slide2">
      <h1>Đội ngũ bác sĩ</h1>

      <Row gutter={40} align="stretch">

        <Col xs={24} md={12}>
          <div className="slide2-main-img">
            <img src={activeDoctor.image} alt={activeDoctor.name} />
          </div>
        </Col>

        <Col xs={24} md={12}>
          <div className="slide2-content">
            <span className="doctor-title">Thạc sĩ - Bác sĩ</span>

            <h2 className="doctor-name">{activeDoctor.name}</h2>

            <p className="doctor-school">{activeDoctor.school}</p>

            <div className="doctor-desc-wrapper">
              <div className="doctor-desc-box">
                <p>{activeDoctor.desc1}</p>
                <p>{activeDoctor.desc2}</p>
                <p>{activeDoctor.desc3}</p>
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
            <img src={doc.image} alt={doc.name} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slide2;