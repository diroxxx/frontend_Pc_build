export const modalSx = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: { xs: "92%", sm: 640 },
    maxHeight: "90vh",
    bgcolor: "var(--color-ocean-dark-blue)",
    color: "var(--color-ocean-white)",
    border: "1px solid var(--color-ocean-blue)",
    boxShadow: "0 12px 40px rgba(16,55,131,0.25)",
    borderRadius: 8,
    p: { xs: 2, sm: 3 },
    outline: "none",
    display: "flex",
    flexDirection: "column",
    gap: 2,
    overflow: "hidden",

    "& .modalHeader": {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
    },
    "& .modalBody": {
        flex: "1 1 auto",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        pt: 1,
        pb: 1,
    },
    "& .modalFooter": {
        display: "flex",
        justifyContent: "flex-end",
        gap: 2,
        pt: 1,
    },

    "& .MuiFormControl-root, & .MuiTextField-root": {
        backgroundColor: "rgba(255,255,255,0.03)",
        borderRadius: 1,
    },
    "& .MuiInputBase-root": {
        color: "var(--color-ocean-white)",
    },
    "& .MuiInputBase-input::placeholder": {
        color: "rgba(255,255,255,0.55)",
        opacity: 1,
    },
    "& .MuiInputLabel-root": {
        color: "rgba(255,255,255,0.75)",
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: "var(--color-ocean-blue)",
    },
    "& .MuiFormHelperText-root": {
        color: "rgba(255,255,255,0.7)",
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: "rgba(255,255,255,0.12)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "var(--color-ocean-blue)",
        borderWidth: 1.5,
    },
    "& .MuiInputAdornment-root .MuiSvgIcon-root": {
        color: "rgba(255,255,255,0.85)",
    },
} as const;
