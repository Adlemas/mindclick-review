import { message } from "antd"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "slices"
import axios from "../api/axios"
import { IMultiplyTask, MultiplySettings, STAGE, Statistic } from "../types"
import handleAxiosError from "../utils/handleAxiosError"
import playSound from "../utils/playSound"


const useMultiply = () => {
    const correctSound = useRef<HTMLAudioElement>(new Audio('/audio/line_open.mp3'))
    const incorrectSound = useRef<HTMLAudioElement>(new Audio('/audio/incorrect.mp3'))

    const [stage, setStage] = useState<STAGE>("LOADING")
    const [value, setValue] = useState<string>("")
    const expression = useRef<{ first: number, second: number }>({ first: null, second: null })

    const [expressions, setExpressions] = useState<Statistic[]>([])

    const [speed, setSpeed] = useState<number | null>(0.6)
    const [settings, setSettings] = useState<MultiplySettings>({
        first: ['A'],
        second: ['B']
    })

    useEffect(() => request(), [settings])

    // destruct task from singleTask slice with useAppSelector
    const task = useAppSelector(state => state.singleTask.task)

    /**
     * Effect on task change
     * and if task is not null
     * set settings
     */
    useEffect(() => {
        if (task) {
            const multiplyTask = (task.task as IMultiplyTask)
            setSettings({
                first: multiplyTask.first,
                second: multiplyTask.second
            })
        } else {
            setSettings({
                first: ['A'],
                second: ['B']
            })
        }
    }, [task])

    const [sounds, setSounds] = useState<boolean>(true)

    const [isRight, setIsRight] = useState<boolean>()

    const wait = (right: boolean) => {
        setIsRight(right)
        setStage('WAIT')
    }

    const play = (audio: HTMLAudioElement) => {
        if (sounds) playSound(audio)
    }

    const start = () => {
        setStage('ANSWER')
    }

    const answer = (your: number) => {
        if (expression.current === null || expression.current.first === null || expression.current.second === null) return

        const isRight = expression.current.first * expression.current.second === your

        setExpressions([
            ...expressions,
            {
                expression: [expression.current.first, expression.current.second],
                isRight: isRight,
                your: your.toString(),
                settings: Object.assign(settings, {})
            }
        ])

        if (isRight) {
            message.success("Правильно!")
            wait(true)
            play(correctSound.current)
            return true
        } else {
            message.error("Неправильно!")
            wait(false)
            play(incorrectSound.current)
            return false
        }
    }

    const request = () => {
        setStage('LOADING')
        requestExpression()
    }

    const requestExpression = async () => {
        try {
            const { data, status } = await axios.post<{ first: number, second: number }>('/expression/multiply', settings)

            setStage("ANSWER")

            if (status === 200) {
                expression.current = data
                setValue(`${expression.current.first} * ${expression.current.second}`)
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    useEffect(() => {
        if (expression.current === null || expression.current.first === null || expression.current.second === null) {
            request()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        // State values
        stage, value, isRight, settings, speed, expressions, sounds,

        // Methods
        start, answer,
        wait, request,

        // State setters
        setSpeed,
        setSettings,
        setSounds
    }
}

export default useMultiply