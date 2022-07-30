import { Breadcrumb, Calendar, Card, Col, Row, Typography } from "antd"
import { CalendarMode } from "antd/lib/calendar/generateCalendar"
import MemberScheduleCalendar from "components/MemberScheduleCalendar"
import MemberScheduleDetails from "components/MemberScheduleDetails"
import SizedBox from "container/SizedBox"
import DashboardLayout from "container/student/DashboardLayout"
import moment from "moment"
import { useState } from "react"

const StudentLessonsPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<moment.Moment>(moment())
    const [currentMode, setCurrentMode] = useState<CalendarMode>("month")

    return (
        <DashboardLayout title="Уроки">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
                <Breadcrumb.Item>Уроки</Breadcrumb.Item>
            </Breadcrumb>

            <SizedBox>
                <Row gutter={24}>
                    <Col span={14}>
                        <Card title="Календарь">
                            <MemberScheduleCalendar
                                onChangeMode={setCurrentMode}
                                onSelect={(date) => setCurrentDate(date)}
                            />
                        </Card>
                    </Col>
                    <Col span={10}>
                        <Card
                            title="События дня"
                            style={{
                                overflowX: "auto",
                            }}
                        >
                            <MemberScheduleDetails
                                currentDate={currentDate}
                                currentMode={currentMode}
                            />
                        </Card>
                    </Col>
                </Row>
            </SizedBox>
        </DashboardLayout>
    )
}

export default StudentLessonsPage
