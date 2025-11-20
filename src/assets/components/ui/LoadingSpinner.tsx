interface LoadingSpinnerProps {
    size?: number;
    color?: string;
}

export const LoadingSpinner = ({ size = 48, color = "#457B9D" }: LoadingSpinnerProps) => (
    <div className="flex items-center justify-center gap-2" style={{ height: size }}>
        <div
            className="w-2 h-8 rounded-full animate-wave"
            style={{ 
                backgroundColor: color,
                animationDelay: '0s',
                height: size * 0.6 
            }}
        />
        <div
            className="w-2 h-10 rounded-full animate-wave"
            style={{ 
                backgroundColor: color,
                animationDelay: '0.15s',
                height: size * 0.75 
            }}
        />
        <div
            className="w-2 h-12 rounded-full animate-wave"
            style={{ 
                backgroundColor: color,
                animationDelay: '0.3s',
                height: size 
            }}
        />
        <div
            className="w-2 h-10 rounded-full animate-wave"
            style={{ 
                backgroundColor: color,
                animationDelay: '0.45s',
                height: size * 0.75 
            }}
        />
        <div
            className="w-2 h-8 rounded-full animate-wave"
            style={{ 
                backgroundColor: color,
                animationDelay: '0.6s',
                height: size * 0.6 
            }}
        />
    </div>
);