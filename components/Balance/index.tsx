// destruct import descriptions from antd
import { Descriptions, Typography } from "antd"
import { useAppSelector } from "slices"

// import local module styles
import styles from "./styles.module.scss"

// Create Balance component with descriptions of balance
const Balance = () => {
    // destruct user from auth slice using useAppSelector
    const { user } = useAppSelector((state) => state.auth)

    return (
        <Descriptions
            layout="vertical"
            colon={false}
            labelStyle={{
                fontSize: ".8rem",
                fontWeight: "bold",
            }}
        >
            <Descriptions.Item label="Доступно">
                <Typography.Text type="secondary">
                    {/* render available balance */}
                    {Object.values(user.balance.available)[0]} ₽
                </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Потрачено">
                <Typography.Text type="secondary">
                    {/* render reserved balance */}
                    {Object.values(user.balance.reserved)[0]} ₽
                </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Стоимость в месяц">
                <Typography.Text type="secondary">
                    {/* render monthly balance */}
                    300 ₽
                </Typography.Text>
            </Descriptions.Item>
            <Descriptions.Item label="Осталось дней">
                <Typography.Text type="secondary">
                    {Math.floor(
                        Number(Object.values(user.balance.available)[0]) / 300
                    )}
                </Typography.Text>
            </Descriptions.Item>
        </Descriptions>
    )
}

export default Balance
