import { Breadcrumb, Card, Col, Row, Button } from "antd"
import Balance from "components/Balance"
import IncomingLessons from "components/IncomingLessons"
import MyGroup from "components/MyGroup"
import SizedBox from "container/SizedBox"
import StudentDashboardLayout from "container/student/DashboardLayout"

const StudentPage: React.FC = () => {
    return (
        <StudentDashboardLayout title="Панель">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
            </Breadcrumb>

            <SizedBox>
                {/* ant row component with 24 gutter and two col components inside */}
                <Row gutter={24}>
                    <Col span={12}>
                        <Card
                            title={"Запланированные уроки"}
                            /**
                             * Add extra button with antd button component
                             * with type "primary"
                             * and text "Все уроки"
                             * and with the link to "/student/lessons"
                             */
                            extra={
                                <Button type="primary" href="/student/lessons">
                                    Все уроки
                                </Button>
                            }
                        >
                            {/* Use incoming lessons component here */}
                            <IncomingLessons />
                        </Card>

                        {/* Card with "Баланс" title and "Пополнить" primary button */}
                        <Card
                            // add margin top to card
                            style={{
                                marginTop: "1.5rem",
                            }}
                            title={"Баланс"}
                            extra={
                                <Button type="primary" href="/student/balance">
                                    Пополнить
                                </Button>
                            }
                        >
                            {/* Use balance component here */}
                            <Balance />
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card title={"Моя группа"} style={{ overflow: "auto" }}>
                            {/* Render MyGroup component */}
                            <MyGroup />
                        </Card>
                    </Col>
                </Row>
            </SizedBox>
        </StudentDashboardLayout>
    )
}

export default StudentPage
