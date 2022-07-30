import { Modal, Space, Card, Button, InputNumber, message } from "antd"
import { useState, useRef, useEffect } from "react"
import { useControllerProps } from "hooks/useController"
import useFlashCards from "hooks/useFlashCards"
import { User } from "types"
import FlashCard from "../FlashCard"
import MemberHolder from "../MemberHolder"
import styles from "./styles.module.scss"

interface PropTypes {
    controller?: useControllerProps
    uniqueKey: string
}

const FlashCardsSimulator: React.FC<PropTypes> = ({
    controller,
    uniqueKey: key,
}) => {
    const [your, setYour] = useState<number | null>(null)
    const [setup, setSetup] = useState<boolean>(false)

    const [member, setMember] = useState<User | null>(null)

    const inputRef = useRef<HTMLInputElement | null>(null)

    const flashcards = useFlashCards()

    useEffect(() => {
        if (controller) {
            controller.subscribe({
                member: member,
                history: flashcards.expressions,
                key: key,
                state: flashcards.stage,
                sounds: flashcards.sounds,
                start: () => {
                    flashcards.start()
                },
                request: () => {
                    flashcards.start()
                },
                focus: () => {
                    if (inputRef.current) {
                        inputRef.current.focus()
                    }
                },
                focused: document.activeElement === inputRef.current,
                enableSounds: () => flashcards.setSounds(true),
                disableSounds: () => flashcards.setSounds(false),
            })
        }

        return () => {
            controller.unsubcribe(key)
        }
    }, [controller, key, member, flashcards])

    const handleAnswer = () => {
        if (!your) return message.warn("Введите ответ!")
        flashcards.answer(your)
        setYour(null)
    }

    return (
        <div className={styles.simulator}>
            <MemberHolder
                onSettings={() => {
                    setSetup(true)
                }}
                sounds={flashcards.sounds}
                value={member}
                onChange={setMember}
                onSounds={(v: boolean) => flashcards.setSounds(v)}
            />

            <Modal
                visible={setup}
                onCancel={() => setSetup(false)}
                onOk={() => {
                    setSetup(false)
                    flashcards.start()
                }}
                cancelText={"Закрыть"}
            >
                <Space
                    direction="vertical"
                    style={{ marginTop: "3rem", width: "100%" }}
                >
                    {/* TODO: add settings */}
                </Space>
            </Modal>

            <Card>
                <Space direction="vertical" size={"middle"} align="center">
                    <FlashCard
                        animated={flashcards.animated}
                        itemStyle={flashcards.currentItem}
                        setStage={flashcards.setStage}
                        value={flashcards.value}
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
                        onChange={(newValue) => setYour(newValue)}
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
                        loading={flashcards.stage === "LOADING"}
                        disabled={flashcards.stage === "LOADING"}
                    >
                        ОТВЕТИТЬ
                    </Button>
                </Space>
            </Card>

            {/* <Switcher
                selected={flashcards.stage}
                items={[
                    {
                        key: 'LOADING',
                        render: (
                            <Spin tip={'Загрузка...'} />
                        )
                    },
                    {
                        key: 'WAIT',
                        render: (
                            <Card title={flashcards.isRight ? 'Красаучег!' : "Ну как так?"}>
                                <Space direction='vertical' size={'middle'} align={'center'}>
                                    {flashcards.isRight ? <AiFillLike size={70} color={'green'} /> : <AiFillDislike size={70} color={'crimson'} />}
                                    <Button type='text' onClick={() => {
                                        flashcards.start()
                                    }}>ПРОДОЛЖИТЬ</Button>
                                </Space>
                            </Card>
                        )
                    },
                    {
                        key: 'ANSWER',
                        render: (
                            
                        )
                    },
                ]}
            /> */}
        </div>
    )
}

export default FlashCardsSimulator
