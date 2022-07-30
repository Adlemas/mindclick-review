import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Descriptions,
    Divider,
    Empty,
    Form,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Typography,
} from "antd"
import ProfilePic from "components/ProfilePic"
import SimulatorSettingsDescription from "components/SimulatorSettingsDescription"
import TaskModal from "components/TaskModal"
import TaskStatsModal from "components/TaskStatsModal"
import SizedBox from "container/SizedBox"
import DashboardLayout from "container/student/DashboardLayout"
import { lineColors, weekDays, monthNames } from "data/charts"
import moment from "moment"
import { useEffect, useState } from "react"
import { useAppSelector, useAppDispatch } from "slices"
import { selectAuth } from "slices/auth"
import { getUserTasksAction } from "slices/task"
import { Simulator, Statistic, Task } from "types"
import getCurrentMonth from "utils/getCurrentMonth"
import getCurrentWeek from "utils/getCurrentWeek"
import getCurrentYear from "utils/getCurrentYear"
import randomNumber from "utils/randomNumber"
import simulatorName from "utils/simulatorName"

import {
    Chart,
    PointElement,
    Tooltip,
    Title,
    CategoryScale,
    Filler,
    Legend,
    BarController,
    BarElement,
    LinearScale,
} from "chart.js"
import { Bar } from "react-chartjs-2"

Chart.register(
    BarController,
    BarElement,
    PointElement,
    LinearScale,
    Title,
    Tooltip,
    CategoryScale,
    Filler,
    Legend
)

