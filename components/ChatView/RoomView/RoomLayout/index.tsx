import { LoadingOutlined } from "@ant-design/icons"
import { Spin } from "antd"
import classNames from "classnames"
import useCall from "hooks/useCall"
import { useAppDispatch, useAppSelector } from "slices"
import RoomBottomBar from "../RoomBottomBar"
import RoomUser from "./RoomUser"
import styles from "./styles.module.scss"

const RoomLayout: React.FC = () => {
    const { inCall, users, tracks, started } = useCall()

    const dispatch = useAppDispatch()

    const { user: localUser } = useAppSelector((state) => state.auth)

    return (
        <>
            <div className={styles.room_layout__wrapper}>
                <div className={classNames(styles.room_layout)}>
                    {/* {users && users.length ?
                    users.map(user => (
                        <RoomUser name={`${user.firstName} ${user.lastName}`} src={user._id} key={user._id} />
                    ))
                    :
                    <div className={styles.room_layout__empty}>
                        В конференции никого пока нет!
                    </div>
                } */}

                    {inCall && started ? (
                        <>
                            <RoomUser
                                key={localUser._id}
                                name={`${localUser.firstName} ${localUser.lastName}`}
                                src={localUser._id}
                                tracks={tracks}
                            />
                            {users.map((user) => (
                                <RoomUser
                                    name={user.uid.toString()}
                                    src={user.uid.toString()}
                                    key={user.uid.toString()}
                                    user={user}
                                />
                            ))}
                            {/* fake users */}
                            {/* {[...Array(2)].map((_, i) => (
                                <RoomUser
                                    name={`${i}`}
                                    src={`${i}`}
                                    key={`${i}`}
                                />
                            ))} */}
                        </>
                    ) : (
                        <div className={styles.room_layout__empty}>
                            <Spin
                                indicator={
                                    <LoadingOutlined spin color="dodgerblue" />
                                }
                                size="large"
                                tip="Загрузка..."
                            />
                        </div>
                    )}
                </div>
            </div>
            {inCall && <RoomBottomBar tracks={tracks} />}
        </>
    )
}

export default RoomLayout
