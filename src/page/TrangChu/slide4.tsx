import { useNavigate } from "react-router-dom";
import SoiMat1 from "../../assets/khamMat.png";
import SoiMat2 from "../../assets/soiMat2.png";
import SoiMat3 from "../../assets/soiMat3.png";

const surgeryMethods = [
  {
    id: 1,
    deviceId: "auto-refractometer",
    title: "Máy đo khúc xạ tự động",
    subtitle: "Auto Refractometer",
    image: SoiMat1,
  },
  {
    id: 2,
    deviceId: "fundus-camera",
    title: "Máy chụp đáy mắt",
    subtitle: "Fundus Camera",
    image: SoiMat2,
  },
  {
    id: 3,
    deviceId: "corneal-topography",
    title: "Máy đo bản đồ giác mạc",
    subtitle: "Corneal Topography / Pentacam",
    image: SoiMat3,
  },
];

const Slide4 = () => {
  const navigate = useNavigate();

  const handleViewDevice = (deviceId: string) => {
    navigate(`/thiet-bi/${deviceId}`);
  };

  return (
    <div className="slide4">
      <div className="slide4-container">
        <h2 className="slide4-title">CÁC THIẾT BỊ PHẪU THUẬT HIỆN ĐẠI</h2>

        <p className="slide4-desc">
          Phòng khám Tân Tây Đô thành lập từ năm 2021, trải qua 5 năm
          xây dựng và phát triển, đến nay đã khẳng định được uy tín thương
          hiệu trung tâm khúc xạ luôn dẫn đầu tại Việt Nam với hệ thống
          trang thiết bị tiên tiến trên thế giới và đội ngũ chuyên gia, bác
          sĩ, kĩ thuật viên nhiều năm kinh nghiệm.
        </p>

        <div className="slide4-list">
          {surgeryMethods.map((item) => (
            <div
              className="slide4-card slide4-card--clickable"
              key={item.id}
              onClick={() => handleViewDevice(item.deviceId)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === "Enter" && handleViewDevice(item.deviceId)
              }
            >
              <div className="card-img">
                <img src={item.image} alt={item.title} />
              </div>

              <div className="card-content">
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
                <span className="card-link">Xem chi tiết →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slide4;