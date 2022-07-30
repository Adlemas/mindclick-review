import { Menu, message } from "antd"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

import { MenuHoverEventHandler } from "rc-menu/lib/interface"

import styles from "./styles.module.scss"
// import Link from "antd/lib/typography/Link";
import usePermission from "hooks/usePermission"
import { LockFilled, LockOutlined } from "@ant-design/icons"

import { BiPalette } from "react-icons/bi"
import { IoMdColorPalette } from "react-icons/io"
import { AiTwotoneSetting, AiOutlineSetting } from "react-icons/ai"

const SettingsMenu: React.FC = () => {
    const { pathname, push } = useRouter()

    const [hoverKey, setHoverKey] = useState<null | string>(null)

    const selectedKey = pathname

    const { canAccess } = usePermission()

    const gotoDashboard = useCallback(() => {
        message.error("У вас нет доступа к странице!")
        push("/")
    }, [push])

    useEffect(() => {
        if (!["/teacher", "/teacher/groups"].includes(pathname) && !canAccess) {
            gotoDashboard()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess])

    const handleMouseEnter: MenuHoverEventHandler = (event) => {
        setHoverKey(event.key)
    }

    const handleMouseLeave: MenuHoverEventHandler = () => {
        setHoverKey(null)
    }

    return (
        <div className={styles.parent}>
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                className={styles.menu}
            >
                <Menu.Item
                    key="/teacher/settings"
                    icon={
                        selectedKey === "/teacher/settings" ||
                        (hoverKey && hoverKey === "/teacher/settings") ? (
                            <AiOutlineSetting />
                        ) : (
                            <AiTwotoneSetting />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <a href="/teacher/settings">Основные</a>
                </Menu.Item>
                <Menu.Item
                    key="/teacher/settings/password"
                    icon={
                        selectedKey.includes("settings/password") ||
                        (hoverKey && hoverKey.includes("settings/password")) ? (
                            <LockOutlined />
                        ) : (
                            <LockFilled />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <a href="/teacher/settings/password">
                        Пароль & Безопасность
                    </a>
                </Menu.Item>
                <Menu.Item
                    key="/teacher/settings/appearance"
                    icon={
                        selectedKey.includes("settings/password") ||
                        (hoverKey &&
                            hoverKey.includes("settings/appearance")) ? (
                            <BiPalette />
                        ) : (
                            <IoMdColorPalette />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <a href="/teacher/settings/appearance">Внешний вид</a>
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default SettingsMenu
