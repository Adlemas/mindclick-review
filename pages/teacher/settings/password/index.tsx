import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    message,
    Row,
} from "antd"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import { useForm } from "antd/lib/form/Form"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import useLogout from "hooks/useLogout"
import useResponsive from "hooks/useResponsive"
import { useAppDispatch } from "slices"
import { changePassword } from "slices/auth"

const PasswordSettings: React.FC = () => {
    const dispatch = useAppDispatch()

    const [logout] = useLogout()

    const [form] = useForm<{
        oldPassword: string
        newPassword: string
        repeatPassword: string
    }>()

    const device = useResponsive()

    return (
        <DashboardLayout title="Настройки">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <BreadcrumbItem>Главная</BreadcrumbItem>
                <BreadcrumbItem>Настройки</BreadcrumbItem>
                <BreadcrumbItem>Сброс пароля</BreadcrumbItem>
            </Breadcrumb>

            <SizedBox>
                <Card title={"Сброс пароля"}>
                    <Form
                        form={form}
                        name="password"
                        layout="vertical"
                        onFinish={(values: {
                            oldPassword: string
                            newPassword: string
                            repeatPassword: string
                        }) => {
                            if (values.newPassword !== values.repeatPassword) {
                                message.error("Пароли не совпадают!")
                                return
                            }

                            dispatch(
                                changePassword({
                                    newPassword: values.newPassword,
                                    oldPassword: values.oldPassword,
                                })
                            )
                            logout()
                        }}
                    >
                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Данное поле обязательно!",
                                },
                            ]}
                            label={"Старый пароль"}
                            name={"oldPassword"}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Данное поле обязательно!",
                                },
                            ]}
                            label={"Новый пароль"}
                            name={"newPassword"}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Form.Item
                            rules={[
                                {
                                    required: true,
                                    message: "Данное поле обязательно!",
                                },
                            ]}
                            label={"Повторить пароль"}
                            name={"repeatPassword"}
                        >
                            <Input.Password />
                        </Form.Item>

                        <Divider />

                        <Row>
                            <Col
                                span={device === "mobile" ? 10 : 3}
                                offset={device === "mobile" ? 14 : 21}
                            >
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{
                                        width: "100%",
                                    }}
                                >
                                    Сбросить
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Card>
            </SizedBox>
        </DashboardLayout>
    )
}

export default PasswordSettings
