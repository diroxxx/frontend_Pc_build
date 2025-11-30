// PostTime.ts

/**
 * Parsuje tablicę liczb reprezentującą datę z backendu na obiekt Date.
 * Format tablicy: [rok, miesiąc, dzień, godzina, minuta, sekunda]
 * @param dateArray Tablica liczb daty.
 * @returns Obiekt Date. Domyślnie zwraca nową datę, jeśli wejście jest niepoprawne.
 */
export const parseDateArray = (dateArray: number[] | undefined): Date => {
    // Sprawdza, czy tablica istnieje i ma przynajmniej 6 elementów
    if (!dateArray || dateArray.length < 6) return new Date();

    const [year, month, day, hour, minute, second] = dateArray;

    // Miesiące w JavaScript Date są numerowane od 0 (styczeń) do 11 (grudzień),
    // dlatego odejmujemy 1 od wartości z backendu.
    return new Date(year, month - 1, day, hour, minute, second);
};

/**
 * Formatowanie daty na pełny, czytelny ciąg znaków w formacie "dd miesiąc rrrr, hh:mm".
 * @param date Obiekt Date do sformatowania.
 * @returns Sformatowany ciąg znaków daty i czasu.
 */
export const formatDate = (date: Date): string => {
    return date.toLocaleString("pl-PL", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Oblicza i zwraca przybliżony czas, który upłynął od podanej daty.
 * Np. "przed chwilą", "5 min. temu", "2 godz. temu", "15 dni temu" lub sformatowana data.
 * @param date Obiekt Date, od którego liczony jest czas.
 * @returns Ciąg znaków opisujący, ile czasu upłynęło.
 */
export const timeAgo = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000); // 1 minuta = 60000 ms

    if (diffMinutes < 1) return "przed chwilą";
    if (diffMinutes < 60) return `${diffMinutes} min. temu`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} godz. temu`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} dni temu`;

    // Jeśli minęło więcej niż 30 dni, zwracamy standardowy format daty
    return date.toLocaleDateString("pl-PL");
};