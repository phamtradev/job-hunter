import { callFetchCompany } from '@/config/api';
import { convertSlug } from '@/config/utils';
import { ICompany } from '@/types/backend';
import { Empty, Pagination, Spin } from 'antd';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRightOutlined, EnvironmentOutlined } from '@ant-design/icons';

interface IProps {
    showPagination?: boolean;
}

const CompanyCard = (props: IProps) => {
    const { showPagination = false } = props;

    const [displayCompany, setDisplayCompany] = useState<ICompany[] | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [current, setCurrent] = useState(1);
    const [pageSize, setPageSize] = useState(4);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("");
    const [sortQuery, setSortQuery] = useState("sort=updatedAt,desc");
    const navigate = useNavigate();

    useEffect(() => {
        fetchCompany();
    }, [current, pageSize, filter, sortQuery]);

    const fetchCompany = async () => {
        setIsLoading(true)
        let query = `page=${current}&size=${pageSize}`;
        if (filter) {
            query += `&${filter}`;
        }
        if (sortQuery) {
            query += `&${sortQuery}`;
        }

        const res = await callFetchCompany(query);
        if (res && res.data) {
            setDisplayCompany(res.data.result);
            setTotal(res.data.meta.total)
        }
        setIsLoading(false)
    }


    const handleOnchangePage = (pagination: { current: number, pageSize: number }) => {
        if (pagination && pagination.current !== current) {
            setCurrent(pagination.current)
        }
        if (pagination && pagination.pageSize !== pageSize) {
            setPageSize(pagination.pageSize)
            setCurrent(1);
        }
    }

    const handleViewDetailJob = (item: ICompany) => {
        if (item.name) {
            const slug = convertSlug(item.name);
            navigate(`/company/${slug}?id=${item.id}`)
        }
    }

    const getTags = (description?: string) => {
        if (!description) return ['Công nghệ', 'Sản phẩm', 'Phúc lợi', 'Môi trường tốt'];
        const matches = description.match(/[A-Za-zÀ-ỹ0-9]+/g) || [];
        const uniq: string[] = [];
        matches.forEach(word => {
            if (word.length >= 3 && uniq.length < 6) {
                const lower = word.toLowerCase();
                if (!uniq.find(u => u.toLowerCase() === lower)) {
                    uniq.push(word);
                }
            }
        });
        if (uniq.length === 0) return ['Công nghệ', 'Sản phẩm', 'Phúc lợi', 'Môi trường tốt'];
        return uniq.slice(0, 6);
    }

    const getLocation = (address?: string) => {
        if (!address) return 'Đang cập nhật';
        const parts = address.split(',').map(p => p.trim()).filter(Boolean);
        return parts[parts.length - 1] || address;
    }

    return (
        <div className="relative">
            <Spin spinning={isLoading} tip="Loading...">
                <div className="flex items-center justify-between mb-4">
                    <div className="section-title">Nhà Tuyển Dụng Hàng Đầu</div>
                    {!showPagination && <Link to="company" className="text-primary-600 font-medium text-sm">Xem tất cả</Link>}
                </div>
                <div className="grid gap-4 sm:gap-6 md:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    {displayCompany?.map(item => {
                        const tags = getTags(item.description);
                        return (
                            <div
                                key={item.id}
                                onClick={() => handleViewDetailJob(item)}
                                className="group relative overflow-hidden rounded-2xl bg-slate-900 text-slate-50 border border-slate-800 shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                                style={{ minHeight: 320 }}
                            >
                                <div className="absolute -left-6 -top-6 w-16 h-16 bg-primary-500/18 blur-3xl rounded-full animate-float pointer-events-none" />
                                <div className="absolute -right-8 top-10 w-20 h-20 bg-emerald-400/14 blur-3xl rounded-full animate-pulse-soft pointer-events-none" />
                                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.12),transparent_30%)]" />
                                <div className="relative flex flex-col items-center px-6 pt-8 pb-4 gap-4">
                                    <div className="w-24 h-24 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-inner flex items-center justify-center overflow-hidden">
                                        <img
                                            src={item.logo}
                                            alt={item.name}
                                            className="max-h-16 max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-lg font-semibold text-slate-50">{item.name}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-2 justify-center">
                                        {tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="px-3 py-1 rounded-full bg-slate-800/70 border border-slate-700 text-xs text-slate-200"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative border-t border-slate-800 px-6 py-4 flex items-center justify-between text-sm text-slate-200 bg-slate-900/90">
                                    <div className="flex items-center gap-2">
                                        <EnvironmentOutlined className="text-emerald-400" />
                                        <span>{getLocation(item.address)}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-emerald-400 font-semibold">
                                        Xem chi tiết <ArrowRightOutlined className="text-xs" />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {(!displayCompany || displayCompany.length === 0) && !isLoading &&
                    <div className="flex justify-center py-10">
                        <Empty description="Không có dữ liệu" />
                    </div>
                }

                {showPagination &&
                    <div className="mt-8 flex justify-center">
                        <Pagination
                            current={current}
                            total={total}
                            pageSize={pageSize}
                            responsive
                            onChange={(p: number, s: number) => handleOnchangePage({ current: p, pageSize: s })}
                        />
                    </div>
                }
            </Spin>
        </div>
    )
}

export default CompanyCard;