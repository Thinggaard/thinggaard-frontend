export const getTimeFromStamp = (stamp, msOffset = 0) => {
    const date = new Date(stamp+msOffset);
    return `${("0"+date.getHours()).slice(-2)}:${("0"+date.getMinutes()).slice(-2)}`
};

export const formatDate = (date, format="d/m-yyyy") => {
    return `${date.getDate()}/${date.getMonth() + 1}-${date.getFullYear()}`
};

