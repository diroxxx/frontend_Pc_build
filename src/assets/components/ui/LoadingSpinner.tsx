interface LoadingSpinnerProps {
    size?: number;
}

export const LoadingSpinner = ({ size = 48 }: LoadingSpinnerProps) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 150"
        width={size}
        height={size}
    >
        <path
            fill="none"
            stroke="#6FA5FF"
            strokeWidth="15"
            strokeLinecap="round"
            strokeDasharray="300 385"
            strokeDashoffset="0"
            d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
        >
            <animate
                attributeName="stroke-dashoffset"
                calcMode="spline"
                dur="2s"
                values="685;-685"
                keySplines="0 0 1 1"
                repeatCount="indefinite"
            />
        </path>
    </svg>
);
