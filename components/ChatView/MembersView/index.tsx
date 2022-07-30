import { Button, Card, Divider, Typography } from "antd"
import classNames from "classnames"
import ProfilePic from "components/ProfilePic"
import { useEffect, useState } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { RiCloseCircleLine, RiUser2Fill } from "react-icons/ri"
import { useAppDispatch, useAppSelector } from "slices"
import { getGroupAction } from "slices/group"
import { setGroups, getAllGroupsAction } from "slices/groups"
import ActionButton from "../ActionButton"

import styles from "./styles.module.scss"

interface PropTypes {
    visible?: boolean
    onClose?: Function
}

const MembersView: React.FC<PropTypes> = ({ visible = true, onClose }) => {
    const { currentTheme } = useThemeSwitcher()

    const { groups } = useAppSelector((state) => state.groups)
    const { group: singleGroup, owner } = useAppSelector((state) => state.group)
    const { chat } = useAppSelector((state) => state.singleChat)
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user.role === "TEACHER") {
            dispatch(setGroups(user.groups))
            dispatch(getAllGroupsAction({ groupIds: user.groups || [] }))
        } else {
            dispatch(getGroupAction())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const group =
        user.role === "TEACHER"
            ? groups.find((group) => group._id === chat?.groupId)
            : singleGroup

    return (
        <Card
            className={classNames("chat_view_item", styles.members_view, {
                [styles.members_view__dark]: currentTheme === "dark",
            })}
            style={{
                maxWidth: visible ? "250px" : "0",
            }}
        >
            <h1 className={classNames(styles.members_view__title)}>
                <strong>Участники</strong>
                <Button
                    type="text"
                    icon={<RiCloseCircleLine />}
                    onClick={() => (onClose ? onClose() : null)}
                />
            </h1>

            <div className={styles.members_view__list}>
                {user.role === "TEACHER" && (
                    <ActionButton
                        icon={
                            <ProfilePic
                                src={user.profileImg}
                                size={25}
                                style={{
                                    borderRadius: ".35rem",
                                }}
                                online={true}
                            />
                        }
                    >
                        {user.firstName} (Вы)
                    </ActionButton>
                )}
                {group &&
                    group.members &&
                    group.members.length > 0 &&
                    group.members.map((member) => (
                        <ActionButton
                            icon={
                                <ProfilePic
                                    userId={member._id}
                                    size={25}
                                    style={{
                                        borderRadius: ".35rem",
                                    }}
                                    online={!!member.socketId}
                                />
                            }
                        >
                            {member.firstName}{" "}
                            {user.role === "STUDENT" &&
                                member._id === user._id &&
                                "(Вы)"}
                        </ActionButton>
                    ))}
                {user.role === "STUDENT" && owner && (
                    <ActionButton
                        icon={
                            <ProfilePic
                                userId={owner._id}
                                size={25}
                                style={{
                                    borderRadius: ".35rem",
                                }}
                                online={!!owner.socketId}
                            />
                        }
                    >
                        {owner.firstName}
                    </ActionButton>
                )}
            </div>
        </Card>
    )
}

export default MembersView
