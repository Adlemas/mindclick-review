import {
    Button,
    Col,
    Dropdown,
    Form,
    Input,
    Menu,
    message,
    Modal,
    Row,
    Spin,
    Tooltip,
    Typography,
} from "antd"
import ActionButton from "components/ChatView/ActionButton"
import { useRouter } from "next/router"
import { ReactNode, useEffect, useState } from "react"
import {
    RiAddCircleLine,
    RiArrowDownSLine,
    RiArrowUpSLine,
    RiDeleteBinFill,
    RiEditFill,
    RiHashtag,
    RiVolumeUpFill,
} from "react-icons/ri"
import { useAppDispatch, useAppSelector } from "slices"
import {
    createChannelAction,
    deleteChannelAction,
    getChatChannelsAction,
    setChannel,
    updateChannelAction,
} from "slices/singleChat"
import { Channel, ChannelType } from "types"
import handleFormError from "utils/handleFormError"

import styles from "./styles.module.scss"

interface PropTypes {
    title: ReactNode
    type: ChannelType
}

interface FormValues {
    title: string
}

const initialValues: FormValues = {
    title: "",
}

const ChannelsWrapper: React.FC<PropTypes> = ({ title, type }) => {
    const [visible, setVisible] = useState(true)

    const [modal, setModal] = useState<boolean>(false)
    const [form] = Form.useForm<FormValues>()
    const titleField = Form.useWatch("title", form)

    const router = useRouter()

    const role = useAppSelector((state) => state.auth.user?.role)

    // for channel update
    const [currentChannel, setCurrentChannel] = useState<Channel | null>(null)

    const dispatch = useAppDispatch()

    const {
        chat,
        loading,
        channel: selectedChannel,
    } = useAppSelector((state) => state.singleChat)

    const { user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (chat) {
            dispatch(getChatChannelsAction())
        }
    }, [chat?._id])

    const handleCreateChannel = () => {
        setCurrentChannel(null)
        form.setFieldsValue(initialValues)
        setModal(true)
    }

    const handleCreateChannelSubmit = (values: FormValues) => {
        dispatch(
            createChannelAction({
                title: values.title,
                type,
            })
        )
        setModal(false)
    }

    const handleUpdateChannelSubmit = (values: FormValues) => {
        dispatch(
            updateChannelAction([
                currentChannel._id,
                {
                    title: values.title,
                },
            ])
        )
        setModal(false)
    }

    useEffect(() => {
        if (currentChannel) {
            form.setFieldsValue({
                title: currentChannel.title,
            })
        } else {
            form.setFieldsValue(initialValues)
        }
    }, [currentChannel])

    const handleFinishFailed = (errorInfo: any) => {
        handleFormError(errorInfo)
    }

    const handleChannelDelete = () => {
        if (currentChannel) {
            Modal.confirm({
                title: `Удалить канал "${currentChannel.title}" ?`,
                content: "Вы уверены, что хотите удалить этот канал?",
                onOk: () => {
                    dispatch(deleteChannelAction(currentChannel._id))
                },
                centered: true,
            })
        }
    }

    const menu = (
        <Menu
            items={[
                {
                    key: "edit",
                    icon: <RiEditFill />,
                    label: "Изменить",
                    onClick: () => {
                        setModal(true)
                    },
                },
                {
                    key: "delete",
                    icon: <RiDeleteBinFill />,
                    label: "Удалить",
                    danger: true,
                    onClick: handleChannelDelete,
                },
            ]}
        />
    )

    return (
        <div className={styles.channels_wrapper}>
            <Modal
                visible={modal}
                onCancel={() => setModal(false)}
                title={
                    <Typography>
                        {currentChannel
                            ? `Изменить канал ${currentChannel.title}`
                            : `Создание ${
                                  type === "text" ? "текстового" : "голосового"
                              } канала`}
                    </Typography>
                }
                onOk={() => {
                    form.validateFields()
                        .then((values) => {
                            if (currentChannel) {
                                handleUpdateChannelSubmit(values)
                            } else {
                                handleCreateChannelSubmit(values)
                            }
                        })
                        .catch(handleFinishFailed)
                }}
            >
                <Form
                    form={form}
                    initialValues={initialValues}
                    wrapperCol={{ span: 12 }}
                    layout="vertical"
                    requiredMark={false}
                    style={{ marginTop: "1rem" }}
                >
                    <Form.Item label="Представление">
                        <ActionButton>
                            {type === "text" ? (
                                <RiHashtag />
                            ) : (
                                <RiVolumeUpFill />
                            )}{" "}
                            {titleField && titleField.length
                                ? titleField
                                : "Новый канал"}
                        </ActionButton>
                    </Form.Item>
                    <Form.Item
                        label="Название"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: "Введите название канала",
                            },
                        ]}
                    >
                        <Input placeholder="Напишите название канала" />
                    </Form.Item>
                </Form>
            </Modal>

            <Typography.Text
                type="secondary"
                className={styles.channels_wrapper__title}
            >
                <span onClick={() => setVisible(!visible)}>
                    {visible ? <RiArrowUpSLine /> : <RiArrowDownSLine />}{" "}
                    {title}
                </span>
                {user && user.role === "TEACHER" && (
                    <Tooltip title="Создать канал">
                        <Button type="text" onClick={handleCreateChannel}>
                            <RiAddCircleLine />
                        </Button>
                    </Tooltip>
                )}
            </Typography.Text>
            <div className={styles.channels_wrapper__content} hidden={!visible}>
                <Spin spinning={loading}>
                    {chat &&
                    chat.channels &&
                    chat.channels.filter((channel) => channel.type === type)
                        .length ? (
                        chat.channels.map(
                            (channel) =>
                                channel.type === type && (
                                    <Dropdown
                                        overlay={menu}
                                        trigger={["contextMenu"]}
                                        // visible={contextVisible}
                                        onVisibleChange={(visible) => {
                                            if (visible) {
                                                setCurrentChannel(channel)
                                            } else {
                                                setCurrentChannel(null)
                                            }
                                        }}
                                    >
                                        <ActionButton
                                            // onContextMenu={() =>
                                            //     handleContextVisibleChange(true)
                                            // }
                                            icon={
                                                channel.type === "text" ? (
                                                    <RiHashtag />
                                                ) : (
                                                    <RiVolumeUpFill />
                                                )
                                            }
                                            onClick={() => {
                                                if (role)
                                                    router.push(
                                                        `/${role.toLowerCase()}/chat/${
                                                            chat._id
                                                        }/channel/${
                                                            channel._id
                                                        }`
                                                    )
                                            }}
                                            selected={
                                                selectedChannel &&
                                                selectedChannel._id ===
                                                    channel._id
                                            }
                                        >
                                            {channel.title}
                                        </ActionButton>
                                    </Dropdown>
                                )
                        )
                    ) : (
                        <Typography.Text
                            type="secondary"
                            className={styles.channels_wrapper__content__item}
                        >
                            Нет каналов
                        </Typography.Text>
                    )}
                </Spin>
            </div>
        </div>
    )
}

export default ChannelsWrapper
