import { Drawer, Layout, Typography } from "antd"

import React, { PropsWithChildren, useEffect, useState } from "react"
import styles from "./styles.module.scss"

import Logo from "components/Logo"
import StudentDashboardMenu from "components/StudentDashboardMenu"
import DashboardContent from "container/DashboardContent"
import { useAppSelector } from "slices"
import { selectAuth } from "slices/auth"
import { useRouter } from "next/router"
import useResponsive from "hooks/useResponsive"
import ProfilePic from "components/ProfilePic"
import SettingsMenu from "components/SettingsMenu"
import classNames from "classnames"
import { useThemeSwitcher } from "react-css-theme-switcher"

import Head from "next/head"

const { Sider, Content } = Layout

interface PropTypes extends PropsWithChildren<any> {
    title: string
}

const DashboardLayout: React.FC<PropTypes> = ({ children, title }) => {
    const device = useResponsive()

    const [collapsed, setCollapsed] = useState(false)
    const [logoWidth, setLogoWidth] = useState(120)

    const { user } = useAppSelector(selectAuth)
    const { pathname } = useRouter()

    const [visible, setVisible] = useState<boolean>(true)

    const handleDrawerClose = () => setVisible(false)

    useEffect(() => {
        setVisible(false)

        // Страницы где боковая панель должна скрываться
        if (
            pathname.includes("mental") ||
            pathname.includes("multiply") ||
            pathname.includes("tables")
        ) {
            setTimeout(() => {
                setCollapsed(true)
            }, 100)
        }
    }, [pathname])

    useEffect(() => {
        if (collapsed) {
            setTimeout(() => {
                setLogoWidth(40)
            }, 0)
        } else {
            setTimeout(() => {
                setLogoWidth(120)
            }, 0)
        }
    }, [collapsed])

    const { currentTheme } = useThemeSwitcher()

    return (
        <>
            <Head>
                <title>MindClick - {title}</title>
            </Head>
            <Layout className={styles.dashboard_layout} hasSider>
                <Drawer
                    className={classNames(styles.dashboard_drawer, {
                        [styles.dashboard_light]: currentTheme === "light",
                    })}
                    visible={visible}
                    placement={"left"}
                    onClose={handleDrawerClose}
                    style={{
                        display: device === "mobile" ? "block" : "none",
                    }}
                >
                    <div className={styles.logo}>
                        <Logo compact={collapsed} width={logoWidth} />
                    </div>
                    <hr />
                    <div className={styles.avatar}>
                        <ProfilePic src={user.profileImg} size={50} />
                        {!collapsed && (
                            <div className={styles.right}>
                                <Typography
                                    className={styles.name}
                                >{`${user.firstName} ${user.lastName}`}</Typography>
                                <Typography className={styles.balance}>
                                    {Object.values(user.balance.available)[0]}{" "}
                                    рублей
                                </Typography>
                            </div>
                        )}
                    </div>
                    <hr />
                    <StudentDashboardMenu collapsed={false} />
                </Drawer>
                <Sider
                    width="250"
                    collapsible
                    collapsed={collapsed}
                    onCollapse={setCollapsed}
                    className={classNames(styles.sider, {
                        [styles.sider_light]: currentTheme === "light",
                    })}
                    style={{
                        display: device !== "mobile" ? "block" : "none",
                    }}
                    trigger={null}
                >
                    <div
                        className={styles.logo}
                        onClick={() => setCollapsed(!collapsed)}
                    >
                        <Logo compact={collapsed} width={logoWidth} />
                    </div>
                    <hr />
                    <div className={styles.avatar}>
                        <ProfilePic src={user.profileImg} size={50} />
                        {!collapsed && (
                            <div className={styles.right}>
                                <Typography
                                    className={styles.name}
                                >{`${user.firstName} ${user.lastName}`}</Typography>
                                <Typography className={styles.balance}>
                                    {Object.values(user.balance.available)[0]}{" "}
                                    рублей
                                </Typography>
                            </div>
                        )}
                    </div>
                    <hr />
                    <StudentDashboardMenu collapsed={collapsed} />
                </Sider>
                <Content className={styles.layout_content}>
                    <DashboardContent title={title} setDrawer={setVisible}>
                        {pathname.includes("teacher/settings") ? (
                            <Layout
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    flex: 1,
                                }}
                            >
                                <Sider
                                    width="250"
                                    className={styles.settings_sider}
                                    style={{
                                        display:
                                            device !== "mobile"
                                                ? "block"
                                                : "none",
                                    }}
                                    trigger={null}
                                >
                                    <SettingsMenu />
                                </Sider>
                                <Content>{children}</Content>
                            </Layout>
                        ) : (
                            children
                        )}
                    </DashboardContent>
                </Content>
            </Layout>
        </>
    )
}

export default DashboardLayout
