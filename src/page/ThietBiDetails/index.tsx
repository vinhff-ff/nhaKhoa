import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SoiMat1 from '../../assets/khamMat.png'
import SoiMat2 from '../../assets/soiMat2.png'
import SoiMat3 from '../../assets/soiMat3.png'
export interface Device {
  id: string;
  tag: string;
  name: string;
  subtitle: string;
  img: string;
  intro: string[];
  application: string[];
  benefits: string[];
}

export const devices: Device[] = [
  {
    id: "auto-refractometer",
    tag: "Đo khúc xạ",
    name: "Máy đo khúc xạ tự động",
    subtitle: "Auto Refractometer",
    img: SoiMat1,
    intro: [
      "Máy đo khúc xạ tự động (Auto Refractometer) là một trong những thiết bị quan trọng và được sử dụng phổ biến trong các phòng khám mắt hiện đại. Thiết bị này giúp kiểm tra nhanh và chính xác các tật khúc xạ của mắt như cận thị, viễn thị và loạn thị.",
      "Máy hoạt động dựa trên công nghệ phân tích sự phản xạ của ánh sáng khi đi qua các cấu trúc của mắt. Chỉ trong vài giây, thiết bị có thể đưa ra kết quả tương đối chính xác về độ khúc xạ, hỗ trợ bác sĩ trong quá trình chẩn đoán và điều chỉnh thị lực.",
    ],
    application: [
      "Tại Phòng khám mắt Tân Tây Đô, máy đo khúc xạ tự động được sử dụng trong bước kiểm tra thị lực ban đầu cho hầu hết bệnh nhân. Bác sĩ có thể xác định sơ bộ tình trạng khúc xạ và đưa ra các bước kiểm tra tiếp theo nếu cần.",
      "Thiết bị đặc biệt hữu ích trong việc đo độ kính cho người bị cận thị, viễn thị hoặc loạn thị. Ngoài ra còn được sử dụng để kiểm tra thị lực định kỳ cho học sinh, sinh viên và những người làm việc nhiều với máy tính.",
      "Nhờ công nghệ đo tự động và độ chính xác cao, thiết bị giúp rút ngắn thời gian khám mắt, đồng thời giảm sai số so với các phương pháp đo thủ công truyền thống.",
    ],
    benefits: [
      "Đo chính xác các tật khúc xạ như cận thị, viễn thị và loạn thị",
      "Thời gian đo nhanh chóng, chỉ mất vài giây để có kết quả",
      "Hỗ trợ bác sĩ xác định độ kính phù hợp cho từng bệnh nhân",
      "Giúp phát hiện sớm các vấn đề về thị lực",
      "Tăng độ chính xác và hiệu quả trong quá trình khám mắt",
    ],
  },
  {
    id: "fundus-camera",
    tag: "Chẩn đoán hình ảnh",
    name: "Máy chụp đáy mắt",
    subtitle: "Fundus Camera",
    img: SoiMat2,
    intro: [
      "Máy chụp đáy mắt (Fundus Camera) là thiết bị chẩn đoán hình ảnh hiện đại được sử dụng rộng rãi trong lĩnh vực nhãn khoa. Thiết bị giúp chụp lại hình ảnh chi tiết của đáy mắt, bao gồm võng mạc, dây thần kinh thị giác và hệ thống mạch máu trong mắt.",
      "Đáy mắt là khu vực rất quan trọng, nơi có nhiều cấu trúc liên quan trực tiếp đến thị lực. Nhiều bệnh lý nguy hiểm thường xuất hiện tại đây nhưng ở giai đoạn đầu thường không có triệu chứng rõ ràng.",
    ],
    application: [
      "Tại Phòng khám mắt Tân Tây Đô, máy chụp đáy mắt được sử dụng để phát hiện sớm các bệnh lý như bệnh võng mạc do tiểu đường, thoái hóa điểm vàng, tăng nhãn áp hoặc các tổn thương võng mạc.",
      "Hình ảnh đáy mắt được chụp có độ phân giải cao và lưu trữ trong hệ thống. Nhờ đó, bác sĩ có thể so sánh hình ảnh qua từng lần khám để theo dõi sự tiến triển của bệnh.",
      "Việc sử dụng máy chụp đáy mắt không chỉ nâng cao độ chính xác trong chẩn đoán mà còn giúp bệnh nhân hiểu rõ hơn về tình trạng mắt thông qua hình ảnh trực quan.",
    ],
    benefits: [
      "Chụp hình chi tiết võng mạc và đáy mắt",
      "Giúp bác sĩ quan sát rõ các cấu trúc bên trong mắt",
      "Hỗ trợ phát hiện sớm nhiều bệnh lý nguy hiểm về mắt",
      "Lưu trữ hình ảnh để theo dõi sự tiến triển của bệnh",
      "Hỗ trợ bác sĩ đưa ra phương pháp điều trị phù hợp",
    ],
  },
  {
    id: "corneal-topography",
    tag: "Phân tích giác mạc",
    name: "Máy đo bản đồ giác mạc",
    subtitle: "Corneal Topography / Pentacam",
    img: SoiMat3,
    intro: [
      "Máy đo bản đồ giác mạc (Corneal Topography hoặc Pentacam) là thiết bị chẩn đoán chuyên sâu trong nhãn khoa, dùng để phân tích chi tiết cấu trúc và hình dạng của giác mạc — lớp mô trong suốt ở phía trước mắt, đóng vai trò quan trọng trong việc khúc xạ ánh sáng.",
      "Thiết bị hoạt động bằng công nghệ quét và phân tích hình ảnh hiện đại, tạo ra bản đồ màu chi tiết của bề mặt giác mạc, giúp bác sĩ đánh giá chính xác độ cong, độ dày và các đặc điểm cấu trúc.",
    ],
    application: [
      "Tại Phòng khám mắt Tân Tây Đô, máy đo bản đồ giác mạc hỗ trợ chẩn đoán các bệnh lý như giác mạc hình chóp, loạn thị không đều hoặc các biến dạng khác.",
      "Thiết bị đóng vai trò quan trọng trong đánh giá tình trạng mắt trước khi thực hiện các phương pháp điều trị hoặc phẫu thuật khúc xạ.",
      "Khả năng phân tích dữ liệu chi tiết và chính xác giúp bác sĩ đưa ra phương án điều trị phù hợp, nâng cao chất lượng chẩn đoán và đảm bảo an toàn trong điều trị.",
    ],
    benefits: [
      "Phân tích chi tiết hình ảnh và độ cong của giác mạc",
      "Hỗ trợ phát hiện các bệnh lý liên quan đến giác mạc",
      "Giúp chẩn đoán chính xác các trường hợp loạn thị phức tạp",
      "Hỗ trợ bác sĩ đánh giá mắt trước khi điều trị",
      "Nâng cao hiệu quả và độ an toàn trong quá trình khám mắt",
    ],
  },
];

