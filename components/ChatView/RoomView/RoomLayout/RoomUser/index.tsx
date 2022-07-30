import { Avatar, Dropdown, Menu } from "antd"
import classNames from "classnames"
import { useState } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import {
    RiMicFill,
    RiMicLine,
    RiMoreFill,
    RiPushpinLine,
    RiUserLine,
} from "react-icons/ri"
import {
    IAgoraRTCRemoteUser,
    ICameraVideoTrack,
    IMicrophoneAudioTrack,
    AgoraVideoPlayer,
} from "agora-rtc-react"

import styles from "./styles.module.scss"
import ProfilePic from "components/ProfilePic"

interface PropTypes {
    src: string
    name: string

    tracks?: [IMicrophoneAudioTrack, ICameraVideoTrack]
    user?: IAgoraRTCRemoteUser
}

const RoomUser: React.FC<PropTypes> = ({ src, name, tracks, user }) => {
    const { currentTheme } = useThemeSwitcher()

    const [hover, setHover] = useState(false)

    const userMenu = (
        <Menu
            items={[
                {
                    key: "1",
                    label: "Профиль",
                    icon: <RiUserLine />,
                },
                {
                    key: "2",
                    label: "Вкл/выкл микрофон",
                    icon: <RiMicLine />,
                },
            ]}
        />
    )

    return (
        <div
            className={classNames(styles.room_user, {
                [styles.room_user__dark]: currentTheme === "dark",
                [styles.room_user__hover]: hover,
            })}
            onMouseOver={() => setHover(true)}
            onMouseEnter={() => {
                setHover(true)
            }}
            onMouseLeave={() => {
                setHover(false)
            }}
            onMouseOut={() => {
                setHover(false)
            }}
        >
            {((user && !user.videoTrack) ||
                (tracks && tracks.length && !tracks[1].enabled)) && (
                <ProfilePic userId={src} size={100} />
            )}
            <div
                className={classNames(styles.room_user__bottom, {
                    [styles.room_user__bottom__hover]: hover,
                })}
            >
                <div
                    className={classNames(styles.room_user__item, {
                        [styles.room_user__item__dark]: currentTheme === "dark",
                    })}
                >
                    <RiMicFill />
                </div>
                <div
                    className={classNames(styles.room_user__item, {
                        [styles.room_user__item__dark]: currentTheme === "dark",
                    })}
                >
                    {name}
                </div>
            </div>

            {tracks && tracks[1].enabled ? (
                <AgoraVideoPlayer
                    videoTrack={tracks[1]}
                    style={{ width: "100%", height: "100%" }}
                />
            ) : user && user.videoTrack ? (
                <AgoraVideoPlayer
                    videoTrack={user.videoTrack}
                    style={{ width: "100%", height: "100%" }}
                />
            ) : null}

            <div
                className={classNames(styles.room_user__top, {
                    [styles.room_user__top__hover]: hover,
                })}
            >
                <div
                    className={classNames(
                        styles.room_user__item,
                        styles.room_user__btn,
                        {
                            [styles.room_user__item__dark]:
                                currentTheme === "dark",
                        }
                    )}
                >
                    <RiPushpinLine />
                </div>
                <Dropdown overlay={userMenu}>
                    <div
                        className={classNames(
                            styles.room_user__item,
                            styles.room_user__btn,
                            {
                                [styles.room_user__item__dark]:
                                    currentTheme === "dark",
                            }
                        )}
                    >
                        <RiMoreFill />
                    </div>
                </Dropdown>
            </div>
        </div>
    )
}

export default RoomUser
