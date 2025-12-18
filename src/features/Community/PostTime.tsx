export const parseDateArray = (dateArray: number[] | undefined): Date => {
    if (!dateArray || dateArray.length < 6) return new Date();

    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second);
};


export const formatDate = (date: Date): string => {
    return date.toLocaleString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};


export const timeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return "przed chwilą";
    if (diffMinutes < 60) return `${diffMinutes} min. temu`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} godz. temu`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} dni temu`;


    return date.toLocaleDateString("pl-PL");
};