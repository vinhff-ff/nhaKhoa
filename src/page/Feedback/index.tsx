import { useState } from "react";
import { Form, Input, Button, Rate, message } from "antd";
import { createFeedback } from "../../api/api";
import "./feedback.scss";

const Feedback = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                sick: values.sick,
                text: values.text,
                evaluate: values.evaluate,
            };
            await createFeedback(payload);
            message.success("Gửi đánh giá thành công!");
            form.resetFields();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            message.error("Gửi đánh giá thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
            <div className="feedback-page">
                <div className="feedback-container">
                    <div className="feedback-header">
                        <h1>Đánh giá dịch vụ</h1>
                        <p>Chia sẻ trải nghiệm của bạn với chúng tôi</p>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="feedback-form"
                    >
                        <Form.Item
                            label="Bệnh / Triệu chứng"
                            name="sick"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập bệnh hoặc triệu chứng",
                                },
                            ]}
                        >
                            <Input
                                placeholder="Vd: Cảm cúm, Viêm họng..."
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item
                            label="Đánh giá"
                            name="evaluate"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng chọn mức đánh giá",
                                },
                            ]}
                        >
                            <Rate style={{ fontSize: 24 }} />
                        </Form.Item>

                        <Form.Item
                            label="Nhận xét"
                            name="text"
                            rules={[
                                {
                                    required: true,
                                    message: "Vui lòng nhập nhận xét của bạn",
                                },
                                {
                                    min: 10,
                                    message: "Nhận xét phải có ít nhất 10 ký tự",
                                },
                            ]}
                        >
                            <Input.TextArea
                                rows={10}
                                placeholder="Chia sẻ trải nghiệm của bạn về dịch vụ..."
                                size="large"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                size="large"
                                className="feedback-submit-btn"
                            >
                                Gửi đánh giá
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
    );
};

export default Feedback;
