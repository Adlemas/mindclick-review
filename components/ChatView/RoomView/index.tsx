import { Card } from "antd"
import classNames from "classnames"
import dynamic from "next/dynamic"
import { useThemeSwitcher } from "react-css-theme-switcher"
import RoomHeader from "./RoomHeader"

const RoomLayout = dynamic(() => import("./RoomLayout"), {
    ssr: false,
})

import styles from "./styles.module.scss"

const RoomView: React.FC = () => {
    const { currentTheme } = useThemeSwitcher()

    return (
        <Card
            className={classNames(styles.room_view, {
                [styles.room_view__dark]: currentTheme === "dark",
            })}
            title={<RoomHeader />}
        >
            <RoomLayout />
        </Card>
    )
}

export default RoomView
