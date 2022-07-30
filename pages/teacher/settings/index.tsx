import { EditFilled, InboxOutlined } from "@ant-design/icons"
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    message,
    Modal,
    Row,
    Space,
    Tooltip,
    Upload,
} from "antd"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import { UploadFile } from "antd/lib/upload/interface"
import moment from "moment"
import { ChangeEvent, useRef, useState } from "react"
import axios from "api/axios"
import updateProfile, { updateProfileBody } from "api/user/updateProfile"
import Portfolio from "components/Portfolio"
import ProfilePic from "components/ProfilePic"
import DashboardLayout from "container/DashboardLayout"
import useResponsive from "hooks/useResponsive"
import { useAppDispatch, useAppSelector } from "slices"
import {
    refreshUser,
    refreshUserAction,
    selectAuth,
    uploadPortfolioFile,
} from "slices/auth"
import humanFileSize from "utils/fileSizeToHumanString"
import handleAxiosError from "utils/handleAxiosError"

import styles from "./styles.module.scss"

interface BasicProps {
    email: string
    firstName: string
    lastName: string
}

interface ProfileProps {
    phone: string
    birthDate: moment.Moment
    city: string
    address: string
    description: string
}

const Settings: React.FC = () => {
    const { user } = useAppSelector(selectAuth)
    const dispatch = useAppDispatch()

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [portfolioModal, setPortfolioModal] = useState<boolean>(false)
    const [fileList, setFileList] = useState<UploadFile<any>[]>([])

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

    const handleSelectProfile = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    const onFinishPortfolio = async (values: ProfileProps) => {
        updateProfileAction(values)
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
                <BreadcrumbItem>Основные</BreadcrumbItem>
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
                        <h3>Профиль</h3>
                        <small>Обновите свое портфолио и биографию</small>
                    </Col>
                    <Col
                        span={device === "mobile" ? 22 : 16}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <Card>
                            <Form
                                name="basic"
                                onFinish={onFinishPortfolio}
                                onFinishFailed={onFinishFailedBasic}
                                initialValues={
                                    {
                                        ...user,
                                        birthDate: moment(user.birthDate),
                                    } as ProfileProps
                                }
                                layout={"vertical"}
                            >
                                <Row>
                                    <Col span={11}>
                                        <Form.Item
                                            label={"Номер телефона"}
                                            name={"phone"}
                                            wrapperCol={{ span: 24 }}
                                            rules={[
                                                {
                                                    pattern:
                                                        /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/i,
                                                    message:
                                                        "Номер телефона введён неверно!",
                                                },
                                            ]}
                                        >
                                            <Input />
                                        </Form.Item>
                                    </Col>

                                    <Col span={12} offset={1}>
                                        <Form.Item
                                            label={"Дата рождения"}
                                            name={"birthDate"}
                                            wrapperCol={{ span: 24 }}
                                        >
                                            <DatePicker />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Form.Item
                                    label={"Город"}
                                    name={"city"}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input maxLength={50} showCount />
                                </Form.Item>

                                <Form.Item
                                    label={"Адрес"}
                                    name={"address"}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input maxLength={256} showCount />
                                </Form.Item>

                                <Form.Item
                                    label={"Краткое описание"}
                                    name={"description"}
                                    wrapperCol={{ span: 24 }}
                                >
                                    <Input.TextArea
                                        placeholder="Введите описание..."
                                        showCount
                                        maxLength={512}
                                    />
                                </Form.Item>

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
                        marginBottom: "1.5rem",
                    }}
                >
                    <Modal
                        visible={portfolioModal}
                        onCancel={() => setPortfolioModal(false)}
                        onOk={() => {
                            console.log(fileList)
                            dispatch(
                                uploadPortfolioFile({
                                    files: fileList.map(
                                        (file) => file.originFileObj
                                    ),
                                })
                            )
                            dispatch(refreshUser())
                        }}
                        okText={"Добавить"}
                        cancelText={"Отмена"}
                        title={"Добавление файлов в портфолио"}
                    >
                        <Upload.Dragger
                            name="file"
                            onChange={(info) => {
                                setFileList(info.fileList)
                            }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Чтобы добавить файл нажмите или перетащите
                            </p>
                            <p className="ant-upload-hint">
                                Поддержка как одиночной загрузки, так и массовой
                            </p>
                        </Upload.Dragger>
                    </Modal>

                    <Col
                        span={device === "mobile" ? 22 : 5}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <h3>Портфолио</h3>
                        <small>Добавьте сертификаты, награды участников</small>
                    </Col>
                    <Col
                        span={device === "mobile" ? 22 : 16}
                        offset={device === "mobile" ? 1 : 1}
                    >
                        <Card
                            extra={
                                <Button
                                    type="primary"
                                    onClick={() => setPortfolioModal(true)}
                                >
                                    Добавить
                                </Button>
                            }
                        >
                            <Portfolio onAdd={() => setPortfolioModal(true)} />
                        </Card>
                    </Col>
                </Row>
            </Space>
        </DashboardLayout>
    )
}

export default Settings
