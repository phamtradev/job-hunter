import { callFetchUser } from "@/config/api";
import { useEffect, useState } from "react";

const HomePage = () => {
    const [id, setId] = useState<string>("");
    const [user, setUser] = useState("");

    const handleSearchUser = async () => {
        const res = await callFetchUser(id);
        if (res) setUser(res)
    }

    return (
        <div>
            <br />
            <div>
                homepage:
                <input value={id} onChange={(e) => setId(e.target.value)} />
                <button onClick={() => handleSearchUser()}>Search</button>
            </div>
            <div>
                User data = {JSON.stringify(user)}
            </div>
            <br /> <br /> <br />
        </div>
    )
}

export default HomePage;