import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './styles/welcome.css';
import { useLoggedInUser } from 'src/context/UserContext';
import TicTacToe from './TicTacToe';

const BASE_URL = 'http://localhost:3000';

type UserData = {
  name: string,
  noOfLogins: number,
  gamesPlayed: number;
  createdAt: string;
}

const Welcome: React.FC = () => {
  const { token } = useLoggedInUser();
  const [userData, setUserData] = useState<UserData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setUserData({
          name: response.data.data.name,
          noOfLogins: response.data.data.noOfLogins,
          gamesPlayed: response.data.data.gamesPlayed,
          createdAt: new Date(response.data.data.createdAt).toLocaleDateString('en-GB'),
        });
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  if (loading || !userData) {
    return (
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    );
  }

  const { name, noOfLogins, gamesPlayed, createdAt } = userData;

  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome {noOfLogins > 0 ? 'back' : ''} to the Application {name}!</h1>
        <p className="welcome-message">
          We're glad to have you here. Let's play TicTacToe!
        </p>
        <p className="user-stats">
          Games Played: {gamesPlayed} <br />
          Signed Up On: {createdAt}
        </p>
        <TicTacToe />
      </div>
    </div>
  );
};

export default Welcome;