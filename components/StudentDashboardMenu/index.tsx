import { Badge, Menu, MenuTheme, message, Typography } from "antd"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"
import classNames from "classnames"

import { MenuHoverEventHandler } from "rc-menu/lib/interface"
import {
    RiDashboardFill,
    RiDashboardLine,
    RiGridFill,
    RiGridLine,
    RiTableLine,
    RiTableFill,
    RiLayoutRowFill,
    RiLayoutRowLine,
    RiFlashlightFill,
    RiFlashlightLine,
} from "react-icons/ri"
import {
    IoCallOutline,
    IoCall,
    IoChatbubble,
    IoChatbubbleOutline,
} from "react-icons/io5"
import { BiAbacus, BiCodeAlt, BiTask } from "react-icons/bi"

import styles from "./styles.module.scss"
import Link from "antd/lib/typography/Link"
import usePermission from "hooks/usePermission"
import { SettingFilled, SettingOutlined } from "@ant-design/icons"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { useAppDispatch, useAppSelector } from "slices"
import { getChatByGroupIdAction } from "slices/singleChat"

interface PropTypes {
    collapsed: boolean
}

const StudentDashboardMenu: React.FC<PropTypes> = ({ collapsed }) => {
    const { pathname, push } = useRouter()

    const [hoverKey, setHoverKey] = useState<null | string>(null)

    const selectedKey = pathname

    const { canAccess } = usePermission()

    useEffect(() => {
        // TODO: здесь проверять доступ к конкретному разделу на основании пути
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canAccess])

    const handleMouseEnter: MenuHoverEventHandler = (event) => {
        setHoverKey(event.key)
    }

    const handleMouseLeave: MenuHoverEventHandler = () => {
        setHoverKey(null)
    }

    const { currentTheme } = useThemeSwitcher()

    const { chat } = useAppSelector((state) => state.singleChat)
    const { group } = useAppSelector((state) => state.group)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!chat && group) {
            dispatch(getChatByGroupIdAction(group._id))
        }
    }, [chat, group])

    return (
        <div className="parent">
            <Typography
                className={classNames(styles.subtitle, {
                    [styles.collapsed]: collapsed,
                })}
            >
                ИНФОРМАЦИЯ
            </Typography>
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                theme={currentTheme as MenuTheme}
                className={classNames(styles.menu, {
                    [styles.collapsed]: collapsed,
                })}
            >
                <Menu.Item
                    key="/student"
                    icon={
                        selectedKey === "/student" ||
                        hoverKey === "/student" ? (
                            <RiDashboardFill />
                        ) : (
                            <RiDashboardLine />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Badge dot={!canAccess}>
                        <Link
                            href="/student"
                            style={{
                                color:
                                    hoverKey === "/student" ||
                                    selectedKey === "/student"
                                        ? currentTheme === "light"
                                            ? "#222"
                                            : "white"
                                        : currentTheme === "light"
                                        ? "#222a"
                                        : "#fffa",
                            }}
                        >
                            Панель
                        </Link>
                    </Badge>
                </Menu.Item>
            </Menu>
            <Typography
                className={classNames(styles.subtitle, {
                    [styles.collapsed]: collapsed,
                })}
            >
                МЕНТАЛЬНЫЙ СЧЁТ
            </Typography>
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                theme={currentTheme as MenuTheme}
                className={classNames(styles.menu, {
                    [styles.collapsed]: collapsed,
                })}
            >
                <Menu.Item
                    key="/student/mental"
                    icon={<BiAbacus />}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/mental">Сложение / Вычитание</Link>
                </Menu.Item>
                <Menu.Item
                    key="/student/multiply"
                    icon={
                        selectedKey === "/student/multiply" ||
                        hoverKey === "/student/multiply" ? (
                            <RiGridFill />
                        ) : (
                            <RiGridLine />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/multiply">Умножение</Link>
                </Menu.Item>
                <Menu.Item
                    key="/student/tables"
                    icon={
                        selectedKey === "/student/tables" ||
                        hoverKey === "/student/tables" ? (
                            <RiTableFill />
                        ) : (
                            <RiTableLine />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/tables">Столбики</Link>
                </Menu.Item>
                <Menu.Item
                    key="/student/divide"
                    icon={
                        selectedKey === "/student/divide" ||
                        hoverKey === "/student/divide" ? (
                            <RiLayoutRowFill />
                        ) : (
                            <RiLayoutRowLine />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/divide">Деление</Link>
                </Menu.Item>
                <Menu.Item
                    key="/student/flash"
                    icon={
                        selectedKey === "/student/flash" ||
                        hoverKey === "/student/flash" ? (
                            <RiFlashlightFill />
                        ) : (
                            <RiFlashlightLine />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/flash">Флешкарты</Link>
                </Menu.Item>
            </Menu>

            <Typography
                className={classNames(styles.subtitle, {
                    [styles.collapsed]: collapsed,
                })}
            >
                ПРОГРАММИРОВАНИЕ
            </Typography>
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                theme={currentTheme as MenuTheme}
                className={classNames(styles.menu, {
                    [styles.collapsed]: collapsed,
                })}
            >
                <Menu.Item
                    key="/student/programming"
                    icon={<BiCodeAlt />}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/programming">Проектирование</Link>
                </Menu.Item>
            </Menu>
            <Typography
                className={classNames(styles.subtitle, {
                    [styles.collapsed]: collapsed,
                })}
            >
                СВЯЗЬ
            </Typography>
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                theme={currentTheme as MenuTheme}
                className={classNames(styles.menu, {
                    [styles.collapsed]: collapsed,
                })}
            >
                <Menu.Item
                    key="/student/lessons"
                    icon={
                        selectedKey === "/student/lessons" ||
                        hoverKey === "/student/lessons" ? (
                            <IoCall />
                        ) : (
                            <IoCallOutline />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/lessons">Уроки</Link>
                </Menu.Item>
                {chat && (
                    <Menu.Item
                        key={`/student/chat/${chat._id}`}
                        icon={
                            selectedKey === `/student/chat/${chat._id}` ||
                            hoverKey === `/student/chat/${chat._id}` ? (
                                <IoChatbubble />
                            ) : (
                                <IoChatbubbleOutline />
                            )
                        }
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link href={`/student/chat/${chat._id}`}>
                            {chat.title}
                        </Link>
                    </Menu.Item>
                )}
            </Menu>
            <Typography
                className={classNames(styles.subtitle, {
                    [styles.collapsed]: collapsed,
                })}
            >
                ДОМАШНЯЯ РАБОТА
            </Typography>
            <Menu
                selectedKeys={[selectedKey]}
                mode="inline"
                theme={currentTheme as MenuTheme}
                className={classNames(styles.menu, {
                    [styles.collapsed]: collapsed,
                })}
            >
                <Menu.Item
                    key="/student/mytasks"
                    icon={<BiTask />}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/mytasks">Мои задания</Link>
                </Menu.Item>
            </Menu>
            <Typography
                className={classNames(styles.subtitle, {
                    [styles.collapsed]: collapsed,
                })}
            >
                ДРУГОЕ
            </Typography>
            <Menu
                selectedKeys={[
                    selectedKey.includes("student/settings")
                        ? "/student/settings"
                        : selectedKey,
                ]}
                mode="inline"
                theme={currentTheme as MenuTheme}
                className={classNames(styles.menu, {
                    [styles.collapsed]: collapsed,
                })}
            >
                <Menu.Item
                    key="/student/settings"
                    icon={
                        selectedKey.includes("student/settings") ||
                        hoverKey === "/student/settings" ? (
                            <SettingFilled />
                        ) : (
                            <SettingOutlined />
                        )
                    }
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <Link href="/student/settings">Настройки</Link>
                </Menu.Item>
            </Menu>
        </div>
    )
}

export default StudentDashboardMenu
