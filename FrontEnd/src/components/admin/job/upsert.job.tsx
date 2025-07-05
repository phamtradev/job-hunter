import { Breadcrumb, Col, ConfigProvider, Divider, Form, Row, message, notification } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DebounceSelect } from "../user/debouce.select";
import { FooterToolbar, ProForm, ProFormDatePicker, ProFormDigit, ProFormSelect, ProFormSwitch, ProFormText } from "@ant-design/pro-components";
import styles from 'styles/admin.module.scss';
import { LOCATION_LIST, SKILLS_LIST } from "@/config/utils";
import { ICompanySelect } from "../user/modal.user";
import { useState, useEffect } from 'react';
import { callCreateJob, callFetchAllSkill, callFetchCompany, callFetchJobById, callUpdateJob } from "@/config/api";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { CheckSquareOutlined } from "@ant-design/icons";
import enUS from 'antd/lib/locale/en_US';
import dayjs from 'dayjs';
import { IJob, ISkill } from "@/types/backend";

interface ISkillSelect {
    label: string;
    value: string;
    key?: string;
}

const ViewUpsertJob = (props: any) => {
    const [companies, setCompanies] = useState<ICompanySelect[]>([]);
    const [skills, setSkills] = useState<ISkillSelect[]>([]);

    const navigate = useNavigate();
    const [value, setValue] = useState<string>("");

    let location = useLocation();
    let params = new URLSearchParams(location.search);
    const id = params?.get("id"); // job id
    const [dataUpdate, setDataUpdate] = useState<IJob | null>(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const init = async () => {
            const temp = await fetchSkillList();
            setSkills(temp);

            if (id) {
                const res = await callFetchJobById(id);
                if (res && res.data) {
                    setDataUpdate(res.data);
                    setValue(res.data.description);
                    setCompanies([
                        {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?.id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?.id
                        }
                    ])

                    //skills
                    const temp: any = res.data?.skills?.map((item: ISkill) => {
                        return {
                            label: item.name,
                            value: item.id,
                            key: item.id
                        }
                    })
                    form.setFieldsValue({
                        ...res.data,
                        company: {
                            label: res.data.company?.name as string,
                            value: `${res.data.company?.id}@#$${res.data.company?.logo}` as string,
                            key: res.data.company?.id
                        },
                        skills: temp
                    })
                }
            }
        }
        init();
        return () => form.resetFields()
    }, [id])

    // Usage of DebounceSelect
    async function fetchCompanyList(name: string): Promise<ICompanySelect[]> {
        const res = await callFetchCompany(`page=1&size=100&name ~ '${name}'`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item.id}@#$${item.logo}` as string
                }
            })
            return temp;
        } else return [];
    }

    async function fetchSkillList(): Promise<ISkillSelect[]> {
        const res = await callFetchAllSkill(`page=1&size=100`);
        if (res && res.data) {
            const list = res.data.result;
            const temp = list.map(item => {
                return {
                    label: item.name as string,
                    value: `${item.id}` as string
                }
            })
            return temp;
        } else return [];
    }

    const onFinish = async (values: any) => {
        if (dataUpdate?.id) {
            //update
            const cp = values?.company?.value?.split('@#$');

            let arrSkills = [];
            if (typeof values?.skills?.[0] === 'object') {
                arrSkills = values?.skills?.map((item: any) => { return { id: item.value } });
            } else {
                arrSkills = values?.skills?.map((item: any) => { return { id: +item } });
            }

            const job = {
                name: values.name,
                skills: arrSkills,
                company: {
                    id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.company.label,
                    logo: cp && cp.length > 1 ? cp[1] : ""
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: value,
                startDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.startDate) ? dayjs(values.startDate, 'DD/MM/YYYY').toDate() : values.startDate,
                endDate: /[0-9]{2}[/][0-9]{2}[/][0-9]{4}$/.test(values.endDate) ? dayjs(values.endDate, 'DD/MM/YYYY').toDate() : values.endDate,
                active: values.active,

            }

            const res = await callUpdateJob(job, dataUpdate.id);
            if (res.data) {
                message.success("Cập nhật job thành công");
                navigate('/admin/job')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        } else {
            //create
            const cp = values?.company?.value?.split('@#$');
            const arrSkills = values?.skills?.map((item: string) => { return { id: +item } });
            const job = {
                name: values.name,
                skills: arrSkills,
                company: {
                    id: cp && cp.length > 0 ? cp[0] : "",
                    name: values.company.label,
                    logo: cp && cp.length > 1 ? cp[1] : ""
                },
                location: values.location,
                salary: values.salary,
                quantity: values.quantity,
                level: values.level,
                description: value,
                startDate: dayjs(values.startDate, 'DD/MM/YYYY').toDate(),
                endDate: dayjs(values.endDate, 'DD/MM/YYYY').toDate(),
                active: values.active
            }

            const res = await callCreateJob(job);
            if (res.data) {
                message.success("Tạo mới job thành công");
                navigate('/admin/job')
            } else {
                notification.error({
                    message: 'Có lỗi xảy ra',
                    description: res.message
                });
            }
        }
    }



    return (
        <div className={styles["upsert-job-container"]}>
            <div className={styles["title"]}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to="/admin/job">Manage Job</Link>,
                        },
                        {
                            title: 'Upsert Job',
                        },
                    ]}
                />
            </div>
            <div >

                <ConfigProvider locale={enUS}>
                    <ProForm
                        form={form}
                        onFinish={onFinish}
                        submitter={
                            {
                                searchConfig: {
                                    resetText: "Hủy",
                                    submitText: <>{dataUpdate?.id ? "Cập nhật Job" : "Tạo mới Job"}</>
                                },
                                onReset: () => navigate('/admin/job'),
                                render: (_: any, dom: any) => <FooterToolbar>{dom}</FooterToolbar>,
                                submitButtonProps: {
                                    icon: <CheckSquareOutlined />
                                },
                            }
                        }
                    >
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={12}>
                                <ProFormText
                                    label="Tên Job"
                                    name="name"
                                    rules={[
                                        { required: true, message: 'Vui lòng không bỏ trống' },
                                    ]}
                                    placeholder="Nhập tên job"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="skills"
                                    label="Kỹ năng yêu cầu"
                                    options={skills}
                                    placeholder="Please select a skill"
                                    rules={[{ required: true, message: 'Vui lòng chọn kỹ năng!' }]}
                                    allowClear
                                    mode="multiple"
                                    fieldProps={{
                                        suffixIcon: null
                                    }}
                                />
                            </Col>

                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="location"
                                    label="Địa điểm"
                                    options={LOCATION_LIST.filter(item => item.value !== 'ALL')}
                                    placeholder="Please select a location"
                                    rules={[{ required: true, message: 'Vui lòng chọn địa điểm!' }]}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Mức lương"
                                    name="salary"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập mức lương"
                                    fieldProps={{
                                        addonAfter: " đ",
                                        formatter: (value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                                        parser: (value) => +(value || '').replace(/\$\s?|(,*)/g, '')
                                    }}
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDigit
                                    label="Số lượng"
                                    name="quantity"
                                    rules={[{ required: true, message: 'Vui lòng không bỏ trống' }]}
                                    placeholder="Nhập số lượng"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSelect
                                    name="level"
                                    label="Trình độ"
                                    valueEnum={{
                                        INTERN: 'INTERN',
                                        FRESHER: 'FRESHER',
                                        JUNIOR: 'JUNIOR',
                                        MIDDLE: 'MIDDLE',
                                        SENIOR: 'SENIOR',
                                    }}
                                    placeholder="Please select a level"
                                    rules={[{ required: true, message: 'Vui lòng chọn level!' }]}
                                />
                            </Col>

                            {(dataUpdate?.id || !id) &&
                                <Col span={24} md={6}>
                                    <ProForm.Item
                                        name="company"
                                        label="Thuộc Công Ty"
                                        rules={[{ required: true, message: 'Vui lòng chọn company!' }]}
                                    >
                                        <DebounceSelect
                                            allowClear
                                            showSearch
                                            defaultValue={companies}
                                            value={companies}
                                            placeholder="Chọn công ty"
                                            fetchOptions={fetchCompanyList}
                                            onChange={(newValue: any) => {
                                                if (newValue?.length === 0 || newValue?.length === 1) {
                                                    setCompanies(newValue as ICompanySelect[]);
                                                }
                                            }}
                                            style={{ width: '100%' }}
                                        />
                                    </ProForm.Item>

                                </Col>
                            }

                        </Row>
                        <Row gutter={[20, 20]}>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày bắt đầu"
                                    name="startDate"
                                    normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',

                                    }}
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormDatePicker
                                    label="Ngày kết thúc"
                                    name="endDate"
                                    normalize={(value) => value && dayjs(value, 'DD/MM/YYYY')}
                                    fieldProps={{
                                        format: 'DD/MM/YYYY',

                                    }}
                                    // width="auto"
                                    rules={[{ required: true, message: 'Vui lòng chọn ngày cấp' }]}
                                    placeholder="dd/mm/yyyy"
                                />
                            </Col>
                            <Col span={24} md={6}>
                                <ProFormSwitch
                                    label="Trạng thái"
                                    name="active"
                                    checkedChildren="ACTIVE"
                                    unCheckedChildren="INACTIVE"
                                    initialValue={true}
                                    fieldProps={{
                                        defaultChecked: true,
                                    }}
                                />
                            </Col>
                            <Col span={24}>
                                <ProForm.Item
                                    name="description"
                                    label="Miêu tả job"
                                    rules={[{ required: true, message: 'Vui lòng nhập miêu tả job!' }]}
                                >
                                    <ReactQuill
                                        theme="snow"
                                        value={value}
                                        onChange={setValue}
                                    />
                                </ProForm.Item>
                            </Col>
                        </Row>
                        <Divider />
                    </ProForm>
                </ConfigProvider>

            </div>
        </div>
    )
}

export default ViewUpsertJob;