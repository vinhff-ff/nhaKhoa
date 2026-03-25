import React, { useRef, useEffect, useState } from "react";
import { Carousel } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { getPost } from "../../api/admin";

interface Post {
  id: number;
  title: string;
  content: string;
  status: string;
  img: string;
  publishedAt: string;
  createdAt: string;
}

const Slide1 = () => {
  const carouselRef = useRef<any>(null);
  const [slides, setSlides] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await getPost();
        const list: Post[] = Array.isArray(res) ? res : res?.data ?? [];
        setSlides(list.filter(p => p.status === "PUBLISHED"));
      } catch (err) {
        console.error("Lỗi tải bài viết:", err);
      }
    };
    fetchPosts();
  }, []);

  if (slides.length === 0) return null;

  return (
    <div className="home-banner">
      <div className="banner-arrow left" onClick={() => carouselRef.current.prev()}>
        <LeftOutlined />
      </div>

      <Carousel autoplay ref={carouselRef}>
        {slides.map((item) => (
          <div key={item.id} className="banner-slide">
            <img src={item.img} alt={item.title} />
            <div className="banner-content">
              <h2>{item.title}</h2>
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </Carousel>

      <div className="banner-arrow right" onClick={() => carouselRef.current.next()}>
        <RightOutlined />
      </div>
    </div>
  );
};

export default Slide1;