import { Select, Empty, SelectProps } from "antd"
import { useAppSelector } from "slices"
import { selectGroups } from "slices/groups"

const MemberSelect: React.FC<SelectProps> = (props) => {
    const { groups } = useAppSelector(selectGroups)

    return (
        <Select
            {...props}
            optionFilterProp="children"
            showSearch
            placeholder={"Выберите участников"}
            mode="multiple"
            style={{
                minWidth: 200,
            }}
            filterOption={(input, option) =>
                (option!.children as unknown as string)
                    .toLowerCase()
                    .includes(input.toLowerCase())
            }
        >
            {groups.length ? (
                groups.map((group) => {
                    return (
                        <Select.OptGroup label={group.name}>
                            {group.members.map((member) => {
                                return (
                                    <Select.Option value={member._id}>
                                        {member.firstName} {member.lastName}
                                    </Select.Option>
                                )
                            })}
                        </Select.OptGroup>
                    )
                })
            ) : (
                <Empty description={"Нет участников"} />
            )}
        </Select>
    )
}

export default MemberSelect
