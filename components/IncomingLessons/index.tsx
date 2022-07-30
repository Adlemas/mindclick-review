import { Table, Avatar, Typography } from "antd"
import ProfilePic from "components/ProfilePic"
import fakeCalls from "data/fakeCalls"

import moment from "moment"

/**
 * Incoming lessons component, that return ant design table component
 */
const IncomingLessons = () => {
    /**
     * Columns of table
     */
    const columns = [
        {
            title: "Название",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Дата",
            dataIndex: "date",
            key: "date",
            render: (date: string) => moment(date).format("DD.MM.YYYY"),
        },
        {
            title: "Участники",
            dataIndex: "members",
            key: "members",
            render: (members: string[]) =>
                // Display members avatars with Avatar.Group component with maxCount 3
                members.length ? (
                    <Avatar.Group maxCount={3}>
                        {members.map((member: string) => (
                            // Use ProfilePic component here
                            <ProfilePic key={member} userId={member} />
                        ))}
                    </Avatar.Group>
                ) : (
                    // render "Нет участников" secondary typography
                    <Typography.Text type="secondary">
                        Нет участников
                    </Typography.Text>
                ),
        },
    ]

    /**
     * Return table with columns and data
     */
    return (
        <Table
            columns={columns}
            /**
             * Disable pagination
             */
            pagination={false}
            /**
             * Pass fakeCalls sorted by date with moment.js and filtered expired lessons by date
             */
            dataSource={fakeCalls
                .filter((call) => moment().isSameOrBefore(moment(call.date)))
                .slice(0, 3)
                .sort((a, b) => moment(a.date).diff(moment(b.date)))}
        />
    )
}

// Export component
export default IncomingLessons
