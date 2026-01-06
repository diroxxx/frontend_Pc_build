export const getCategoryColor = (name: string | undefined): string => {
    if (!name) return 'bg-teal-500';

    const normalizedName = name.trim().toLowerCase();

    // switch (normalizedName) {
    //     case 'pomoc':
    //         return 'bg-blue-600';
    //     case 'zestawy':
    //         return 'bg-green-600';
    //     case 'newsy':
    //         return 'bg-red-500';
    //     case 'buildy użytkowników':
    //         return 'bg-purple-600';
    //     case 'ogólne':
    //         return 'bg-gray-500';
    //     default:
    //         return 'bg-teal-500';
    // }

 switch (normalizedName) {
        case 'pomoc':
            return 'bg-sky-500'; 
        case 'zestawy':
            return 'bg-teal-600'; 
        case 'newsy':
            return 'bg-rose-600'; 
        case 'buildy użytkowników':
            return 'bg-indigo-600'; 
        case 'ogólne':
            return 'bg-slate-500'; 
        default:
            return 'bg-ocean-blue';
    }
};