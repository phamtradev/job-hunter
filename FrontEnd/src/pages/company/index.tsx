import { Tag } from 'antd';
import CompanyCard from '@/components/client/card/company.card';
import { StarFilled, FireOutlined, CrownOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const ClientCompanyPage = (_props: any) => {
    const tags = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Sản phẩm', 'Dịch vụ', 'Fintech', 'Outsourcing'];
    const highlights = [
        { icon: <CrownOutlined />, label: 'Top công ty IT', desc: 'Uy tín, minh bạch' },
        { icon: <StarFilled className="text-amber-400" />, label: 'Đánh giá tích cực', desc: 'Từ cộng đồng IT' },
        { icon: <FireOutlined className="text-rose-400" />, label: 'Cập nhật liên tục', desc: 'Review & job mới' },
        { icon: <SafetyCertificateOutlined className="text-emerald-400" />, label: 'Thông tin kiểm duyệt', desc: 'Logo, mô tả, địa chỉ' },
    ];

    return (
        <div className="relative app-shell">
            <div className="absolute inset-0 bg-subtle-radial opacity-70 pointer-events-none" />
            <div className="absolute -left-8 top-10 w-52 h-52 bg-primary-500/15 blur-3xl rounded-full animate-float pointer-events-none" />
            <div className="absolute right-0 top-28 w-64 h-64 bg-emerald-400/12 blur-3xl rounded-full animate-float pointer-events-none" />
            <div className="relative page-container py-10 space-y-8">

                {/* Hero */}
                <header className="glass-card p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-slate-50 border border-slate-800 shadow-soft">
                    <div className="flex flex-col gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/15 px-4 py-2 text-sm font-medium text-emerald-200">
                            <StarFilled /> 26,961 reviews công ty IT hàng đầu
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl sm:text-4xl font-semibold">Top công ty công nghệ tại Việt Nam</h1>
                            <span className="text-sm text-emerald-200">Review chế độ đãi ngộ, môi trường làm việc</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-slate-200">
                            {highlights.map(item => (
                                <div key={item.label} className="rounded-xl bg-white/5 border border-white/10 px-4 py-3 flex gap-2 items-start">
                                    <span className="text-lg">{item.icon}</span>
                                    <div>
                                        <div className="font-semibold text-slate-50">{item.label}</div>
                                        <div className="text-xs text-slate-200/80">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm">
                            <span className="text-slate-200 font-semibold">Bộ lọc nhanh:</span>
                            {tags.map(tag => (
                                <Tag key={tag} color="blue" className="m-0 rounded-full px-2 py-1 text-xs bg-white/10 border border-white/20 text-slate-50">
                                    {tag}
                                </Tag>
                            ))}
                        </div>
                    </div>
                </header>

                {/* Company list */}
                <section className="glass-card p-4 sm:p-6 border border-slate-100 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                        <div className="section-title">Danh sách công ty IT</div>
                        <span className="text-xs sm:text-sm text-slate-500">Đã kiểm duyệt & phân trang</span>
                    </div>
                    <CompanyCard showPagination={true} />
                </section>
            </div>
        </div>
    )
}

export default ClientCompanyPage;