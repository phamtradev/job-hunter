import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div style={{ margin: "50px 20px" }}>
            <h3>
                <Link to={"/admin"}>Go to Admin</Link>
            </h3>
        </div>
    )
}

export default HomePage;