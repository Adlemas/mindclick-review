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
import { useState } from "react"
import { useEffect } from "react"
import DiapasonSelect from "components/DiapasonSelect"
import FormulaSelect from "components/FormulaSelect"
import ProfilePic from "components/ProfilePic"
import TaskModal from "components/TaskModal"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import useResponsive from "hooks/useResponsive"
import { useAppDispatch, useAppSelector } from "slices"
import { refreshUser, selectAuth } from "slices/auth"
import { getAllGroupsAction, selectGroups, setGroups } from "slices/groups"
import { addTask, fetchRecentTasks, selectTasks } from "slices/task"
import { CountFormula, IMentalTask, ITaskBase, Task } from "types"
import simulatorName from "utils/simulatorName"

interface FormProps extends ITaskBase {
    formula: CountFormula
    diapason: string
    terms: number
    isAutoReward: "auto" | "manual"
    members: string[]
    speed: number
}

const initialValues: FormProps | { expire: moment.Moment } = {
    count: 10,
    reward: "auto",
    expire: moment().add(2, "days"),
    formula: "NF",
    diapason: "NF:1-4",
    terms: 10,
    isAutoReward: "auto",
    speed: 1.5,
    members: [],
}

const MentalTask: React.FC = () => {
    const [form] = useForm<FormProps>()
    const diapasonValue = Form.useWatch<string>("diapason", form)
    const isAutoReward = Form.useWatch<"auto" | "manual">("isAutoReward", form)

    const { groups } = useAppSelector(selectGroups)
    const { user } = useAppSelector(selectAuth)
    const { tasks, loading } = useAppSelector(selectTasks)
    const dispatch = useAppDispatch()

    const [taskInfo, setTaskInfo] = useState<boolean>(false)
    const [currentTask, setCurrentTask] = useState<Task | null>(null)

    const device = useResponsive()

    const onFinish = (values: FormProps | { expire: moment.Moment }) => {
        ;(values as FormProps).members.forEach((member) => {
            dispatch(
                addTask({
                    completed: false,
                    creator: user._id,
                    simulator: "MENTAL",
                    stats: [],
                    userId: member,
                    task: {
                        count: (values as FormProps).count,
                        diapason: {
                            min: parseInt(
                                (values as FormProps).diapason.split("-")[0],
                                10
                            ),
                            max: parseInt(
                                (values as FormProps).diapason.split("-")[1],
                                10
                            ),
                        },
                        expire: (values.expire as moment.Moment).toISOString(),
                        formula: (values as FormProps).formula,
                        reward: (values as FormProps).reward,
                        speed: (values as FormProps).speed,
                        terms: (values as FormProps).terms,
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
        <DashboardLayout title="???????????????????? ????????">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>??????????????</Breadcrumb.Item>
                <Breadcrumb.Item>???????????????????? ????????</Breadcrumb.Item>
            </Breadcrumb>

            <TaskModal
                onTask={(selectedTask) => {
                    if (selectedTask === null) {
                        setCurrentTask(null)
                        setTaskInfo(false)
                    }

                    if (currentTask && currentTask.simulator === "MENTAL") {
                        const settings = currentTask.task as IMentalTask
                        form.setFieldsValue({
                            ...settings,
                            diapason: `${settings.diapason.min}-${settings.diapason.max}`,
                            isAutoReward:
                                settings.reward === "auto" ? "auto" : "manual",
                            members: [currentTask.userId],
                            expire: moment(currentTask.task.expire),
                        } as unknown as FormProps)
                    }

                    setCurrentTask(null)
                    setTaskInfo(false)
                }}
                simulator={"MENTAL"}
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
                        <Card title={"?????????? ??????????????"}>
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
                                        ??????????????????
                                    </Typography>

                                    <Form.Item
                                        label={"???????????????? ????????????????????"}
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
                                                    "?????????????????? ??????????????????????",
                                            },
                                        ]}
                                    >
                                        <Select
                                            optionFilterProp="children"
                                            showSearch
                                            placeholder={"???????????????? ????????????????????"}
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
                                                        "?????? ????????????????????"
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
                                                ?????????????????? ??????????
                                            </Typography>

                                            <Form.Item
                                                label={
                                                    "??????.-???? ?????????????????? (2-500)"
                                                }
                                                name={"terms"}
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
                                                            "??????.-???? ?????????????????? ??????????????????????",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={2}
                                                    max={500}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={"????????????????"}
                                                name={"speed"}
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
                                                            "???????????????? ??????????????????????",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={0.1}
                                                    max={3.5}
                                                    step={0.1}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={"??????????????"}
                                                name={"formula"}
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
                                                            "?????????????? ????????????????????a",
                                                    },
                                                ]}
                                            >
                                                <FormulaSelect
                                                    disabled={
                                                        diapasonValue &&
                                                        diapasonValue.includes(
                                                            ":"
                                                        )
                                                    }
                                                />
                                            </Form.Item>
                                            <Form.Item
                                                label={"???????????? ????????????????????"}
                                                name={"diapason"}
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
                                                            "???????????? ???????????????????? ????????????????????",
                                                    },
                                                ]}
                                            >
                                                <DiapasonSelect />
                                            </Form.Item>
                                        </Col>

                                        <Col>
                                            <Typography
                                                style={{
                                                    fontSize: 18,
                                                    marginBottom: "1.5rem",
                                                }}
                                            >
                                                ?????????????????? ??????????????
                                            </Typography>

                                            <Form.Item
                                                name={"count"}
                                                label={
                                                    "??????.-???? ???????????????? (2-500)"
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
                                                            "??????.-???? ???????????????? ??????????????????????",
                                                    },
                                                ]}
                                            >
                                                <InputNumber
                                                    min={2}
                                                    max={500}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                label={"??????????????"}
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
                                                        ??????????????????????????
                                                    </Radio.Button>
                                                    <Radio.Button
                                                        value={"manual"}
                                                    >
                                                        ?????????????? ??????????????
                                                    </Radio.Button>
                                                </Radio.Group>
                                            </Form.Item>

                                            <Form.Item
                                                label={
                                                    "?????????????? ?????????????? (1-1000)"
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
                                                label={"???????? ????????????????????"}
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
                                                            "???????? ???????????????????? ????????????????????",
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
                                        ????????????
                                    </Button>
                                </Space>
                            </Form>
                        </Card>
                    </Col>

                    <Col
                        span={device === "mobile" ? 24 : 7}
                        offset={device === "mobile" ? 0 : 1}
                    >
                        <Card title={"???????????????????? ??????????????"}>
                            {loading ? (
                                <Spin
                                    spinning
                                    tip="????????????????..."
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
                                <Empty description={"???????????????? ?????????????? ??????!"} />
                            ) : (
                                <List
                                    dataSource={tasks.filter(
                                        (task) => task.simulator === "MENTAL"
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
                                                    ??????????????????
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

export default MentalTask
