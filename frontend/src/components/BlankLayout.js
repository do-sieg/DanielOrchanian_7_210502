export default function BlankLayout({ children }) {
    return (
        <div className="container">
            <div className="inner-container">
                {children}
            </div>
        </div>
    );
}