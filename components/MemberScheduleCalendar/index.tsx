import { Calendar, Space, Spin, Typography } from "antd"
import { CalendarMode } from "antd/lib/calendar/generateCalendar"
import moment from "moment"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "slices"
import { getAllSchedulesWithMembersAction } from "slices/schedule"

import styles from "./styles.module.scss"

interface PropTypes {
    onSelect: (date: moment.Moment) => void
    onChangeMode: (mode: CalendarMode) => void
}

const MemberScheduleCalendar: React.FC<PropTypes> = ({
    onSelect,
    onChangeMode,
}) => {
    // destruct schedules and loading from schedule slice with useAppSelector
    const { schedules, loading } = useAppSelector((state) => state.schedule)

    // destruct user from auth slice with useAppSelector
    const { user } = useAppSelector((state) => state.auth)

    // get dispatch from useAppDispatch
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user) {
            dispatch(getAllSchedulesWithMembersAction(user._id))
        }
    }, [user])

    return (
        <Spin spinning={loading}>
            <Calendar
                onSelect={onSelect}
                onPanelChange={(date, mode) => {
                    onChangeMode(mode)
                    onSelect(date)
                }}
                dateCellRender={(date) => {
                    if (schedules) {
                        const filteredSchedules = schedules.filter(
                            (schedule) =>
                                moment(schedule.date).format("YYYY-MM-DD") ===
                                moment(date).format("YYYY-MM-DD")
                        )
                        if (filteredSchedules.length) {
                            if (filteredSchedules.length === 1) {
                                return (
                                    <Typography.Text
                                        key={filteredSchedules[0]._id}
                                    >
                                        {filteredSchedules[0].name} в{" "}
                                        {moment(
                                            filteredSchedules[0].date
                                        ).format("HH:mm")}
                                    </Typography.Text>
                                )
                            } else {
                                return (
                                    <Typography.Text
                                        style={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {filteredSchedules.length} событий
                                    </Typography.Text>
                                )
                            }
                        }
                    } else {
                        return null
                    }
                }}
            />
        </Spin>
    )
}

export default MemberScheduleCalendar
