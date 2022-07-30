import { Dropdown, Menu, Space, Typography } from "antd"
import classNames from "classnames"
import ProfilePic from "components/ProfilePic"
import moment from "moment"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { RiClipboardFill, RiDeleteBinFill, RiEditFill } from "react-icons/ri"
import { useAppSelector } from "slices"
import { selectAuth } from "slices/auth"
import { Message, User } from "types"

import { message as AntMessage } from "antd"

import copyToClipboard from "utils/clipboard"

interface PropTypes {
    message: Message
    user: User
    previousMessage?: Message
}

import styles from "./styles.module.scss"

const BubbleMessage: React.FC<PropTypes> = ({
    message,
    user,
    previousMessage,
}) => {
    const { user: authUser } = useAppSelector(selectAuth)

    const { currentTheme } = useThemeSwitcher()

    const diff = previousMessage
        ? Math.floor(
              moment
                  .duration(
                      moment(message.createdAt).diff(
                          moment(previousMessage.createdAt)
                      )
                  )
                  .asMinutes()
          )
        : 0

    const isMine = user._id === authUser._id

    const menu = (
        <Menu
            items={[
                {
                    key: "copy",
                    icon: <RiClipboardFill />,
                    label: "Копировать",
                    onClick: () => {
                        copyToClipboard(message.content)
                        AntMessage.success(
                            "Сообщение скопировано в буфер обмена"
                        )
                    },
                },
                {
                    key: "edit",
                    icon: <RiEditFill />,
                    label: "Редактировать",
                    style: { display: !isMine ? "none" : "block" },
                    onClick: () => {
                        console.log("edit")
                    },
                },
                {
                    key: "delete",
                    icon: <RiDeleteBinFill />,
                    label: "Удалить",
                    style: { display: !isMine ? "none" : "block" },
                    danger: true,
                    onClick: () => {
                        console.log("delete")
                    },
                },
            ]}
        />
    )

    return (
        <div
            className={classNames(styles.bubble_message__wrapper, {
                [styles.bubble_message__wrapper__nomargin]:
                    previousMessage &&
                    previousMessage.from._id === user._id &&
                    diff < 2,
                [styles.bubble_message__wrapper__mine]: isMine,
                [styles.bubble_message__wrapper__dark]: currentTheme === "dark",
            })}
        >
            <div className={styles.bubble_message__avatar}>
                {!(
                    previousMessage &&
                    previousMessage.from._id === user._id &&
                    diff < 2
                ) && (
                    <ProfilePic
                        userId={user._id}
                        style={{
                            borderRadius: ".5rem",
                        }}
                    />
                )}
            </div>
            <div className={styles.bubble_message__content}>
                <div
                    className={styles.bubble_message__content__wrapper}
                    hidden={
                        previousMessage &&
                        previousMessage.from._id === user._id &&
                        diff < 2
                    }
                >
                    <Typography>{user.firstName}</Typography>
                    <Typography.Text
                        type="secondary"
                        className={styles.bubble_message__content__time}
                    >
                        {moment(message.createdAt).format("HH:mm")}
                    </Typography.Text>
                </div>

                <Dropdown overlay={menu} trigger={["contextMenu"]}>
                    <div className={classNames(styles.bubble_message)}>
                        <Typography>{message.content}</Typography>
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default BubbleMessage
