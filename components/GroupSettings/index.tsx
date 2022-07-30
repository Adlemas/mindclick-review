import { Button, Form, Input, InputNumber, Modal, Space } from "antd"
import { ValidateErrorEntity } from "rc-field-form/lib/interface"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import { refreshUserAction } from "slices/auth"
import { createChatAction, deleteChatAction, getChats } from "slices/chats"
import { updateGroupAction } from "slices/groups"
import { Group } from "types"
import handleFormError from "utils/handleFormError"

interface PropTypes {
    visible: boolean
    onClose: () => void
    group: Group
}

interface FormValues {
    name: string
    maxMembers: number
}

const GroupSettings: React.FC<PropTypes> = ({ group, onClose, visible }) => {
    const [form] = Form.useForm<FormValues>()

    const { chats } = useAppSelector((state) => state.chats)
    const { user } = useAppSelector((state) => state.auth)

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user.groups && user.groups.length) {
            dispatch(getChats(user.groups))
        }
    }, [user.groups])

    if (!group) {
        return null
    }

    const handleFinish = (values: FormValues) => {
        dispatch(updateGroupAction([group._id, values]))
        dispatch(refreshUserAction())
        onClose()
    }

    const handleFinishFailed = (errorInfo: ValidateErrorEntity<FormValues>) => {
        handleFormError(errorInfo)
    }

    const handleCreateChat = () => {
        dispatch(createChatAction({
            groupId: group._id,
            title: `${group.name} - Чат`,
        }))
        onClose()
        dispatch(refreshUserAction())
    }

    return (
        <Modal
            visible={visible}
            okText={'Сохранить'}
            onCancel={onClose}
            cancelText={'Отмена'}
            title={'Настройки группы'}
            footer={
                <Space size='small'>
                    <Button key="back" type="primary" danger onClick={onClose}>
                        Закрыть
                    </Button>
                    {!chats.find(chat => chat.groupId === group._id) && <Button key="back" type="primary" onClick={handleCreateChat}>
                        Создать чат
                    </Button>}
                    <Button key="export" type="dashed">
                        Экспорт
                    </Button>
                    <Button key="save" type="primary" onClick={() => {
                        form.validateFields().then(handleFinish).catch(handleFinishFailed)
                    }}>
                        Сохранить
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout='vertical'
                initialValues={{
                    name: group.name,
                    maxMembers: group.maxMembers,
                }}
            >
                <Form.Item name='name' label='Название группы' required rules={[
                    {
                        required: true,
                        message: 'Введите название группы'
                    }
                ]}>
                    <Input placeholder='Название группы' />
                </Form.Item>

                <Form.Item name='maxMembers' label='Максимальное кол-во участников' required rules={[
                    {
                        required: true,
                        message: 'Укажите максимальное кол-во участников'
                    }
                ]}>
                    <InputNumber min={5} max={15} placeholder='Максимальное кол-во участников' />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default GroupSettings