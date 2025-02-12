const getDelay = (targetTime: string, currentTime: string): number => {
    const [targetHours, targetMinutes] = targetTime.split(":").map(Number);
    const [currentHours, currentMinutes] = currentTime.split(":").map(Number);

    const targetTotalMinutes = targetHours * 60 + targetMinutes;
    const currentTotalMinutes = currentHours * 60 + currentMinutes;

    let delayInMinutes = targetTotalMinutes - currentTotalMinutes;

    // If target time is earlier today, add 24 hours to it
    if (delayInMinutes < 0) {
        delayInMinutes += 24 * 60;  // Add 24 hours (next day)
    }

    return delayInMinutes * 60000; // Convert minutes to milliseconds
};

const isTimeWithinRange = (time: string, start: string, end: string): boolean => {
    const [currentHours, currentMinutes] = time.split(":").map(Number);
    const [startHours, startMinutes] = start.split(":").map(Number);
    const [endHours, endMinutes] = end.split(":").map(Number);

    let currentTimeInMinutes = currentHours * 60 + currentMinutes;
    let startTimeInMinutes = startHours * 60 + startMinutes;
    let endTimeInMinutes = endHours * 60 + endMinutes;

    // Handle crossing midnight
    if (endTimeInMinutes < startTimeInMinutes) {
        endTimeInMinutes += 24 * 60;  // Add 24 hours to the end time
    }

    console.log('Slot start-end', start, "-", end)
    console.log('curent -time', currentHours, ":", currentMinutes);
    console.log('Times', currentTimeInMinutes, startTimeInMinutes, endTimeInMinutes);

    return currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes <= endTimeInMinutes;
};


const getISTtime = () => {
    const currentTime = new Date();
    const ISTOffset = 330; // IST is UTC +5:30 (in minutes)

    return new Date(currentTime.getTime() + ISTOffset * 60000);
}

export {
    getDelay,
    getISTtime,
    isTimeWithinRange,
}