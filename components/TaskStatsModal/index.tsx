import { Empty, Modal, ModalProps, Space, Table, Typography } from "antd"
import { ColumnsType } from "antd/lib/table"
import { Task } from "types"

type PropTypes = ModalProps & {
    task?: Task
}

const TaskStatsModal: React.FC<PropTypes> = (props) => {
    const task = props.task || null

    const columns: ColumnsType = [
        {
            title: "Правильный ответ",
            dataIndex: "expression",
            render: (expression: number[]) =>
                expression
                    .reduce((prev, current) => prev + current, 0)
                    .toString(),
        },
        {
            title: "Ответ участника",
            dataIndex: "your",
        },
        {
            title: "Статус",
            dataIndex: "isRight",
            render: (isRight: boolean) => (
                <Typography
                    style={{
                        color: isRight ? "green" : "crimson",
                        fontWeight: 600,
                    }}
                >
                    {isRight ? "Правильно" : "Неправильно"}
                </Typography>
            ),
        },
    ]

    return (
        <Modal
            okButtonProps={{ style: { display: "none" } }}
            cancelText={"Закрыть"}
            {...props}
        >
            {task && task.stats.length ? (
                <Space
                    direction="vertical"
                    style={{
                        width: "100%",
                    }}
                >
                    <Typography>
                        {task.stats.length} примеров (
                        {task.stats.reduce(
                            (prev, next) => (next.isRight ? prev + 1 : prev),
                            0
                        )}{" "}
                        правильно)
                    </Typography>
                    <Table columns={columns} dataSource={task.stats} />
                </Space>
            ) : (
                <Empty description={"Нет статистики!"} />
            )}
        </Modal>
    )
}

export default TaskStatsModal
