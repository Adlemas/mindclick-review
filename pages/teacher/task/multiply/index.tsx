import {
    Breadcrumb,
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    InputNumber,
    Radio,
    Row,
    Select,
    Space,
    Typography,
} from "antd"
import { useForm } from "antd/lib/form/Form"
import moment from "moment"
import { useState } from "react"
import { useEffect } from "react"
import MemberSelect from "components/MemberSelect"
import TaskList from "components/TaskList"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import useResponsive from "hooks/useResponsive"
import { useAppDispatch, useAppSelector } from "slices"
import { refreshUser, selectAuth } from "slices/auth"
import { getAllGroupsAction, setGroups } from "slices/groups"
import { addTask, fetchRecentTasks } from "slices/task"
import { IMultiplyTask, Task } from "types"

import multiplyData from "data/multiply"
import TaskModal from "components/TaskModal"

type FormProps = IMultiplyTask & {
    members: string[]
    template: string
    isAutoReward: "auto" | "manual"
}

const initialValues: FormProps | { expire: moment.Moment } = {
    count: 10,
    reward: "auto",
    expire: moment().add(2, "days"),
    members: [],
    first: [],
    second: [],
    template: Object.keys(multiplyData)[0],
    isAutoReward: "auto",
}

const MultiplyTask: React.FC = () => {
    const [form] = useForm<FormProps>()
    const isAutoReward = Form.useWatch<"auto" | "manual">("isAutoReward", form)
    const template = Form.useWatch<string>("template", form)

    const { user } = useAppSelector(selectAuth)
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
                    simulator: "MULTIPLY",
                    stats: [],
                    userId: member,
                    task: {
                        count: (values as FormProps).count,
                        expire: (values.expire as moment.Moment).toISOString(),
                        reward: (values as FormProps).reward,
                        first: (values as FormProps).first,
                        second: (values as FormProps).second,
                    },
                })
            )
        })
        dispatch(refreshUser())
    }

    useEffect(() => {
        if (template && currentTask === null) {
            form.setFieldsValue({
                first: [],
                second: [],
            })
        } else if (currentTask !== null) {
            setCurrentTask(null)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template, form])

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
        <DashboardLayout title="Ментальный счёт">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Задание</Breadcrumb.Item>
                <Breadcrumb.Item>Умножение</Breadcrumb.Item>
            </Breadcrumb>

            <TaskModal
                simulator="MULTIPLY"
                task={currentTask}
                visible={taskInfo}
                onTask={(selectedTask) => {
                    if (selectedTask === null) {
                        setCurrentTask(null)
                        setTaskInfo(false)
                        return
                    }

                    const settings = currentTask.task as IMultiplyTask
                    const templateFindIndex = Object.values(
                        multiplyData
                    ).findIndex(
                        (v) =>
                            v.first.includes(settings.first[0]) &&
                            v.second.includes(settings.second[0])
                    )
                    form.setFieldsValue({
                        ...settings,
                        template: templateFindIndex
                            ? Object.keys(multiplyData)[templateFindIndex]
                            : "?",
                        isAutoReward:
                            settings.reward === "auto" ? "auto" : "manual",
                        members: [currentTask.userId],
                        expire: moment(currentTask.task.expire),
                    } as unknown as FormProps)
                    form.setFieldsValue({
                        first: settings.first,
                        second: settings.second,
                    })

                    setTaskInfo(false)
                }}
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
                                        <MemberSelect />
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
                                                name={"template"}
                                                label={"Шаблон примера"}
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
                                                            "Шаблон обязателен",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    optionFilterProp="children"
                                                    showSearch
                                                    placeholder={
                                                        "Выберите шаблон"
                                                    }
                                                    style={{
                                                        minWidth: 200,
                                                    }}
                                                    filterOption={(
                                                        input,
                                                        option
                                                    ) =>
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
                                                    {Object.keys(
                                                        multiplyData
                                                    ).map((label) => {
                                                        return (
                                                            <Select.Option
                                                                key={label}
                                                            >
                                                                {label}
                                                            </Select.Option>
                                                        )
                                                    })}
                                                </Select>
                                            </Form.Item>

                                            <Form.Item
                                                name={"first"}
                                                label={"Первое"}
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
                                                            "Первое число обязательно",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    allowClear
                                                    mode="multiple"
                                                    style={{ minWidth: 200 }}
                                                    placeholder="Пожалуйства выберите первое число"
                                                    onChange={(
                                                        value: string[]
                                                    ) => {
                                                        console.log(value)
                                                        if (
                                                            value.includes("*")
                                                        ) {
                                                            form.setFieldsValue(
                                                                {
                                                                    first: multiplyData[
                                                                        template
                                                                    ].first.filter(
                                                                        (f) =>
                                                                            f !==
                                                                            "*"
                                                                    ),
                                                                }
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {template
                                                        ? multiplyData[
                                                              template
                                                          ].first.map(
                                                              (label) => {
                                                                  return (
                                                                      <Select.Option
                                                                          key={
                                                                              label
                                                                          }
                                                                      >
                                                                          {
                                                                              label
                                                                          }
                                                                      </Select.Option>
                                                                  )
                                                              }
                                                          )
                                                        : []}
                                                </Select>
                                            </Form.Item>

                                            <Typography>{template}</Typography>

                                            <Form.Item
                                                name={"second"}
                                                label={"Второе"}
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
                                                            "Второе число обязательно",
                                                    },
                                                ]}
                                            >
                                                <Select
                                                    allowClear
                                                    mode="multiple"
                                                    style={{ minWidth: 200 }}
                                                    placeholder="Пожалуйства выберите второе число"
                                                    onChange={(
                                                        value: string[]
                                                    ) => {
                                                        if (
                                                            value.includes("*")
                                                        ) {
                                                            form.setFieldsValue(
                                                                {
                                                                    second: multiplyData[
                                                                        template
                                                                    ].second.filter(
                                                                        (s) =>
                                                                            s !==
                                                                            "*"
                                                                    ),
                                                                }
                                                            )
                                                        }
                                                    }}
                                                >
                                                    {template
                                                        ? multiplyData[
                                                              template
                                                          ].second.map(
                                                              (label) => {
                                                                  return (
                                                                      <Select.Option
                                                                          key={
                                                                              label
                                                                          }
                                                                      >
                                                                          {
                                                                              label
                                                                          }
                                                                      </Select.Option>
                                                                  )
                                                              }
                                                          )
                                                        : []}
                                                </Select>
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
                                                    "Кол.-во примеров (2-500)"
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
                                                            "Кол.-во примеров обязательно",
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
                        <TaskList
                            onSelect={(task) => {
                                setCurrentTask(task)
                                setTaskInfo(true)
                            }}
                        />
                    </Col>
                </Row>
            </SizedBox>
        </DashboardLayout>
    )
}

export default MultiplyTask
