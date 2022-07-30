import { DatePicker, Form, Input, InputNumber, message, Modal } from "antd"
import { useState } from "react"
import { ValidateErrorEntity } from "rc-field-form/lib/interface"
import { useAppDispatch, useAppSelector } from "slices"
import { addGroupAction, selectGroups, getAllGroupsAction } from "slices/groups"
import { Group, User } from "types"
import handleFormError from "utils/handleFormError"

import { MouseEvent } from "react"
import { refreshUser, selectAuth } from "slices/auth"

interface PropTypes {
    visible: boolean
    onClose: (e: MouseEvent<HTMLElement, Event>) => void
}

const AddGroup: React.FC<PropTypes> = ({ visible, onClose }) => {
    const dispatch = useAppDispatch()
    const { loading } = useAppSelector(selectGroups)

    const [values, setValues] = useState({
        name: "",
        maxMembers: 10,
    })

    const handleOk = () => {
        // Check for values
        if (
            values.name.length > 2 &&
            values.maxMembers >= 5 &&
            values.maxMembers <= 15
        ) {
            // All it's ok
            dispatch(addGroupAction(values as Group))
            dispatch(refreshUser())
            onClose(null)
        } else {
            message.error("Введите корректные данные!")
            if (values.maxMembers < 5 || values.maxMembers > 15) {
                setTimeout(() => {
                    message.error("Число участников вне лимита!")
                }, 500)
            }
        }
    }

    const onFinishFailed = (errorInfo: ValidateErrorEntity<User>) => {
        handleFormError(errorInfo)
    }

    return (
        <Modal
            confirmLoading={loading}
            visible={visible}
            title={"Новая группа"}
            onCancel={onClose}
            onOk={handleOk}
        >
            <Form
                // className={styles.form}
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                // onFinish={handleOk}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name={"name"}
                    label={"Имя класса"}
                    rules={[{ required: true, message: "Введите имя класса" }]}
                >
                    <Input
                        placeholder="Телепузики"
                        onChange={(e) => {
                            setValues({
                                ...values,
                                name: e.target.value,
                            })
                        }}
                    />
                </Form.Item>

                <Form.Item
                    name={"maxMembers"}
                    label={"Максимальное число участников (от 5 до 15)"}
                >
                    <InputNumber
                        min={5}
                        max={15}
                        onChange={(v) =>
                            setValues({ ...values, maxMembers: v })
                        }
                    />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddGroup
