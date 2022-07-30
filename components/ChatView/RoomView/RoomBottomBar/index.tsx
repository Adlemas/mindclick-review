import { IMicrophoneAudioTrack, ICameraVideoTrack } from "agora-rtc-react"
import { Button, Dropdown, Menu, Space, Tooltip, Typography } from "antd"
import classNames from "classnames"
import { useClient } from "hooks/agora"
import { useState } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import {
    RiCameraFill,
    RiCameraOffFill,
    RiDoorOpenLine,
    RiMicFill,
    RiMicOffFill,
    RiMoreFill,
} from "react-icons/ri"
import { useAppDispatch, useAppSelector } from "slices"
import { setInCall, setStarted } from "slices/call"
import styles from "./styles.module.scss"

interface PropTypes {
    tracks: [IMicrophoneAudioTrack, ICameraVideoTrack]
}

const RoomBottomBar: React.FC<PropTypes> = ({ tracks }) => {
    const { channel } = useAppSelector((state) => state.singleChat)
    const client = useClient()

    const { currentTheme } = useThemeSwitcher()

    const [trackState, setTrackState] = useState({
        audio: true,
        video: true,
    })

    const dispatch = useAppDispatch()

    const moreMenu = (
        <Menu>
            <Menu.ItemGroup title="Коммуникации">
                <Menu.Item>Провести опрос</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup title="Участники">
                <Menu.Item>Выкл всем микрофоны</Menu.Item>
                <Menu.Item>Выкл всем камеры</Menu.Item>
                <Menu.Item>Выкл всем демонстрации</Menu.Item>
            </Menu.ItemGroup>
        </Menu>
    )

    const leaveChannel = async () => {
        await client.leave()
        client.removeAllListeners()
        tracks[0].close()
        tracks[1].close()
        dispatch(setStarted(false))
        dispatch(setInCall(false))
    }

    const toggle = async (mediaType: "audio" | "video") => {
        if (mediaType === "audio") {
            await tracks[0].setEnabled(!trackState.audio)
            setTrackState((prev) => ({ ...prev, audio: !prev.audio }))
        } else if (mediaType === "video") {
            await tracks[1].setEnabled(!trackState.video)
            setTrackState((prev) => ({ ...prev, video: !prev.video }))
        }
    }

    return (
        <div className={styles.room_bottom_bar__wrapper}>
            <div
                className={classNames(styles.room_bottom_bar, {
                    [styles.room_bottom_bar__dark]: currentTheme === "dark",
                })}
            >
                <div className={styles.room_bottom_bar__meta}>
                    <Typography.Text>
                        Вы в {channel && channel.title ? channel.title : ""}
                    </Typography.Text>
                    <Typography.Text type="secondary">
                        5 участников вместе с вами
                    </Typography.Text>
                </div>
                <Space size="small">
                    <Tooltip
                        title={
                            trackState.audio ? "Выкл микрофон" : "Вкл микрофон"
                        }
                    >
                        <Button
                            type="primary"
                            size="middle"
                            onClick={() => toggle("audio")}
                        >
                            {trackState.audio ? (
                                <RiMicFill size={20} />
                            ) : (
                                <RiMicOffFill size={20} />
                            )}
                        </Button>
                    </Tooltip>
                    <Tooltip
                        title={trackState.video ? "Выкл камеру" : "Вкл камеру"}
                    >
                        <Button
                            type="primary"
                            size="middle"
                            onClick={() => toggle("video")}
                        >
                            {trackState.video ? (
                                <RiCameraFill size={20} />
                            ) : (
                                <RiCameraOffFill size={20} />
                            )}
                        </Button>
                    </Tooltip>
                    {/* <Tooltip title="Демонстрировать экран">
                        <Button type="primary" size="middle">
                            <RiComputerLine size={20} />
                        </Button>
                    </Tooltip> */}
                    <Dropdown overlay={moreMenu}>
                        <Button type="primary" size="middle">
                            <RiMoreFill size={20} />
                        </Button>
                    </Dropdown>
                </Space>
                <Tooltip title="Покинуть вызов">
                    <Button
                        type="primary"
                        danger
                        size="middle"
                        onClick={leaveChannel}
                    >
                        <RiDoorOpenLine size={20} />
                    </Button>
                </Tooltip>
            </div>
        </div>
    )
}

export default RoomBottomBar
