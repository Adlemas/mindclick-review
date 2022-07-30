import {
    IFlashCardsTask,
    IMentalTask,
    IMultiplyTask,
    Simulator,
    Task,
} from "types"

import { Popover, List, Button } from "antd"
import formulaName from "utils/formulaName"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import { getUserTasksAction } from "slices/task"

import { RiTaskLine } from "react-icons/ri"
import simulatorName from "utils/simulatorName"

interface PropTypes<T> {
    simulator: Simulator

    onSelect: (task: T) => void
}

const PopoverTasks = <T extends Task>({
    simulator,
    onSelect,
}: PropTypes<T>) => {
    // create dispatch const with useAppDispatch
    const dispatch = useAppDispatch()

    // destruct user from auth slice using useAppSelector
    const { user } = useAppSelector((state) => state.auth)

    // destruct tasks from tasks slice using useAppSelector
    const { tasks } = useAppSelector((state) => state.tasks)

    // call get user tasks action in useEffect
    useEffect(() => {
        dispatch(getUserTasksAction())
    }, [dispatch, user])

    return (
        <Popover
            title={"Задания"}
            trigger={["click"]}
            content={
                <List
                    dataSource={tasks.filter(
                        (task) => task.simulator === simulator
                    )}
                    renderItem={(item) => (
                        <List.Item
                            style={{
                                minWidth: 250,
                            }}
                            actions={[
                                <Button onClick={() => onSelect(item as T)}>
                                    ВЫБРАТЬ
                                </Button>,
                            ]}
                        >
                            <List.Item.Meta
                                title={
                                    // switch simulator
                                    simulator === "MENTAL" ||
                                    simulator === "TABLES"
                                        ? formulaName(
                                              (item.task as IMentalTask).formula
                                          )
                                        : simulator === "MULTIPLY"
                                        ? `${"A".repeat(
                                              (item.task as IMultiplyTask)
                                                  .first[0].length
                                          )} * ${"A".repeat(
                                              (item.task as IMultiplyTask)
                                                  .second[0].length
                                          )}`
                                        : simulator === "DIVIDE"
                                        ? `${
                                              (item.task as IMultiplyTask).first
                                          } * ${
                                              (item.task as IMultiplyTask)
                                                  .second
                                          }`
                                        : simulator === "FLASHCARDS"
                                        ? `${
                                              (item.task as IFlashCardsTask)
                                                  .digitNumber
                                          } цифр`
                                        : simulatorName(simulator)
                                }
                                description={`${item.task.count} примеров`}
                            />
                        </List.Item>
                    )}
                />
            }
        >
            <Button
                icon={<RiTaskLine />}
                onClick={() => {
                    // TODO: Показать окно для выбора задания
                }}
            />
        </Popover>
    )
}

export default PopoverTasks
