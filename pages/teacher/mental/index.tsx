import { Button, Card, Modal, Row, Space, Typography } from "antd"
import classNames from "classnames"
import { useState } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { BiMinus } from "react-icons/bi"
import { IoAddOutline } from "react-icons/io5"
import MentalSimulator from "components/MentalSimulator"
import DashboardLayout from "container/DashboardLayout"
import useController from "hooks/useController"
import styles from "./styles.module.scss"
import AnswerSimulatorModal from "components/AnswerSimulatorModal"

const Mental: React.FC = () => {
    const [modal, setModal] = useState<boolean>(false)

    const answerModal = () => setModal(true)

    const controller = useController({ answerModal })

    const { currentTheme } = useThemeSwitcher()

    return (
        <DashboardLayout title="Сложение / Вычитание">
            <AnswerSimulatorModal
                controller={controller}
                onClose={() => setModal(false)}
                visible={modal}
            />

            <Row
                className={classNames(styles.screens, {
                    [styles.screens_dark]: currentTheme === "dark",
                })}
            >
                <Button type="primary" onClick={controller.decreaseScreen}>
                    <BiMinus />
                </Button>
                <Typography
                    style={{
                        padding: "0 1.5rem",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    {controller.screens}
                </Typography>
                <Button type="primary" onClick={controller.addScreen}>
                    <IoAddOutline />
                </Button>
            </Row>

            <div
                style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    display: "flex",
                    flexWrap: "wrap",
                }}
            >
                {Array.from({ length: controller.screens }, (v, i) => (
                    <MentalSimulator
                        uniqueKey={`--app-${i.toString()}`}
                        controller={controller}
                    />
                ))}
            </div>
        </DashboardLayout>
    )
}

export default Mental
