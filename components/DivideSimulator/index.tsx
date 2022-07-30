import {
    Button,
    Card,
    InputNumber,
    message,
    Modal,
    Row,
    Select,
    Space,
    Spin,
    Typography,
} from "antd"
import { useEffect, useRef, useState } from "react"
import { AiFillLike, AiFillDislike } from "react-icons/ai"
import Switcher from "container/Switcher"
import { useControllerProps } from "hooks/useController"
import useDivide from "hooks/useDivide"
import { User } from "types"
import MemberHolder from "components/MemberHolder"
import styles from "./styles.module.scss"

interface PropTypes {
    controller?: useControllerProps
    uniqueKey: string
}

const DivideSimulator: React.FC<PropTypes> = ({
    controller,
    uniqueKey: key,
}) => {
    const divide = useDivide()

    const [your, setYour] = useState<number | null>(null)
    const [setup, setSetup] = useState<boolean>(false)

    const [member, setMember] = useState<User | null>(null)

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (controller) {
            controller.subscribe({
                member: member,
                history: divide.expressions,
                key: key,
                state: divide.stage,
                sounds: divide.sounds,
                start: () => {
                    divide.start()
                },
                request: () => {
                    divide.request()
                },
                focus: () => {
                    if (inputRef.current) {
                        inputRef.current.focus()
                    }
                },
                focused: document.activeElement === inputRef.current,
                enableSounds: () => divide.setSounds(true),
                disableSounds: () => divide.setSounds(false),
            })
        }

        return () => {
            controller.unsubcribe(key)
        }
    }, [controller, key, member, divide])

    const handleAnswer = () => {
        if (!your) return message.warn("Введите ответ!")
        divide.answer(your)
        setYour(null)
    }

    return (
        <div className={styles.simulator}>
            <MemberHolder
                onSettings={() => {
                    setSetup(true)
                }}
                sounds={divide.sounds}
                value={member}
                onChange={setMember}
                onSounds={(v: boolean) => divide.setSounds(v)}
            />

            <Modal
                visible={setup}
                onCancel={() => setSetup(false)}
                onOk={() => {
                    setSetup(false)
                    divide.request()
                }}
                cancelText={"Закрыть"}
            >
                <Space
                    direction="vertical"
                    style={{ marginTop: "3rem", width: "100%" }}
                >
                    <Select
                        style={{ width: "100%" }}
                        placeholder="Пожалуйства выберите шаблон"
                        value={`${divide.settings.first}:${divide.settings.second}`}
                        onChange={(value: string) => {
                            const parts = value.split(":")
                            divide.setSettings({
                                ...divide.settings,
                                first: parts[0],
                                second: parts[1],
                            })
                        }}
                    >
                        <Select.Option key={"AB:C"}>AB &#247; C</Select.Option>
                        <Select.Option key={"ABC:D"}>
                            ABC &#247; D
                        </Select.Option>
                        <Select.Option key={"ABC:DE"}>
                            ABC &#247; DE
                        </Select.Option>
                        <Select.Option key={"ABCD:E"}>
                            ABCD &#247; E
                        </Select.Option>
                        <Select.Option key={"ABCD:EF"}>
                            ABCD &#247; EF
                        </Select.Option>
                        <Select.Option key={"ABCD:EFG"}>
                            ABCD &#247; EFG
                        </Select.Option>
                    </Select>
                </Space>
            </Modal>

            <Switcher
                selected={divide.stage}
                items={[
                    {
                        key: "LOADING",
                        render: <Spin tip={"Загрузка..."} />,
                    },
                    {
                        key: "WAIT",
                        render: (
                            <Card
                                title={
                                    divide.isRight
                                        ? "Красаучег!"
                                        : "Ну как так?"
                                }
                            >
                                <Space
                                    direction="vertical"
                                    size={"middle"}
                                    align={"center"}
                                >
                                    {divide.isRight ? (
                                        <AiFillLike size={70} color={"green"} />
                                    ) : (
                                        <AiFillDislike
                                            size={70}
                                            color={"crimson"}
                                        />
                                    )}
                                    <Button
                                        type="text"
                                        onClick={() => {
                                            divide.request()
                                        }}
                                    >
                                        ПРОДОЛЖИТЬ
                                    </Button>
                                </Space>
                            </Card>
                        ),
                    },
                    {
                        key: "ANSWER",
                        render: (
                            <Card>
                                <Space
                                    direction="vertical"
                                    size={"middle"}
                                    align="center"
                                >
                                    <Row justify="center">
                                        <Typography
                                            style={{
                                                fontSize: 20,
                                            }}
                                        >
                                            {divide.value}
                                        </Typography>
                                    </Row>
                                    <InputNumber
                                        ref={inputRef}
                                        min={1}
                                        placeholder={"Ответ..."}
                                        size={"large"}
                                        style={{
                                            width: 150,
                                        }}
                                        value={your}
                                        onChange={(newValue) =>
                                            setYour(newValue)
                                        }
                                        onKeyUp={(ev) => {
                                            if (
                                                ev.key === "Enter" &&
                                                your &&
                                                your.toString().length
                                            ) {
                                                handleAnswer()
                                            }
                                        }}
                                    />
                                    <Button
                                        type="primary"
                                        style={{
                                            width: 150,
                                        }}
                                        onClick={handleAnswer}
                                    >
                                        ОТВЕТИТЬ
                                    </Button>
                                </Space>
                            </Card>
                        ),
                    },
                ]}
            />
        </div>
    )
}

export default DivideSimulator
