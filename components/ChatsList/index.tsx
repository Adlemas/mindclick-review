import { List, Avatar, Typography, Button, Space } from "antd"
import classNames from "classnames"
import ChatItem from "components/ChatItem"
import fakeChats from "data/fakeChats"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { useAppDispatch } from "slices"
import { setChat } from "slices/singleChat"

import styles from "./styles.module.scss"

const ChatsList: React.FC = () => {
    const dispatch = useAppDispatch()

    const { currentTheme, switcher } = useThemeSwitcher()

    return (
        <Space direction="vertical" className={styles.chats_list__wrapper}>
            <h2 className={styles.chats_list__title}>Клиенты</h2>

            <List
                dataSource={fakeChats}
                className={classNames(styles.chats_list, {
                    [styles.chats_list__dark]: currentTheme === "dark",
                })}
                renderItem={(chat, index) => (
                    <>
                        <List.Item
                            key={chat._id}
                            onClick={() => {
                                dispatch(setChat(chat))
                            }}
                            className={styles.chats_list__item}
                        >
                            <ChatItem chat={chat} key={chat._id} />
                        </List.Item>
                        {index === fakeChats.length - 1 && (
                            <Button
                                onClick={() => {
                                    switcher({
                                        theme:
                                            currentTheme === "dark"
                                                ? "light"
                                                : "dark",
                                    })
                                }}
                            >
                                {currentTheme === "dark"
                                    ? "Светлая тема"
                                    : "Темная тема"}
                            </Button>
                        )}
                    </>
                )}
            />
        </Space>
    )
}

export default ChatsList
