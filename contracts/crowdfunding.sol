//SPDX License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding {

    struct Campaign {
        address payable creator;
        uint goal;
        uint raisedAmount;
        uint deadline;
        bool completed;
    }

    mapping(uint => Campaign) public campaigns;
    uint public campaignCount = 0;
    mapping(uint => mapping(address => uint)) public contributions;

    // Events
    event CampaignCreated(uint campaignId, address creator, uint goal, uint deadline);
    event DonationReceived(uint campaignId, address donor, uint amount);
    event GoalReached(uint campaignId);
    event RefundIssued(uint campaignId, address contributor, uint amount);

    // Create a new crowdfunding campaign
    function createCampaign(uint _goal, uint _durationInMinutes) public {
    require(_goal > 0, "Goal must be greater than 0");
    require(_durationInMinutes > 0, "Duration must be greater than 0");

    campaignCount++;
    uint deadline = block.timestamp + (_durationInMinutes * 1 minutes);

    campaigns[campaignCount] = Campaign(
        payable(msg.sender),
        _goal,
        0,
        deadline,
        false
    );

    emit CampaignCreated(campaignCount, msg.sender, _goal, deadline);
}


    // Donate to a campaign
    function donate(uint _campaignId) public payable {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp < campaign.deadline, "Campaign has ended");
        require(!campaign.completed, "Campaign is already completed");
        require(msg.value > 0, "Donation must be greater than 0");

        campaign.raisedAmount += msg.value;
        contributions[_campaignId][msg.sender] += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value);

        if (campaign.raisedAmount >= campaign.goal) {
            campaign.completed = true;
            campaign.creator.transfer(campaign.raisedAmount);

            emit GoalReached(_campaignId);
        }
    }

    // Request refund if campaign failed
    function refund(uint _campaignId) public {
        Campaign storage campaign = campaigns[_campaignId];
        require(block.timestamp >= campaign.deadline, "Campaign is still running");
        require(!campaign.completed, "Campaign goal was reached");

        uint contributedAmount = contributions[_campaignId][msg.sender];
        require(contributedAmount > 0, "No contributions from this address");

        contributions[_campaignId][msg.sender] = 0;
        payable(msg.sender).transfer(contributedAmount);

        emit RefundIssued(_campaignId, msg.sender, contributedAmount);
    }
}
