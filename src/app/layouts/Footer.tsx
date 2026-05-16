export default function Footer() {
    return (
        <footer className="bg-dark-surface border-t border-dark-border text-dark-muted text-center py-4 text-sm">
            © {new Date().getFullYear()} Pc-Build. Wszelkie prawa zastrzeżone.
        </footer>
    );
}
