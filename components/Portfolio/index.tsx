import { Button, Empty, List, Space, Typography } from "antd"
import moment from "moment"
import { useAppSelector } from "slices"
import { selectAuth } from "slices/auth"

import emptySvg from "assets/empty.svg"
import ProfilePic from "components/ProfilePic"
import { FileTwoTone } from "@ant-design/icons"

interface PropTypes {
    onAdd?: () => void
}

const Portfolio: React.FC<PropTypes> = ({ onAdd }) => {
    const { user } = useAppSelector(selectAuth)

    if (user.portfolio && user.portfolio.length) {
        return (
            <List
                dataSource={user.portfolio}
                renderItem={(file) => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={
                                ["png", "jpeg", "jpg"].includes(
                                    file.filename.split(".").pop()
                                ) ? (
                                    <ProfilePic
                                        src={file.filename}
                                        style={{
                                            borderRadius: 5,
                                        }}
                                    />
                                ) : (
                                    <FileTwoTone />
                                )
                            }
                            title={file.displayName}
                            description={moment(file.uploadAt).format(
                                "DD/MM/YYYY HH:mm"
                            )}
                        />
                    </List.Item>
                )}
            />
        )
    } else {
        return (
            <Empty
                image={emptySvg.src}
                imageStyle={{
                    height: 60,
                }}
                description={<span>Добавьте первый файл</span>}
            >
                <Button type="primary" onClick={onAdd}>
                    Добавить
                </Button>
            </Empty>
        )
    }
}

export default Portfolio
