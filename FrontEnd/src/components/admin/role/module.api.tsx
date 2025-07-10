import { Card, Col, Collapse, Row, Tooltip } from 'antd';
import { ProFormSwitch } from '@ant-design/pro-components';
import { grey } from '@ant-design/colors';
import { colorMethod } from '@/config/utils';
import { IPermission } from '@/types/backend';
import 'styles/reset.scss';
import type { ProFormInstance } from '@ant-design/pro-components';

const { Panel } = Collapse;

interface IProps {
  onChange?: (data: any[]) => void;
  onReset?: () => void;
  form: ProFormInstance;
  listPermissions: {
    module: string;
    permissions: IPermission[]
  }[] | null

};

const ModuleApi = (props: IProps) => {
  const { form, listPermissions } = props;

  const handleSwitchAll = (value: boolean, name: string) => {
    const child = listPermissions?.find(item => item.module === name);
    if (child) {
      child?.permissions?.forEach(item => {
        if (item.id)
          form.setFieldValue(["permissions", item.id], value)
      })
    }
  }

  const handleSingleCheck = (value: boolean, child: string, parent: string) => {
    form.setFieldValue(["permissions", child], value);

    //check all
    const temp = listPermissions?.find(item => item.module === parent);
    if (temp?.module) {
      const restPermission = temp?.permissions?.filter(item => item.id !== child);
      if (restPermission && restPermission.length) {
        const allTrue = restPermission.every(item => form.getFieldValue(["permissions", item.id as string]));
        form.setFieldValue(["permissions", parent], allTrue && value)
      }
    }

  }


  return (
    <Card size="small" bordered={false}>
      <Collapse>
        {
          listPermissions?.map((item, index) => (
            <Panel
              header={<div>{item.module}</div>}
              key={index}
              forceRender //force to render form item (with collapse mode)
              extra={
                <div className={'customize-form-item'}>
                  <ProFormSwitch
                    name={["permissions", item.module]}
                    fieldProps={{
                      defaultChecked: false,
                      onClick: (u, e) => { e.stopPropagation() },
                      onChange: (v) => handleSwitchAll(v, item.module),
                    }}
                  />
                </div>
              }
            >
              <Row gutter={[16, 16]}>
                {
                  item.permissions?.map((value, i: number) => (
                    <Col lg={12} md={12} sm={24} key={i}>
                      <Card size="small" bodyStyle={{ display: "flex", flex: 1, flexDirection: 'row' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <ProFormSwitch
                            name={["permissions", value.id as string]}
                            fieldProps={{
                              defaultChecked: false,
                              onChange: (v) => handleSingleCheck(v, (value.id) as string, item.module)
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                          <Tooltip title={value?.name}>
                            <p style={{ paddingLeft: 10, marginBottom: 3 }}>{value?.name || ''}</p>
                            <div style={{ display: 'flex' }}>
                              <p style={{ paddingLeft: 10, fontWeight: 'bold', marginBottom: 0, color: colorMethod(value?.method as string) }}>{value?.method || ''}</p>
                              <p style={{ paddingLeft: 10, marginBottom: 0, color: grey[5] }}>{value?.apiPath || ''}</p>
                            </div>
                          </Tooltip>
                        </div>
                      </Card>
                    </Col>
                  ))
                }
              </Row>
            </Panel>
          ))
        }
      </Collapse>
    </Card>
  );
};

export default ModuleApi;
