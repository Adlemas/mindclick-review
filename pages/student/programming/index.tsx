import { Breadcrumb, Calendar } from "antd"
import DashboardLayout from "container/student/DashboardLayout"

const StudentProgrammingPage: React.FC = () => {
    return (
        <DashboardLayout title="Программирование">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
                <Breadcrumb.Item>Программирование</Breadcrumb.Item>
            </Breadcrumb>
        </DashboardLayout>
    )
}

export default StudentProgrammingPage
