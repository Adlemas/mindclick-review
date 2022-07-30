import { Avatar, Button, Card, Input, Spin, Tooltip } from "antd"
import classNames from "classnames"
import BubbleMessage from "components/BubbleMessage"
import InfoMessage from "components/InfoMessage"
import ProfilePic from "components/ProfilePic"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import {
    RiAddCircleFill,
    RiHashtag,
    RiSendPlane2Fill,
    RiUserLine,
    RiVolumeUpFill,
} from "react-icons/ri"
import { useAppSelector, useAppDispatch } from "slices"
import { setGroups, getAllGroupsAction } from "slices/groups"
import {
    getChannelMessagesAction,
    getChatChannelsAction,
    getSingleChatChannelAction,
    sendMessageAction,
    setChannel,
} from "slices/singleChat"

import { animateScroll } from "react-scroll"

import styles from "./styles.module.scss"
import ChatStart from "components/ChatStart"
import useSocket from "hooks/useSocket"
import { SocketMessage } from "types"
import { LoadingOutlined } from "@ant-design/icons"

interface PropTypes {
    membersVisible: boolean
    onOpenMembers: () => void
}

const MessagesView: React.FC<PropTypes> = ({
    membersVisible = true,
    onOpenMembers,
}) => {
    const { currentTheme } = useThemeSwitcher()

    const { groups } = useAppSelector((state) => state.groups)
    const { chat, channel, sending } = useAppSelector(
        (state) => state.singleChat
    )
    const { user } = useAppSelector((state) => state.auth)
    const dispatch = useAppDispatch()

    const [message, setMessage] = useState("")

    const messagesListRef = useRef<HTMLDivElement | null>(null)

    const socket = useSocket()

    useEffect(() => {
        if (chat) {
            dispatch(getChatChannelsAction())
        }
    }, [chat?._id])

    useEffect(() => {
        const handleNewMessage = (message: SocketMessage) => {
            if (channel?._id === message.channelId) {
                dispatch(getChannelMessagesAction(message.channelId))
            }
        }
        if (socket) {
            socket.on('messageMeta', handleNewMessage)
        }

        // Will not work if uncommented
        // return () => {
        //     socket?.off('messageMeta', handleNewMessage)
        // }
    }, [socket])

    useEffect(() => {
        dispatch(setGroups(user.groups))
        dispatch(getAllGroupsAction({ groupIds: user.groups || [] }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const group = groups.find((group) => group._id === chat?.groupId)

    useEffect(() => {
        if (channel) {
            if (typeof channel === "string" && chat && chat.channels) {
                dispatch(
                    setChannel({
                        ...chat.channels
                            .map((c) => c)
                            .find((c) => c._id === channel),
                    })
                )
            } else {
                dispatch(getChannelMessagesAction(channel._id))
            }
        } else if (chat && chat.channels.length) {
            if (typeof chat.channels[0] === "string") {
                dispatch(getSingleChatChannelAction(chat.channels[0]))
            } else {
                dispatch(getSingleChatChannelAction(chat.channels[0]._id))
            }
        }
    }, [channel?._id, chat?.channels])

    const handleSendMessage = () => {
        // TODO: message type support

        if (message.length <= 0) {
            return
        }

        dispatch(
            sendMessageAction({
                content: message,
                type: "text",
            })
        )

        setMessage("")
        const element = document.querySelector(
            "#message_input"
        ) as HTMLTextAreaElement
        if (element) {
            element.style.height = "auto"
        }
    }

    /**
     * effect to scroll to the bottom of the messages list when new message is added
     */
    useEffect(() => {
        if (messagesListRef.current) {
            // messagesListRef.current.scrollTop =
            //     messagesListRef.current.scrollHeight
            animateScroll.scrollToBottom({
                containerId: "messages_list",
                duration: 100,
            })
        }
    }, [channel?.messages])

    return (
        <Card
            className={classNames("chat_view_item", styles.messages_view, {
                [styles.messages_view__dark]: currentTheme === "dark",
            })}
            title={
                <div className={styles.messages_view__head}>
                    <div className={styles.messages_view__head__title}>
                        {channel ? (
                            channel.type === "text" ? (
                                <RiHashtag />
                            ) : (
                                <RiVolumeUpFill />
                            )
                        ) : (
                            ""
                        )}{" "}
                        {channel ? channel.title : ""}
                    </div>

                    <div className={styles.messages_view__head__actions}>
                        <Avatar.Group size="small" maxCount={3}>
                            <ProfilePic src={user.profileImg} />
                            {group && group.members.length
                                ? group.members.map((member) => (
                                    <ProfilePic userId={member._id} />
                                ))
                                : null}
                        </Avatar.Group>

                        <Button
                            type="text"
                            hidden={membersVisible}
                            onClick={onOpenMembers}
                        >
                            <RiUserLine />
                        </Button>
                    </div>
                </div>
            }
            bordered={false}
        >
            <div
                className={styles.messages_view__list}
                ref={messagesListRef}
                id="messages_list"
            >
                <ChatStart />
                {channel && channel.messages && channel.messages.length
                    ? channel?.messages.map((message, index) => {
                        if (typeof message !== "object") return

                        const previousMessage =
                            index > 0 ? channel.messages[index - 1] : null

                        const duration = previousMessage
                            ? moment(
                                moment(message.createdAt).format(
                                    "DD-MM-YYYY"
                                ),
                                "DD-MM-YYYY"
                            ).diff(
                                moment(
                                    moment(
                                        previousMessage.createdAt
                                    ).format("DD-MM-YYYY"),
                                    "DD-MM-YYYY"
                                ),
                                "days"
                            )
                            : 0

                        return (
                            <>
                                {(duration > 0 || index === 0) && (
                                    <InfoMessage>
                                        {moment(message.createdAt).format(
                                            "MMM DD, YYYY"
                                        )}
                                    </InfoMessage>
                                )}
                                <BubbleMessage
                                    message={message}
                                    key={index}
                                    user={message.from}
                                    previousMessage={
                                        index > 0
                                            ? channel.messages[index - 1]
                                            : null
                                    }
                                />
                            </>
                        )
                    })
                    : ""}
            </div>

            <div className={styles.messages_view__input}>
                <div
                    className={classNames(styles.messages_view__input__inner, {
                        [styles.messages_view__input__inner__dark]:
                            currentTheme === "dark",
                    })}
                >
                    <Input.TextArea
                        id="message_input"
                        maxLength={2000}
                        rows={1}
                        placeholder={`Напишите сообщение в ${channel ? channel.title || "канал" : "канал"
                            }`}
                        disabled={!channel || typeof channel === "string"}
                        value={message}
                        onChange={(e) => {
                            setMessage(e.target.value)
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && e.shiftKey === false) {
                                e.preventDefault()
                                handleSendMessage()
                                return
                            }
                        }}
                        onInput={(e) => {
                            const element = e.target as HTMLTextAreaElement
                            element.style.height = "5px"
                            element.style.height = element.scrollHeight + "px"
                        }}
                    />
                    <div
                        className={styles.messages_view__input__button}
                        hidden={!channel || typeof channel === "string"}
                    >
                        <RiAddCircleFill size={20} />
                    </div>
                    <Tooltip title="Отправить">
                        {sending ? (
                            <Spin indicator={<LoadingOutlined spin />} />
                        ) : (
                            <div
                                className={styles.messages_view__input__button}
                                hidden={!channel || typeof channel === "string"}
                                onClick={(e) => handleSendMessage()}
                            >
                                <RiSendPlane2Fill size={20} />
                            </div>
                        )}
                    </Tooltip>
                </div>
            </div>
        </Card>
    )
}

export default MessagesView