const ThietBiDetails: React.FC = () => {
  let routeParams: { id?: string } = {};
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    routeParams = useParams<{ id: string }>();
  } catch {
    // useParams not available outside Router context
  }

  const getIdFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("id") || routeParams.id || "";
  };

  const [activeId, setActiveId] = useState<string>(getIdFromUrl);

  let navigate: ((path: string) => void) | null = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate();
  } catch {
    navigate = null;
  }

  useEffect(() => {
    const handlePop = () => setActiveId(getIdFromUrl());
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  const device = devices.find((d) => d.id === activeId) || devices[0];
  const related = devices.filter((d) => d.id !== device.id).slice(0, 2);

  const handleNavigate = (id: string) => {
    if (navigate) {
      navigate(`/thiet-bi/${id}`);
    } else {
      const url = new URL(window.location.href);
      url.searchParams.set("id", id);
      window.history.pushState({}, "", url);
    }
    setActiveId(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  return (
    <div className="tbd-page">

      <div className="tbd-layout">
        <main className="tbd-main">
          <div className="tbd-hero">
            <img
              className="tbd-hero__img"
              src={device.img}
              alt={device.name}
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://via.placeholder.com/900x420?text=${encodeURIComponent(device.subtitle)}`;
              }}
            />
            <span className="tbd-hero__tag">{device.tag}</span>
          </div>

          <div className="tbd-title-block">
            <h1 className="tbd-title-block__name">{device.name}</h1>
            <p className="tbd-title-block__subtitle">{device.subtitle}</p>
          </div>
          <section className="tbd-section">
            <h2 className="tbd-section__heading">
              <span className="tbd-section__heading-bar" />
              Giới thiệu về thiết bị
            </h2>
            {device.intro.map((p, i) => (
              <p key={i} className="tbd-section__body">
                {p}
              </p>
            ))}
          </section>

          <section className="tbd-section">
            <h2 className="tbd-section__heading">
              <span className="tbd-section__heading-bar" />
              Ứng dụng trong khám và điều trị mắt
            </h2>
            {device.application.map((p, i) => (
              <p key={i} className="tbd-section__body">
                {p}
              </p>
            ))}
          </section>

          <section className="tbd-section">
            <h2 className="tbd-section__heading">
              <span className="tbd-section__heading-bar" />
              Lợi ích của thiết bị
            </h2>
            <ul className="tbd-benefits">
              {device.benefits.map((b, i) => (
                <li key={i} className="tbd-benefits__item">
                  <span className="tbd-benefits__dot" />
                  {b}
                </li>
              ))}
            </ul>
          </section>
        </main>
        <aside className="tbd-sidebar">
          <h3 className="tbd-sidebar__title">Thiết bị liên quan</h3>
          <div className="tbd-sidebar__list">
            {related.map((r) => (
              <button
                key={r.id}
                className="tbd-rel-card"
                onClick={() => handleNavigate(r.id)}
              >
                <div className="tbd-rel-card__img-wrap">
                  <img
                    className="tbd-rel-card__img"
                    src={r.img}
                    alt={r.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://via.placeholder.com/240x140?text=${encodeURIComponent(r.subtitle)}`;
                    }}
                  />
                  <span className="tbd-rel-card__tag">{r.tag}</span>
                </div>
                <div className="tbd-rel-card__body">
                  <p className="tbd-rel-card__name">{r.name}</p>
                  <p className="tbd-rel-card__sub">{r.subtitle}</p>
                  <span className="tbd-rel-card__link">Xem chi tiết →</span>
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ThietBiDetails;