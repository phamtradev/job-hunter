import ModalCompany from "@/components/admin/company/modal.company";
import DataTable from "@/components/client/data-table";
import { FileSearchOutlined, PlusOutlined } from "@ant-design/icons";
import { ProColumns } from '@ant-design/pro-components';
import { Button, Space } from "antd";
import { useState } from 'react';

const CompanyPage = () => {
    const [openModal, setOpenModal] = useState<boolean>(false);

    const columns: ProColumns<any>[] = [
        {
            title: 'Name',
            dataIndex: 'name',
        },
        {
            title: 'Address',
            dataIndex: 'address',
        },

        {

            title: 'Action',
            render: (_value, entity, _index, _action) => (
                <Space>
                    <FileSearchOutlined
                        style={{
                            marginLeft: 10,
                            fontSize: 20,
                            color: '#d81921',
                        }}
                        type=""
                        onClick={() => {
                            //   setVisible(true);
                            //   setSelectedItem(entity);
                        }}
                    />
                </Space>
            ),
            hideInSearch: true,
            width: 50,
        },
    ];
    return (
        <div>
            <DataTable
                // loading={isFetching}
                columns={columns}
                // dataSource={response?.data.results}
                request={async (params, sort, _filter): Promise<any> => {

                }}
                scroll={{ x: 2500 }}
                // pagination={{ ...response?.data.meta }}
                rowSelection={false}
                toolBarRender={(_action, _rows): any => {
                    return (
                        <Button
                            icon={<PlusOutlined />}
                            type="primary"
                            onClick={() => setOpenModal(true)}
                        >
                            Add New
                        </Button>
                    );
                }}
            />
            <ModalCompany
                openModal={openModal}
                setOpenModal={setOpenModal}
            />
        </div>
    )
}

export default CompanyPage;