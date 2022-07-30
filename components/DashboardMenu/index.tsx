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
    RiChat3Fill,
    RiChat3Line,
    RiTelegramFill,
    RiTelegramLine,
} from "react-icons/ri"
import { HiOutlineDocumentText, HiDocumentText } from "react-icons/hi"
import {
    IoCallOutline,
    IoCall,
    IoStatsChartOutline,
    IoStatsChart,
} from "react-icons/io5"
import { BiAbacus, BiCodeAlt, BiTask } from "react-icons/bi"

import styles from "./styles.module.scss"
import Link from "antd/lib/typography/Link"
import usePermission from "hooks/usePermission"
import { SettingFilled, SettingOutlined } from "@ant-design/icons"
import { useThemeSwitcher } from "react-css-theme-switcher"
import { useAppDispatch, useAppSelector } from "slices"
import { getChats } from "slices/chats"

interface PropTypes {
    collapsed: boolean
}

const DashboardMenu: React.FC<PropTypes> = ({ collapsed }) => {
    const { pathname, push } = useRouter()

    const [hoverKey, setHoverKey] = useState<null | string>(null)

    const selectedKey = pathname

    const { canAccess } = usePermission()

    const gotoDashboard = useCallback(() => {
        message.error("У вас нет доступа к странице!")
        push("/")
    }, [push])

    const dispatch = useAppDispatch()
    const { chats } = useAppSelector((state) => state.chats)
    const { user } = useAppSelector((state) => state.auth)

    useEffect(() => {
        dispatch(getChats(user.groups))
    }, [dispatch, user.groups])

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

    const { currentTheme } = useThemeSwitcher()

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
                    key="/teacher"
                    icon={
                        selectedKey === "/teacher" ||
                        hoverKey === "/teacher" ? (
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
                            href="/teacher"
                            style={{
                                color:
                                    hoverKey === "/teacher" ||
                                    selectedKey === "/teacher"
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
            {canAccess && (
                <>
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
                            key="/teacher/mental"
                            icon={<BiAbacus />}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/mental">
                                Сложение / Вычитание
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/multiply"
                            icon={
                                selectedKey === "/teacher/multiply" ||
                                hoverKey === "/teacher/multiply" ? (
                                    <RiGridFill />
                                ) : (
                                    <RiGridLine />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/multiply">Умножение</Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/tables"
                            icon={
                                selectedKey === "/teacher/tables" ||
                                hoverKey === "/teacher/tables" ? (
                                    <RiTableFill />
                                ) : (
                                    <RiTableLine />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/tables">Столбики</Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/divide"
                            icon={
                                selectedKey === "/teacher/divide" ||
                                hoverKey === "/teacher/divide" ? (
                                    <RiLayoutRowFill />
                                ) : (
                                    <RiLayoutRowLine />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/divide">Деление</Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/flash"
                            icon={
                                selectedKey === "/teacher/flash" ||
                                hoverKey === "/teacher/flash" ? (
                                    <RiFlashlightFill />
                                ) : (
                                    <RiFlashlightLine />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/flash">Флешкарты</Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/mental/generate"
                            icon={
                                selectedKey === "/teacher/mental/generate" ||
                                hoverKey === "/teacher/mental/generate" ? (
                                    <HiDocumentText />
                                ) : (
                                    <HiOutlineDocumentText />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/mental/generate">
                                Ментальный генератор
                            </Link>
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
                            key="/teacher/programming"
                            icon={<BiCodeAlt />}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/programming">
                                Проектирование
                            </Link>
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
                            key="/teacher/call"
                            icon={
                                selectedKey === "/teacher/call" ||
                                hoverKey === "/teacher/call" ? (
                                    <IoCall />
                                ) : (
                                    <IoCallOutline />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/call">Конференции</Link>
                        </Menu.Item>

                        {chats.map((chat) => (
                            <Menu.Item
                                key={`/teacher/chat/${chat._id}`}
                                icon={
                                    selectedKey ===
                                        `/teacher/chat/${chat._id}` ||
                                    hoverKey === `/teacher/chat/${chat._id}` ? (
                                        <RiChat3Fill />
                                    ) : (
                                        <RiChat3Line />
                                    )
                                }
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                            >
                                <Link href={`/teacher/chat/${chat._id}`}>
                                    {chat.title}
                                </Link>
                            </Menu.Item>
                        ))}
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
                            key="/teacher/task/mental"
                            icon={<BiTask />}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/task/mental">
                                Ментальный счёт
                            </Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/task/multiply"
                            icon={
                                selectedKey === "/teacher/task/multiply" ||
                                hoverKey === "/teacher/task/multiply" ? (
                                    <RiGridFill />
                                ) : (
                                    <RiGridLine />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/task/multiply">Умножение</Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/task/flash"
                            icon={
                                selectedKey === "/teacher/task/flash" ||
                                hoverKey === "/teacher/task/flash" ? (
                                    <RiFlashlightFill />
                                ) : (
                                    <RiFlashlightLine />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/task/flash">Флешкарты</Link>
                        </Menu.Item>
                        <Menu.Item
                            key="/teacher/task/stats"
                            icon={
                                selectedKey === "/teacher/task/stats" ||
                                hoverKey === "/teacher/task/stats" ? (
                                    <IoStatsChart />
                                ) : (
                                    <IoStatsChartOutline />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/task/stats">Статистика</Link>
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
                            selectedKey.includes("teacher/settings")
                                ? "/teacher/settings"
                                : selectedKey,
                        ]}
                        mode="inline"
                        theme={currentTheme as MenuTheme}
                        className={classNames(styles.menu, {
                            [styles.collapsed]: collapsed,
                        })}
                    >
                        <Menu.Item
                            key="/teacher/settings"
                            icon={
                                selectedKey.includes("teacher/settings") ||
                                hoverKey === "/teacher/settings" ? (
                                    <SettingFilled />
                                ) : (
                                    <SettingOutlined />
                                )
                            }
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <Link href="/teacher/settings">Настройки</Link>
                        </Menu.Item>
                    </Menu>
                </>
            )}
        </div>
    )
}

export default DashboardMenu
