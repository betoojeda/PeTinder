import { useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import api from "../services/api";
import "../Swipe.css";


export default function Swipe() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        api.get("/pets")
            .then(res => setPets(res.data))
            .catch(err => console.log(err));
    }, []);

    const swiped = (direction, name) => {
        console.log("You swiped: " + name + " to " + direction);
    };

    const outOfFrame = (name) => {
        console.log(name + " left the screen");
    };

    return (
        <div className="swipe-container">
            <h2>Encuentra tu nueva mascota ❤️</h2>

            <div className="card-container">
                {pets.map((p) => (
                    <TinderCard
                        key={p.id}
                        onSwipe={(dir) => swiped(dir, p.name)}
                        onCardLeftScreen={() => outOfFrame(p.name)}
                        preventSwipe={["up", "down"]}
                    >
                        <div
                            className="card"
                            style={{ backgroundImage: `url(${p.imageUrl})` }}
                        >
                            <h3>{p.name}</h3>
                            <p>{p.breed}</p>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    );
}
