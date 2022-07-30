import {
    Breadcrumb,
    Card,
    Col,
    Descriptions,
    Row,
    Space,
    Statistic,
    Typography,
} from "antd"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import { useAppDispatch, useAppSelector } from "slices"
import { selectAuth } from "slices/auth"

import moment from "moment"
import usePermission from "hooks/usePermission"
import useResponsive from "hooks/useResponsive"
import GroupsCard from "components/GroupsCard"
import { useEffect } from "react"
import { setGroups, getAllGroupsAction } from "slices/groups"
import ProfilePic from "components/ProfilePic"

const TeacherPage: React.FC = () => {
    const { user } = useAppSelector(selectAuth)
    const { canAccess } = usePermission()

    const device = useResponsive()

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(setGroups(user.groups))
        dispatch(getAllGroupsAction({ groupIds: user.groups || [] }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <DashboardLayout title="Панель">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <Breadcrumb.Item>
                    <a href="/teacher">Панель</a>
                </Breadcrumb.Item>
            </Breadcrumb>

            <SizedBox>
                <GroupsCard />

                <Row align="top" gutter={24} style={{ marginTop: "1rem" }}>
                    <Col span={device === "mobile" ? 24 : 18}>
                        <Row align="top">
                            <Col
                                span={device === "mobile" ? 24 : 10}
                                style={
                                    device === "mobile"
                                        ? { marginTop: "2rem" }
                                        : {}
                                }
                            >
                                <Card title={"Основная информация"}>
                                    <Space
                                        size={"middle"}
                                        direction={
                                            device === "mobile"
                                                ? "vertical"
                                                : "horizontal"
                                        }
                                    >
                                        <ProfilePic
                                            src={user.profileImg}
                                            size={100}
                                        />
                                        <Space direction="vertical">
                                            <Typography
                                                style={{
                                                    fontWeight: 600,
                                                    fontSize: 24,
                                                }}
                                            >{`${user.firstName} ${user.lastName}`}</Typography>
                                            <Typography.Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                {user.email}
                                            </Typography.Text>
                                            <Typography.Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                {user.phone}
                                            </Typography.Text>
                                        </Space>
                                    </Space>
                                </Card>
                            </Col>

                            <Col
                                offset={device === "mobile" ? 0 : 1}
                                span={device === "mobile" ? 24 : 13}
                                style={
                                    device === "mobile"
                                        ? { marginTop: "2rem" }
                                        : {}
                                }
                            >
                                <Card title={"Баланс"}>
                                    <Row
                                        justify="space-around"
                                        align="middle"
                                    >
                                        <Space direction="vertical">
                                            <Statistic
                                                value={
                                                    Object.values(
                                                        user.balance
                                                            .available
                                                    )[0]
                                                }
                                                title={"Доступно"}
                                                suffix={" ₽"}
                                            />
                                            <Statistic
                                                value={moment(
                                                    user.createdAt
                                                ).format("DD-MM-YYYY")}
                                                title={"Аккаунт создан"}
                                            />
                                        </Space>
                                        <Space direction="vertical">
                                            <Statistic
                                                value={
                                                    Object.values(
                                                        user.balance
                                                            .reserved
                                                    )[0]
                                                }
                                                title={"Потрачено"}
                                                suffix={" ₽"}
                                            />
                                            <Statistic
                                                value={Math.floor(
                                                    Number(
                                                        Object.values(
                                                            user.balance
                                                                .available
                                                        )[0]
                                                    ) / 300
                                                )}
                                                title={"Дней осталось"}
                                                valueStyle={
                                                    !canAccess
                                                        ? {
                                                            color: "crimson",
                                                        }
                                                        : {}
                                                }
                                            />
                                        </Space>
                                        <Space direction="vertical">
                                            <Statistic
                                                value={"300"}
                                                title={"Цена в день"}
                                                suffix={" ₽"}
                                            />
                                            <Statistic
                                                value={Math.floor(
                                                    Number(
                                                        Object.values(
                                                            user.balance
                                                                .reserved
                                                        )[0]
                                                    ) / 300
                                                )}
                                                title={"Дней прошло"}
                                            />
                                        </Space>
                                    </Row>
                                </Card>
                            </Col>
                        </Row>
                    </Col>
                    <Col
                        span={device === "mobile" ? 24 : 6}
                        style={
                            device === "mobile"
                                ? { marginTop: "2rem" } : {}
                        }
                    >
                        <Card title={"Подробная информация"}>
                            <Descriptions
                                column={1}
                                layout={"vertical"}
                                labelStyle={{ fontWeight: 600 }}
                                colon={false}
                            >
                                <Descriptions.Item
                                    label={"Имя"}
                                >{`${user.firstName} ${user.lastName}`}</Descriptions.Item>
                                <Descriptions.Item label={"Email"}>
                                    {user.email}
                                </Descriptions.Item>
                                <Descriptions.Item label={"Номер телефона"}>
                                    {user.phone || "Не указано"}
                                </Descriptions.Item>
                                <Descriptions.Item label={"Дата рождения"}>
                                    {moment(user.birthDate).format(
                                        "DD-MM-YYYY"
                                    )}
                                </Descriptions.Item>
                                <Descriptions.Item label={"Город"}>
                                    {user.city || "Не указано"}
                                </Descriptions.Item>
                                <Descriptions.Item label={"Адрес"}>
                                    {user.address || "Не указано"}
                                </Descriptions.Item>
                                <Descriptions.Item label={"Описание"}>
                                    {user.description || "Не указано"}
                                </Descriptions.Item>
                            </Descriptions>
                        </Card>
                    </Col>
                </Row>
            </SizedBox>
        </DashboardLayout>
    )
}

export default TeacherPage
