// import { useState } from "react";
// import UserProfile from "../components/UserProfile.tsx";
// import UserComputers from "../components/UserComputers.tsx";
//
// function UserPage() {
//     const [activeTab, setActiveTab] = useState("profile");
//
//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="max-w-4xl mx-auto py-8 px-4">
//                 {/* Navigation Tabs */}
//                 <div className="flex justify-center mb-8">
//                     <div className="bg-gray-200 rounded-full p-1 flex">
//                         <button
//                             onClick={() => setActiveTab("profile")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "profile"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Profile
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("posts")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "posts"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Posts
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("builds")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "builds"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Builds
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("saved")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "saved"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             Saved
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Profile Content */}
//                 {activeTab === "profile" &&
//                     <UserProfile />
//                 }
//
//                 {/* Other tabs content */}
//                 {activeTab === "posts" && (
//                     <div className="text-center text-gray-600 py-8">
//                         <h3 className="text-xl font-medium">My Posts</h3>
//                         <p className="mt-2">Your posts will be displayed here</p>
//                     </div>
//                 )}
//
//                 {activeTab === "builds" && (
//                     <UserComputers />
//                 )}
//
//                 {activeTab === "saved" && (
//                     <div className="text-center text-gray-600 py-8">
//                         <h3 className="text-xl font-medium">Saved</h3>
//                         <p className="mt-2">Your saved items will be displayed here</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default UserPage;


// import { useState, useEffect } from "react";
// import UserProfile from "../components/UserProfile.tsx";
// import UserComputers from "../components/UserComputers.tsx";
// import customAxios from "../../../../lib/customAxios.tsx";
//
// function UserPage() {
//     const [activeTab, setActiveTab] = useState("profile");
//
//     // --- STATE DLA POSTÓW ---
//     const [posts, setPosts] = useState<any[]>([]);
//     const [loadingPosts, setLoadingPosts] = useState(false);
//     const [errorPosts, setErrorPosts] = useState<string | null>(null);
//
//     // --- POBRANIE POSTÓW UŻYTKOWNIKA ---
//     useEffect(() => {
//         if (activeTab === "posts") {
//             const fetchPosts = async () => {
//                 try {
//                     setLoadingPosts(true);
//                     setErrorPosts(null);
//
//                     // Pobierz userId z backendu lub z JWT, tutaj przykładowo 1
//                     const userId = 1;
//
//                     const response = await customAxios.get(`test/posts/${userId}`);
//                     const data = response.data;
//
//                     setPosts(Array.isArray(data) ? data : []);
//                 } catch (err: any) {
//                     setErrorPosts(err.message || "Failed to load posts");
//                 } finally {
//                     setLoadingPosts(false);
//                 }
//             };
//
//             fetchPosts();
//         }
//     }, [activeTab]);
//
//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="max-w-4xl mx-auto py-8 px-4">
//                 {/* Navigation Tabs */}
//                 <div className="flex justify-center mb-8">
//                     <div className="bg-gray-200 rounded-full p-1 flex">
//                         <button
//                             onClick={() => setActiveTab("profile")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "profile"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Profile
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("posts")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "posts"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Posts
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("builds")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "builds"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Builds
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("saved")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "saved"
//                                     ? "bg-white text-gray-800 shadow-sm"
//                                     : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             Saved
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Profile */}
//                 {activeTab === "profile" && <UserProfile />}
//
//                 {/* --- MY POSTS CONTENT --- */}
//                 {activeTab === "posts" && (
//                     <div className="py-8">
//                         <h3 className="text-xl font-semibold mb-4">My Posts</h3>
//
//                         {loadingPosts && (
//                             <p className="text-gray-600 text-center">Loading...</p>
//                         )}
//
//                         {errorPosts && (
//                             <p className="text-red-500 text-center">{errorPosts}</p>
//                         )}
//
//                         {!loadingPosts && !errorPosts && posts.length === 0 && (
//                             <p className="text-gray-600 text-center">You haven't created any posts yet.</p>
//                         )}
//
//                         {/* LISTA POSTÓW */}
//                         <div className="space-y-4">
//                             {Array.isArray(posts) && posts.map((post) => (
//                                 <div
//                                     key={post.id}
//                                     className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
//                                 >
//                                     <h4 className="text-lg font-bold">{post.title}</h4>
//                                     <p className="text-gray-700 mt-1">{post.content}</p>
//
//                                     {post.category?.name && (
//                                         <p className="text-gray-400 text-sm mt-2">
//                                             Category: {post.category.name}
//                                         </p>
//                                     )}
//
//                                     {/*<p className="text-gray-400 text-sm mt-3">Posted by you</p>*/}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//
//                 {activeTab === "builds" && <UserComputers />}
//
//                 {activeTab === "saved" && (
//                     <div className="text-center text-gray-600 py-8">
//                         <h3 className="text-xl font-medium">Saved</h3>
//                         <p className="mt-2">Your saved items will be displayed here</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default UserPage;


