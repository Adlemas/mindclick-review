import { Card } from "antd"
import classNames from "classnames"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { useAppDispatch, useAppSelector } from "slices"
import { getChatAction } from "slices/singleChat"
import ChannelsView from "./ChannelsView"
import MembersView from "./MembersView"
import MessagesView from "./MessagesView"
import RoomView from "./RoomView"

import styles from "./styles.module.scss"

interface PropTypes {
    id: string
}

const ChatView: React.FC<PropTypes> = ({ id }) => {
    const { currentTheme } = useThemeSwitcher()

    const dispatch = useAppDispatch()
    const { chat, channel } = useAppSelector((state) => state.singleChat)
    const [requestedChat, setRequestedChat] = useState(false)

    const [membersVisible, setMembersVisible] = useState<boolean>(false)

    const router = useRouter()

    useEffect(() => {
        if (requestedChat && !chat) {
            router.back()
        }
        if (!chat || chat._id !== id) {
            setRequestedChat(true)
            dispatch(getChatAction(id))
        }
    }, [dispatch, id, chat])

    return (
        <Card
            bordered={false}
            className={classNames(styles.chat_view, {
                [styles.chat_view__dark]: currentTheme === "dark",
            })}
            bodyStyle={{
                padding: "0",
                margin: "0",
            }}
        >
            <ChannelsView />
            {channel && channel.type === 'text' ? <MessagesView
                membersVisible={membersVisible}
                onOpenMembers={() => setMembersVisible(true)}
            /> : channel && <RoomView />}
            <MembersView
                visible={membersVisible}
                onClose={() => setMembersVisible(false)}
            />
        </Card>
    )
}

export default ChatView
