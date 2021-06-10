import Header from "./Header";

// Layout du site (invité)
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