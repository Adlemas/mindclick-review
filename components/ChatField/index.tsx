import styles from "./styles.module.scss"

import { Button, Input } from "antd"
import { RiSendPlane2Line } from "react-icons/ri"
import classNames from "classnames"
import { useThemeSwitcher } from "react-css-theme-switcher"

const ChatField: React.FC = () => {
    const { currentTheme } = useThemeSwitcher()

    return (
        <div
            className={classNames(styles.chat_field, {
                [styles.chat_field__dark]: currentTheme === "dark",
            })}
        >
            <Input.TextArea
                bordered={false}
                placeholder="Введите сообщение"
                className={styles.chat_field__input}
                onInput={(e) => {
                    // auto grow textarea with scroll height
                    ;(e.target as HTMLTextAreaElement).style.height = "5px"
                    ;(e.target as HTMLTextAreaElement).style.height =
                        (e.target as HTMLTextAreaElement).scrollHeight + "px"
                }}
            />
            <Button icon={<RiSendPlane2Line />} type="primary" />
        </div>
    )
}

export default ChatField
