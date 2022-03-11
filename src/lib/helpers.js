import config from "lib/config"

export const getFileName = (name, splitLength = config.maxNameLength) => {
    const format = `.${name.split(".").pop()}`
    const fileName = `${name.split(".").shift()}`
    if (name.length > splitLength + format.length) {
        return `${name.slice(0, splitLength / 2)}...${name.slice(fileName.length - 2, fileName.length)}${format}`
    }

    return name
}