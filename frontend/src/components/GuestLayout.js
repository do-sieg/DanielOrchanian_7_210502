import Header from "./Header";

export default function GuestLayout({ children }) {
    return (
        <>
            <Header />
            {children}
        </>
    );
}