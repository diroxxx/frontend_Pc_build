import { useState } from 'react';
import customAxios from '../../../lib/customAxios.tsx';
import { useAtom } from 'jotai';
import { userAtom } from '../../auth/atoms/userAtom.tsx';
import { useNavigate } from 'react-router-dom';
import { useLogout } from '../../auth/user/hooks/useLogout.ts';
import { showToast } from '../../../lib/ToastContainer.tsx';
import { Eye, EyeOff, User, Mail, Lock, CheckCircle } from 'lucide-react';

function UserProfile() {
    const [user] = useAtom(userAtom);
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
            showToast.error('Wprowadź aktualne hasło');
            return;
        }
        setIsVerifying(true);
        try {
            const response = await customAxios.post('/auth/verify-password', { currentPassword });
            if (response.status === 200) {
                setIsPasswordVerified(true);
                showToast.success('Hasło zweryfikowane');
            }
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Nieprawidłowe hasło');
            setIsPasswordVerified(false);
        } finally {
            setIsVerifying(false);
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || !confirmPassword) {
            showToast.error('Wypełnij wszystkie pola');
            return;
        }
        if (newPassword !== confirmPassword) {
            showToast.error('Nowe hasła nie są identyczne');
            return;
        }
        if (newPassword.length < 8) {
            showToast.error('Hasło musi mieć co najmniej 8 znaków');
            return;
        }
        try {
            const response = await customAxios.put('/auth/change-password', { currentPassword: newPassword });
            if (response.status === 200) {
                showToast.success('Hasło zmienione. Za chwilę zostaniesz wylogowany.');
                resetPasswordForm();
                setTimeout(() => { logout(); navigate('/login'); }, 1000);
            }
        } catch (error: any) {
            showToast.error(error.response?.data?.message || 'Nie udało się zmienić hasła');
        }
    };

    const resetPasswordForm = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsPasswordVerified(false);
    };

    const inputClass = "w-full px-3 py-2 bg-dark-surface2 border border-dark-border rounded-lg text-dark-text text-sm focus:outline-none focus:border-dark-accent transition-colors";
    const labelClass = "block text-xs font-medium text-dark-muted mb-1.5 uppercase tracking-wide";

    return (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 max-w-md mx-auto">
            {/* Avatar */}
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-dark-surface2 border-2 border-dark-border flex items-center justify-center">
                    <User size={36} className="text-dark-muted" />
                </div>
            </div>

            <div className="space-y-4">
                {/* Username */}
                <div>
                    <label className={labelClass}>
                        <span className="flex items-center gap-1.5"><User size={11} /> Nazwa użytkownika</span>
                    </label>
                    <input
                        type="text"
                        value={user?.nickname || ''}
                        className={`${inputClass} opacity-60 cursor-not-allowed`}
                        disabled
                        readOnly
                    />
                    <p className="text-[11px] text-dark-muted mt-1">Nie można zmienić nazwy użytkownika</p>
                </div>

                {/* Email */}
                <div>
                    <label className={labelClass}>
                        <span className="flex items-center gap-1.5"><Mail size={11} /> Email</span>
                    </label>
                    <input
                        type="email"
                        value={user?.email || ''}
                        className={`${inputClass} opacity-60 cursor-not-allowed`}
                        disabled
                        readOnly
                    />
                    <p className="text-[11px] text-dark-muted mt-1">Nie można zmienić adresu email</p>
                </div>

                {/* Password section */}
                <div className="border-t border-dark-border pt-4">
                    <h3 className="flex items-center gap-2 text-sm font-semibold text-dark-text mb-4">
                        <Lock size={14} className="text-dark-muted" />
                        Zmiana hasła
                    </h3>

                    {/* Current password */}
                    <div className="mb-3">
                        <label className={labelClass}>Aktualne hasło</label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className={`${inputClass} pr-10 ${isPasswordVerified ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    placeholder="Wprowadź aktualne hasło"
                                    disabled={isPasswordVerified}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark-muted hover:text-dark-text transition-colors"
                                    disabled={isPasswordVerified}
                                >
                                    {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                            {!isPasswordVerified ? (
                                <button
                                    onClick={verifyCurrentPassword}
                                    disabled={isVerifying || !currentPassword}
                                    className="px-4 py-2 bg-dark-accent text-white rounded-lg hover:bg-dark-accent-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                                >
                                    {isVerifying ? 'Sprawdzam...' : 'Weryfikuj'}
                                </button>
                            ) : (
                                <div className="flex items-center px-3 text-green-400">
                                    <CheckCircle size={18} />
                                </div>
                            )}
                        </div>
                    </div>

                    {isPasswordVerified && (
                        <>
                            <div className="mb-3">
                                <label className={labelClass}>Nowe hasło</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`${inputClass} pr-10`}
                                        placeholder="Wprowadź nowe hasło"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark-muted hover:text-dark-text transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className={labelClass}>Potwierdź nowe hasło</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`${inputClass} pr-10`}
                                        placeholder="Powtórz nowe hasło"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-dark-muted hover:text-dark-text transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={handlePasswordChange}
                                    className="flex-1 bg-dark-accent hover:bg-dark-accent-hover text-white py-2 rounded-lg transition-colors text-sm font-semibold"
                                >
                                    Zmień hasło
                                </button>
                                <button
                                    onClick={resetPasswordForm}
                                    className="px-4 py-2 bg-dark-surface2 border border-dark-border text-dark-muted hover:text-dark-text rounded-lg transition-colors text-sm"
                                >
                                    Anuluj
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
