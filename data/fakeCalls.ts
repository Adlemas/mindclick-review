import moment from "moment";
import { Conference } from "../types";


const fakeCalls: Conference[] = [
    {
        date: moment().add(-2, "days").toISOString(),
        members: ["62acafb95a68583f0605abe1", "62c59b516e746cc4acf30452"],
        name: 'WEB Разработка',
        visibility: 'PRIVATE'
    },
    {
        date: moment().add(-1, "days").toISOString(),
        members: [],
        name: 'Скорочтение',
        visibility: 'PUBLIC'
    },
    {
        date: moment().add(-5, "days").toISOString(),
        members: ["62acafb95a68583f0605abe1"],
        name: 'Презентация MindClick Education',
        visibility: 'PUBLIC'
    },
    {
        date: moment().add(1, "days").toISOString(),
        members: [],
        name: 'Скорочтение',
        visibility: 'PUBLIC'
    },
    {
        date: moment().add(3, "days").toISOString(),
        members: ["62acafb95a68583f0605abe1"],
        name: 'Презентация MindClick Education',
        visibility: 'PUBLIC'
    },
]

export default fakeCalls