import { Modal, Descriptions, Button, Popconfirm } from "antd"
import moment from "moment"
import { useAppDispatch } from "slices"
import { refreshUserAction } from "slices/auth"
import { deleteTask } from "slices/task"
import { Simulator, Task } from "types"
import simulatorName from "utils/simulatorName"
import SimulatorSettingsDescription from "../SimulatorSettingsDescription"

interface PropTypes {
    visible: boolean
    simulator?: Simulator

    task: Task
    onTask: (task: Task | null) => void
    label?: string
}

const TaskModal: React.FC<PropTypes> = ({
    visible,
    onTask,
    task: currentTask,
    simulator,
    label,
}) => {
    const dispatch = useAppDispatch()

    return (
        <Modal
            visible={visible}
            title={"Информация"}
            onCancel={() => onTask(null)}
            footer={[
                <Button
                    type="default"
                    onClick={() => {
                        onTask(null)
                    }}
                >
                    Закрыть
                </Button>,
                <Popconfirm
                    title={"Вы уверены что хотите удалить задание?"}
                    onConfirm={() => {
                        dispatch(deleteTask(currentTask._id))
                        dispatch(refreshUserAction())
                        onTask(null)
                    }}
                    okText={"Да, уверен"}
                    cancelText={"Отмена"}
                >
                    <Button type="primary" danger>
                        Удалить
                    </Button>
                </Popconfirm>,
                <Button
                    type="primary"
                    onClick={() => {
                        if (currentTask) {
                            if (
                                !simulator ||
                                (simulator &&
                                    currentTask.simulator === simulator)
                            )
                                onTask(currentTask)
                        }
                    }}
                >
                    {label || "Повторить"}
                </Button>,
            ]}
        >
            {currentTask && (
                <Descriptions
                    column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                    layout={"vertical"}
                    // bordered
                    labelStyle={{ fontWeight: 600 }}
                    colon={false}
                >
                    <Descriptions.Item label={"Тренажёр"}>
                        {simulatorName(currentTask.simulator)}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Статус"}>
                        {currentTask.completed
                            ? "Выполнено"
                            : currentTask.stats && currentTask.stats.length > 0
                            ? "В процессе"
                            : "Невыполнено"}
                    </Descriptions.Item>
                    {SimulatorSettingsDescription(currentTask)}
                    <Descriptions.Item label={"Кол.-во примеров"}>
                        {currentTask.task.count}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Награда"}>
                        {currentTask.task.reward === "auto"
                            ? "Автоматически"
                            : currentTask.task.reward}
                    </Descriptions.Item>
                    <Descriptions.Item label={"Срок выполнения"}>
                        {moment(currentTask.task.expire).format("DD/MM/YYYY")}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Modal>
    )
}

export default TaskModal
