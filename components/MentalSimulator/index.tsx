import {
    Button,
    Card,
    Dropdown,
    Form,
    InputNumber,
    message,
    Modal,
    Space,
    Spin,
    Typography,
} from "antd"
import { useEffect, useRef, useState } from "react"
import { AiFillLike, AiFillDislike } from "react-icons/ai"
import Switcher from "container/Switcher"
import { useControllerProps } from "hooks/useController"
import useMental from "hooks/useMental"
import { CountFormula } from "types"
import { User } from "types"
import formulaName from "utils/formulaName"
import DiapasonMenu from "components/DiapasonMenu"
import FormulaMenu from "components/FormulaMenu"
import MemberHolder from "components/MemberHolder"
import styles from "./styles.module.scss"

interface PropTypes {
    controller?: useControllerProps
    uniqueKey: string
}

const MentalSimulator: React.FC<PropTypes> = ({
    controller,
    uniqueKey: key,
}) => {
    const mental = useMental()

    const [your, setYour] = useState<number | null>(null)
    const [setup, setSetup] = useState<boolean>(false)

    const [member, setMember] = useState<User | null>(null)

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (controller) {
            controller.subscribe({
                member: member,
                history: mental.expressions,
                key: key,
                state: mental.stage,
                sounds: mental.sounds,
                start: () => {
                    mental.start()
                },
                request: () => {
                    mental.request()
                },
                focus: () => {
                    if (inputRef.current) {
                        inputRef.current.focus()
                    }
                },
                focused: document.activeElement === inputRef.current,
                enableSounds: () => mental.setSounds(true),
                disableSounds: () => mental.setSounds(false),
            })
        }

        return () => {
            controller.unsubcribe(key)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controller, mental])

    const handleAnswer = () => {
        if (!your) return message.warn("Введите ответ!")
        mental.answer(your)
        setYour(null)
    }

    return (
        <div className={styles.simulator}>
            <MemberHolder
                onSettings={() => {
                    setSetup(true)
                }}
                sounds={mental.sounds}
                value={member}
                onChange={setMember}
                onSounds={(v: boolean) => mental.setSounds(v)}
            />

            <Modal
                visible={setup}
                onCancel={() => setSetup(false)}
                onOk={() => {
                    setSetup(false)
                    mental.request()
                }}
                cancelText={"Закрыть"}
            >
                <Form.Item label={"Кол.-во слагаемых (2-500)"}>
                    <InputNumber
                        min={2}
                        max={500}
                        value={mental.settings.terms}
                        onChange={(newValue) =>
                            mental.setSettings({
                                ...mental.settings,
                                terms: newValue,
                            })
                        }
                    />
                </Form.Item>
                <Form.Item label={"Скорость (0.1-3.5)"}>
                    <InputNumber
                        min={0.1}
                        max={3.5}
                        step={0.1}
                        value={mental.speed}
                        onChange={(newValue) => mental.setSpeed(newValue)}
                    />
                </Form.Item>
                <Form.Item label={"Формула"}>
                    <Dropdown
                        disabled={mental.settings.forceFormula}
                        trigger={["click"]}
                        overlay={
                            <FormulaMenu
                                value={mental.settings.formula}
                                onChange={(formula) =>
                                    mental.setSettings({
                                        ...mental.settings,
                                        formula: formula as CountFormula,
                                    })
                                }
                            />
                        }
                    >
                        <Button type={"text"}>
                            {formulaName(mental.settings.formula)}
                        </Button>
                    </Dropdown>
                </Form.Item>
                <Form.Item label={"Размер слагаемого"}>
                    <Dropdown
                        trigger={["click"]}
                        overlay={
                            <DiapasonMenu
                                value={`${mental.settings.min}-${mental.settings.max}`}
                                onChange={(diapason) => {
                                    mental.setSettings({
                                        ...mental.settings,
                                        forceFormula: diapason.includes(":"),
                                        formula: diapason.includes(":")
                                            ? "NF"
                                            : mental.settings.formula,
                                        min: parseInt(
                                            diapason.includes(":")
                                                ? diapason
                                                      .split(":")
                                                      .pop()
                                                      .split("-")[0]
                                                : diapason.split("-")[0]
                                        ),
                                        max: parseInt(
                                            diapason.includes(":")
                                                ? diapason
                                                      .split(":")
                                                      .pop()
                                                      .split("-")[1]
                                                : diapason.split("-")[1]
                                        ),
                                    })
                                }}
                            />
                        }
                    >
                        <Button type={"text"}>
                            {mental.settings.forceFormula
                                ? "Прямой счёт от 1 до 4"
                                : `от ${mental.settings.min} до ${mental.settings.max}`}
                        </Button>
                    </Dropdown>
                </Form.Item>
            </Modal>

            <Switcher
                selected={mental.stage}
                items={[
                    {
                        key: "LOADING",
                        render: <Spin tip={"Загрузка..."} />,
                    },
                    {
                        key: "START",
                        render: (
                            <Button
                                type="primary"
                                shape={"round"}
                                style={{
                                    width: 250,
                                    height: 75,
                                    fontSize: "25px",
                                }}
                                onClick={mental.start}
                            >
                                НАЧАТЬ
                            </Button>
                        ),
                    },
                    {
                        key: "BEFORE",
                        render: (
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",

                                    width: 175,
                                    height: 175,
                                    borderRadius: Math.round(175 / 2),
                                    backgroundColor:
                                        mental.before === 3
                                            ? "crimson"
                                            : mental.before === 2
                                            ? "orangered"
                                            : "green",
                                }}
                            ></div>
                        ),
                    },
                    {
                        key: "COUNT",
                        render: (
                            <Typography
                                style={{
                                    fontSize: 80,
                                    paddingLeft: mental.repeated ? "2rem" : "0",
                                }}
                            >
                                {mental.value}
                            </Typography>
                        ),
                    },
                    {
                        key: "WAIT",
                        render: (
                            <Card
                                title={
                                    mental.isRight
                                        ? "Красаучег!"
                                        : "Ну как так?"
                                }
                            >
                                <Space
                                    direction="vertical"
                                    size={"middle"}
                                    align={"center"}
                                >
                                    {mental.isRight ? (
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
                                            mental.request()
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
                                    <Button
                                        type="dashed"
                                        style={{
                                            width: 150,
                                        }}
                                        onClick={mental.start}
                                    >
                                        ЕЩЁ РАЗОЧЕК
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

export default MentalSimulator
