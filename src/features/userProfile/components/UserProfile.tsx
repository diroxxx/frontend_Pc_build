import { useState } from 'react';
import customAxios from '../../../lib/customAxios.tsx';
import { useAtom } from 'jotai';
import { userAtom } from '../../auth/atoms/userAtom.tsx';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import {useLogout} from "../../auth/user/hooks/useLogout.ts";
import { showToast } from '../../../lib/ToastContainer.tsx';

function UserProfile(){
    const [user,] = useAtom(userAtom);
    const navigate = useNavigate();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVerified, setIsPasswordVerified] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const logout = useLogout();
    const verifyCurrentPassword = async () => {
        if (!currentPassword) {
            showToast.error('Please enter your current password');
            return;
        }

        setIsVerifying(true);

        try {
            const response = await customAxios.post('/auth/verify-password', {
                currentPassword: currentPassword
            });

            if (response.status === 200) {
                setIsPasswordVerified(true);
                showToast.success('Password verified successfully');
            }
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Current password is incorrect');
            setIsPasswordVerified(false);
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || !confirmPassword) {
            showToast.error('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast.error('New passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            showToast.error('New password must be at least 8 characters long');
            return;
        }

        try {
            const response = await customAxios.put('/auth/change-password', {
                currentPassword: newPassword
            });

            if (response.status === 200) {
                showToast.success('Password changed successfully! You will be logged out.');

                resetPasswordForm();
                setTimeout(() => {
                    logout();
                    navigate('/login');
                }, 1000);
            }
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Failed to change password');
        }
    };

    const resetPasswordForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordVerified(false);
    };
    
    return(
        <div className="bg-gray-100 rounded-lg shadow-lg p-8 max-w-md mx-auto">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <img
                                    src="user2.png"
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
                            </div>
                        </div>


                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    value={user?.nickname || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                    disabled
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Username cannot be changed
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
                                    disabled
                                    readOnly
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Email cannot be changed
                                </p>
                            </div>

                            <div className="border-t pt-4">
                                <h3 className="text-lg font-medium text-gray-700 mb-3">Change Password</h3>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Current Password
                                    </label>
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                                placeholder="Enter current password"
                                                disabled={isPasswordVerified}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                disabled={isPasswordVerified}
                                            >
                                                {showCurrentPassword ? (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {!isPasswordVerified && (
                                            <button
                                                onClick={verifyCurrentPassword}
                                                disabled={isVerifying || !currentPassword}
                                                className="px-4 py-2 bg-ocean-blue text-white rounded-md hover:bg-ocean-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
                                            >
                                                {isVerifying ? 'Verifying...' : 'Verify'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {isPasswordVerified && (
                                    <>
                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showNewPassword ? "text" : "password"}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showNewPassword ? (
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                    </svg>
                                                    ) : (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Confirm New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                                    placeholder="Confirm new password"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                                >
                                                    {showConfirmPassword ? (
                                                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                    </svg>
                                                    ) : (
                                                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={handlePasswordChange}
                                                className="flex-1 bg-ocean-teal text-white py-2 rounded-md hover:bg-teal-400 transition-colors duration-200"
                                            >
                                                Change Password
                                            </button>
                                            <button
                                                onClick={resetPasswordForm}
                                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors duration-200"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
    );
}

export default UserProfile;