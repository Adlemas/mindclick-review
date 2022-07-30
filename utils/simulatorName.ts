import { Simulator } from "../types"


const simulatorName = (simulator: Simulator): string => {
    switch (simulator) {
        case "DIVIDE": return "Деление"
        case "FLASHCARDS": return "Флешкарты"
        case "MENTAL": return "Сложение / Вычитание"
        case "MULTIPLY": return "Умножение"
        case "TABLES": return "Столбики"
        default: return "Симулятор"
    }
}

export default simulatorName