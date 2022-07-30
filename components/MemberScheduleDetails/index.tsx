import { Empty, Table, Typography } from "antd"
import { CalendarMode } from "antd/lib/calendar/generateCalendar"
import moment from "moment"
import { useAppSelector } from "slices"

interface PropTypes {
    currentDate: moment.Moment
    currentMode: CalendarMode
}

const MemberScheduleDetails: React.FC<PropTypes> = ({
    currentDate,
    currentMode,
}) => {
    // destruct schedules and loading from schedule slice with useAppSelector
    const { schedules, loading } = useAppSelector((state) => state.schedule)

    /**
     * Create columns for schedule table
     */
    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
        },
        // render members column
        {
            title: "Приглашенные",
            dataIndex: "members",
            key: "members",
            render: (members) => {
                return `${members.length} участников`
            },
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "date",
            render: (date: string) => moment(date).format("DD.MM.YYYY"),
        },
        {
            title: "До начала",
            dataIndex: "date",
            key: "date",
            render: (date: string) => {
                const diff = moment(date).diff(moment(), "days")
                return `${diff} дней`
            },
        },
        // render actions column with "Перейти" button
        {
            title: "Действия",
            key: "actions",
            render: (text, record) => (
                <Typography.Text>
                    <a href={`/schedule/${record._id}`}>Перейти</a>
                </Typography.Text>
            ),
        },
    ]

    if (
        !currentDate ||
        !schedules.length ||
        schedules.filter(
            (schedule) =>
                moment(schedule.date).format("YYYY-MM-DD") ===
                currentDate.format("YYYY-MM-DD")
        ).length <= 0
    ) {
        return (
            <Empty description={`Нет событий на ${currentDate.format("LL")}`} />
        )
    }

    return (
        <Table
            style={{
                maxWidth: "100%",
            }}
            columns={columns}
            dataSource={schedules.filter((schedule) =>
                currentMode === "month"
                    ? moment(schedule.date).format("YYYY-MM-DD") ===
                      moment(currentDate).format("YYYY-MM-DD")
                    : moment(schedule.date).format("YYYY-MM") ===
                      moment(currentDate).format("YYYY-MM")
            )}
            loading={loading}
        />
    )
}

export default MemberScheduleDetails
