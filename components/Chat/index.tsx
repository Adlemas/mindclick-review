import { Card } from "antd"
import BubbleMessage from "components/BubbleMessage"
import ChatField from "components/ChatField"
import { useAppSelector } from "slices"

import styles from "./styles.module.scss"

const Chat: React.FC = () => {
    const { chat } = useAppSelector((state) => state.singleChat)

    return (
        <Card className={styles.chat_wrapper}>
            <div className={styles.chat_wrapper__messages}>
                {chat ? (
                    chat.messages.map((message) => (
                        <BubbleMessage message={message} />
                    ))
                ) : (
                    <div>Выберите чат</div>
                )}
            </div>
            <ChatField />
        </Card>
    )
}

export default Chat
