import React, { useRef } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import ButtonCustom from "../../components/custom/button";

const Slide1 = () => {

    const carouselRef = useRef<any>(null);

    const slides = [
        {
            image: "https://picsum.photos/1200/500?random=1",
            title: "Thiết bị y tế hiện đại",
            description:
                "Phòng khám Medicare trang bị đầy đủ các thiết bị và máy móc y tế tiên tiến nhằm đảm bảo mang đến dịch vụ chăm sóc sức khỏe tốt nhất cho khách hàng.",
        },
        {
            image: "https://picsum.photos/1200/500?random=2",
            title: "Đội ngũ bác sĩ chuyên môn cao",
            description:
                "Các bác sĩ với nhiều năm kinh nghiệm trong lĩnh vực y khoa, tận tâm và chuyên nghiệp.",
        },
        {
            image: "https://picsum.photos/1200/500?random=3",
            title: "Dịch vụ chăm sóc tận tâm",
            description:
                "Chúng tôi luôn đặt sức khỏe và sự hài lòng của khách hàng lên hàng đầu.",
        },
    ];

    return (
        <div className="home-banner">
            <div
                className="banner-arrow left"
                onClick={() => carouselRef.current.prev()}
            >
                <LeftOutlined />
            </div>

            <Carousel autoplay ref={carouselRef}>
                {slides.map((item, index) => (
                    <div key={index} className="banner-slide">

                        <img src={item.image} alt="banner" />

                        <div className="banner-content">

                            <h2>{item.title}</h2>

                            <p>{item.description}</p>

                            <ButtonCustom text="Xem thêm"/>

                        </div>

                    </div>
                ))}
            </Carousel>

            <div
                className="banner-arrow right"
                onClick={() => carouselRef.current.next()}
            >
                <RightOutlined />
            </div>

        </div>
    );
};

export default Slide1;