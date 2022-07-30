import { Button, Form, Input, Modal, Typography } from "antd"
import { RiSettings3Line, RiTimeLine, RiUser3Line } from "react-icons/ri"

import styles from "./styles.module.scss"

import ActionButton from "components/ChatView/ActionButton"
import { useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import handleFormError from "utils/handleFormError"
import { deleteChatAction, updateChatAction } from "slices/chats"
import { useRouter } from "next/router"

interface FormValues {
    title: string
}

const initialValues: FormValues = {
    title: "",
}

const ActionsView: React.FC = () => {
    const [chatEdit, setChatEdit] = useState(false)
    const [form] = Form.useForm<FormValues>()

    const { chat } = useAppSelector((state) => state.singleChat)
    const { user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        if (chat) {
            form.setFieldsValue({
                title: chat.title,
            })
        }
    }, [chat])

    const dispatch = useAppDispatch()

    const router = useRouter()

    const handleChatEditSubmit = (values: FormValues) => {
        if (chat) {
            dispatch(
                updateChatAction([
                    chat._id,
                    {
                        title: values.title,
                    },
                ])
            )
            setChatEdit(false)
        }
    }

    const handleChatDeleteRequest = () => {
        if (chat) {
            Modal.confirm({
                title: "Вы уверены, что хотите удалить этот чат?",
                content:
                    "Это действие нельзя отменить, удалиться абсолютно всё связанное с этим чатом - каналы, сообщения и т. д.",
                okText: "Да",
                cancelText: "Нет",
                centered: true,
                onOk: () => {
                    dispatch(deleteChatAction(chat._id))
                    router.replace('/')
                },
                onCancel: () => setChatEdit(false),
            })
        }
    }

    return (
        <>
            <Modal
                visible={chatEdit}
                title={<Typography>Настройки чата</Typography>}
                onCancel={() => setChatEdit(false)}
                footer={[
                    <Button type="default" onClick={() => setChatEdit(false)}>
                        Закрыть
                    </Button>,
                    <Button
                        type="primary"
                        onClick={handleChatDeleteRequest}
                        danger
                    >
                        Удалить
                    </Button>,
                    <Button
                        type="primary"
                        onClick={() => {
                            form.validateFields()
                                .then(handleChatEditSubmit)
                                .catch(handleFormError)
                        }}
                    >
                        Сохранить
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    initialValues={initialValues}
                    layout="vertical"
                >
                    <Form.Item name="title" label="Название чата">
                        <Input maxLength={30} showCount />
                    </Form.Item>
                </Form>
            </Modal>

            <div className={styles.action_buttons_wrapper}>
                <ActionButton icon={<RiTimeLine />}>Уведомления</ActionButton>
                {user && user.role === "TEACHER" && (
                    <ActionButton
                        icon={<RiSettings3Line />}
                        onClick={() => setChatEdit(true)}
                    >
                        Настройки
                    </ActionButton>
                )}
            </div>
        </>
    )
}

export default ActionsView
