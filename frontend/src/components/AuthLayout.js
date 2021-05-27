import Header from "./Header";

export default function AuthLayout({ children }) {
    return (
        <div className="container">
            <Header isAuthenticated={true} />
            {children}
        </div>
    );
}