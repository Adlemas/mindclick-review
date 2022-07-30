import { QuestionCircleOutlined } from "@ant-design/icons"
import {
    Button,
    Empty,
    List,
    Modal,
    Popconfirm,
    Space,
    Switch,
    Typography,
} from "antd"
import { Group, User } from "types"
import emptySvg from "assets/empty.svg"
import { useAppDispatch, useAppSelector } from "slices"
import { removeMemberAction, updateMemberAction } from "slices/groups"
import { refreshUser } from "slices/auth"
// import { IoTrophyOutline } from "react-icons/io5"
// import { BiCoinStack } from "react-icons/bi"
import ProfilePic from "../ProfilePic"
import Table, { ColumnsType } from "antd/lib/table"
import moment from "moment"

interface PropTypes {
    group: Group
    onSelect?: (groupId: string) => void
    onMember: (member: User) => void
    smaller?: boolean
}

const GroupList: React.FC<PropTypes> = ({
    group,
    onSelect,
    smaller,
    onMember,
}) => {
    const dispatch = useAppDispatch()

    const { loading } = useAppSelector((state) => state.groups)

    if (!group.members?.length) {
        return (
            <Empty
                image={emptySvg.src}
                imageStyle={{
                    height: 60,
                }}
                description={<span>Добавьте первого ученика</span>}
            >
                <Button
                    type="primary"
                    onClick={() => onSelect && onSelect(group._id)}
                >
                    Добавить
                </Button>
            </Empty>
        )
    }

    const columns: ColumnsType<User> = [
        {
            title: "Имя Фамилия",
            dataIndex: "firstName",
            render: (firstName: string, record) => (
                <Space size={"small"}>
                    <ProfilePic src={record.profileImg} />
                    <Typography>
                        {firstName} {record.lastName}
                    </Typography>
                </Space>
            ),
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Телефон",
            dataIndex: "phone",
        },
        {
            title: "Дата рождения",
            dataIndex: "birthDate",
            render: (birthDate: string) =>
                moment(birthDate).format("DD/MM/YYYY"),
        },
        {
            title: "Статус",
            dataIndex: "status",
            render: (status: boolean, record) => (
                <>
                    <Switch
                        loading={loading}
                        defaultChecked={status}
                        onChange={() => {
                            dispatch(
                                updateMemberAction({
                                    id: record._id,
                                    user: {
                                        ...record,
                                        status: !record.status,
                                        password: undefined,
                                    },
                                })
                            )
                        }}
                    />
                </>
            ),
        },
        {
            title: "Действия",
            render: (_, record) => (
                <Space size={"small"}>
                    {smaller ? (
                        <Button
                            type={"dashed"}
                            onClick={() => onMember(record)}
                        >
                            ВЫБРАТЬ
                        </Button>
                    ) : (
                        <>
                            <Button
                                type="primary"
                                onClick={() => onMember(record)}
                            >
                                ПОДРОБНЕЕ
                            </Button>
                            <Popconfirm
                                title="Вы уверены?"
                                icon={
                                    <QuestionCircleOutlined
                                        style={{ color: "red" }}
                                    />
                                }
                                okText={"Да"}
                                cancelText={"Нет"}
                                onConfirm={() => {
                                    dispatch(
                                        removeMemberAction({
                                            groupId: group._id,
                                            memberId: record._id,
                                        })
                                    )
                                    dispatch(refreshUser())
                                }}
                            >
                                <Button type="primary" danger>
                                    УДАЛИТЬ
                                </Button>
                            </Popconfirm>
                        </>
                    )}
                </Space>
            ),
        },
    ]

    return (
        <>
            <Table
                dataSource={group.members}
                columns={columns}
                pagination={false}
            />
        </>
    )
}

export default GroupList
