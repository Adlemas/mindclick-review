import ChatView from "components/ChatView"
import DashboardLayout from "container/DashboardLayout"
import { useRouter } from "next/router"
import { useAppSelector } from "slices"

const TeacherChatPage: React.FC = () => {
    const router = useRouter()

    const { chats } = useAppSelector((state) => state.chats)

    const chat = chats.find((chat) => chat._id === router.query.id)

    return (
        <DashboardLayout title={chat ? chat.title : "Чат"}>
            <ChatView id={router.query.id.toString() || ""} />
        </DashboardLayout>
    )
}

export default TeacherChatPage
