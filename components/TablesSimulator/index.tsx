import {
    Modal,
    Spin,
    Card,
    Space,
    Button,
    InputNumber,
    message,
    Dropdown,
    Form,
    List,
} from "antd"
import { useState, useRef, useEffect } from "react"
import { AiFillLike, AiFillDislike } from "react-icons/ai"
import Switcher from "container/Switcher"
import { useControllerProps } from "hooks/useController"
import useTables from "hooks/useTables"
import { CountFormula, User } from "types"
import formulaName from "utils/formulaName"
import DiapasonMenu from "../DiapasonMenu"
import FormulaMenu from "../FormulaMenu"
import MemberHolder from "../MemberHolder"

import styles from "./styles.module.scss"

interface PropTypes {
    controller?: useControllerProps
    uniqueKey: string
}

const TablesSimulator: React.FC<PropTypes> = ({
    controller,
    uniqueKey: key,
}) => {
    const tables = useTables()

    const [your, setYour] = useState<number | null>(null)
    const [setup, setSetup] = useState<boolean>(false)

    const [member, setMember] = useState<User | null>(null)

    const inputRef = useRef<HTMLInputElement | null>(null)

    useEffect(() => {
        if (controller) {
            controller.subscribe({
                member: member,
                history: tables.expressions,
                key: key,
                state: tables.stage,
                sounds: tables.sounds,
                start: () => {
                    tables.start()
                },
                request: () => {
                    tables.request()
                },
                focus: () => {
                    if (inputRef.current) {
                        inputRef.current.focus()
                    }
                },
                focused: document.activeElement === inputRef.current,
                enableSounds: () => tables.setSounds(true),
                disableSounds: () => tables.setSounds(false),
            })
        }

        return () => {
            controller.unsubcribe(key)
        }
    }, [controller, key, member, tables])

    const handleAnswer = () => {
        if (!your) return message.warn("Введите ответ!")
        tables.answer(your)
        setYour(null)
    }

    return (
        <div className={styles.simulator}>
            <MemberHolder
                onSettings={() => {
                    setSetup(true)
                }}
                sounds={tables.sounds}
                value={member}
                onChange={setMember}
                onSounds={(v: boolean) => tables.setSounds(v)}
            />

            <Modal
                visible={setup}
                onCancel={() => setSetup(false)}
                onOk={() => {
                    setSetup(false)
                    tables.request()
                }}
                cancelText={"Закрыть"}
            >
                <Form.Item label={"Кол.-во слагаемых (2-500)"}>
                    <InputNumber
                        min={2}
                        max={500}
                        value={tables.settings.terms}
                        onChange={(newValue) =>
                            tables.setSettings({
                                ...tables.settings,
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
                        value={tables.speed}
                        onChange={(newValue) => tables.setSpeed(newValue)}
                    />
                </Form.Item>
                <Form.Item label={"Формула"}>
                    <Dropdown
                        disabled={tables.settings.forceFormula}
                        trigger={["click"]}
                        overlay={
                            <FormulaMenu
                                value={tables.settings.formula}
                                onChange={(formula) =>
                                    tables.setSettings({
                                        ...tables.settings,
                                        formula: formula as CountFormula,
                                    })
                                }
                            />
                        }
                    >
                        <Button type={"text"}>
                            {formulaName(tables.settings.formula)}
                        </Button>
                    </Dropdown>
                </Form.Item>
                <Form.Item label={"Размер слагаемого"}>
                    <Dropdown
                        trigger={["click"]}
                        overlay={
                            <DiapasonMenu
                                value={`${tables.settings.min}-${tables.settings.max}`}
                                onChange={(diapason) => {
                                    tables.setSettings({
                                        ...tables.settings,
                                        forceFormula: diapason.includes(":"),
                                        formula: diapason.includes(":")
                                            ? "NF"
                                            : tables.settings.formula,
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
                            {tables.settings.forceFormula
                                ? "Прямой счёт от 1 до 4"
                                : `от ${tables.settings.min} до ${tables.settings.max}`}
                        </Button>
                    </Dropdown>
                </Form.Item>
            </Modal>

            <Switcher
                selected={tables.stage}
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
                                    tables.isRight
                                        ? "Красаучег!"
                                        : "Ну как так?"
                                }
                            >
                                <Space
                                    direction="vertical"
                                    size={"middle"}
                                    align={"center"}
                                >
                                    {tables.isRight ? (
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
                                            tables.request()
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
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={tables.value || []}
                                        renderItem={(item) => (
                                            <List.Item>{item}</List.Item>
                                        )}
                                    />
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

export default TablesSimulator
