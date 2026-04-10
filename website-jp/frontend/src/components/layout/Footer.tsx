'use client';

import Link from 'next/link';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* 公司信息 */}
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium mb-4">柏木设计</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            花は散り また咲く 一期一会を大切に
                        </p>
                        <p className="text-sm text-gray-600">
                            精致的手工首饰设计与制作
                        </p>
                    </div>

                    {/* 快速链接 */}
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-medium mb-4">快速链接</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products" className="text-sm text-gray-600 hover:text-accent">
                                    产品展示
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-sm text-gray-600 hover:text-accent">
                                    关于我们
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="text-sm text-gray-600 hover:text-accent">
                                    设计服务
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-gray-600 hover:text-accent">
                                    联系我们
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 产品类别 */}
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-medium mb-4">产品类别</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/products?category=耳环" className="text-sm text-gray-600 hover:text-accent">
                                    耳环
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=戒指" className="text-sm text-gray-600 hover:text-accent">
                                    戒指
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=手链手镯" className="text-sm text-gray-600 hover:text-accent">
                                    手链手镯
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=项链" className="text-sm text-gray-600 hover:text-accent">
                                    项链
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=胸针" className="text-sm text-gray-600 hover:text-accent">
                                    胸针
                                </Link>
                            </li>
                            <li>
                                <Link href="/products?category=套装" className="text-sm text-gray-600 hover:text-accent">
                                    套装
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* 联系信息 */}
                    <div className="md:col-span-1">
                        <h3 className="text-sm font-medium mb-4">联系我们</h3>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 mr-2 mt-1"
                                >
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                <span>+86 123 4567 8910</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 mr-2 mt-1"
                                >
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                <span>info@kashiwagi-design.com</span>
                            </li>
                            <li className="flex items-start">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="w-4 h-4 mr-2 mt-1"
                                >
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                                <span>东京都新宿区西新宿1-1-1<br />柏木设计工作室</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* 版权信息 */}
                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-600">© {currentYear} 柏木设计 版权所有</p>
                    <div className="mt-4 md:mt-0 flex space-x-6">
                        <a href="#" className="text-gray-600 hover:text-accent">
                            <span className="sr-only">微博</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19.5 3h-15A1.5 1.5 0 003 4.5v15A1.5 1.5 0 004.5 21h15a1.5 1.5 0 001.5-1.5v-15A1.5 1.5 0 0019.5 3zm-7.797 14.45c-3.466 0-6.253-1.667-6.253-3.73 0-1.222.978-2.618 2.67-3.973 1.677-1.352 3.632-1.95 4.277-1.364.276.253.317.698.117 1.228-.1.27.066.364.293.14 1.134-1.14.306-.513.306-.513s.766-1.117.18-1.937c-1.217-1.212-4.07-.09-6.6 1.783-1.505 1.118-2.413 2.3-2.413 3.642 0 2.146 2.74 3.538 6.286 3.58 3.457.045 5.72-1.194 6.127-2.158.475-1.12-.62-1.764-1.663-1.77a4.315 4.315 0 00-1.805.388c-.215.115-.195-.156-.078-.337.195-.31.337-.603.337-.863 0-.416-.34-.753-.914-.753-1.11 0-2.463 1.334-2.463 2.96 0 1.33 1.953 2.16 3.86.536.556-.473 1.023-1.195 1.372-1.856.117-.233.35-.22.384-.09l.09.264c.33 1.05.136 1.82-.746 2.24-1.17.55-4.463.364-6.954.364z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-600 hover:text-accent">
                            <span className="sr-only">微信</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.507 14.307c-.163 0-.312.048-.459.111v-.05c.226-.104.459-.209.691-.355.009-.003.021-.01.03-.01.087-.035.183-.059.282-.059a.73.73 0 01.731.73.736.736 0 01-.731.731 2.98 2.98 0 01-.544-.098zm-2.786-3.673c-.274 0-.522.111-.69.285a.949.949 0 00-.285.693c0 .274.11.522.285.69a.949.949 0 00.69.285c.274 0 .522-.11.69-.285a.949.949 0 00.285-.69.949.949 0 00-.285-.693 1.01 1.01 0 00-.69-.285zm3.631-3.339h-9.17a4.27 4.27 0 00-4.267 4.267v4.735a4.27 4.27 0 004.267 4.267h9.17a4.27 4.27 0 004.267-4.267V11.56a4.27 4.27 0 00-4.267-4.267zm-3.94 8.267c-.546 0-1.004-.163-1.557-.451-.177.033-.369.058-.573.08l-.503.089-.458-.579c-.297-.379-.471-.837-.471-1.327 0-1.193.969-2.156 2.166-2.156 1.193 0 2.165.969 2.165 2.156 0 1.196-.972 2.188-2.165 2.188h.896zm3.132 0c.45 0 .879-.145 1.251-.415l.43.533.85-.152c.132-.023.259-.043.377-.067a1.746 1.746 0 01-.442 1.009l.458.579.503-.089c.2-.03.388-.055.563-.081.554.289 1.009.453 1.558.453 1.193 0 2.166-.992 2.166-2.188s-.973-2.156-2.166-2.156c-1.196 0-2.168.963-2.168 2.156 0 .49.175.946.472 1.327zm-6.136-1.755c-.274 0-.522.11-.69.285a.949.949 0 00-.285.69c0 .274.11.522.285.69a.949.949 0 00.69.285c.271 0 .522-.11.69-.285a.949.949 0 00.285-.69.949.949 0 00-.285-.69 1.01 1.01 0 00-.69-.285z" />
                            </svg>
                        </a>
                        <a href="#" className="text-gray-600 hover:text-accent">
                            <span className="sr-only">Instagram</span>
                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path
                                    fillRule="evenodd"
                                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
