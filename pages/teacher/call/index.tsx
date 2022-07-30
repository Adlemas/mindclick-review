import { Breadcrumb, Card, Col, Row } from "antd"
import { useEffect } from "react"
import CallForm from "components/CallForm"
import CallHistory from "components/CallHistory"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import useResponsive from "hooks/useResponsive"
import { useAppDispatch, useAppSelector } from "slices"
import { selectAuth } from "slices/auth"
import { setGroups, getAllGroupsAction } from "slices/groups"

const CallPage: React.FC = () => {
    const device = useResponsive()
    const dispatch = useAppDispatch()
    const { user } = useAppSelector(selectAuth)

    useEffect(() => {
        dispatch(setGroups(user.groups))
        dispatch(getAllGroupsAction({ groupIds: user.groups || [] }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <DashboardLayout title="Конференции">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>Панель</Breadcrumb.Item>
                <Breadcrumb.Item>Конференции</Breadcrumb.Item>
            </Breadcrumb>

            <SizedBox>
                <Row
                    style={{
                        gap: "1rem",
                    }}
                >
                    <Col span={24}>
                        <Card title={"Создать конференцию"}>
                            <CallForm />
                            {/* TODO: сделать превью для обзора конференции со стороны клиента */}
                        </Card>
                    </Col>
                    <Col span={24}>
                        <Card
                            title={"История"}
                            style={{
                                overflowX: "auto",
                            }}
                        >
                            <CallHistory />
                        </Card>
                    </Col>
                </Row>
            </SizedBox>
        </DashboardLayout>
    )
}

export default CallPage
