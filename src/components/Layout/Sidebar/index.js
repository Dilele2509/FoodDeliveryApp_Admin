import Header from "../components/Header";
import SidebarComponent from "../components/SidebarComponent";
import Footer from "../components/Footer";

function Sidebar({ children }) {
    return (
        <div>
            <Header />
            <div className="body-container">
                <SidebarComponent />
                <div className="content">{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default Sidebar;
