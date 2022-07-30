import { Spin, Table, Space, Button } from "antd"
import { useAppDispatch, useAppSelector } from "slices"
import { User } from "types"

// import columns type from antd
import { ColumnsType } from "antd/lib/table"

// import typography from antd
import { Typography } from "antd"

import ProfilePic from "components/ProfilePic"

import { useEffect } from "react"

import { getGroupAction } from "slices/group"

import { RiTrophyLine, RiMoneyDollarCircleLine } from "react-icons/ri"

/**
 * MyGroup component
 */
const MyGroup: React.FC = () => {
    // create dispatch and use it to dispatch an action
    const dispatch = useAppDispatch()

    // destruct group and loading state from group slice using useAppSelector
    const { group, loading } = useAppSelector((state) => state.group)

    // destruct user from user slice using useAppSelector
    const { user } = useAppSelector((state) => state.auth)

    // dispatch getGroupAction with useEffect hook with user dependency
    useEffect(() => {
        dispatch(getGroupAction())
    }, [dispatch, user])

    // user columns for table
    const columns: ColumnsType<User> = [
        {
            title: "Имя",
            dataIndex: "firstName",
            key: "firstName",
            // render profile pic component with userId prop as src and create typography with firstName with lastName content\
            render: (firstName: string, user: User) => (
                <Space size={"small"}>
                    {/* render ProfilePic component with userId */}
                    <ProfilePic userId={user._id} />
                    <Typography.Text>{`${firstName} ${user.lastName}`}</Typography.Text>
                </Space>
            ),
        },
        // render email prop as email secondary content
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email: string) => (
                <Typography.Text type="secondary">{email}</Typography.Text>
            ),
        },
        // render rate prop as rate secondary content and trophy icon
        {
            title: "Рейтинг",
            dataIndex: "rate",
            key: "rate",
            render: (rate: number) => (
                <Space size={"small"}>
                    <Typography.Text type="secondary">{rate}</Typography.Text>
                    <RiTrophyLine />
                </Space>
            ),
        },
        // render points prop as points secondary content and moneyDollarCircleLine icon
        {
            title: "Очки",
            dataIndex: "points",
            key: "points",
            render: (points: number) => (
                <Space size={"small"}>
                    <Typography.Text type="secondary">{points}</Typography.Text>
                    <RiMoneyDollarCircleLine />
                </Space>
            ),
        },
    ]

    // return antd table component with group data
    return (
        <Spin spinning={loading}>
            <Table
                dataSource={group ? group.members : []}
                columns={columns}
                pagination={false}
            />
        </Spin>
    )
}

export default MyGroup
