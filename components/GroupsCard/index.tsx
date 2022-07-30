import { ReloadOutlined } from "@ant-design/icons"
import {
    Button,
    Card,
    Empty,
    Popconfirm,
    Row,
    Space,
    Spin,
    Tabs,
    Typography,
} from "antd"
import { BiTrash } from "react-icons/bi"
import { useAppDispatch, useAppSelector } from "slices"
import { removeGroupAction, selectGroups } from "slices/groups"
import GroupList from "./GroupList"
import emptySvg from "assets/empty.svg"
import { refreshUser, refreshUserAction } from "slices/auth"
import { useState } from "react"
import AddMember from "components/AddMember"
import { IoAdd } from "react-icons/io5"
import AddGroup from "components/AddGroup"
import { Group, User } from "types"
import GroupSettings from "components/GroupSettings"
import { RiMore2Fill } from "react-icons/ri"

// remove group
/**
 * dispatch(
    removeGroupAction({
        groupId: group._id,
    })
)
dispatch(refreshUser())
 */

const GroupsCard: React.FC = () => {
    const { groups, loading } = useAppSelector(selectGroups)
    const dispatch = useAppDispatch()

    const [visible, setVisible] = useState<boolean>(false)
    const [addGroupVisible, setAddGroupVisible] = useState<boolean>(false)
    const [groupId, setGroupId] = useState<string>("")

    const [groupSettingsVisible, setGroupSettingsVisible] = useState<boolean>(false)
    const [group, setGroup] = useState<Group | null>(null)

    const [selectedUser, setSelectedUser] = useState<User | null>(null)

    return (
        <Card
            style={{
                width: "100%",
                height: "100%",
                flex: 1,
                marginTop: "1.5rem",
            }}
            title={"Мои Группы"}
            extra={
                <Space>
                    <Button
                        type="primary"
                        onClick={() => {
                            dispatch(refreshUserAction())
                        }}
                        disabled={loading}
                    >
                        <ReloadOutlined />
                    </Button>
                    <Button
                        disabled={loading}
                        type="primary"
                        onClick={() => setAddGroupVisible(true)}
                    >
                        НОВАЯ ГРУППА
                    </Button>
                    <Button
                        disabled={loading || groups.length <= 0}
                        type="primary"
                        onClick={() => {
                            setSelectedUser(null)
                            setVisible(true)
                            setGroupId(null)
                        }}
                    >
                        НОВЫЙ УЧАСТНИК
                    </Button>
                </Space>
            }
        >
            <AddMember
                groupId={groupId}
                visible={visible}
                user={selectedUser}
                onClose={() => setVisible(false)}
            />
            <AddGroup
                visible={addGroupVisible}
                onClose={() => setAddGroupVisible(false)}
            />
            <GroupSettings
                visible={groupSettingsVisible}
                group={group}
                onClose={() => setGroupSettingsVisible(false)}
            />
            {loading && (!groups.length || (groups.length && !groups[0].members?.length)) ? (
                <Row justify="center">
                    <Spin
                        spinning
                        tip="Загрузка..."
                        size="large"
                        style={{ maxHeight: "unset" }}
                    />
                </Row>
            ) : groups.length ? (
                <Tabs tabPosition="top">
                    {groups.map((group) => (
                        <Tabs.TabPane
                            tab={
                                <Space size={"small"}>
                                    <Typography>{group.name}</Typography>
                                    <Button type="primary" size="small" onClick={() => {
                                        setGroup(group)
                                        setGroupSettingsVisible(true)
                                    }}>
                                        <RiMore2Fill />
                                    </Button>
                                    <Button
                                        type="primary"
                                        size="small"
                                        onClick={() => {
                                            setSelectedUser(null)
                                            setVisible(true)
                                            setGroupId(group._id)
                                        }}
                                    >
                                        <IoAdd />
                                    </Button>
                                </Space>
                            }
                            key={group._id}
                        >
                            <GroupList
                                group={group}
                                onSelect={() => {
                                    setVisible(true)
                                    setGroupId(group._id)
                                }}
                                onMember={(user: User) => {
                                    setVisible(true)
                                    setGroupId(group._id)
                                    setSelectedUser(user)
                                }}
                            />
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            ) : (
                <Empty
                    image={emptySvg.src}
                    imageStyle={{
                        height: 60,
                    }}
                    description={<span>Добавьте первую группу</span>}
                >
                    <Button
                        type="primary"
                        onClick={() => setAddGroupVisible(true)}
                    >
                        Добавить
                    </Button>
                </Empty>
            )}
        </Card>
    )
}

export default GroupsCard
