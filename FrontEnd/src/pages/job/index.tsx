import SearchClient from '@/components/client/search.client';
import { Tag } from 'antd';
import JobCard from '@/components/client/card/job.card';
import { FireOutlined, ThunderboltOutlined, SafetyCertificateOutlined, FilterOutlined } from '@ant-design/icons';

const ClientJobPage = (_props: any) => {
    const quickFilters = ['Frontend', 'Backend', 'DevOps', 'Data', 'QA', 'Product', 'Mobile'];
    const highlights = [
        { icon: <ThunderboltOutlined />, label: 'Ứng tuyển nhanh', desc: '1-click apply, lưu job yêu thích' },
        { icon: <SafetyCertificateOutlined />, label: 'Đã kiểm duyệt', desc: 'Công ty minh bạch, tin cậy' },
        { icon: <FireOutlined />, label: 'Cập nhật liên tục', desc: 'Nhiều job mới mỗi ngày' },
    ];

    return (
        <div className="relative app-shell">
            <div className="absolute inset-0 bg-subtle-radial opacity-70 pointer-events-none" />
            <div className="absolute -left-8 top-8 w-48 h-48 bg-primary-500/15 blur-3xl rounded-full animate-float pointer-events-none" />
            <div className="absolute right-0 top-24 w-56 h-56 bg-emerald-400/12 blur-3xl rounded-full animate-float pointer-events-none" />
            <div className="relative page-container py-10 space-y-8">
                <header className="flex flex-col gap-3">
                    <div className="inline-flex items-center gap-2 rounded-full bg-white/80 border border-slate-200 shadow-sm px-4 py-2 text-sm font-medium text-primary-700">
                        <FireOutlined className="text-amber-500" />
                        Việc làm IT mới nhất
                    </div>
                    <div className="flex flex-wrap items-baseline gap-3">
                        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 leading-tight">
                            Danh sách việc làm IT
                        </h1>
                        <span className="text-sm text-primary-600 font-medium">Đã kiểm duyệt & cập nhật liên tục</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        {highlights.map(item => (
                            <span key={item.label} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200 shadow-sm">
                                <span className="text-primary-600">{item.icon}</span>
                                {item.label}
                            </span>
                        ))}
                    </div>
                </header>

                <section className="glass-card p-4 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <FilterOutlined className="text-primary-600" />
                        Bộ lọc & tìm kiếm
                    </div>
                    <SearchClient />
                    <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                        <span className="font-semibold text-slate-700">Phổ biến:</span>
                        {quickFilters.map(item => (
                            <Tag key={item} color="blue" className="m-0 rounded-full px-2 py-1 text-xs">
                                {item}
                            </Tag>
                        ))}
                    </div>
                </section>

                <section className="glass-card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="section-title">
                            Tất cả việc làm
                        </div>
                        <span className="text-xs sm:text-sm text-slate-500">Hiển thị theo phân trang</span>
                    </div>
                    <JobCard showPagination={true} />
                </section>
            </div>
        </div>
    )
}

export default ClientJobPage;