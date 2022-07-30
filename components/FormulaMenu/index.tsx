import { Menu } from "antd"

interface PropTypes {
    value: string;
    onChange: (value: string) => any;
}

const FormulaMenu: React.FC<PropTypes> = ({ onChange, value }) => {
    return (
        <Menu
            selectable
            defaultSelectedKeys={[value]}
            onClick={({ key }) => onChange(key)}
            items={[
                {
                    key: 'NF',
                    label: 'Прямой счёт',
                },
                {
                    key: 'LF',
                    label: 'Маленькие друзья',
                },
                {
                    key: 'BF',
                    label: 'Большие друзья',
                },
                {
                    key: 'FF',
                    label: 'Семья',
                },
            ]}
        />
    )
}

export default FormulaMenu