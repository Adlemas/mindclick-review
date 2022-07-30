import { message } from "antd"
import { useEffect, useRef, useState } from "react"
import { useAppSelector } from "slices"
import axios from "../api/axios"
import { CountSettings, IMentalTask, STAGE, Statistic } from "../types"
import handleAxiosError from "../utils/handleAxiosError"
import playSound from "../utils/playSound"


const useMental = () => {
    const signalSound = useRef<HTMLAudioElement>(new Audio('/audio/signal.mpeg'))
    const correctSound = useRef<HTMLAudioElement>(new Audio('/audio/line_open.mp3'))
    const incorrectSound = useRef<HTMLAudioElement>(new Audio('/audio/incorrect.mp3'))

    const beforeStartSound = useRef<HTMLAudioElement>(new Audio('/audio/before_open.mp3'))
    const beforeEndSound = useRef<HTMLAudioElement>(new Audio('/audio/before_end.mp3'))

    const [stage, setStage] = useState<STAGE>("LOADING")
    const [value, setValue] = useState<string>("")

    const expression = useRef<number[] | null>(null)
    const exprIndex = useRef<number>(0)

    const countTimer = useRef<NodeJS.Timer | null>(null)
    const beforeTimer = useRef<NodeJS.Timer | null>(null)
    const [before, setBefore] = useState<number>(0)
    const beforeRef = useRef<number>(0)

    const [expressions, setExpressions] = useState<Statistic[]>([])

    const [repeated, setRepeated] = useState<boolean>(false)

    // destruct task from singleTask slice with useAppSelector
    const task = useAppSelector(state => state.singleTask.task)

    const [speed, setSpeed] = useState<number>(1.5)
    const [settings, setSettings] = useState<CountSettings>({
        terms: 10,
        formula: 'NF',
        min: 1,
        max: 4,
        forceFormula: true,
    })

    /**
     * Effect on task change
     * and if task is not null
     * set settings
     */
    useEffect(() => {
        if (task) {
            const mentalTask = (task.task as IMentalTask)
            console.log({ mentalTask });
            setSettings({
                terms: mentalTask.terms,
                formula: mentalTask.formula,
                min: mentalTask.diapason.min,
                max: mentalTask.diapason.max,
                forceFormula: false
            })
            // set speed from mentalTask.speed
            setSpeed(mentalTask.speed)
            request()
        } else {
            setSettings({
                terms: 10,
                formula: 'NF',
                min: 1,
                max: 4,
                forceFormula: true
            })
            setSpeed(1.5)
            request()
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
        play(beforeStartSound.current)
        setBefore(3)
        beforeRef.current = 3
        setStage('BEFORE')
        if (beforeTimer.current) clearInterval(beforeTimer.current)
        beforeTimer.current = setInterval(() => {
            if (beforeRef.current <= 1) {
                clearInterval(beforeTimer.current)
                setBefore(0)
                beforeRef.current = 0
                setStage('COUNT')
                startCount()
            } else {
                beforeRef.current--
                if (beforeRef.current !== 1) play(beforeStartSound.current)
                else play(beforeEndSound.current)
                setBefore(beforeRef.current)
            }
        }, 1000)
    }

    const startCount = () => {
        exprIndex.current = 0
        setValue(expression.current[exprIndex.current].toString())
        exprIndex.current++
        if (countTimer.current) clearInterval(countTimer.current)
        countTimer.current = setInterval(() => {
            if (exprIndex.current >= expression.current.length) {
                exprIndex.current = 0
                setStage('ANSWER')
                setValue('')
                clearInterval(countTimer.current)
            } else {
                play(signalSound.current)
                if (expression.current.length > 1 && expression.current[exprIndex.current] === expression.current[exprIndex.current - 1]) {
                    console.log('repeating', expression.current[exprIndex.current], '=', expression.current[exprIndex.current - 1])
                    setRepeated(true)
                }
                else setRepeated(false)
                setValue(expression.current[exprIndex.current].toString())
                exprIndex.current++
            }
        }, speed * 1000)
    }

    const answer = (your: number) => {
        if (expression.current === null) return
        const right = expression.current.reduce((previousValue, currentValue) => previousValue + currentValue)

        setExpressions([
            ...expressions,
            {
                expression: expression.current,
                isRight: right === your,
                your: your.toString(),
                settings: Object.assign(settings, {})
            }
        ])

        if (your === right) {
            // message success if task is not null
            if (task) message.success("+1 правильно к заданию!")
        } else {
            // message warning if task is not null
            if (task) message.warning("+1 неправильно к заданию!")
        }

        if (your === right) {
            expression.current = null
            wait(true)
            play(correctSound.current)
            return true
        } else {
            message.error("Неправильный ответ!")
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
            const { data, status } = await axios.post<number[]>('/expression/mental', settings)

            setStage("START")

            if (status === 200) {
                expression.current = data
            }
        } catch (error) {
            handleAxiosError(error)
        }
    }

    useEffect(() => {
        if (expression.current === null) {
            setStage('LOADING')
            requestExpression()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return {
        // State values
        stage, value, before, isRight, settings, speed, expressions, sounds, repeated,

        // Methods
        start, answer,
        wait, request,

        // State setters
        setSpeed,
        setSettings,
        setSounds
    }
}

export default useMental