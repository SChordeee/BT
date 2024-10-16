// client/src/components/CampaignList.js
import React from 'react';
import './CampaignList.css';

const CampaignList = ({ campaigns, donate }) => {
  return (
    <div className="campaign-list">
      <h2>Active Campaigns</h2>
      {campaigns.length > 0 ? (
        campaigns.map((campaign) => (
          <div key={campaign.id} className="campaign-item">
            <h3>Campaign #{campaign.id}</h3>
            <p>Goal: {campaign.goal} ETH</p>
            <p>Raised: {campaign.raised} ETH</p>
            <p>Deadline: {new Date(campaign.deadline * 1000).toLocaleString()}</p>
            <button onClick={() => donate(campaign.id)} className="donate-btn">
              Donate
            </button>
          </div>
        ))
      ) : (
        <p>No active campaigns</p>
      )}
    </div>
  );
};

export default CampaignList;
