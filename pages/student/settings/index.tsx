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
                `???????????? ?????????? ?????????????? ?????????? (${humanFileSize(
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
                    message.success("??????????????!")
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
        <DashboardLayout title="??????????????????">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <BreadcrumbItem>??????????????</BreadcrumbItem>
                <BreadcrumbItem>??????????????????</BreadcrumbItem>
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
                        <h3>???????????? ????????????????????</h3>
                        <small>
                            ???????????????? ???????? ???????? ?????????????? ?? ???????????? ????????????
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
                                    <Tooltip title={"???????????????? 3 ????"}>
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
                                            label={"??????"}
                                            name={"firstName"}
                                            wrapperCol={{ span: 24 }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message: "?????? ??????????????????????",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12} offset={1}>
                                        <Form.Item
                                            label={"??????????????"}
                                            name={"lastName"}
                                            wrapperCol={{ span: 24 }}
                                            rules={[
                                                {
                                                    required: true,
                                                    message:
                                                        "?????????????? ??????????????????????",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Tooltip title={"?????? ???????? ???????????? ????????????????"}>
                                    <Form.Item
                                        label={"Email"}
                                        name={"email"}
                                        wrapperCol={{ span: 24 }}
                                        rules={[
                                            {
                                                required: true,
                                                message: "?????????? ??????????????????????",
                                            },
                                        ]}
                                    >
                                        <Input type={"email"} disabled />
                                    </Form.Item>
                                </Tooltip>

                                <Divider />

                                <Row className={styles.row_end}>
                                    <Button type="primary" htmlType="submit">
                                        ????????????????
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
                        <h3>???????????????????????? & ????????????????????????????????????</h3>
                        <small>???????????????? ???????? ????????????</small>
                    </Col>
                    <Col
                        span={device === "mobile" ? 22 : 16}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <Card title={"?????????? ????????????"}>
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
                                        message.error("???????????? ???? ??????????????????!")
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
                                            message: "???????????? ???????? ??????????????????????!",
                                        },
                                    ]}
                                    label={"???????????? ????????????"}
                                    name={"oldPassword"}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "???????????? ???????? ??????????????????????!",
                                        },
                                    ]}
                                    label={"?????????? ????????????"}
                                    name={"newPassword"}
                                >
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    rules={[
                                        {
                                            required: true,
                                            message: "???????????? ???????? ??????????????????????!",
                                        },
                                    ]}
                                    label={"?????????????????? ????????????"}
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
                                            ????????????????
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
                        <h3>?????????????? ??????</h3>
                        <small>???????????????? ?????????????? ?????? ????????????????????</small>
                    </Col>
                    <Col
                        span={device === "mobile" ? 22 : 16}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <Card title={"?????????????????? ???????????????? ????????"}>
                            <Space direction="vertical">
                                <Typography>????????</Typography>
                                <Radio.Group
                                    buttonStyle="solid"
                                    onChange={(e) => setTheme(e.target.value)}
                                    value={currentTheme}
                                >
                                    <Radio.Button value={"light"}>
                                        ??????????????
                                    </Radio.Button>
                                    <Radio.Button value={"dark"}>
                                        ????????????
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
