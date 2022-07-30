import {
    QuestionCircleTwoTone,
    ReloadOutlined,
    UserOutlined,
} from "@ant-design/icons"
import {
    Avatar,
    Breadcrumb,
    Button,
    Card,
    Dropdown,
    Form,
    Input,
    List,
    Menu,
    Modal,
    Space,
    Tooltip,
    Typography,
} from "antd"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import moment from "moment"
import { useEffect, useState } from "react"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import { useAppDispatch, useAppSelector } from "slices"
import { selectAuth } from "slices/auth"
import { getAllGroupsAction, selectGroups, setGroups } from "slices/groups"
import styles from "./styles.module.scss"

const Programming: React.FC = () => {
    const [modal, setModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const [members, setMembers] = useState<string[]>([])

    const { user } = useAppSelector(selectAuth)
    const { groups, loading: groupsLoading } = useAppSelector(selectGroups)
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setGroups(user.groups))
        dispatch(getAllGroupsAction({ groupIds: user.groups || [] }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <DashboardLayout title="Проектирование">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <BreadcrumbItem>Программирование</BreadcrumbItem>
                <BreadcrumbItem>Проектирование</BreadcrumbItem>
            </Breadcrumb>

            <Modal
                visible={modal}
                onCancel={() => {
                    setMembers([])
                    setModal(false)
                }}
                okText={"Готово"}
                cancelText={"Отмена"}
                confirmLoading={loading}
            >
                <Form
                    layout="vertical"
                    style={{
                        marginTop: "2rem",
                    }}
                >
                    <Form.Item label={"Имя проекта"} name={"name"}>
                        <Input placeholder="HTML/CSS/JS Группа 1" />
                    </Form.Item>

                    <Form.Item
                        label={`Участники (${members.length})`}
                        name={"members"}
                    >
                        <Dropdown
                            disabled={groupsLoading}
                            overlay={
                                <Menu
                                    selectable
                                    multiple
                                    selectedKeys={members}
                                    onClick={({ key }) => {
                                        if (members.includes(key)) {
                                            setMembers(
                                                [...members].filter(
                                                    (k) => k !== key
                                                )
                                            )
                                        } else {
                                            setMembers([...members, key])
                                        }
                                    }}
                                    items={groups.map((group) => {
                                        return {
                                            type: "group",
                                            label: group.name,
                                            children: group.members.map(
                                                (member) => {
                                                    return {
                                                        key: member._id,
                                                        label: (
                                                            <Space>
                                                                <Avatar
                                                                    src={
                                                                        member.profileImg
                                                                    }
                                                                    icon={
                                                                        <UserOutlined />
                                                                    }
                                                                />
                                                                <Typography>
                                                                    {
                                                                        member.firstName
                                                                    }{" "}
                                                                    {
                                                                        member.lastName
                                                                    }
                                                                </Typography>
                                                            </Space>
                                                        ),
                                                    }
                                                }
                                            ),
                                        }
                                    })}
                                />
                            }
                            trigger={["click"]}
                        >
                            <Button type="text">Выберите участников</Button>
                        </Dropdown>
                    </Form.Item>

                    <Form.Item
                        label={
                            <Space>
                                <Typography>Есть Git репозиторий?</Typography>
                                <Tooltip
                                    title={
                                        "Если вы хотите начать проект с Git репозитория, то просто вставьте ссылку на репозиторий здесь. Оставьте пустым чтобы не клонировать"
                                    }
                                >
                                    <QuestionCircleTwoTone />
                                </Tooltip>
                            </Space>
                        }
                    >
                        <Input placeholder="https://github.com/MindClick/start.git" />
                    </Form.Item>
                </Form>
            </Modal>

            <SizedBox>
                <Space
                    direction="vertical"
                    size={"large"}
                    style={{
                        width: "100%",
                    }}
                >
                    <Card
                        title={"Проекты"}
                        extra={
                            <Space>
                                <Button type="primary" onClick={() => {}}>
                                    <ReloadOutlined />
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={() => setModal(true)}
                                >
                                    НОВЫЙ ПРОЕКТ
                                </Button>
                            </Space>
                        }
                    >
                        <List
                            dataSource={[
                                {
                                    name: "TheBox",
                                    members: [
                                        {
                                            name: "Ринат Лепшоков",
                                            avatar: "https://images.unsplash.com/photo-1479685894911-37e888d38f0a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
                                        },
                                        {
                                            name: "Сергей Раткогло",
                                            avatar: "https://images.unsplash.com/photo-1530071711643-d02e3fad31a2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80",
                                        },
                                        {
                                            name: "Ринат Лепшоков",
                                            avatar: "https://images.unsplash.com/photo-1524660988542-c440de9c0fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
                                        },
                                    ],
                                },
                                {
                                    name: "Boldo",
                                    members: [],
                                },
                            ]}
                            renderItem={(item) => (
                                <List.Item
                                    key={item.name}
                                    className={styles.project}
                                >
                                    <Space
                                        direction={"vertical"}
                                        size={"small"}
                                    >
                                        <Typography className={styles.title}>
                                            {item.name}
                                        </Typography>
                                        <Typography
                                            className={styles.description}
                                        >
                                            {item.members.length ? (
                                                <Avatar.Group
                                                    maxCount={2}
                                                    size="default"
                                                    maxStyle={{
                                                        backgroundColor:
                                                            "#1F64FF",
                                                        color: "#FFFFFF",
                                                    }}
                                                >
                                                    {item.members.map(
                                                        (member) => (
                                                            <Avatar
                                                                icon={
                                                                    <UserOutlined />
                                                                }
                                                                src={
                                                                    member.avatar
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </Avatar.Group>
                                            ) : (
                                                "Нет участников"
                                            )}
                                        </Typography>
                                    </Space>

                                    <Space>
                                        <Button type="primary" danger>
                                            Удалить
                                        </Button>
                                        <Button type="primary">Открыть</Button>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>

                    <Card title={"История действий"}>
                        <List
                            dataSource={[
                                {
                                    id: 1,
                                    date: 1246756786785,
                                    message: 'Создан проект "TheBox"',
                                },
                                {
                                    id: 2,
                                    date: 1249999999999,
                                    message:
                                        'Вы добавили Ринат Лепшоков в проект "TheBox"',
                                },
                            ].reverse()}
                            renderItem={(item) => (
                                <List.Item key={item.id}>
                                    <List.Item.Meta
                                        title={item.message}
                                        description={moment(item.date).format(
                                            "DD/MM/YYYY hh:mm"
                                        )}
                                    />
                                </List.Item>
                            )}
                        />
                    </Card>
                </Space>
            </SizedBox>
        </DashboardLayout>
    )
}

export default Programming
