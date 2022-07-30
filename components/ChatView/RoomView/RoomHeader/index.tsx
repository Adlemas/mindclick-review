import { Button, Typography } from "antd"
import classNames from "classnames"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { RiGroupLine, RiMoreFill, RiWifiLine } from "react-icons/ri"
import { useAppSelector } from "slices"

import styles from "./styles.module.scss"

const RoomHeader: React.FC = () => {
    const { channel } = useAppSelector((state) => state.singleChat)

    const { currentTheme } = useThemeSwitcher()

    return (
        <div className={classNames(styles.room_header)}>
            {/* TODO: set 3 colors depends on internet connection quality
                * 1. #51e664 if internet connection is good
                * 2. #f5a623 if internet connection is bad
                * 3. crimson if internet connection is lost
            */}
            <RiWifiLine color='#f5a623' />
            <Typography>{channel && channel.title ? channel.title : '..'}</Typography>

            <Button type="text" size="small">
                <RiMoreFill />
            </Button>

            {/* Members count */}
            <Typography.Text className={classNames(styles.room_header__users, {
                [styles.room_header__users__dark]: currentTheme === "dark",
            })}>
                <RiGroupLine />
                {channel && channel.members ? channel.members.length : 0} участников
            </Typography.Text>
        </div>
    )
}

export default RoomHeader