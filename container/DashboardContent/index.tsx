import { Button, Layout, Space, Typography } from "antd"
import classNames from "classnames"
import { PropsWithChildren } from "react"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { GiHamburgerMenu } from "react-icons/gi"
import useLogout from "hooks/useLogout"
import useResponsive from "hooks/useResponsive"
import styles from "./styles.module.scss"
import { RiMoonLine, RiSunLine } from "react-icons/ri"
import { setItemInLocal } from "utils/localStorage"

const { Header, Content } = Layout

interface PropsType extends PropsWithChildren<any> {
    title: string
    setDrawer: (state: boolean) => void
}

const DashboardContent: React.FC<PropsType> = ({
    children,
    title,
    setDrawer,
}) => {
    const [logout] = useLogout()
    const device = useResponsive()

    const { currentTheme, switcher } = useThemeSwitcher()

    const toggleTheme = () => {
        switcher({ theme: currentTheme === "light" ? "dark" : "light" })
        setItemInLocal("theme", currentTheme === "light" ? "dark" : "light")
    }

    return (
        <Layout
            style={{
                width: "100%",
                height: "100%",
                flex: 1,
            }}
        >
            <Header
                className={classNames(styles.header, {
                    [styles.header_light]: currentTheme === "light",
                })}
            >
                {device === "mobile" && (
                    <Button
                        type="text"
                        onClick={() => (setDrawer ? setDrawer(true) : null)}
                    >
                        <GiHamburgerMenu size={20} />
                    </Button>
                )}
                <h4>{title}</h4>
                <Space align="center">
                    <Button
                        icon={
                            currentTheme === "light" ? (
                                <RiSunLine />
                            ) : (
                                <RiMoonLine />
                            )
                        }
                        onClick={toggleTheme}
                    />
                    <Button danger type="primary" onClick={logout}>
                        Выйти
                    </Button>
                </Space>
            </Header>
            <Content
                style={{
                    width: "100%",
                    height: "100%",
                    flex: 1,
                    position: "relative",
                }}
            >
                {children}
            </Content>
        </Layout>
    )
}

export default DashboardContent
