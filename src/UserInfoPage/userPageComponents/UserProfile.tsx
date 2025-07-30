function UserProfile(){
    
    return(
<div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                        {/* Profile Image */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img
                                    src="user.png"
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-300"
                                    onError={(e) => {
                                        console.log("Image failed to load:", e.currentTarget.src);
                                        // e.currentTarget.style.backgroundColor = "#e5e7eb";
                                        e.currentTarget.style.display = "block";
                                    }}
                                    onLoad={() => {
                                        console.log("Image loaded successfully");
                                    }}
                                />
                                {/* <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200">
                                    edit
                                </button> */}
                            </div>
                        </div>

                        {/* Form Fields */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    defaultValue="Tomek123"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    defaultValue="tomek1@gmail.com"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    defaultValue="Valuesadsasdasdasdad"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <button className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200 font-medium">
                                Edit
                            </button>
                        </div>
                    </div>
    );
}

export default UserProfile;