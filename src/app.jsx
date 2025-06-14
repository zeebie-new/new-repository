import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mood, setMood] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');
  const [reaction, setReaction] = useState(null);
  const [userLocation, setUserLocation] = useState('');

  // Auto-detect location using Geolocation API
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`)
            .then((res) => res.json())
            .then((data) => setUserLocation(data.city || data.locality || 'Unknown location'))
            .catch(() => setUserLocation('Location not found'));
        },
        () => setUserLocation('Location access denied')
      );
    } else {
      setUserLocation('Geolocation not supported');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ mood, location, age, reaction });
    alert(`Thanks for sharing! You feel ${mood}, from ${location || userLocation}, age ${age || 'not specified'}. Reaction: ${reaction || 'none'}`);
    setMood('');
    setLocation('');
    setAge('');
    setReaction(null);
  };

  const reactions = ['Like', 'Love', 'Haha', 'Wow', 'Sad', 'Angry'];

  return (
    <div className="App">
      <h1>How Are You Feeling Today?</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Your Mood:
          <input
            type="text"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
            placeholder="e.g., Happy, Stressed"
            required
          />
        </label>
        <label>
          Your Location (optional, or enter manually):
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={userLocation || 'Enter your city'}
          />
        </label>
        <label>
          Your Age (optional):
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter your age"
            min="0"
          />
        </label>
        <div>
          React to Your Mood:
          {reactions.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setReaction(r)}
              style={{ background: reaction === r ? '#ddd' : 'white' }}
            >
              {r}
            </button>
          ))}
        </div>
        <button type="submit">Submit</button>
      </form>
      {mood && <p>Your current mood: {mood}</p>}
    </div>
  );
}

export default App;
