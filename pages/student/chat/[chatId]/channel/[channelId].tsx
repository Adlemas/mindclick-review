import { Spin } from "antd"
import DashboardLayout from "container/student/DashboardLayout"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import { getSingleChatChannelAction, setChat } from "slices/singleChat"

const SingleChannelPage: React.FC = () => {
    const router = useRouter()
    const { chatId, channelId } = router.query

    const dispatch = useAppDispatch()
    const { chat, channel } = useAppSelector((state) => state.singleChat)

    if (!channelId || !chatId) {
        /**
         * Return loading page
         */
        return (
            <Spin
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
                tip="Загрузка..."
            >
                <div
                    style={{
                        width: "100vw",
                        height: "100vh",
                    }}
                ></div>
            </Spin>
        )
    }

    useEffect(() => {
        if (chatId) {
            dispatch(setChat(chatId))
        }
        if (channelId) {
            dispatch(getSingleChatChannelAction(channelId.toString()))
        }
    }, [channelId, chatId])

    return (
        <DashboardLayout title="Чат">
            <h1>Чат: {chat ? chat.title : "..."}</h1>
            <h2>Канал: {channel ? channel.title : "..."}</h2>
        </DashboardLayout>
    )
}

export default SingleChannelPage
