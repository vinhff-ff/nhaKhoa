import React from "react";
import Anh1 from "../../assets/gt1.jpg";
import Anh2 from "../../assets/gt2.jpg";

const stats = [
  { value: "2021", label: "Năm thành lập" },
  { value: "5+", label: "Năm kinh nghiệm" },
  { value: "100%", label: "Tận tâm — chu đáo" },
];

const highlights = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    title: "Chuyên khoa mắt",
    desc: "Thăm khám, chẩn đoán và điều trị toàn diện các bệnh lý về mắt.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Đội ngũ chuyên môn",
    desc: "Bác sĩ và nhân viên y tế có chuyên môn cao, làm việc tận tâm và chu đáo.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    title: "Thiết bị hiện đại",
    desc: "Trang bị các thiết bị y tế hỗ trợ khám và chẩn đoán mắt chính xác, hiệu quả.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: "Chi phí hợp lý",
    desc: "Dịch vụ chất lượng cao với mức chi phí minh bạch, phù hợp mọi đối tượng.",
  },
];

const GioiThieu: React.FC = () => {
  return (
    <div className="gt-page">

      {/* ══ HERO SECTION ══ */}
      <section className="gt-hero">
        <div className="gt-hero__img-wrap">
          <img
            src={Anh1}
            alt="Phòng khám mắt Tân Tây Đô"
            className="gt-hero__img"
          />
          <div className="gt-hero__overlay" />
        </div>

        <div className="gt-hero__content">
          <span className="gt-hero__eyebrow">Đan Phượng, Hà Nội · Thành lập 2021</span>
          <h1 className="gt-hero__title">
            Phòng khám mắt<br />
            <em>Tân Tây Đô</em>
          </h1>
          <p className="gt-hero__tagline">
            Chăm sóc &amp; bảo vệ sức khỏe đôi mắt — lấy người bệnh làm trung tâm
          </p>
        </div>

        {/* Stats strip */}
        <div className="gt-stats">
          {stats.map((s, i) => (
            <div className="gt-stats__item" key={i}>
              <span className="gt-stats__value">{s.value}</span>
              <span className="gt-stats__label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ INTRO SECTION ══ */}
      <section className="gt-intro">
        <div className="gt-intro__inner">

          {/* Left: text */}
          <div className="gt-intro__text">
            <div className="gt-section-label">Giới thiệu</div>
            <h2 className="gt-intro__heading">
              Địa chỉ chăm sóc mắt <br />đáng tin cậy tại Đan Phượng
            </h2>

            <p className="gt-intro__body">
              Phòng khám mắt Tân Tây Đô là cơ sở chuyên khoa về mắt uy tín tọa lạc tại Đan Phượng, Hà Nội.
              Được thành lập vào năm 2021 với định hướng mang đến dịch vụ chăm sóc và bảo vệ sức khỏe
              đôi mắt cho mọi người.
            </p>
            <p className="gt-intro__body">
              Phòng khám không chỉ tập trung vào thăm khám, chẩn đoán và điều trị các bệnh lý về mắt
              mà còn chú trọng đến tư vấn, phòng ngừa và nâng cao nhận thức về chăm sóc thị lực
              cho cộng đồng.
            </p>
            <p className="gt-intro__body">
              Với định hướng phát triển bền vững, phòng khám không ngừng nâng cao chất lượng dịch vụ,
              cập nhật các phương pháp khám và điều trị phù hợp, đảm bảo hiệu quả và chi phí hợp lý
              cho người dân.
            </p>

            <div className="gt-intro__quote">
              <span className="gt-intro__quote-mark">"</span>
              Lấy người bệnh làm trung tâm trong mọi hoạt động
            </div>
          </div>

          {/* Right: image */}
          <div className="gt-intro__img-wrap">
            <img
              src={Anh2}
              alt="Đội ngũ phòng khám Tân Tây Đô"
              className="gt-intro__img"
            />
            <div className="gt-intro__img-badge">
              <span className="gt-intro__img-badge-year">2021</span>
              <span className="gt-intro__img-badge-text">Thành lập</span>
            </div>
          </div>

        </div>
      </section>

      {/* ══ MISSION SECTION ══ */}
      <section className="gt-mission">
        <div className="gt-mission__inner">
          <div className="gt-section-label gt-section-label--light">Sứ mệnh</div>
          <h2 className="gt-mission__heading">
            Đồng hành cùng cộng đồng <br />bảo vệ sức khỏe đôi mắt
          </h2>
          <p className="gt-mission__body">
            Phòng khám hướng tới xây dựng một môi trường y tế chuyên nghiệp, thân thiện và gần gũi,
            giúp người bệnh cảm thấy thoải mái và tin tưởng trong suốt quá trình sử dụng dịch vụ.
            Trong quá trình hoạt động, Phòng khám Mắt Tân Tây Đô đã và đang trở thành địa chỉ
            chăm sóc mắt quen thuộc, đáng tin cậy của nhiều người dân tại Đan Phượng.
          </p>
        </div>
      </section>

      {/* ══ HIGHLIGHTS ══ */}
      <section className="gt-highlights">
        <div className="gt-section-label">Điểm nổi bật</div>
        <h2 className="gt-highlights__heading">Cam kết của chúng tôi</h2>

        <div className="gt-highlights__grid">
          {highlights.map((h, i) => (
            <div className="gt-hl-card" key={i}>
              <div className="gt-hl-card__icon">{h.icon}</div>
              <h3 className="gt-hl-card__title">{h.title}</h3>
              <p className="gt-hl-card__desc">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default GioiThieu;