import './App.css'

function AuthPage() {
    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-200">
            <h1 className="text-5xl font-black my-4">Pc-Build</h1>
            <header className="w-full bg-red-600 py-4 flex justify-between px-4">
                <span className="text-white text-2xl">📧</span>
                <span className="text-white text-2xl">🔗</span>
            </header>
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <label className="block mb-2">Email</label>
                <input
                    type="email"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Enter your email"
                />
                <label className="block mb-2">Password</label>
                <input
                    type="password"
                    className="w-full mb-4 px-3 py-2 border rounded"
                    placeholder="Enter your password"
                />
                <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                    Sign In
                </button>
                <div className="text-sm mt-2 text-right">
                    <a href="#" className="text-blue-500 hover:underline">
                        Forgot password?
                    </a>
                </div>
            </div>
        </div>
    );
}
export default AuthPage;