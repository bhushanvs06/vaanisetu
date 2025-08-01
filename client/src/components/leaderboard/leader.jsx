import React from "react";
import "./leader.css"; // CSS styles go here

const Leaderboard = () => {
  const podium = [
    { rank: 2, name: "Alice", color: "#C0C0C0" },   // Silver
    { rank: 1, name: "Bob", color: "#FFD700" },     // Gold
    { rank: 3, name: "Charlie", color: "#CD7F32" }, // Bronze
  ];

  const others = [
    { rank: 4, name: "David" },
    { rank: 5, name: "Eve" },
    { rank: 6, name: "Frank" },
    { rank: 7, name: " Bella"},
    { rank: 8, name: "Tom"},
    // Add more players as needed
  ];

  return (
    <div className="leaderboard-container">
      <h1 className="heading">🏆 Leaderboard 🏆</h1>

      <div className="podium">
        {podium.map((player) => (
          <div
            key={player.rank}
            className={`podium-box rank-${player.rank}`}
            style={{ backgroundColor: player.color }}
          >
            <div className="rank">#{player.rank}</div>
            <div className="name">
              <strong>{player.name}</strong>{" "}
              {player.rank === 1 && "👑"}
              {player.rank === 2 && "🥈"}
              {player.rank === 3 && "🥉"}
            </div>
          </div>
        ))}
      </div>

      <div className="others">
        <h2>🏅 Other Rankings</h2>
        <ul>
          {others.map((player) => (
            <li key={player.rank}>
              <strong>#{player.rank}</strong> — <strong>{player.name}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Leaderboard;