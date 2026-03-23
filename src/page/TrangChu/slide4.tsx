import { useNavigate } from "react-router-dom";

const surgeryMethods = [
  {
    id: 1,
    deviceId: "auto-refractometer",
    title: "Phẫu thuật SMILE Pro DND",
    subtitle: "SMILE trên máy VISUMAX 800 của ZEISS",
    image: "https://images.unsplash.com/photo-1588776814546-ec7e89f0f89d",
  },
  {
    id: 2,
    deviceId: "fundus-camera",
    title: "Phẫu thuật CLEAR",
    subtitle: "No Flap & Small Incision Lenticule Extraction",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
  },
  {
    id: 3,
    deviceId: "corneal-topography",
    title: "Phẫu thuật Femto Pro",
    subtitle: "Femto LASIK trên máy VISUMAX 800",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118",
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
          Trung Tâm khúc xạ DND thành lập từ năm 2011, trải qua gần 15 năm
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