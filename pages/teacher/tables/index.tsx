import { Row, Button, Typography, Card, Modal, Space } from "antd"
import classNames from "classnames"
import { useState } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { BiMinus } from "react-icons/bi"
import { IoAddOutline } from "react-icons/io5"
import TablesSimulator from "components/TablesSimulator"
import DashboardLayout from "container/DashboardLayout"
import useController from "hooks/useController"
import styles from "./styles.module.scss"

const Tables: React.FC = () => {
    const [modal, setModal] = useState<boolean>(false)

    const controller = useController({
        answerModal: () => setModal(true),
        maxScreens: 2,
    })
    const { currentTheme } = useThemeSwitcher()

    return (
        <DashboardLayout title="Столбики">
            <Modal
                visible={modal}
                onCancel={() => setModal(false)}
                onOk={() => setModal(false)}
                cancelButtonProps={{
                    style: {
                        display: "none",
                    },
                }}
            >
                {Object.values(controller.listeners).map((listener) => {
                    const lastHistory = listener.history.length
                        ? listener.history[listener.history.length - 1]
                        : null

                    if (lastHistory === null) return null

                    return (
                        <Card
                            style={{
                                marginTop: "1.5rem",
                            }}
                            title={
                                listener.member
                                    ? `${listener.member.firstName} ${listener.member.lastName}`
                                    : null
                            }
                        >
                            <Space direction="vertical">
                                <h1
                                    style={{
                                        fontWeight: 600,
                                        color: lastHistory.isRight
                                            ? "green"
                                            : "crimson",
                                    }}
                                >
                                    {lastHistory.isRight
                                        ? "Правильно!"
                                        : "Неправильно!"}
                                </h1>
                                <ul
                                    style={{
                                        marginLeft: "1.5rem",
                                    }}
                                >
                                    {lastHistory.expression.map((term) => {
                                        return <li>{term}</li>
                                    })}
                                </ul>
                            </Space>
                        </Card>
                    )
                })}
            </Modal>

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
                    <TablesSimulator
                        uniqueKey={`--app-${i.toString()}`}
                        controller={controller}
                    />
                ))}
            </div>
        </DashboardLayout>
    )
}

export default Tables