// import { useState, useEffect } from "react";
// import { useAtom } from "jotai";
// import { userAtom } from "../../../../atomContext/userAtom.tsx"; // import swojego userAtom
// import UserProfile from "../components/UserProfile.tsx";
// import UserComputers from "../components/UserComputers.tsx";
// import customAxios from "../../../../lib/customAxios.tsx";
//
// function UserPage() {
//     const [activeTab, setActiveTab] = useState("profile");
//
//     // --- STATE DLA POSTÓW ---
//     const [posts, setPosts] = useState<any[]>([]);
//     const [loadingPosts, setLoadingPosts] = useState(false);
//     const [errorPosts, setErrorPosts] = useState<string | null>(null);
//
//     // --- POBRANIE USERA Z ATOMA ---
//     const [user] = useAtom(userAtom);
//
//     console.log("Current user:", user);
//
//     useEffect(() => {
//         if (activeTab === "posts" && user?.id) {
//             const fetchPosts = async () => {
//                 try {
//                     setLoadingPosts(true);
//                     setErrorPosts(null);
//
//                     const response = await customAxios.get(`test/posts/user/${user.id}`);
//                     const data = response.data;
//
//                     setPosts(Array.isArray(data) ? data : []);
//                 } catch (err: any) {
//                     setErrorPosts(err.message || "Failed to load posts");
//                 } finally {
//                     setLoadingPosts(false);
//                 }
//             };
//
//             fetchPosts();
//         }
//     }, [activeTab, user?.id]);
//
//     return (
//         <div className="min-h-screen bg-gray-100">
//             <div className="max-w-4xl mx-auto py-8 px-4">
//                 {/* Navigation Tabs */}
//                 <div className="flex justify-center mb-8">
//                     <div className="bg-gray-200 rounded-full p-1 flex">
//                         <button
//                             onClick={() => setActiveTab("profile")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "profile" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Profile
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("posts")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "posts" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Posts
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("builds")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "builds" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             My Builds
//                         </button>
//                         <button
//                             onClick={() => setActiveTab("saved")}
//                             className={`px-6 py-2 rounded-full transition-all duration-200 ${
//                                 activeTab === "saved" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
//                             }`}
//                         >
//                             Saved
//                         </button>
//                     </div>
//                 </div>
//
//                 {/* Profile */}
//                 {activeTab === "profile" && <UserProfile />}
//
//                 {/* My Posts */}
//                 {activeTab === "posts" && (
//                     <div className="py-8">
//                         <h3 className="text-xl font-semibold mb-4">My Posts</h3>
//
//                         {loadingPosts && <p className="text-gray-600 text-center">Loading...</p>}
//
//                         {errorPosts && <p className="text-red-500 text-center">{errorPosts}</p>}
//
//                         {!loadingPosts && !errorPosts && posts.length === 0 && (
//                             <p className="text-gray-600 text-center">You haven't created any posts yet.</p>
//                         )}
//
//                         <div className="space-y-4">
//                             {Array.isArray(posts) && posts.map((post) => (
//                                 <div key={post.id} className="p-4 bg-white rounded-lg shadow hover:shadow-md transition">
//                                     <h4 className="text-lg font-bold">{post.title}</h4>
//                                     <p className="text-gray-700 mt-1">{post.content}</p>
//                                     {post.category?.name && (
//                                         <p className="text-gray-400 text-sm mt-2">
//                                             Category: {post.category.name}
//                                         </p>
//                                     )}
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}
//
//                 {activeTab === "builds" && <UserComputers />}
//
//                 {activeTab === "saved" && (
//                     <div className="text-center text-gray-600 py-8">
//                         <h3 className="text-xl font-medium">Saved</h3>
//                         <p className="mt-2">Your saved items will be displayed here</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default UserPage;



