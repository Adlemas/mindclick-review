import { EditFilled, InboxOutlined } from "@ant-design/icons"
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Divider,
    Form,
    Input,
    message,
    Radio,
    Row,
    Space,
    Tooltip,
    Typography,
} from "antd"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import updateProfile, { updateProfileBody } from "api/user/updateProfile"
import axios from "api/axios"
import ProfilePic from "components/ProfilePic"
import DashboardLayout from "container/student/DashboardLayout"
import useResponsive from "hooks/useResponsive"
import { ChangeEvent, useRef } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import {
    changePassword,
    refreshUser,
    refreshUserAction,
    selectAuth,
} from "slices/auth"
import humanFileSize from "utils/fileSizeToHumanString"
import handleAxiosError from "utils/handleAxiosError"

import styles from "./styles.module.scss"
import SizedBox from "container/SizedBox"
import useLogout from "hooks/useLogout"
import { useForm } from "antd/lib/form/Form"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { setItemInLocal } from "utils/localStorage"

interface BasicProps {
    email: string
    firstName: string
    lastName: string
}

const StudentSettingsPage: React.FC = () => {
    const { user } = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()

    const inputRef = useRef<HTMLInputElement | null>(null)

    const updateProfileAction = async (values) => {
        try {
            const data = await updateProfile(values as updateProfileBody)
            if (data && data.message) {
                message.success(data.message)
            }
            dispatch(refreshUserAction())
        } catch (err: any) {
            handleAxiosError(err)
        }
    }

    const onFinishBasic = async (values: BasicProps) => {
        updateProfileAction({
            ...values,
            email: user.email,
        })
    }

    const device = useResponsive()

    const onFinishFailedBasic = () => {}

    const handleSelectProfile = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    const handleInputFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files.length) return

        const file = e.target.files[0]

        if (file.size > 3 * 1_000_000) {
            message.error(
                `Размер файла слишком велик (${humanFileSize(
                    file.size,
                    true
                )} > ${"3 MiB"})`
            )
            e.target.value = ""
        } else {
            const formData = new FormData()
            formData.append("profile", file)

            try {
                const { status } = await axios.post("profile", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })

                if (status === 200) {
                    message.success("Успешно!")
                    dispatch(refreshUser())
                }
            } catch (err: any) {
                handleAxiosError(err)
            }
        }
    }

    const [logout] = useLogout()

    const [form] = useForm<{
        oldPassword: string
        newPassword: string
        repeatPassword: string
    }>()

    const { switcher, currentTheme, themes, status } = useThemeSwitcher()

    const setTheme = (theme: string) => {
        switcher({ theme })
        // set theme in local storage
        setItemInLocal("theme", theme)
    }

    return (
        <DashboardLayout title="Настройки">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <BreadcrumbItem>Главная</BreadcrumbItem>
                <BreadcrumbItem>Настройки</BreadcrumbItem>
            </Breadcrumb>

            <Space
                direction="vertical"
                size={"large"}
                style={{
                    flex: 1,
                    width: "100%",
                }}
            >
                <Row
                    style={{
                        gap: "3rem",
                    }}
                >
                    <Col
                        span={device === "mobile" ? 22 : 5}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <h3>Личная информация</h3>
                        <small>
                            Обновите свое фото профиля и личные данные
                        </small>
                    </Col>
                    <Col
                        span={device === "mobile" ? 22 : 16}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <Card>
                            <div className={styles.profile_container}>
                                <div className={styles.profile_content}>
                                    <ProfilePic
                                        src={user.profileImg}
                                        size={150}
                                    />
                                    <input
                                        type="file"
                                        ref={inputRef}
                                        accept="image/png, image/jpeg"
                                        onChange={handleInputFile}
                                    />
                                    <Tooltip title={"Максимум 3 мб"}>
                                        <div
                                            className={styles.float_edit}
                                            onClick={handleSelectProfile}
                                        >
                                            <EditFilled />
                                        </div>
                                    </Tooltip>
                                </div>
                            </div>

                            <Form
                                name="basic"
                                onFinish={onFinishBasic}
                                onFinishFailed={onFinishFailedBasic}
                                initialValues={user as BasicProps}
                                layout={"vertical"}
                            >
                                <Row>
                                    <Col span={11}>
                                        <Form.Item
                                            label={"Имя"}
                                            name={"firstName"}
                                            wrapperCol={{ span: 24 }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "Имя обязательно",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12} offset={1}>
                                        <Form.Item
                                            label={"Фамилия"}
                                            name={"lastName"}
                                            wrapperCol={{ span: 24 }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "Фамилия обязательна",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Tooltip title={"Это поле нельзя изменить"}>
                                    <Form.Item
                                        label={"Email"}
                                        name={"email"}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "Почта обязательна",
                                            },
                                        ]}
                                    >
                                        <Input type={"email"} disabled />
                                    </Form.Item>
                                </Tooltip>

                                <Divider />

                                <Row className={styles.row_end}>
                                    <Button type="primary" htmlType="submit">
                                        Обновить
                                    </Button>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                </Row>

                <Row
                    style={{
                        gap: "3rem",
                    }}
                >
                    <Col
                        span={device === "mobile" ? 22 : 5}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <h3>Безопасность & Конфиденциальность</h3>
                        <small>Обновите свой пароль</small>
                    </Col>
                    <Col
                        span={device === "mobile" ? 22 : 16}
                        offset={device === "mobile" ? 1 : 1}
                    >
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
                                    if (
                                        values.newPassword !==
                                        values.repeatPassword
                                    ) {
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
                    </Col>
                </Row>

                <Row
                    style={{
                        gap: "3rem",
                    }}
                >
                    <Col
                        span={device === "mobile" ? 22 : 5}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <h3>Внешний вид</h3>
                        <small>Обновите внешний вид приложения</small>
                    </Col>
                    <Col
                        span={device === "mobile" ? 22 : 16}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <Card title={"Настройки внешнего вида"}>
                            <Space direction="vertical">
                                <Typography>Тема</Typography>
                                <Radio.Group
                                    buttonStyle="solid"
                                    onChange={(e) => setTheme(e.target.value)}
                                    value={currentTheme}
                                >
                                    <Radio.Button value={"light"}>
                                        Светлая
                                    </Radio.Button>
                                    <Radio.Button value={"dark"}>
                                        Тёмная
                                    </Radio.Button>
                                </Radio.Group>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </Space>
        </DashboardLayout>
    )
}

export default StudentSettingsPage
