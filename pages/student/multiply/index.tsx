import DashboardLayout from "container/student/DashboardLayout"

import { Breadcrumb } from "antd"
import useController from "hooks/useController"
import { useState } from "react"
import AnswerSimulatorModal from "components/AnswerSimulatorModal"
import TopRightWrapper from "container/TopRightWrapper"
import StudentSimulatorActions from "components/StudentSimulatorActions"
import MultiplySimulator from "components/MultiplySimulator"

const StudentMultiplyPage: React.FC = () => {
    /**
     * Create modal visible state
     */
    const [modal, setModal] = useState<boolean>(false)

    const controller = useController({
        answerModal: () => setModal(true),
        maxScreens: 1,
    })

    return (
        <DashboardLayout title="Умножение">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
                <Breadcrumb.Item>Умножение</Breadcrumb.Item>
            </Breadcrumb>

            <AnswerSimulatorModal
                controller={controller}
                onClose={() => setModal(false)}
                visible={modal}
            />

            <TopRightWrapper>
                <StudentSimulatorActions />
            </TopRightWrapper>

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

export default StudentMultiplyPage
