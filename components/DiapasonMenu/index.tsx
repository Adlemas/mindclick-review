import { Menu } from "antd"

interface PropTypes {
    value: string;
    onChange: (value: string) => any;
}

const DiapasonMenu: React.FC<PropTypes> = ({ onChange, value }) => {
    return (
        <Menu
            selectable
            defaultSelectedKeys={[value]}
            onClick={({ key }) => onChange(key)}
            items={[
                {
                    key: 'NF:1-4',
                    label: 'Прямой счёт от 1 до 4',
                },
                {
                    key: '1-9',
                    label: 'от 1 до 9',
                },
                {
                    key: '1-99',
                    label: 'от 1 до 99',
                },
                {
                    key: '10-99',
                    label: 'от 10 до 99',
                },
                {
                    key: '1-999',
                    label: 'от 1 до 999',
                },
                {
                    key: '10-999',
                    label: 'от 10 до 999',
                },
                {
                    key: '100-999',
                    label: 'от 100 до 999',
                },
            ]}
        />
    )
}

export default DiapasonMenu