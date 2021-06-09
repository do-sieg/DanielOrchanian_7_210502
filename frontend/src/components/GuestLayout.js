import Header from "./Header";

export default function GuestLayout({ children }) {
    return (
        <div className="container">
            <Header />
            <div className="inner-container">
                {children}
            </div>
        </div>
    );
}