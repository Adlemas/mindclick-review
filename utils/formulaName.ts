
const formulaName = (formula: string) => {
    switch(formula) {
        case "NF":
            return "Прямой счёт"
        case "LF":
            return "Маленькие друзья"
        case "BF":
            return "Большие друзья"
        case "FF":
            return "Семья"
        default:
            return `Формула (${formula})`        
    }
}

export default formulaName