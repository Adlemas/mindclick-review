import { DatePicker, Form, Input, Modal, Select } from "antd"
import { useEffect } from "react"
import { ValidateErrorEntity } from "rc-field-form/lib/interface"
import { useAppDispatch, useAppSelector } from "slices"
import {
    addMemberAction,
    selectGroups,
    updateMemberAction,
} from "slices/groups"
import { User } from "types"
import handleFormError from "utils/handleFormError"

import { MouseEvent } from "react"
import { refreshUser } from "slices/auth"
import moment from "moment"

interface PropTypes {
    groupId: string | null
    visible: boolean
    onClose: (e: MouseEvent<HTMLElement, Event>) => void

    user?: User
}

interface FormProps extends User {
    groupId: string | null
}

const AddMember: React.FC<PropTypes> = ({
    groupId,
    visible,
    onClose,
    user,
}) => {
    const [form] = Form.useForm<FormProps>()

    const dispatch = useAppDispatch()
    const { loading, groups } = useAppSelector(selectGroups)

    const handleOk = (values: FormProps) => {
        // All it's ok
        if (user === null) {
            dispatch(
                addMemberAction({
                    groupId: values.groupId,
                    member: values as any,
                })
            )
        } else {
            dispatch(
                updateMemberAction({
                    id: user._id,
                    user: {
                        ...values,
                        role: "STUDENT",
                    },
                })
            )
        }
        dispatch(refreshUser())
        onClose(null)
    }

    const onFinishFailed = (errorInfo: ValidateErrorEntity<User>) => {
        handleFormError(errorInfo)
    }

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user,
                birthDate: user ? moment(user.birthDate) : null,
                password: "",
            } as FormProps & { birthDate: moment.Moment })
        } else {
            form.setFieldsValue({
                firstName: "",
                lastName: "",
                phone: "",
                birthDate: 0,
                role: "STUDENT",
                email: "",
                password: "",
                groupId,
            } as unknown as FormProps & { birthDate: moment.Moment })
        }
    }, [user])

    useEffect(() => {
        form.setFieldsValue({
            ...user,
            groupId,
            birthDate: user ? moment(user.birthDate) : null,
            password: "",
        } as FormProps & { birthDate: moment.Moment })
    }, [groupId])

    return (
        <Modal
            confirmLoading={loading}
            visible={visible}
            onCancel={onClose}
            title={user !== null ? "?????????????????? ??????????????" : "???????????????????? ??????????????"}
            onOk={() => {
                form.validateFields()
                    .then((values) => {
                        form.resetFields()
                        handleOk(values)
                    })
                    .catch((info) => {
                        handleFormError(info)
                    })
            }}
        >
            <Form
                // className={styles.form}
                form={form}
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={
                    user
                        ? {
                              ...user,
                              birthDate: user ? moment(user.birthDate) : null,
                              password: "",
                              groupId,
                          }
                        : {
                              firstName: "",
                              lastName: "",
                              phone: "",
                              birthDate: 0,
                              role: "STUDENT",
                              email: "",
                              password: "",
                              groupId,
                          }
                }
                onFinishFailed={onFinishFailed}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    name={"firstName"}
                    label={"??????"}
                    rules={[{ required: true, message: "?????????????? ??????" }]}
                >
                    <Input placeholder="??????????" />
                </Form.Item>

                <Form.Item
                    name={"lastName"}
                    label={"??????????????"}
                    rules={[{ required: true, message: "?????????????? ??????????????" }]}
                >
                    <Input placeholder="??????????????" />
                </Form.Item>

                <Form.Item
                    label={"Email"}
                    name={"email"}
                    rules={[
                        {
                            required: true,
                            message: "Email ????????????????????",
                        },
                        {
                            pattern:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "???????????????????? ?????????????? ???????????????????? Email",
                        },
                    ]}
                >
                    <Input
                        disabled={user !== null}
                        placeholder="info@company.com"
                    />
                </Form.Item>

                <Form.Item
                    name={"phone"}
                    label={"?????????? ????????????????"}
                    rules={[
                        { required: true, message: "?????????????? ?????????? ????????????????" },
                    ]}
                >
                    <Input placeholder="+7..." />
                </Form.Item>

                <Form.Item
                    label={"???????? ????????????????"}
                    name={"birthDate"}
                    rules={[
                        {
                            required: true,
                            message: "???????? ???????????????? ??????????????????????",
                        },
                    ]}
                >
                    <DatePicker
                        format={"DD-MM-YYYY"}
                        placeholder={"????-????-????????"}
                    />
                </Form.Item>

                <Form.Item
                    name={"groupId"}
                    label={"????????????"}
                    rules={[{ required: true, message: "???????????????? ????????????!" }]}
                >
                    <Select
                        placeholder={"???????????????? ????????????"}
                        options={groups.map((group) => ({
                            label: group.name,
                            value: group._id,
                        }))}
                    ></Select>
                </Form.Item>

                <Form.Item
                    name={"password"}
                    label={"????????????"}
                    rules={[
                        { required: user === null, message: "?????????????? ????????????" },
                    ]}
                >
                    <Input.Password />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddMember
