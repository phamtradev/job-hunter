import { ArrowRightOutlined, FireOutlined, ThunderboltOutlined } from '@ant-design/icons';
import SearchClient from '@/components/client/search.client';
import JobCard from '@/components/client/card/job.card';
import CompanyCard from '@/components/client/card/company.card';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="relative app-shell">
            <div className="absolute inset-0 bg-subtle-radial opacity-80 pointer-events-none" />
            <div className="absolute -left-10 top-6 w-48 h-48 bg-primary-500/15 blur-3xl rounded-full animate-float pointer-events-none" />
            <div className="absolute -right-10 top-20 w-56 h-56 bg-emerald-400/12 blur-3xl rounded-full animate-float pointer-events-none" />
            <div className="relative page-container py-10 sm:py-14 space-y-12">

                {/* Hero */}
                <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                    <div className="lg:col-span-3 space-y-6">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 shadow-sm px-4 py-2 text-sm font-medium text-primary-700">
                            <ThunderboltOutlined className="text-primary-500" />
                            Nền tảng tuyển dụng IT hàng đầu
                        </div>
                        <div className="space-y-4">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 leading-tight">
                                Tìm công việc mơ ước, kết nối với công ty công nghệ hàng đầu
                            </h1>
                            <p className="text-lg text-slate-600 max-w-2xl">
                                Khám phá hàng nghìn cơ hội việc làm, nhà tuyển dụng uy tín và hồ sơ công ty chi tiết.
                                Trải nghiệm tìm kiếm nhanh, trực quan và thân thiện trên mọi thiết bị.
                            </p>
                        </div>
                        <div className="bg-white/90 backdrop-blur border border-slate-200 rounded-2xl shadow-card p-4 sm:p-6">
                            <div className="text-slate-900 font-semibold mb-2 flex items-center gap-2">
                                <FireOutlined className="text-amber-500" /> Bắt đầu tìm kiếm
                            </div>
                            <SearchClient />
                            <div className="mt-3 text-sm text-slate-500">
                                Gợi ý: Backend, Frontend, DevOps, Product, Data, QA...
                            </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: 'Công việc đang mở', value: '2.3K+' },
                                { label: 'Công ty đối tác', value: '480+' },
                                { label: 'Ứng viên thành công', value: '12K+' },
                                { label: 'Đánh giá tích cực', value: '4.9/5' },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="glass-card p-4 text-center transition-transform duration-200 hover:-translate-y-1"
                                >
                                    <div className="text-2xl font-semibold text-slate-900">{item.value}</div>
                                    <div className="text-sm text-slate-500">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <div className="glass-card h-full p-6 flex flex-col justify-between bg-gradient-to-br from-primary-50 via-white to-slate-50">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                    <p className="text-sm text-emerald-600 font-medium">Cập nhật mới mỗi ngày</p>
                                </div>
                                <h2 className="text-2xl font-semibold text-slate-900">
                                    Được tin dùng bởi cộng đồng IT Việt Nam
                                </h2>
                                <p className="text-slate-600">
                                    Từ startup đến doanh nghiệp lớn, Job Hunter giúp bạn tiếp cận cơ hội phù hợp,
                                    quản lý ứng tuyển và kết nối trực tiếp với nhà tuyển dụng.
                                </p>
                            </div>
                            <div className="mt-6 flex flex-col gap-3">
                                {[
                                    'Tìm kiếm thông minh, lọc theo kỹ năng và mức lương',
                                    'Hồ sơ công ty minh bạch, review môi trường làm việc',
                                    'Thông báo thời gian thực khi có job phù hợp',
                                ].map(text => (
                                    <div key={text} className="flex items-start gap-3 text-slate-700">
                                        <span className="mt-1 h-2 w-2 rounded-full bg-primary-500" />
                                        <p>{text}</p>
                                    </div>
                                ))}
                                <Link
                                    to="/job"
                                    className="cta-static mt-2 px-6 py-3"
                                >
                                    Khám phá ngay <ArrowRightOutlined />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Companies */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="section-title">
                            Top công ty công nghệ nổi bật
                        </div>
                        <span className="text-sm text-primary-600 font-medium">Cập nhật liên tục</span>
                    </div>
                    <CompanyCard />
                </section>

                {/* Featured Jobs */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="section-title">
                            Việc làm hot dành cho bạn
                        </div>
                        <span className="text-sm text-primary-600 font-medium">Đã kiểm duyệt</span>
                    </div>
                    <JobCard />
                </section>
            </div>
        </div>
    )
}

export default HomePage;