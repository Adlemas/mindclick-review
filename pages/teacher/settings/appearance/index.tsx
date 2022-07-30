import { Breadcrumb, Card, Radio, Space, Typography } from "antd"
import BreadcrumbItem from "antd/lib/breadcrumb/BreadcrumbItem"
import { useThemeSwitcher } from "react-css-theme-switcher"
import DashboardLayout from "container/DashboardLayout"
import SizedBox from "container/SizedBox"
import { setItemInLocal } from "utils/localStorage"

const AppearanceSettings: React.FC = () => {
    const { switcher, currentTheme, themes, status } = useThemeSwitcher()

    const setTheme = (theme: string) => {
        switcher({ theme })
        // set theme in local storage
        setItemInLocal("theme", theme)
    }

    return (
        <DashboardLayout title="Настройки">
            <Breadcrumb
                style={{
                    padding: "1rem",
                }}
            >
                <BreadcrumbItem>Главная</BreadcrumbItem>
                <BreadcrumbItem>Настройки</BreadcrumbItem>
                <BreadcrumbItem>Внешний вид</BreadcrumbItem>
            </Breadcrumb>

            <SizedBox>
                <Card title={"Настройки внешнего вида"}>
                    <Space direction="vertical">
                        <Typography>Стиль текста</Typography>
                        <Radio.Group
                            buttonStyle="solid"
                            defaultValue={"blogger"}
                        >
                            <Radio.Button value={"blogger"}>
                                Динамический
                            </Radio.Button>
                            <Radio.Button value={"montserrat"}>
                                Статический
                            </Radio.Button>
                        </Radio.Group>

                        <Typography>Тема</Typography>
                        <Radio.Group
                            buttonStyle="solid"
                            onChange={(e) => setTheme(e.target.value)}
                            value={currentTheme}
                        >
                            <Radio.Button value={"light"}>Светлая</Radio.Button>
                            <Radio.Button value={"dark"}>Тёмная</Radio.Button>
                        </Radio.Group>
                    </Space>
                </Card>
            </SizedBox>
        </DashboardLayout>
    )
}

export default AppearanceSettings
