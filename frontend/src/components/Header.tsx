import "../../css/Layout.css";

function Header() {

  const user = JSON.parse(
    localStorage.getItem("user") ?? "{}"
  );

  const nombre =
    user?.nombre ||
    user?.name ||
    user?.username ||
    user?.fullName ||
    "Administrador";

  return (
    <header className="header">

      <div className="header-right">

        <div className="notification">
          🔔
        </div>

        <div className="user-info">

          <div className="avatar">
            {nombre.charAt(0).toUpperCase()}
          </div>

          <span>
            {nombre}
          </span>

        </div>

      </div>

    </header>
  );
}

export default Header;