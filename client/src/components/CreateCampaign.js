// client/src/components/CreateCampaign.js
import React, { useState } from 'react';
import './CreateCampaign.css';

const CreateCampaign = ({ createCampaign }) => {
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    createCampaign(goal, duration);
  };

  return (
    <form className="create-campaign" onSubmit={handleSubmit}>
      <h2>Create a New Campaign</h2>
      <label>Goal (ETH)</label>
      <input
        type="number"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Enter goal in ETH"
        required
      />
      <label>Duration (Minutes)</label>
      <input
        type="number"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        placeholder="Enter duration in minutes"
        required
      />
      <button type="submit" className="create-btn">Create Campaign</button>
    </form>
  );
};

export default CreateCampaign;
