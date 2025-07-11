
function Unauthorized() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md text-center">
                <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Brak dostępu</h2>
                <p className="text-gray-600 mb-6">
                    Nie masz uprawnień, aby zobaczyć tę stronę.
                </p>
                <a
                    href="/login"
                    className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl transition"
                >
                    Wróć do logowania
                </a>
            </div>
        </div>
    );
}

export default Unauthorized