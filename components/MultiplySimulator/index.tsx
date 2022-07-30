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
import multiplyData from "data/multiply"
import { useControllerProps } from "hooks/useController"
import useMultiply from "hooks/useMultiply"
import { User } from "types"
import MemberHolder from "components/MemberHolder"
import styles from "./styles.module.scss"

interface PropTypes {
    controller?: useControllerProps
    uniqueKey: string
}

const MultiplySimulator: React.FC<PropTypes> = ({
    controller,
    uniqueKey: key,
}) => {
    const multiply = useMultiply()

    const [your, setYour] = useState<number | null>(null)
    const [setup, setSetup] = useState<boolean>(false)

    const [member, setMember] = useState<User | null>(null)

    const inputRef = useRef<HTMLInputElement | null>(null)

    const [template, setTemplate] = useState<string>(
        Object.keys(multiplyData)[0]
    )

    useEffect(() => {
        if (controller) {
            controller.subscribe({
                member: member,
                history: multiply.expressions,
                key: key,
                state: multiply.stage,
                sounds: multiply.sounds,
                start: () => {
                    multiply.start()
                },
                request: () => {
                    multiply.request()
                },
                focus: () => {
                    if (inputRef.current) {
                        inputRef.current.focus()
                    }
                },
                focused: document.activeElement === inputRef.current,
                enableSounds: () => multiply.setSounds(true),
                disableSounds: () => multiply.setSounds(false),
            })
        }

        return () => {
            controller.unsubcribe(key)
        }
    }, [controller, key, member, multiply])

    const handleAnswer = () => {
        if (!your) return message.warn("Введите ответ!")
        multiply.answer(your)
        setYour(null)
    }

    return (
        <div className={styles.simulator}>
            <MemberHolder
                onSettings={() => {
                    setSetup(true)
                }}
                sounds={multiply.sounds}
                value={member}
                onChange={setMember}
                onSounds={(v: boolean) => multiply.setSounds(v)}
            />

            <Modal
                visible={setup}
                onCancel={() => setSetup(false)}
                onOk={() => {
                    setSetup(false)
                    multiply.request()
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
                        value={template}
                        onChange={(value: string) => {
                            setTemplate(value)
                            multiply.setSettings({
                                ...multiply.settings,
                                first: [],
                                second: [],
                            })
                        }}
                    >
                        {Object.keys(multiplyData).map((label) => {
                            return (
                                <Select.Option key={label}>
                                    {label}
                                </Select.Option>
                            )
                        })}
                    </Select>

                    <Select
                        mode="multiple"
                        allowClear
                        style={{ width: "100%" }}
                        placeholder="Пожалуйства выберите первое число"
                        value={multiply.settings.first}
                        onClear={() => {
                            multiply.setSettings({
                                ...multiply.settings,
                                first: [],
                            })
                        }}
                        onChange={(value: string[]) => {
                            if (value.includes("*")) {
                                multiply.setSettings({
                                    ...multiply.settings,
                                    first: multiplyData[template].first.filter(
                                        (f) => f !== "*"
                                    ),
                                })
                            }
                        }}
                    >
                        {template
                            ? multiplyData[template].first.map((label) => {
                                  return (
                                      <Select.Option key={label}>
                                          {label}
                                      </Select.Option>
                                  )
                              })
                            : []}
                    </Select>

                    <Select
                        mode="multiple"
                        allowClear
                        onClear={() => {
                            multiply.setSettings({
                                ...multiply.settings,
                                second: [],
                            })
                        }}
                        style={{ width: "100%" }}
                        placeholder="Пожалуйства выберите второе число"
                        value={multiply.settings.second}
                        onChange={(value: string[]) => {
                            if (value.includes("*")) {
                                multiply.setSettings({
                                    ...multiply.settings,
                                    second: multiplyData[
                                        template
                                    ].second.filter((f) => f !== "*"),
                                })
                            }
                        }}
                    >
                        {template
                            ? multiplyData[template].second.map((label) => {
                                  return (
                                      <Select.Option key={label}>
                                          {label}
                                      </Select.Option>
                                  )
                              })
                            : []}
                    </Select>
                </Space>
            </Modal>

            <Switcher
                selected={multiply.stage}
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
                                    multiply.isRight
                                        ? "Красаучег!"
                                        : "Ну как так?"
                                }
                            >
                                <Space
                                    direction="vertical"
                                    size={"middle"}
                                    align={"center"}
                                >
                                    {multiply.isRight ? (
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
                                            multiply.request()
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
                                            {multiply.value}
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

export default MultiplySimulator
