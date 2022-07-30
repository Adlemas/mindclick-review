import { Avatar, Card, Space } from "antd"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { Chat } from "types"

import styles from "./styles.module.scss"

import classNames from "classnames"
import { useAppSelector } from "slices"

interface ChatItemProps {
    chat: Chat
    onClick?: () => void
}

const ChatItem: React.FC<ChatItemProps> = ({ chat, onClick }) => {
    const { currentTheme } = useThemeSwitcher()

    // destruct chat from singleChat slice with useAppSelector
    const { chat: selectedChat } = useAppSelector((state) => state.singleChat)

    return (
        <Card
            bordered={false}
            className={classNames(styles.chat_item, {
                [styles.chat_item__dark]: currentTheme === "dark",
                [styles.chat_item__selected]:
                    selectedChat && selectedChat._id === chat._id,
            })}
        >
            <Space size="large">
                <Avatar size="large" src={chat.user.avatar} />
                <div>
                    <div className={styles.chat_item__name}>
                        {chat.user.name}
                    </div>
                    <small className={styles.chat_item__hint}>
                        {chat.messages && chat.messages.length
                            ? [...chat.messages].pop().text
                            : "Начните чат с пользователем"}
                    </small>
                </div>
            </Space>
        </Card>
    )
}

export default ChatItem
