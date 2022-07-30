import { Select } from "antd"

interface PropTypes {
    disabled?: boolean
    value?: string
    onChange?: (v: string) => void
}

const FormulaSelect: React.FC<PropTypes> = ({ disabled, value, onChange }) => {
    return (
        <Select disabled={disabled} value={value} onChange={onChange}>
            <Select.Option value={"NF"}>Прямой счёт</Select.Option>
            <Select.Option value={"LF"}>Маленькие друзья</Select.Option>
            <Select.Option value={"BF"}>Большие друзья</Select.Option>
            <Select.Option value={"FF"}>Семья</Select.Option>
        </Select>
    )
}

export default FormulaSelect