import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userAtom } from "../../../../atomContext/userAtom.tsx";
import UserProfile from "../components/UserProfile.tsx";
import UserComputers from "../components/UserComputers.tsx";
import customAxios from "../../../../lib/customAxios.tsx";

function UserPage() {
    const [activeTab, setActiveTab] = useState("profile");

    // --- STATE DLA POSTÓW ---
    const [posts, setPosts] = useState<any[]>([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [errorPosts, setErrorPosts] = useState<string | null>(null);

    // --- Pobranie aktualnego usera z atomu ---
    const [user] = useAtom(userAtom);

    // --- POBRANIE POSTÓW UŻYTKOWNIKA ---
    useEffect(() => {
        if (activeTab === "posts" && user?.nickname) {
            const fetchPosts = async () => {
                try {
                    setLoadingPosts(true);
                    setErrorPosts(null);

                    // Pobranie postów po nickname
                    const response = await customAxios.get(`community/posts/user/${user.nickname}`);
                    const data = response.data;

                    // Upewnienie się, że posts jest tablicą
                    setPosts(Array.isArray(data) ? data : []);
                } catch (err: any) {
                    setErrorPosts(err.message || "Failed to load posts");
                } finally {
                    setLoadingPosts(false);
                }
            };

            fetchPosts();
        }
    }, [activeTab, user?.nickname]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Navigation Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-gray-200 rounded-full p-1 flex">
                        <button
                            onClick={() => setActiveTab("profile")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "profile" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            My Profile
                        </button>
                        <button
                            onClick={() => setActiveTab("posts")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "posts" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            My Posts
                        </button>
                        <button
                            onClick={() => setActiveTab("builds")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "builds" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            My Builds
                        </button>
                        <button
                            onClick={() => setActiveTab("saved")}
                            className={`px-6 py-2 rounded-full transition-all duration-200 ${
                                activeTab === "saved" ? "bg-white text-gray-800 shadow-sm" : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Saved
                        </button>
                    </div>
                </div>

                {/* Profile */}
                {activeTab === "profile" && <UserProfile />}

                {/* --- MY POSTS CONTENT --- */}
                {activeTab === "posts" && (
                    <div className="py-8">
                        <h3 className="text-xl font-semibold mb-4">My Posts</h3>

                        {loadingPosts && <p className="text-gray-600 text-center">Loading...</p>}
                        {errorPosts && <p className="text-red-500 text-center">{errorPosts}</p>}
                        {!loadingPosts && !errorPosts && posts.length === 0 && (
                            <p className="text-gray-600 text-center">You haven't created any posts yet.</p>
                        )}

                        {/* LISTA POSTÓW */}
                        <div className="space-y-4">
                            {Array.isArray(posts) &&
                                posts.map((post) => (
                                    <div
                                        key={post.id}
                                        className="p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                                    >
                                        <h4 className="text-lg font-bold">{post.title}</h4>
                                        <p className="text-gray-700 mt-1">{post.content}</p>
                                        {post.category?.name && (
                                            <p className="text-gray-400 text-sm mt-2">
                                                Category: {post.category.name}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </div>
                )}

                {activeTab === "builds" && <UserComputers />}

                {activeTab === "saved" && (
                    <div className="text-center text-gray-600 py-8">
                        <h3 className="text-xl font-medium">Saved</h3>
                        <p className="mt-2">Your saved items will be displayed here</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserPage;