import { Divider, Image, Typography } from "antd"
import { RiHashtag, RiVolumeUpFill } from "react-icons/ri"
import { useAppSelector } from "slices"

import styles from "./styles.module.scss"

// import celebrationGif from "assets/gifs/celebration.gif"

const ChatStart: React.FC = () => {
    const { channel } = useAppSelector((state) => state.singleChat)

    return (
        <>
            <div className={styles.chat_start}>
                {channel && channel.title ? (
                    <Typography.Title className={styles.chat_start__title}>
                        {channel.type === "text" ? (
                            <RiHashtag />
                        ) : (
                            <RiVolumeUpFill />
                        )}
                        {channel.title}
                    </Typography.Title>
                ) : (
                    ""
                )}
                <Typography.Text type="secondary">
                    Это начало канала "{channel?.title}"
                </Typography.Text>
            </div>
            <Divider
                style={{
                    marginTop: 0,
                }}
            />
        </>
    )
}

export default ChatStart
