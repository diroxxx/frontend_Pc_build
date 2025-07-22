import { Link } from "react-router-dom";

function mainPage() {
    return (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen font-sans">
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12">
                {/* Navigation Cards */}
                <div className="mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-800 mb-4">
                        PC Build Hub
                    </h1>
                    <p className="text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
                        Stwórz idealny zestaw komputerowy i podziel się nim ze społecznością
                    </p>

                    {/* Quick Access Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <Link to="/components" className="group">
                            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden">
                                <div className="aspect-w-16 aspect-h-12 bg-gradient-to-br from-blue-500 to-purple-600">
                                    <img
                                        src="/components_mainPage.png"
                                        alt="Components"
                                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Components</h3>
                                    <p className="text-gray-600 text-sm">Przeglądaj i porównuj komponenty komputerowe</p>
                                </div>
                            </div>
                        </Link>

                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Builds</h3>
                            <p className="text-gray-600 text-sm">Twórz i dziel się swoimi zestawami</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col justify-center items-center text-center">
                            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
                            <p className="text-gray-600 text-sm">Dołącz do społeczności entuzjastów</p>
                        </div>
                    </div>
                </div>

                {/* Featured Section */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl mx-auto">
                    <div className="flex flex-col lg:flex-row">
                        <div className="lg:w-1/2">
                            <img
                                src="/pc_photo_mainPage.png"
                                alt="Gaming PC Setup"
                                className="w-full h-64 lg:h-full object-cover"
                            />
                        </div>
                        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
                            <div className="mb-6">
                                <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                                    Nowa funkcja
                                </span>
                                <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                    Stwórz idealny zestaw komputerowy
                                </h2>
                                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                    Dołącz do społeczności, porównuj zestawy, komentuj i ulepszaj sprzęt – wszystko w jednym miejscu.
                                    Znajdź najlepsze komponenty dla swojego budżetu.
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                                    Rozpocznij budowę
                                </button>
                                <button className="border-2 border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 font-semibold px-8 py-3 rounded-lg transition-all duration-300">
                                    Zobacz przykłady
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <div className="text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">1000+</div>
                        <div className="text-gray-600">Komponentów w bazie</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
                        <div className="text-gray-600">Gotowych zestawów</div>
                    </div>
                    <div className="text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">250+</div>
                        <div className="text-gray-600">Aktywnych użytkowników</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default mainPage;