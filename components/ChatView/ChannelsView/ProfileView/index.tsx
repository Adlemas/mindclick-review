import { Button, Card, Space, Typography } from "antd"
import classNames from "classnames"
import ProfilePic from "components/ProfilePic"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { RiCheckboxBlankCircleFill, RiMoreFill } from "react-icons/ri"
import { useAppSelector } from "slices"
import { selectAuth } from "slices/auth"

import styles from "./styles.module.scss"

const ProfileView: React.FC = () => {
    const { user } = useAppSelector(selectAuth)

    const { currentTheme } = useThemeSwitcher()

    return (
        <Card
            className={classNames(styles.profile_view, {
                [styles.profile_view__dark]: currentTheme === "dark",
            })}
        >
            <div className={styles.profile_view__info}>
                <ProfilePic
                    userId={user._id}
                    size={50}
                    style={{
                        borderRadius: "1rem",
                    }}
                />
                <div>
                    <h1>{user.firstName}</h1>
                    <Space size="small" align="center">
                        <RiCheckboxBlankCircleFill
                            size={10}
                            color={"#54D497"}
                        />
                        <Typography.Text type="secondary">
                            Online
                        </Typography.Text>
                    </Space>
                </div>
            </div>
            <Button type="text">
                <Typography.Text type="secondary">
                    <RiMoreFill />
                </Typography.Text>
            </Button>
        </Card>
    )
}

export default ProfileView
