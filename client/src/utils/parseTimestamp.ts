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
            // dateStyle: 'full',
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }),
        time: parsedTimestamp.toLocaleTimeString('en-us', {
            hour: 'numeric',
            minute: 'numeric'
        })
    }
}