export const generateRandomColor = (): string => {
    const colorsArray = ["#00fe9b", "#ffff00c4", "#ff69b4c4", "#2dd9fe", "#9461fd"]
    return colorsArray[Math.floor((Math.random() * 10) / 2)]
}
