export default function parseTimestamp(timestamp: string | undefined) {
    if (!timestamp) {
        return {
            date: 'Error',
            time: 'Error'
        };
    }

    const parsedTimestamp = new Date(timestamp);

    return {
        date: parsedTimestamp.toLocaleDateString('en-us', {
            month: 'numeric',
            day: 'numeric',
            year: '2-digit'
        }),
        time: parsedTimestamp.toLocaleTimeString('en-us', {
            hour: 'numeric',
            minute: 'numeric'
        })
    }
}