const StudentMyTasksPage: React.FC = () => {
    const [currentTasks, setCurrentTasks] = useState<Task[]>([])
    const [viewTask, setViewTask] = useState<Task | null>(null)
    const [taskModal, setTaskModal] = useState<boolean>(false)

    const [statsTask, setStatsTask] = useState<Task | null>(null)
    const [statsModal, setStatsModal] = useState<boolean>(false)

    const { tasks, loading } = useAppSelector((state) => state.tasks)
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(selectAuth)

    const [timeFactor, setTimeFactor] = useState<"week" | "month" | "year">(
        "week"
    )

    useEffect(() => {
        dispatch(getUserTasksAction())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    const dateSorted = () => {
        const temp = tasks.slice()
        temp.sort((taskB, taskA) =>
            moment(taskB.createdAt).isAfter(taskA.createdAt)
                ? -1
                : moment(taskB.createdAt).isSame(taskA.createdAt)
                ? 0
                : 1
        )
        return temp
    }

    const getTimedStats = ({ stats, createdAt }: Task) => {
        if (timeFactor === "week") {
            const weekDays = getCurrentWeek()

            return weekDays.map((wd) => {
                let count = 0

                stats.forEach((stat) => {
                    if (moment(stat.createdAt).isSame(wd, "date")) {
                        count++
                    }
                })

                return count
            })
        } else if (timeFactor === "month") {
            return getCurrentMonth().map((md) => {
                let count = 0
                console.log({
                    monthDays: getCurrentMonth().map((m) =>
                        m.format("DD/MM/YYYY")
                    ),
                })

                stats.forEach((s) => {
                    if (moment(s.createdAt).isSame(md, "date")) {
                        count++
                    }
                })

                return count
            })
        } else if (timeFactor === "year") {
            return getCurrentYear().map((ym) => {
                let count = 0

                stats.forEach((stat) => {
                    if (moment(stat.createdAt).isSame(ym, "month")) {
                        count++
                    }
                })

                return count
            })
        }

        return []
    }

    return (
        <DashboardLayout title="Мои задачи">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
                <Breadcrumb.Item>Мои задачи</Breadcrumb.Item>
            </Breadcrumb>

            <TaskStatsModal
                visible={statsModal}
                task={statsTask}
                onCancel={() => {
                    setStatsModal(false)
                    setStatsTask(null)
                }}
            />

            <TaskModal
                label={
                    viewTask &&
                    currentTasks.map((t) => t._id).includes(viewTask._id)
                        ? "Удалить из статистики"
                        : "Добавить"
                }
                onTask={(selectedTask) => {
                    setViewTask(selectedTask)
                    setTaskModal(false)

                    if (selectedTask !== null) {
                        if (
                            viewTask &&
                            currentTasks
                                .map((t) => t._id)
                                .includes(selectedTask._id)
                        ) {
                            setCurrentTasks(
                                currentTasks.filter(
                                    (t) => t._id !== selectedTask._id
                                )
                            )
                        } else {
                            setCurrentTasks([...currentTasks, selectedTask])
                        }
                    }
                }}
                task={viewTask}
                visible={taskModal}
            />

            <SizedBox>
                <Row
                    wrap={true}
                    style={{
                        gap: "1.5rem",
                    }}
                >
                    <Col span={24}>
                        <Card title={"Статистика"}>
                            {!currentTasks.length ? (
                                <Empty
                                    description={
                                        "Выберите задание для просмотра статистики!"
                                    }
                                />
                            ) : (
                                <>
                                    <Form.Item
                                        label={"Диапазон времени"}
                                        labelCol={{ span: 24 }}
                                    >
                                        <Select
                                            value={timeFactor}
                                            onChange={setTimeFactor}
                                        >
                                            <Select.Option value={"week"}>
                                                Неделя
                                            </Select.Option>
                                            <Select.Option value={"month"}>
                                                Месяц
                                            </Select.Option>
                                            <Select.Option value={"year"}>
                                                Год
                                            </Select.Option>
                                        </Select>
                                    </Form.Item>
                                    <Bar
                                        data={{
                                            datasets: currentTasks.map(
                                                (task, index) => {
                                                    const color: string =
                                                        lineColors.length >
                                                        index
                                                            ? lineColors[index]
                                                            : `rgba(${randomNumber(
                                                                  0,
                                                                  255
                                                              )}, ${randomNumber(
                                                                  0,
                                                                  255
                                                              )}, ${randomNumber(
                                                                  0,
                                                                  255
                                                              )}, 255)`

                                                    return {
                                                        backgroundColor: color,
                                                        borderColor:
                                                            lineColors.length >
                                                            index
                                                                ? lineColors[
                                                                      index
                                                                  ] + "88"
                                                                : color.replace(
                                                                      "255)",
                                                                      "150)"
                                                                  ),
                                                        label: simulatorName(
                                                            task.simulator
                                                        ),
                                                        data: getTimedStats(
                                                            task
                                                        ),
                                                    }
                                                }
                                            ),
                                            labels:
                                                timeFactor === "week"
                                                    ? weekDays
                                                    : timeFactor === "month"
                                                    ? Array.from(
                                                          Array(
                                                              moment().daysInMonth()
                                                          ),
                                                          (_, index) => {
                                                              return (index + 1)
                                                                  .toString()
                                                                  .padStart(
                                                                      2,
                                                                      "0"
                                                                  )
                                                          }
                                                      )
                                                    : monthNames,
                                        }}
                                    />
                                    <h2
                                        style={{
                                            marginTop: "2.5rem",
                                        }}
                                    >
                                        Информация
                                    </h2>
                                    {currentTasks.map((currentTask) => (
                                        <>
                                            <h3
                                                style={{
                                                    margin: "1rem",
                                                }}
                                            >
                                                {simulatorName(
                                                    currentTask.simulator
                                                )}
                                            </h3>
                                            <Descriptions
                                                column={{
                                                    xxl: 3,
                                                    xl: 2,
                                                    lg: 2,
                                                    md: 2,
                                                    sm: 1,
                                                    xs: 1,
                                                }}
                                                layout={"vertical"}
                                                // bordered
                                                labelStyle={{ fontWeight: 600 }}
                                                colon={false}
                                            >
                                                <Descriptions.Item
                                                    label={"Тренажёр"}
                                                >
                                                    {simulatorName(
                                                        currentTask.simulator
                                                    )}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={"Статус"}
                                                >
                                                    {currentTask.completed
                                                        ? "Выполнено"
                                                        : currentTask.stats &&
                                                          currentTask.stats
                                                              .length > 0
                                                        ? "В процессе"
                                                        : "Невыполнено"}
                                                </Descriptions.Item>
                                                {SimulatorSettingsDescription(
                                                    currentTask
                                                )}
                                                <Descriptions.Item
                                                    label={"Кол.-во примеров"}
                                                >
                                                    {currentTask.task.count}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={"Решено примеров"}
                                                >
                                                    {currentTask?.stats
                                                        ?.length || 0}{" "}
                                                    / {currentTask.task.count}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={"Награда"}
                                                >
                                                    {currentTask.task.reward ===
                                                    "auto"
                                                        ? "Автоматически"
                                                        : currentTask.task
                                                              .reward}
                                                </Descriptions.Item>
                                                <Descriptions.Item
                                                    label={"Срок выполнения"}
                                                >
                                                    {moment(
                                                        currentTask.task.expire
                                                    ).format("DD/MM/YYYY")}
                                                </Descriptions.Item>
                                            </Descriptions>
                                            <Button
                                                type="ghost"
                                                onClick={() => {
                                                    setStatsTask(currentTask)
                                                    setStatsModal(true)
                                                }}
                                            >
                                                Подробнее
                                            </Button>
                                            <Divider />
                                        </>
                                    ))}
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card title={"Задания"}>
                            {loading ? (
                                <Spin
                                    spinning
                                    tip="Загрузка..."
                                    size="large"
                                    style={{
                                        maxHeight: "unset",
                                    }}
                                >
                                    <div
                                        style={{
                                            padding: "3.5rem",
                                        }}
                                    />
                                </Spin>
                            ) : tasks.length <= 0 ? (
                                <Empty description={"Нет заданий"} />
                            ) : (
                                <Table
                                    dataSource={dateSorted()}
                                    columns={[
                                        {
                                            title: "Тренажёр",
                                            dataIndex: "userId",
                                            key: "simulator",
                                            render: (
                                                userId: Simulator,
                                                task: Task
                                            ) => {
                                                return (
                                                    <Space size={"small"}>
                                                        <ProfilePic
                                                            userId={userId}
                                                        />
                                                        <Typography>
                                                            {simulatorName(
                                                                task.simulator
                                                            )}
                                                        </Typography>
                                                    </Space>
                                                )
                                            },
                                        },
                                        {
                                            title: "Срок выполнения",
                                            dataIndex: "task",
                                            key: "task/expire",
                                            render: (task: {
                                                expire: string
                                            }) => (
                                                <Typography>
                                                    {moment(task.expire).format(
                                                        "DD/MM/YYYY"
                                                    )}
                                                    <br />
                                                    {moment(
                                                        task.expire
                                                    ).fromNow()}
                                                </Typography>
                                            ),
                                        },
                                        {
                                            title: "Дата создания",
                                            dataIndex: "createdAt",
                                            key: "task/createdAt",
                                            render: (createdAt: string) => (
                                                <Typography>
                                                    {moment(createdAt).format(
                                                        "DD/MM/YYYY"
                                                    )}
                                                </Typography>
                                            ),
                                        },
                                        {
                                            title: "Статус",
                                            dataIndex: "stats",
                                            key: "stats",
                                            render: (
                                                stats: Statistic[],
                                                task
                                            ) => (
                                                <Typography
                                                    style={{
                                                        color: moment(
                                                            task.task.expire
                                                        ).isBefore(
                                                            moment(),
                                                            "day"
                                                        )
                                                            ? "crimson"
                                                            : "inherit",
                                                    }}
                                                >
                                                    {stats.length
                                                        ? stats.length <
                                                          task.task.count
                                                            ? "В процессе"
                                                            : "Выполнено"
                                                        : task?.task?.expire &&
                                                          moment(
                                                              task.task.expire
                                                          ).isBefore(
                                                              moment(),
                                                              "day"
                                                          )
                                                        ? "Просрочено"
                                                        : "Создано"}
                                                </Typography>
                                            ),
                                        },
                                        {
                                            title: "Действия",
                                            dataIndex: "simulator",
                                            render: (_, task) => (
                                                <Space size={"small"}>
                                                    <Button
                                                        type="primary"
                                                        onClick={() => {
                                                            if (
                                                                currentTasks
                                                                    .map(
                                                                        (t) =>
                                                                            t._id
                                                                    )
                                                                    .includes(
                                                                        task._id
                                                                    )
                                                            ) {
                                                                setCurrentTasks(
                                                                    currentTasks.filter(
                                                                        (t) =>
                                                                            t._id !==
                                                                            task._id
                                                                    )
                                                                )
                                                            } else {
                                                                setCurrentTasks(
                                                                    [
                                                                        ...currentTasks,
                                                                        task,
                                                                    ]
                                                                )
                                                            }
                                                        }}
                                                        danger={
                                                            currentTasks.findIndex(
                                                                (t) =>
                                                                    t._id ===
                                                                    task._id
                                                            ) >= 0
                                                        }
                                                    >
                                                        {currentTasks.findIndex(
                                                            (t) =>
                                                                t._id ===
                                                                task._id
                                                        ) >= 0
                                                            ? "УДАЛИТЬ"
                                                            : "ДОБАВИТЬ"}
                                                    </Button>
                                                    <Button
                                                        type="dashed"
                                                        onClick={() => {
                                                            setViewTask(task)
                                                            setTaskModal(true)
                                                        }}
                                                    >
                                                        ПРОСМОТРЕТЬ
                                                    </Button>
                                                </Space>
                                            ),
                                        },
                                    ]}
                                />
                            )}
                        </Card>
                    </Col>
                </Row>
            </SizedBox>
        </DashboardLayout>
    )
}

export default StudentMyTasksPage
