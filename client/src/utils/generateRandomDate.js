const generateRandomDate = () => {
    const maxDate = Date.now();
    const timestamp = Math.floor(Math.random() * maxDate);
    return new Date(timestamp).toString;
}

export default generateRandomDate;