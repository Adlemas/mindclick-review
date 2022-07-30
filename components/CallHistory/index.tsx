import { Avatar, Table, Typography } from "antd"
import { ColumnsType } from "antd/lib/table"
import moment from "moment"
import fakeCalls from "data/fakeCalls"
import { Conference } from "types"
import ProfilePic from "components/ProfilePic"
import { useAppDispatch, useAppSelector } from "slices"
import { useEffect } from "react"
import { getAllSchedulesAction } from "slices/schedule"

const CallHistory: React.FC = () => {
    // destruct schedule list from schedule slice with useAppSelector
    const { schedules, loading } = useAppSelector((state) => state.schedule)

    // get dispatch from useAppDispatch
    const dispatch = useAppDispatch()

    /**
     * Call getAllSchedulesAction to get all schedules in useEffect hook with user dependency
     */
    useEffect(() => {
        dispatch(getAllSchedulesAction())
    }, [])

    const columns: ColumnsType<Conference> = [
        {
            title: "Название",
            dataIndex: "name",
            render: (name: string) => (
                <Typography.Text
                    style={{
                        whiteSpace: "nowrap",
                    }}
                >
                    {name}
                </Typography.Text>
            ),
        },
        {
            title: "Дата",
            dataIndex: "date",
            render: (date: string) => moment(date).format("DD/MM/YYYY HH:mm"),
        },
        {
            title: "Создано",
            dataIndex: "createdAt",
            render: (createdAt: string) => moment(createdAt).fromNow(),
        },
        {
            title: "Участники",
            dataIndex: "members",
            render: (members: string[]) =>
                members.length ? (
                    <Avatar.Group
                        maxCount={4}
                        size={"small"}
                        maxStyle={{
                            color: "#f56a00",
                            backgroundColor: "#fde3cf",
                        }}
                    >
                        {members.map((memberID) => (
                            <ProfilePic userId={memberID} />
                        ))}
                    </Avatar.Group>
                ) : (
                    <Typography.Text>Нет</Typography.Text>
                ),
        },
    ]

    return (
        <Table
            dataSource={[...schedules].sort((a, b) =>
                moment(a.date).diff(moment(b.date))
            )}
            columns={columns}
            loading={loading}
        />
    )
}

export default CallHistory
