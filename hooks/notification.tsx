import { message, notification } from "antd"
import { useRouter } from "next/router"
import { ReactNode } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import { getChannelMessagesAction } from "slices/singleChat"
import { SocketMessage } from "types"
import { getItemFromLocal } from "utils/localStorage"

interface NotificationProps {
    title: string
    message: string
    icon: ReactNode
    next?: string
}

const useNotification = () => {
    const { push } = useRouter()

    const channelId = getItemFromLocal("channelId")
    const dispatch = useAppDispatch()

    const handleNewMessage = (message: SocketMessage) => {
        if (channelId === message.channelId) {
            dispatch(getChannelMessagesAction(message.channelId))
        }
    }

    const openNotification = ({
        title,
        message,
        icon,
        next,
    }: NotificationProps) => {
        notification.info({
            message: title,
            duration: 2,
            placement: "bottomLeft",
            description: message,

            icon: icon,
            onClick: () => {
                notification.destroy()
                if (next) push(next)
            },
            style: {
                userSelect: "none",
                cursor: "pointer",
            },
        })
    }

    return {
        openNotification,
        handleNewMessage,
    }
}

export default useNotification
