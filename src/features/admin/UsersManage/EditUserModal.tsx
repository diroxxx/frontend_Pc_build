import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {IconButton, Stack} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import Button from "@mui/material/Button";
import {UserRole, type UserUpdateDto} from "./UserUpdateDto.ts";
import {showToast} from "../../../lib/ToastContainer.tsx";
import {modalSx} from "../../../types/modalStyle.ts";
import {updateUserApi} from "./updateUserApi.ts";
import type {UserToShowDto} from "./UserToShowDto.ts";
import Alert from "@mui/material/Alert";

export type EditUserModalProps = {
    open: boolean;
    handleClose: () => void;
    userUpdateDto: UserToShowDto;
    userRefetch: () => void;
};

export const EditUserModal = ({ open, handleClose, userUpdateDto, userRefetch}: EditUserModalProps) => {

    const [errorMessage, setErrorMessage] = useState<string>("");



    const [userToUpdate, setUserToUpdate] = useState<UserUpdateDto>({
        email: userUpdateDto?.email ?? "",
        nickname: userUpdateDto?.nickname ?? "",
        password: "",
        role: userUpdateDto?.role ?? UserRole.USER,
    });

    useEffect(() => {
        setUserToUpdate({
            email: userUpdateDto?.email ?? "",
            nickname: userUpdateDto?.nickname ?? "",
            password: "",
            role: userUpdateDto?.role ?? UserRole.USER,
        });
        setErrors({});
    }, [userUpdateDto, open]);

    const [errors, setErrors] = useState<{ nickname?: string; email?: string; password?: string }>({});


    const validate = (): boolean => {
        if (!userToUpdate.nickname?.trim() || userToUpdate.nickname.trim().length < 2) {
            setErrorMessage("Pseudonim musi mieć co najmniej 2 znaki");
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userToUpdate.email ?? "")) {
            setErrorMessage("Nieprawidłowy adres email");
            return false;
        }
        if (userToUpdate.password && userToUpdate.password.length > 0 && userToUpdate.password.length < 6) {
            setErrorMessage("Hasło musi mieć co najmniej 6 znaków");
            return false;
        }
        if (
            userToUpdate.nickname === (userUpdateDto?.nickname ?? "") &&
            userToUpdate.email === (userUpdateDto?.email ?? "")
        ) {
            setErrorMessage("Brak zmian w danych");
            return false;
        }
        return true;
    };


    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!validate()) return;
        try {
            console.log(userToUpdate);
            const result = await updateUserApi(userToUpdate);
            showToast.success(result.message ?? "Zapisano");
            userRefetch();
            handleClose();
        } catch (err) {
            console.error("Failed saving user", err);
            setErrorMessage("Błąd serwera podczas zapisu");
        }
    };

    return (
        <Modal open={open} onClose={handleClose} closeAfterTransition disableEnforceFocus disableAutoFocus>
            <Box component="form" onSubmit={handleSubmit} sx={modalSx}>
                <div className="modalHeader">
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Edytuj użytkownika</Typography>
                    <IconButton onClick={handleClose}><CloseIcon fontSize="small" /></IconButton>
                </div>

                {errorMessage && <Alert severity="error" onClose={() => setErrorMessage("")}>{errorMessage}</Alert>}


                <div className="modalBody">
                    <Stack spacing={1}>
                        <TextField
                            label="Pseudonim"
                            value={userToUpdate.nickname ?? ""}
                            onChange={(e) => setUserToUpdate((prev) => ({ ...prev, nickname: e.target.value }))}
                            size="small"
                            fullWidth
                            required
                            helperText={errors.nickname}
                        />

                        <TextField
                            label="Email"
                            value={userToUpdate.email ?? ""}
                            onChange={(e) => setUserToUpdate((prev) => ({ ...prev, email: e.target.value }))}
                            size="small"
                            fullWidth
                            required
                            helperText={errors.email}
                        />

                        <TextField
                            label="Hasło (opcjonalnie)"
                            value={userToUpdate.password ?? ""}
                            onChange={(e) => setUserToUpdate((prev) => ({ ...prev, password: e.target.value }))}
                            size="small"
                            fullWidth
                            type="password"
                            helperText={errors.password ?? "Pozostaw puste, aby nie zmieniać hasła"}
                        />
                    </Stack>
                </div>

                <div className="modalFooter">
                    <Button onClick={handleClose} variant="outlined" size="small">Anuluj</Button>
                    <Button type="submit" variant="contained" size="small">Zapisz</Button>
                </div>
            </Box>
        </Modal>
    );
};