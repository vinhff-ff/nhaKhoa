import React from 'react';

const GioiThieu: React.FC = () => {
  return (
    <div className="container-gt">

      <span className="badge">
        <i className="fas fa-eye"></i> Chuyên khoa mắt & Đa khoa chất lượng cao
      </span>
      <h1>Bệnh viện Đa khoa Tâm Anh Hà Nội</h1>
      <div className="subhead">
        <i className="fas fa-location-dot"></i>
        108 Hoàng Như Tiếp, P. Bồ Đề, Q. Long Biên, Hà Nội
        <span>|</span>
        <i className="fas fa-phone-alt"></i> 024 7106 6858 / 024 3872 3872
      </div>


      <div className="grid2">
        <div className="facilityCard">
          <h2>
            <i className="fas fa-hospital"></i> Bệnh viện Đa khoa Tâm Anh
          </h2>
          <p>Trung tâm Mắt Công nghệ cao - quy tụ chuyên gia đầu ngành, trang bị hiện đại bậc nhất.</p>
          <div className="addressLine">
            <i className="fas fa-map-pin"></i>
            <span>
              <strong>108 Hoàng Như Tiếp</strong>, P. Bồ Đề, Long Biên, Hà Nội
            </span>
          </div>
          <div className="hotline">
            <i className="fas fa-headset"></i> Hotline: 024 7106 6858 - 024 3872 3872
          </div>
          <div>
            <p>
              <strong>Giờ làm việc:</strong> Thứ 2 - Chủ nhật (kể cả lễ, Tết)
            </p>
          </div>
          <div className="services">
            <p>Dịch vụ nổi bật:</p>
            <ul>
              <li>
                <i className="fas fa-check-circle"></i> Phẫu thuật LASIK, SMILE, Phakic
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Phaco đục thủy tinh thể
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Điều trị glôcôm, võng mạc
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Khám mắt trẻ em, tạo hình thẩm mỹ
              </li>
            </ul>
          </div>
          <div className="techTag">
            <span>Femtosecond Laser Visumax 800</span>
            <span>Excimer Laser Amaris 1050S</span>
            <span>Pentacam AXL Wave</span>
          </div>
        </div>

        <div className="facilityCard">
          <h2>
            <i className="fas fa-clinic-medical"></i> Phòng khám Đa khoa Tâm Anh Cầu Giấy
          </h2>
          <p>Cơ sở hiện đại phía Tây Hà Nội, bác sĩ từ Bệnh viện Tâm Anh luân phiên trực tiếp.</p>
          <div className="addressLine">
            <i className="fas fa-map-pin"></i>
            <span>
              <strong>265 Cầu Giấy</strong>, P. Cầu Giấy, Hà Nội
            </span>
          </div>
          <div className="hotline">
            <i className="fas fa-headset"></i> Hotline: 024 7106 6858 - 024 3872 3872
          </div>

          <div className="services">
            <p>Tiện ích vượt trội:</p>
            <ul>
              <li>
                <i className="fas fa-check-circle"></i> Khám mắt toàn diện, máy móc đồng bộ
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Đặt lịch online, nhắc lịch tái khám
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Không gian riêng tư, thoáng rộng
              </li>
              <li>
                <i className="fas fa-check-circle"></i> Bảo hiểm y tế & bảo hiểm tư nhân
              </li>
            </ul>
          </div>
          <div style={{ marginTop: '15px' }}>
            <i className="fas fa-star" style={{ color: '#f4b740' }}></i>{' '}
            <i className="fas fa-star" style={{ color: '#f4b740' }}></i>{' '}
            <i className="fas fa-star" style={{ color: '#f4b740' }}></i>{' '}
            <i className="fas fa-star" style={{ color: '#f4b740' }}></i>{' '}
            <i className="fas fa-star" style={{ color: '#f4b740' }}></i> (4.9/5 từ hơn 2000 đánh giá)
          </div>
        </div>
      </div>

      <div className="demoSection">
        <div className="demoTitle">
          <i className="fas fa-play-circle"></i>
          CẢNH DEMO THỰC TẾ
          <i className="fas fa-map-marked-alt"></i>
        </div>
        <div className="demoFlex">

          <div className="demoItem">
            <h3>
              <i className="fab fa-youtube"></i> Video giới thiệu bệnh viện
            </h3>
            <div className="iframePlaceholder">
              <iframe
                src="https://www.youtube.com/embed/tGBFqM2w6GM?si=WlHpmR_7hTt8gazB"
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
            <p style={{ marginTop: '10px', color: '#2f4858' }}>
              <i className="fas fa-eye"></i> Trung tâm Mắt công nghệ cao - Phẫu thuật SMILE, LASIK, Phaco thế hệ mới.
            </p>
          </div>

          <div className="demoItem">
            <h3>
              <i className="fas fa-map-location-dot" style={{ color: '#0f9d58' }}></i> Bản đồ chỉ đường
            </h3>
            <div className="iframePlaceholder">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.654710073135!2d105.87654387607353!3d21.04627778061243!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a917b1039a3f%3A0x91332e5b8e25d39c!2zMTE4IEhvw6BuZyBOaOG7rSBUaeG6v3AsIELhu5MgxJDDtCwgTG9uZyBCacOqbiwgSMOgIE7hu5lpLCBWaWV0bmFt!5e0!3m2!1svi!2s!4v1712234567890!5m2!1svi!2s"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              ></iframe>
            </div>
            <p style={{ marginTop: '10px' }}>
              <i className="fas fa-location-arrow" style={{ color: '#d1462f' }}></i> 108 Hoàng Như Tiếp (bản đồ thật).
              Cơ sở Cầu Giấy: 265 Cầu Giấy.
            </p>
          </div>
        </div>
      </div>


      <div className="notesBox">
        <h3>
          <i className="fas fa-clipboard-list"></i> Lưu ý khi đi khám mắt tại Hà Nội
        </h3>
        <ul>
          <li>
            <i className="fas fa-glasses"></i> Mang theo kính đang sử dụng (cận/loạn/viễn)
          </li>
          <li>
            <i className="fas fa-notes-medical"></i> Chuẩn bị sẵn các triệu chứng & tiền sử bệnh
          </li>
          <li>
            <i className="fas fa-folder-open"></i> Kết quả khám cũ (nếu có)
          </li>
          <li>
            <i className="fas fa-makeup"></i> Hạn chế trang điểm vùng mắt
          </li>
          <li>
            <i className="fas fa-clock"></i> Sắp xếp thời gian; có thể nhìn mờ tạm thời sau khám
          </li>
          <li>
            <i className="fas fa-comment-medical"></i> Trao đổi đầy đủ với bác sĩ chuyên khoa
          </li>
        </ul>
      </div>

      <div className="featureGrid">
        <div className="featureItem">
          <i className="fas fa-user-md"></i>
          <h4>Đội ngũ bác sĩ đầu ngành</h4>
          <p>Chuyên gia nhãn khoa giàu kinh nghiệm, tận tâm.</p>
        </div>
        <div className="featureItem">
          <i className="fas fa-microscope"></i>
          <h4>Thiết bị hiện đại</h4>
          <p>Visumax 800, Amaris 1050S, Centurion, Corvis ST...</p>
        </div>
        <div className="featureItem">
          <i className="fas fa-hand-holding-heart"></i>
          <h4>Quy trình chuyên nghiệp</h4>
          <p>Đặt khám online, hồ sơ điện tử, bảo hiểm.</p>
        </div>
      </div>

    </div>
  );
};

export default GioiThieu;