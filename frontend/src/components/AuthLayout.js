import Header from "./Header";

export default function AuthLayout({ children }) {
    return (
        <>
            <Header isAuthenticated={true} />
            {children}
        </>
    );
}