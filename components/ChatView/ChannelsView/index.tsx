import { Card, Input } from "antd"
import classNames from "classnames"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { RiSearch2Line } from "react-icons/ri"
import ActionsView from "./ActionsView"
import ProfileView from "./ProfileView"

import styles from "./styles.module.scss"
import ChannelsWrapper from "./ChannelsWrapper"

const ChannelsView: React.FC = () => {
    const { currentTheme } = useThemeSwitcher()

    return (
        <Card
            className={classNames("chat_view_item", styles.channels_view, {
                [styles.channels_view__dark]: currentTheme === "dark",
            })}
        >
            <Input
                placeholder="Найдите что нибудь"
                suffix={<RiSearch2Line />}
                className={styles.channels_view__search}
            />

            <ProfileView />

            <ActionsView />

            <ChannelsWrapper title="текстовые каналы" type="text" />
            <ChannelsWrapper title="голосовые каналы" type="call" />
        </Card>
    )
}

export default ChannelsView
