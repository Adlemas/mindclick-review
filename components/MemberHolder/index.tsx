import { CloseOutlined, UserOutlined } from "@ant-design/icons"
import { GiSoundOff, GiSoundOn } from "react-icons/gi"
import { Button, Empty, Popover, Tabs, Typography, Tooltip } from "antd"
import { useEffect } from "react"
import { RiSettings4Fill } from "react-icons/ri"
import { useAppDispatch, useAppSelector } from "slices"
import { selectAuth } from "slices/auth"
import { getAllGroupsAction, selectGroups } from "slices/groups"
import { User } from "types"
import GroupList from "../GroupsCard/GroupList"
import styles from "./styles.module.scss"
import classNames from "classnames"
import { useThemeSwitcher } from "react-css-theme-switcher"

interface PropTypes {
    onSettings: () => void
    value: User
    sounds: boolean

    onChange: (value: User) => void
    onSounds: (v: boolean) => void
}

const MemberHolder: React.FC<PropTypes> = ({
    onSettings,
    value,
    sounds,
    onChange,
    onSounds,
}) => {
    const { groups } = useAppSelector(selectGroups)
    const { user } = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()

    const { currentTheme } = useThemeSwitcher()

    // destruct task from singleTask with useAppSelector
    const { task: currentTask } = useAppSelector((state) => state.singleTask)

    useEffect(() => {
        dispatch(getAllGroupsAction({ groupIds: user.groups }))
    }, [dispatch, user.groups])

    return (
        <div
            className={classNames(styles.member_holder, {
                [styles.member_holder_dark]: currentTheme === "dark",
            })}
        >
            {user.role === "STUDENT" ? null : value ? (
                <Button
                    size="small"
                    type={"primary"}
                    danger
                    onClick={() => onChange(null)}
                >
                    <CloseOutlined />
                </Button>
            ) : (
                <Popover
                    content={
                        groups.length ? (
                            <Tabs>
                                {groups.map((group) => (
                                    <Tabs.TabPane
                                        tab={
                                            <Typography>
                                                {group.name}
                                            </Typography>
                                        }
                                        key={group._id}
                                        tabKey={group._id}
                                        style={{
                                            minWidth: 350,
                                        }}
                                    >
                                        <GroupList
                                            onMember={(member) => {
                                                onChange(member)
                                            }}
                                            group={group}
                                            smaller
                                        />
                                    </Tabs.TabPane>
                                ))}
                            </Tabs>
                        ) : (
                            <Empty description={"Нет участников!"} />
                        )
                    }
                    trigger="click"
                    title={"Выберите участника"}
                >
                    <Button size="small" type="primary">
                        <UserOutlined />
                    </Button>
                </Popover>
            )}
            <Tooltip title={currentTask ? "Вы выполняете задание!" : undefined}>
                <Button
                    disabled={!!currentTask}
                    type={"text"}
                    onClick={() => (!currentTask ? onSettings() : null)} // (!currentTask)
                >
                    <RiSettings4Fill size={20} />
                </Button>
            </Tooltip>
            {user.role === "TEACHER" && (
                <div>
                    {value
                        ? `${value.firstName} ${value.lastName}`
                        : "выберите участника"}
                </div>
            )}
            <Button type={"text"} onClick={() => onSounds(!sounds)}>
                {sounds ? <GiSoundOn size={20} /> : <GiSoundOff size={20} />}
            </Button>
        </div>
    )
}

export default MemberHolder
