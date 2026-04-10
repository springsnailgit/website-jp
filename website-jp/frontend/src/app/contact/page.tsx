'use client';

import MainLayout from '@/components/layout/MainLayout';
import { FormEvent, useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success?: boolean; message?: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitResult(null);

        // 这里模拟一个提交过程
        try {
            // 在实际项目中，这里会是一个真实的API调用
            await new Promise(resolve => setTimeout(resolve, 1500));

            // 模拟成功响应
            setSubmitResult({
                success: true,
                message: '您的消息已成功发送！我们会尽快与您联系。'
            });

            // 清空表单
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            // 模拟失败响应
            setSubmitResult({
                success: false,
                message: '发送失败，请稍后再试或直接联系我们。'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            {/* 顶部横幅 */}
            <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gray-800">
                <div className="absolute inset-0 z-0">
                    <div className="w-full h-full bg-gray-800">
                        {/* 图片将来从资源文件夹加载 */}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>

                <div className="container mx-auto px-4 z-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-medium text-white mb-6">
                        联系我们
                    </h1>
                    <p className="text-xl text-white mb-8 max-w-3xl mx-auto">
                        无论是产品咨询、定制需求还是合作机会，我们很期待听到您的声音
                    </p>
                </div>
            </section>

            {/* 联系信息 */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                        {/* 联系信息 */}
                        <div>
                            <h2 className="text-3xl font-medium mb-8">联系方式</h2>

                            <div className="space-y-8">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">地址</h3>
                                        <p className="text-gray-600">
                                            东京都新宿区西新宿1-1-1<br />
                                            柏木设计工作室<br />
                                            邮编: 160-0023
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">电子邮件</h3>
                                        <p className="text-gray-600">
                                            一般咨询: <a href="mailto:info@kashiwagi-design.com" className="text-accent hover:underline">info@kashiwagi-design.com</a><br />
                                            客户支持: <a href="mailto:support@kashiwagi-design.com" className="text-accent hover:underline">support@kashiwagi-design.com</a><br />
                                            商务合作: <a href="mailto:business@kashiwagi-design.com" className="text-accent hover:underline">business@kashiwagi-design.com</a>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">电话</h3>
                                        <p className="text-gray-600">
                                            总机: +81 3-1234-5678<br />
                                            客服: +81 3-1234-5679
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mr-4 flex-shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium mb-2">营业时间</h3>
                                        <p className="text-gray-600">
                                            周一至周五: 上午10点 - 下午6点<br />
                                            周六: 上午10点 - 下午4点<br />
                                            周日及法定假日: 休息
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12">
                                <h3 className="text-lg font-medium mb-4">关注我们</h3>
                                <div className="flex space-x-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-accent hover:text-white transition-colors">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-accent hover:text-white transition-colors">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-7.797 14.45c-3.466 0-6.253-1.667-6.253-3.73 0-1.222.978-2.618 2.67-3.973 1.677-1.352 3.632-1.95 4.277-1.364.276.253.317.698.117 1.228-.1.27.066.364.293.14 1.134-1.14.306-.513.306-.513s.766-1.117.18-1.937c-1.217-1.212-4.07-.09-6.6 1.783-1.505 1.118-2.413 2.3-2.413 3.642 0 2.146 2.74 3.538 6.286 3.58 3.457.045 5.72-1.194 6.127-2.158.475-1.12-.62-1.764-1.663-1.77a4.315 4.315 0 00-1.805.388c-.215.115-.195-.156-.078-.337.195-.31.337-.603.337-.863 0-.416-.34-.753-.914-.753-1.11 0-2.463 1.334-2.463 2.96 0 1.33 1.953 2.16 3.86.536.556-.473 1.023-1.195 1.372-1.856.117-.233.35-.22.384-.09l.09.264c.33 1.05.136 1.82-.746 2.24-1.17.55-4.463.364-6.954.364z" />
                                        </svg>
                                    </a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-accent hover:text-white transition-colors">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.507 14.307c-.163 0-.312.048-.459.111v-.05c.226-.104.459-.209.691-.355.009-.003.021-.01.03-.01.087-.035.183-.059.282-.059a.73.73 0 01.731.73.736.736 0 01-.731.731 2.98 2.98 0 01-.544-.098zm-2.786-3.673c-.274 0-.522.111-.69.285a.949.949 0 00-.285.693c0 .274.11.522.285.69a.949.949 0 00.69.285c.274 0 .522-.11.69-.285a.949.949 0 00.285-.69.949.949 0 00-.285-.693 1.01 1.01 0 00-.69-.285zm3.631-3.339h-9.17a4.27 4.27 0 00-4.267 4.267v4.735a4.27 4.27 0 004.267 4.267h9.17a4.27 4.27 0 004.267-4.267V11.56a4.27 4.27 0 00-4.267-4.267zm-3.94 8.267c-.546 0-1.004-.163-1.557-.451-.177.033-.369.058-.573.08l-.503.089-.458-.579c-.297-.379-.471-.837-.471-1.327 0-1.193.969-2.156 2.166-2.156 1.193 0 2.165.969 2.165 2.156 0 1.196-.972 2.188-2.165 2.188h.896zm3.132 0c.45 0 .879-.145 1.251-.415l.43.533.85-.152c.132-.023.259-.043.377-.067a1.746 1.746 0 01-.442 1.009l.458.579.503-.089c.2-.03.388-.055.563-.081.554.289 1.009.453 1.558.453 1.193 0 2.166-.992 2.166-2.188s-.973-2.156-2.166-2.156c-1.196 0-2.168.963-2.168 2.156 0 .49.175.946.472 1.327zm-6.136-1.755c-.274 0-.522.11-.69.285a.949.949 0 00-.285.69c0 .274.11.522.285.69a.949.949 0 00.69.285c.271 0 .522-.11.69-.285a.949.949 0 00.285-.69.949.949 0 00-.285-.69 1.01 1.01 0 00-.69-.285z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* 联系表单 */}
                        <div className="bg-white p-6 md:p-8 border border-gray-200 rounded-sm">
                            <h2 className="text-xl font-medium mb-6">发送消息</h2>

                            {submitResult && (
                                <div
                                    className={`p-4 mb-6 rounded-sm ${submitResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                        }`}
                                >
                                    {submitResult.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">姓名 *</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">电子邮件 *</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">电话</label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">主题 *</label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                                        >
                                            <option value="">请选择...</option>
                                            <option value="产品咨询">产品咨询</option>
                                            <option value="定制服务">定制服务</option>
                                            <option value="软件咨询">软件咨询</option>
                                            <option value="商务合作">商务合作</option>
                                            <option value="其他">其他</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">留言内容 *</label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={6}
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-accent"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-full py-3"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? '发送中...' : '发送消息'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* 地图 */}
            <section className="bg-gray-50 py-20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-medium text-center mb-10">来访指南</h2>
                    <div className="relative w-full h-[400px] bg-gray-200">
                        {/* 实际项目中这里会嵌入地图 */}
                        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                            地图将在这里显示
                        </div>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
