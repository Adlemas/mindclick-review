import DashboardLayout from "container/student/DashboardLayout"

import { Breadcrumb, Modal, Space, Card } from "antd"
import StudentSimulatorActions from "components/StudentSimulatorActions"

import TopRightWrapper from "container/TopRightWrapper"
import MentalSimulator from "components/MentalSimulator"
import useController from "hooks/useController"

import { useState } from "react"
import AnswerSimulatorModal from "components/AnswerSimulatorModal"

const StudentMentalPage = () => {
    /**
     * Create modal visible state
     */
    const [modal, setModal] = useState<boolean>(false)

    /**
     * Create controller for MentalSimulator
     * using useController hook
     */
    const controller = useController({
        answerModal: () => setModal(true),
        maxScreens: 1,
    })

    return (
        <DashboardLayout title="Сложение / Вычитание">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
                <Breadcrumb.Item>Сложение Вычитание</Breadcrumb.Item>
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
                    <MentalSimulator
                        uniqueKey={`--app-${i.toString()}`}
                        controller={controller}
                    />
                ))}
            </div>
        </DashboardLayout>
    )
}

export default StudentMentalPage
