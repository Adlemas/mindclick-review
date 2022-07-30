import { Spin } from "antd"
import ChatView from "components/ChatView"
import DashboardLayout from "container/student/DashboardLayout"
import { useRouter } from "next/router"

const StudentChatPage: React.FC = () => {
    const router = useRouter()

    console.log({ query: router.query })

    if (!router.query.id) {
        // router.back()
        /**
         * Return loading page
         */
        return (
            <Spin
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}
                tip="Загрузка..."
            >
                <div
                    style={{
                        width: "100vw",
                        height: "100vh",
                    }}
                ></div>
            </Spin>
        )
    }

    return (
        <DashboardLayout title="Чат">
            <ChatView id={router.query.id.toString()} />
        </DashboardLayout>
    )
}

export default StudentChatPage
