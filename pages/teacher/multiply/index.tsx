import { Row, Button, Typography } from "antd"
import classNames from "classnames"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { BiMinus } from "react-icons/bi"
import { IoAddOutline } from "react-icons/io5"
import MultiplySimulator from "components/MultiplySimulator"
import DashboardLayout from "container/DashboardLayout"
import useController from "hooks/useController"
import styles from "./styles.module.scss"

const Multiply: React.FC = () => {
    const controller = useController({ answerModal: () => {}, maxScreens: 4 })
    const { currentTheme } = useThemeSwitcher()

    return (
        <DashboardLayout title="Умножение">
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
                    <MultiplySimulator
                        uniqueKey={`--app-${i.toString()}`}
                        controller={controller}
                    />
                ))}
            </div>
        </DashboardLayout>
    )
}

export default Multiply
