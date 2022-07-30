import { Descriptions } from "antd"
import moment from "moment"
import {
    IDivideTask,
    IFlashCardsTask,
    IMentalTask,
    IMultiplyTask,
    Task,
} from "types"
import formulaName from "utils/formulaName"

const SimulatorSettingsDescription: (task: Task) => JSX.Element = (
    task: Task
) => {
    if (!task) {
        return null
    }

    if (task.simulator === "DIVIDE") {
        const settings = task.task as IDivideTask
        return (
            <>
                <Descriptions.Item label={"Первое число"}>
                    {settings.first}
                </Descriptions.Item>
                <Descriptions.Item label={"Второе число"}>
                    {settings.second}
                </Descriptions.Item>
            </>
        )
    }

    if (task.simulator === "MULTIPLY") {
        const settings = task.task as IMultiplyTask
        return (
            <>
                <Descriptions.Item label={"Первое число"}>
                    {settings.first.join(", ")}
                </Descriptions.Item>
                <Descriptions.Item label={"Второе число"}>
                    {settings.second.join(", ")}
                </Descriptions.Item>
            </>
        )
    }

    if (task.simulator === "FLASHCARDS") {
        const settings = task.task as IFlashCardsTask
        return (
            <>
                <Descriptions.Item label={"Разряд числа"}>
                    {settings.digitNumber}
                </Descriptions.Item>
            </>
        )
    }

    if (task.simulator === "MENTAL" || task.simulator === "TABLES") {
        const settings = task.task as IMentalTask
        return (
            <>
                <Descriptions.Item label={"Формула"}>
                    {formulaName(settings.formula)}
                </Descriptions.Item>
                <Descriptions.Item label={"Размер слагаемого"}>
                    от {settings.diapason.min} до {settings.diapason.max}
                </Descriptions.Item>
                <Descriptions.Item label={"Кол.-во слагаемых"}>
                    {settings.terms}
                </Descriptions.Item>
                <Descriptions.Item label={"Скорость"}>
                    {settings.speed}
                </Descriptions.Item>
            </>
        )
    }

    const settings = task.task

    return (
        <>
            <Descriptions.Item label={"Кол.-во примеров"}>
                {settings.count}
            </Descriptions.Item>
            <Descriptions.Item label={"Награда"}>
                {settings.reward === "auto" ? "Автоматически" : settings.reward}
            </Descriptions.Item>
            <Descriptions.Item label={"Срок выполнения"}>
                {moment(settings.expire).format("DD/MM/YYYY")}
            </Descriptions.Item>
        </>
    )
}

export default SimulatorSettingsDescription
