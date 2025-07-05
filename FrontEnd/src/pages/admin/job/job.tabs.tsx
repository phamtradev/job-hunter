import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import JobPage from './job';
import SkillPage from './skill';

const JobTabs = () => {
    const onChange = (key: string) => {
        // console.log(key);
    };

    const items: TabsProps['items'] = [
        {
            key: '1',
            label: 'Manage Jobs',
            children: <JobPage />,
        },
        {
            key: '2',
            label: 'Manage Skills',
            children: <SkillPage />,
        },

    ];
    return (
        <div>
            <Tabs
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
            />

        </div>
    );
}

export default JobTabs;