import {
    Breadcrumb,
    Button,
    Card,
    Col,
    DatePicker,
    Empty,
    Form,
    InputNumber,
    List,
    Radio,
    Row,
    Select,
    Space,
    Spin,
    Typography,
} from "antd"
import { useForm } from "antd/lib/form/Form"
import moment from "moment"
import { useEffect, useState } from "react"
import ProfilePic from "components/ProfilePic"
import TaskModal from "components/TaskModal"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import useResponsive from "hooks/useResponsive"
import { useAppDispatch, useAppSelector } from "slices"
import { refreshUser, selectAuth } from "slices/auth"
import { getAllGroupsAction, selectGroups, setGroups } from "slices/groups"
import { addTask, fetchRecentTasks, selectTasks } from "slices/task"
import { ITaskBase, Task, IFlashCardsTask } from "types"
import simulatorName from "utils/simulatorName"

interface FormProps extends ITaskBase {
    digitNumber: number
    isAutoReward: "auto" | "manual"
    members: string[]
    count: number
}

const initialValues: FormProps | { expire: moment.Moment } = {
    count: 10,
    reward: "auto",
    expire: moment().add(2, "days"),
    isAutoReward: "auto",
    members: [],
    digitNumber: 2,
}

const FlashTask: React.FC = () => {
    const device = useResponsive()

    const [form] = useForm()
    const isAutoReward = Form.useWatch<"auto" | "manual">("isAutoReward", form)

    const dispatch = useAppDispatch()
    const { user } = useAppSelector(selectAuth)
    const { groups } = useAppSelector(selectGroups)
    const { tasks, loading } = useAppSelector(selectTasks)

    const [taskInfo, setTaskInfo] = useState<boolean>(false)
    const [currentTask, setCurrentTask] = useState<Task | null>(null)

    const onFinish = (values: FormProps | { expire: moment.Moment }) => {
        ;(values as FormProps).members.forEach((member) => {
            dispatch(
                addTask({
                    completed: false,
                    creator: user._id,
                    simulator: "FLASHCARDS",
                    stats: [],
                    userId: member,
                    task: {
                        count: (values as FormProps).count,
                        expire: (values.expire as moment.Moment).toISOString(),
                        reward: (values as FormProps).reward,
                        digitNumber: (values as FormProps).digitNumber,
                    },
                })
            )
        })
        dispatch(refreshUser())
    }

    useEffect(() => {
        if (
            isAutoReward === "manual" &&
            form.getFieldValue("reward") === "auto"
        ) {
            form.setFieldsValue({
                reward: 1,
            })
        } else if (isAutoReward === "auto") {
            form.setFieldsValue({
                reward: "auto",
            })
        }
    }, [form, isAutoReward])

    useEffect(() => {
        dispatch(setGroups(user.groups))
        dispatch(getAllGroupsAction({ groupIds: user.groups || [] }))
        dispatch(fetchRecentTasks())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <DashboardLayout title="Флешкарты">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Задание</Breadcrumb.Item>
                <Breadcrumb.Item>Флешкарты</Breadcrumb.Item>
            </Breadcrumb>

            <TaskModal
                onTask={(selectedTask) => {
                    if (selectedTask === null) {
                        setCurrentTask(null)
                        setTaskInfo(false)
                        return
                    }

                    if (currentTask && currentTask.simulator === "FLASHCARDS") {
                        const settings = currentTask.task as IFlashCardsTask
                        form.setFieldsValue({
                            ...settings,
                            isAutoReward:
                                settings.reward === "auto" ? "auto" : "manual",
                            members: [currentTask.userId],
                            expire: moment(currentTask.task.expire),
                        } as unknown as FormProps)
                    }

                    setCurrentTask(null)
                    setTaskInfo(false)
                }}
                simulator={"FLASHCARDS"}
                task={currentTask}
                visible={taskInfo}
            />

            <SizedBox>
                <Row
                    style={
                        device === "mobile"
                            ? {
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "1.5rem",
                              }
                            : {}
                    }
                >
                    <Col span={device === "mobile" ? 24 : 16}>
                        <Card title={"Новое задание"}>
                            <Form
                                form={form}
                                name="mental_task"
                                layout="vertical"
                                initialValues={initialValues}
                                onFinish={onFinish}
                            >
                                <Space size={"large"} direction={"vertical"}>
                                    <Typography
                                        style={{
                                            fontSize: 18,
                                            marginBottom: "1.5rem",
                                        }}
                                    >
                                        Участники
                                    </Typography>

                                    <Form.Item
                                        label={"Выберите участников"}
                                        name={"members"}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "flex-start",
                                            marginLeft: "15px",
                                        }}
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    "Участники обязательны",
                                            },
                                        ]}
                                    >
                                        <Select
                                            optionFilterProp="children"
                                            showSearch
                                            placeholder={"Выберите участников"}
                                            mode="multiple"
                                            style={{
                                                minWidth: 200,
                                            }}
                                            filterOption={(input, option) =>
                                                (option!
                                                    .children as unknown as string)
                                                    ? (
                                                          option!
                                                              .children as unknown as string
                                                      )
                                                          .toLowerCase()
                                                          .includes(
                                                              input.toLowerCase()
                                                          )
                                                    : false
                                            }
                                        >
                                            {groups.length ? (
                                                groups.map((group) => {
                                                    return (
                                                        <Select.OptGroup
                                                            label={group.name}
                                                        >
                                                            {group.members.map(
                                                                (member) => {
                                                                    return (
                                                                        <Select.Option
                                                                            value={
                                                                                member._id
                                                                            }
                                                                        >
                                                                            {
                                                                                member.firstName
                                                                            }{" "}
                                                                            {
                                                                                member.lastName
                                                                            }
                                                                        </Select.Option>
                                                                    )
                                                                }
                                                            )}
                                                        </Select.OptGroup>
                                                    )
                                                })
                                            ) : (
                                                <Empty
                                                    description={
                                                        "Нет участников"
                                                    }
                                                />
                                            )}
                                        </Select>
                                    </Form.Item>
                                    <Space
                                        size={100}
                                        align={"start"}
                                        wrap={true}
                                    >
                                        <Col>
                                            <Typography
                                                style={{
                                                    fontSize: 18,
                                                    marginBottom: "1.5rem",
                                                }}
                                            >
                                                Настройки счёта
                                            </Typography>

                                            <Form.Item
                                                label={"Разрад чисел (1-4)"}
                                                name={"digitNumber"}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    marginLeft: "15px",
                                                }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Разрад чисел обязателен",
                                                    },
                                                ]}
                                            >
                                                <InputNumber min={1} max={4} />
                                            </Form.Item>
                                        </Col>

                                        <Col>
                                            <Typography
                                                style={{
                                                    fontSize: 18,
                                                    marginBottom: "1.5rem",
                                                }}
                                            >
                                                Настройки задания
                                            </Typography>

                                            <Form.Item
                                                name={"count"}
                                                label={
                                                    "Кол.-во флешкард (2-500)"
                                                }
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    marginLeft: "15px",
                                                }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Кол.-во флешкард обязательно",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={2}
                                                    max={500}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={"Награда"}
                                                name={"isAutoReward"}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    marginLeft: "15px",
                                                }}
                                            >
                                                <Radio.Group buttonStyle="solid">
                                                    <Radio.Button
                                                        value={"auto"}
                                                    >
                                                        Автоматически
                                                    </Radio.Button>
                                                    <Radio.Button
                                                        value={"manual"}
                                                    >
                                                        Указать вручную
                                                    </Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    "Укажите награду (1-1000)"
                                                }
                                                name={"reward"}
                                                style={{
                                                    display:
                                                        isAutoReward === "auto"
                                                            ? "none"
                                                            : "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    marginLeft: "15px",
                                                }}
                                            >
                                                <InputNumber
                                                    min={1}
                                                    max={1000}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name={"expire"}
                                                label={"Срок выполнения"}
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    alignItems: "flex-start",
                                                    marginLeft: "15px",
                                                }}
                                                rules={[
                                                    {
                                                        required: true,
                                                        message:
                                                            "Срок выполнения обязателен",
                                                    },
                                                ]}
                                            >
                                                <DatePicker
                                                    format={"DD/MM/YYYY"}
                                                />
                                            </Form.Item>
                                        </Col>
                                    </Space>

                                    <Button type="primary" htmlType="submit">
                                        Готово
                                    </Button>
                                </Space>
                            </Form>
                        </Card>
                    </Col>

                    <Col
                        span={device === "mobile" ? 24 : 7}
                        offset={device === "mobile" ? 0 : 1}
                    >
                        <Card title={"Предыдущие задания"}>
                            {loading ? (
                                <Spin
                                    spinning
                                    tip="Загрузка..."
                                    size="large"
                                    style={{ maxHeight: "unset" }}
                                >
                                    <div
                                        style={{
                                            width: "100vw",
                                            padding: "3.5rem 0",
                                        }}
                                    />
                                </Spin>
                            ) : !tasks.length ? (
                                <Empty description={"Недавних заданий нет!"} />
                            ) : (
                                <List
                                    dataSource={tasks.filter(
                                        (task) =>
                                            task.simulator === "FLASHCARDS"
                                    )}
                                    renderItem={(task) => (
                                        <List.Item
                                            key={task._id}
                                            actions={[
                                                <Button
                                                    type="dashed"
                                                    onClick={() => {
                                                        console.log(
                                                            "CURRENT",
                                                            task
                                                        )
                                                        setCurrentTask(task)
                                                        setTaskInfo(true)
                                                    }}
                                                >
                                                    ПОДРОБНЕЕ
                                                </Button>,
                                            ]}
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    <ProfilePic
                                                        userId={task.userId}
                                                    />
                                                }
                                                title={simulatorName(
                                                    task.simulator
                                                )}
                                                description={
                                                    <Typography.Text type="secondary">
                                                        {moment(
                                                            task.task.expire
                                                        ).fromNow()}{" "}
                                                        (
                                                        {moment(
                                                            task.task.expire
                                                        ).format("DD/MM/YYYY")}
                                                        )
                                                        <br />
                                                        {moment(
                                                            task.createdAt
                                                        ).format(
                                                            "DD/MM/YYYY HH:mm"
                                                        )}
                                                    </Typography.Text>
                                                }
                                            />
                                        </List.Item>
                                    )}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </SizedBox>
        </DashboardLayout>
    )
}

export default FlashTask
