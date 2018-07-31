function formatTime (time) {
    time = new Date(parseInt(time, 10));
    return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + (time.getHours() < 10 ? "0" + time.getHours() : time.getHours()) + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + ":" + (time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds());
}

function trimString (value) {
    return (value || '').replace(/\s/g, '');
}

export default {formatTime, trimString};