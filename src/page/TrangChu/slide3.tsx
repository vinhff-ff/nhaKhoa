import { Row, Col } from "antd";
import {
  UsergroupAddOutlined,
  MedicineBoxOutlined,
  DollarOutlined
} from "@ant-design/icons";

const Slide3 = () => {
  const reasons = [
    {
      id: 1,
      icon: <UsergroupAddOutlined style={{color:'#1E3A8A'}}/>,
      title: "Bác sĩ đầu ngành",
      desc: "Đội ngũ bác sĩ nhãn khoa có chuyên môn cao và nhiều năm kinh nghiệm trong khám, chẩn đoán và điều trị các bệnh lý về mắt. Luôn tư vấn tận tâm, đưa ra phác đồ điều trị phù hợp cho từng bệnh nhân."
    },
    {
      id: 2,
      icon: <MedicineBoxOutlined style={{color:'#06B6D4'}}/>,
      title: "Hệ thống thiết bị hiện đại",
      desc: "Phòng khám được trang bị hệ thống máy móc và công nghệ nhãn khoa tiên tiến, hỗ trợ phát hiện sớm và điều trị chính xác các bệnh lý về mắt, đảm bảo quy trình khám chữa bệnh an toàn và vô trùng."
    },
    {
      id: 3,
      icon: <DollarOutlined style={{color:'gold'}}/>,
      title: "Chi phí hợp lý",
      desc: "Chi phí khám và điều trị được công khai minh bạch, phù hợp với nhiều đối tượng khách hàng. Cam kết mang đến dịch vụ chất lượng cao với mức chi phí hợp lý."
    }
  ];

  return (
    <div className="slide3">

      <div className="slide3-header">
        <h2>VÌ SAO NÊN KHÁM MẮT TẠI TÂN TÂY ĐÔ?</h2>
      </div>

      <div className="slide3-content">
        <Row gutter={[40, 40]} justify="center">
          {reasons.map((item) => (
            <Col xs={24} sm={12} md={8} key={item.id}>
              <div className="reason-card">

                <div className="reason-icon">
                  {item.icon}
                </div>

                <h3>{item.title}</h3>

                <p>{item.desc}</p>

              </div>
            </Col>
          ))}
        </Row>
      </div>

    </div>
  );
};

export default Slide3;