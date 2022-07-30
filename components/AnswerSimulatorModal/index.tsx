import { Modal, Card, Space } from "antd"
import { useControllerProps } from "hooks/useController"
import { useRouter } from "next/router"
import { Simulator, Statistic } from "types"

interface PropTypes {
    controller: useControllerProps
    visible: boolean
    onClose: () => void
}

const AnswerSimulatorModal: React.FC<PropTypes> = ({
    controller,
    visible,
    onClose,
}) => {
    let simulator: Simulator = null

    const { pathname } = useRouter()

    if (pathname.includes("mental")) {
        simulator = "MENTAL"
    }

    if (pathname.includes("multiply")) {
        simulator = "MULTIPLY"
    }

    if (pathname.includes("divide")) {
        simulator = "DIVIDE"
    }

    if (pathname.includes("flashcards")) {
        simulator = "FLASHCARDS"
    }

    if (pathname.includes("tables")) {
        simulator = "TABLES"
    }

    const calculateRightAnswer = (lastHistory: Statistic) => {
        if (simulator === "MENTAL" || simulator === "TABLES") {
            return lastHistory.expression.reduce((prev, curr) => prev + curr, 0)
        }

        if (simulator === "MULTIPLY") {
            return lastHistory.expression[0] * lastHistory.expression[1]
        }

        if (simulator === "DIVIDE") {
            return lastHistory.expression[0] / lastHistory.expression[1]
        }

        if (simulator === "FLASHCARDS") {
            return lastHistory.expression[0]
        }
    }

    return (
        <Modal
            visible={visible}
            onCancel={onClose}
            onOk={onClose}
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
                        actions={[
                            <h3>
                                {lastHistory.your}{" "}
                                {lastHistory.isRight ? "=" : "≠"}{" "}
                                {calculateRightAnswer(lastHistory)}
                            </h3>,
                        ]}
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
    )
}

export default AnswerSimulatorModal
