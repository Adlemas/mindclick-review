import { Breadcrumb } from "antd"
import AnswerSimulatorModal from "components/AnswerSimulatorModal"
import FlashCardsSimulator from "components/FlashCardsSimulator"
import StudentSimulatorActions from "components/StudentSimulatorActions"
import DashboardLayout from "container/student/DashboardLayout"
import TopRightWrapper from "container/TopRightWrapper"
import useController from "hooks/useController"
import { useState } from "react"

const StudentFlashCardsPage: React.FC = () => {
    // create modal visible state
    const [modalVisible, setModalVisible] = useState(false)

    // create controller
    const controller = useController({
        answerModal: () => setModalVisible(true),
        maxScreens: 1,
    })

    return (
        <DashboardLayout title="Флешкарты">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
                <Breadcrumb.Item>Флешкарты</Breadcrumb.Item>
            </Breadcrumb>

            <AnswerSimulatorModal
                controller={controller}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
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
                    <FlashCardsSimulator
                        uniqueKey={`--app-${i.toString()}`}
                        controller={controller}
                    />
                ))}
            </div>
        </DashboardLayout>
    )
}

export default StudentFlashCardsPage
