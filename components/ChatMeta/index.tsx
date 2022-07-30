import { Avatar, Card, Descriptions, Space } from "antd"
import { useAppSelector } from "slices"

import styles from "./styles.module.scss"

const ChatMeta: React.FC = () => {
    const { chat } = useAppSelector((state) => state.singleChat)

    return (
        <Card className={styles.chat_meta__card}>
            {chat ? (
                <Space
                    direction="vertical"
                    align="center"
                    className={styles.chat_meta__wrapper}
                >
                    <Avatar src={chat.user.avatar} size={100} />

                    <Descriptions
                        column={1}
                        layout="vertical"
                        colon={false}
                        className={styles.chat_meta__descriptions}
                    >
                        <Descriptions.Item label="Имя">
                            {chat.user.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Фамилия">
                            {chat.user.lastName}
                        </Descriptions.Item>
                        <Descriptions.Item label="Имя пользователя">
                            {chat.user.username}
                        </Descriptions.Item>
                        <Descriptions.Item label="Телефон">
                            {chat.user.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {chat.user.email}
                        </Descriptions.Item>
                    </Descriptions>
                </Space>
            ) : (
                <div>Выберите чат</div>
            )}
        </Card>
    )
}

export default ChatMeta
