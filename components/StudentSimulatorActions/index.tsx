import PopoverTasks from "components/PopoverTasks"

import styles from "./styles.module.scss"

import { useThemeSwitcher } from "react-css-theme-switcher"
import {
    IFlashCardsTask,
    IMentalTask,
    IMultiplyTask,
    Simulator,
    Task,
} from "types"

import { Typography, Button } from "antd"
import formulaName from "utils/formulaName"
import simulatorName from "utils/simulatorName"

import { RiCloseLine } from "react-icons/ri"
import { useAppDispatch, useAppSelector } from "slices"
import { setTask } from "slices/singleTask"

import { useRouter } from "next/router"

const StudentMentalActions = () => {
    const dispatch = useAppDispatch()

    // destruct currentTheme from useThemeSwitcher
    const { currentTheme } = useThemeSwitcher()

    // destruct task from singleTask with useAppSelector
    const { task: currentTask } = useAppSelector((state) => state.singleTask)

    const setCurrentTask = (task: Task | null) => {
        // dispatch setTask action
        dispatch(setTask(task))
    }

    let simulator: Simulator = "MENTAL"

    // get pathname with useRouter hook
    const { pathname } = useRouter()

    // switch pathname to get correct simulator
    // if pathname includes /multiply, change simulator to "MULTIPLY"
    if (pathname.includes("/multiply")) {
        simulator = "MULTIPLY"
    }
    // if pathname includes /flashcards, change simulator to "FLASHCARDS"
    if (pathname.includes("/flashcards")) {
        simulator = "FLASHCARDS"
    }
    // if pathname includes /mental, change simulator to "MENTAL"
    if (pathname.includes("/mental")) {
        simulator = "MENTAL"
    }
    // if pathname includes /divide, change simulator to "DIVIDE"
    if (pathname.includes("/divide")) {
        simulator = "DIVIDE"
    }
    // if pathname includes /tables, change simulator to "TABLES"
    if (pathname.includes("/tables")) {
        simulator = "TABLES"
    }

    return (
        <div
            className={styles.actions}
            style={{
                borderColor: currentTheme === "light" ? "#0005" : "#fff5",
            }}
        >
            <PopoverTasks
                simulator={simulator}
                onSelect={(task) => setCurrentTask(task)}
            />
            <Typography.Text type="secondary">
                {currentTask
                    ? `${
                          // switch simulator
                          currentTask.simulator === "MENTAL" ||
                          currentTask.simulator === "TABLES"
                              ? formulaName(
                                    (currentTask.task as IMentalTask).formula
                                )
                              : currentTask.simulator === "MULTIPLY" ||
                                currentTask.simulator === "DIVIDE"
                              ? `${
                                    (currentTask.task as IMultiplyTask).first
                                } * ${
                                    (currentTask.task as IMultiplyTask).second
                                }`
                              : currentTask.simulator === "FLASHCARDS"
                              ? `${
                                    (currentTask.task as IFlashCardsTask)
                                        .digitNumber
                                } цифр`
                              : simulatorName(currentTask.simulator)
                      }`
                    : "Не выбрано задание"}
            </Typography.Text>
            {!!currentTask && (
                <Button
                    icon={<RiCloseLine />}
                    className={styles.close_button}
                    onClick={() => setCurrentTask(null)}
                />
            )}
        </div>
    )
}

export default StudentMentalActions
