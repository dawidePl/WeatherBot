const adjust = num => {
    return ('0' + num).slice(-2);
}

const getTime = timestamp => {
    const date = new Date(timestamp * 1000);
    const hours = adjust(date.getHours());
    const minutes = adjust(date.getMinutes());
    const seconds = adjust(date.getSeconds());

    return `${hours}:${minutes}:${seconds}`;
}

module.exports = getTime;