import Header from "./Header";

export default function AuthLayout({ children }) {
    return (
        <div className="container">
            <Header isAuthenticated={true} />
            <div className="inner-container">
                {children}
            </div>
        </div>
    );
}