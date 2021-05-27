import Header from "./Header";

export default function GuestLayout({ children }) {
    return (
        <div className="container">
            <Header />
            {children}
        </div>
    );
}