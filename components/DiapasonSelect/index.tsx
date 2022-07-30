import { Select } from "antd"

interface PropTypes {
    value?: string
    onChange?: (v: string) => void
}

const DiapasonSelect: React.FC<PropTypes> = ({ value, onChange }) => {
    return (
        <Select value={value} onChange={onChange}>
            <Select.Option value={"NF:1-4"}>
                Прямой счёт от 1 до 4
            </Select.Option>
            <Select.Option value={"1-9"}>от 1 до 9</Select.Option>
            <Select.Option value={"1-99"}>от 1 до 99</Select.Option>
            <Select.Option value={"10-99"}>от 10 до 99</Select.Option>
            <Select.Option value={"1-999"}>от 1 до 999</Select.Option>
            <Select.Option value={"10-999"}>от 10 до 999</Select.Option>
            <Select.Option value={"100-999"}>от 100 до 999</Select.Option>
        </Select>
    )
}

export default DiapasonSelect
