import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

interface Props {
  children: any;
}


function Layout({ children }: Props) {

  return (
    <div className="layout">

      <Sidebar />

      <div className="main-content">

        <Header />

        <div className="page-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default Layout;