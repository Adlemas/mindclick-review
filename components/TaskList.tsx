import { Card, Spin, Empty, List, Button, Typography } from "antd"
import { useAppSelector } from "../slices"
import { selectTasks } from "../slices/task"
import { Task } from "../types"
import simulatorName from "../utils/simulatorName"
import ProfilePic from "./ProfilePic"

import moment from "moment"

interface PropTypes {
    onSelect: (task: Task) => void
}

const TaskList: React.FC<PropTypes> = ({ onSelect }) => {
    const { loading, tasks } = useAppSelector(selectTasks)

    return (
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
                        (task) => task.simulator === "MULTIPLY"
                    )}
                    renderItem={(task) => (
                        <List.Item
                            key={task._id}
                            actions={[
                                <Button
                                    type="dashed"
                                    onClick={() => {
                                        console.log("CURRENT", task)
                                        onSelect(task)
                                    }}
                                >
                                    ПОДРОБНЕЕ
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                avatar={<ProfilePic userId={task.userId} />}
                                title={simulatorName(task.simulator)}
                                description={
                                    <Typography.Text type="secondary">
                                        {moment(task.task.expire).fromNow()} (
                                        {moment(task.task.expire).format(
                                            "DD/MM/YYYY"
                                        )}
                                        )
                                        <br />
                                        {moment(task.createdAt).format(
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
    )
}

export default TaskList
