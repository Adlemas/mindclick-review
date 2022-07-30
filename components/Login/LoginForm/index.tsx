import { Button, Card, Checkbox, Form, Input } from "antd"
import { ValidateErrorEntity } from "rc-field-form/lib/interface"
import { loginAction, selectAuth } from "slices/auth"
import { useAppDispatch, useAppSelector } from "slices/index"
import { AuthBody } from "types/index"
import handleFormError from "utils/handleFormError"

interface ValueTypes {
    email: string
    password: string
    rememberMe: boolean
}

const LoginForm = () => {
    const { loading } = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()

    const handleSubmit = async (values: ValueTypes) => {
        const body: AuthBody = {
            ...values,
        }
        dispatch(loginAction(body))
    }

    const onFinishFailed = (errorInfo: ValidateErrorEntity<ValueTypes>) => {
        handleFormError(errorInfo)
    }

    return (
        <Card
            style={{
                maxWidth: 350,
                margin: "0 auto",
            }}
        >
            <Form
                name="basic"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                initialValues={{ email: "", password: "", rememberMe: false }}
                onFinish={handleSubmit}
                onFinishFailed={onFinishFailed}
                layout="vertical"
                requiredMark={false}
            >
                <Form.Item
                    label={"Email"}
                    name={"email"}
                    rules={[
                        {
                            required: true,
                            message: "Email обязателен",
                        },
                        {
                            pattern:
                                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Пожалуйста введите корректный Email",
                        },
                    ]}
                >
                    <Input placeholder="info@company.com" />
                </Form.Item>

                <Form.Item
                    name={"password"}
                    label={"Пароль"}
                    rules={[{ required: true, message: "Введите пароль" }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item name={"rememberMe"} valuePropName={"checked"}>
                    <Checkbox>Запомнить меня</Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                    >
                        Логин
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    )
}

export default LoginForm
