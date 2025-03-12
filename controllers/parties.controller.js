const connectToDatabase = require("../misc/db");
const { Op } = require("sequelize");
const fs = require("fs").promises;
const sequelize = require("sequelize");


// Get all parties
const getAllParties = async (req, res) => {
    try {
        const { Parties, States } = await connectToDatabase();
        const parties = await Parties.findAll({
            include: [{
                model: States,
                attributes: ['name'],
                as: 'state'
            }],
            raw: true,
            nest: true
        });

        // Transform the response
        const formattedParties = parties.map(party => ({
            id: party.id,
            name: party.name,
            abbreviation: party.abbreviation,
            logo: party.logo,
            state_id: party.state_id,
            state_name: party.state?.name,
            created_at: new Date(party.created_at).toISOString().split('T')[0],
            updated_at: party.updated_at ? new Date(party.updated_at).toISOString().split('T')[0] : null
        }));

        res.status(200).json({ 
            message: "Parties fetched successfully", 
            parties: formattedParties 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// Create new party
const createParty = async (req, res) => {
    try {
        const { name, abbreviation, state_id } = req.body;

        // Validate required fields
        if (!name || !abbreviation || !state_id) {
            // If file was uploaded, delete it
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            return res.status(400).json({ 
                message: "Name, abbreviation, and state_id are required fields" 
            });
        }

        const { Parties, States } = await connectToDatabase();

        // Check if state exists
        const state = await States.findByPk(state_id);
        if (!state) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            return res.status(404).json({ message: "State not found" });
        }

        // Check if party name or abbreviation already exists
        const existingParty = await Parties.findOne({
            where: {
                [Op.and]: [
                    { name: name },
                    { abbreviation: abbreviation },
                    { state_id: state_id}
                ]
            }
        });

        if (existingParty) {
            if (req.file) {
                await fs.unlink(req.file.path).catch(console.error);
            }
            return res.status(400).json({ 
                message: "Party is already exists in this state" 
            });
        }

        let logoBase64 = null;
        if (req.file) {
            // Read the file and convert to base64
            const fileData = await fs.readFile(req.file.path);
            logoBase64 = `data:${req.file.mimetype};base64,${fileData.toString("base64")}`;

            // Delete the uploaded file after conversion
            await fs.unlink(req.file.path).catch(console.error);
        }

        // Create new party
        const newParty = await Parties.create({
            name,
            abbreviation,
            logo: logoBase64,
            state_id,
            created_at: new Date(),
            updated_at: new Date()
        });

        // Format the response
        const formattedParty = {
            id: newParty.id,
            name: newParty.name,
            abbreviation: newParty.abbreviation,
            logo: newParty.logo,
            state_id: newParty.state_id,
            created_at: new Date(newParty.created_at).toISOString().split('T')[0],
            updated_at: new Date(newParty.updated_at).toISOString().split('T')[0]
        };

        res.status(201).json({
            message: "Party created successfully",
            party: formattedParty
        });
    } catch (error) {
        // Clean up uploaded file if there's an error
        if (req.file) {
            await fs.unlink(req.file.path).catch(console.error);
        }
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};

const getPartyWiseVotingCount = async (req, res) => {
    try {
        const { Parties, Voters, States, Polls, PollParties } = await connectToDatabase();

        // Find active polls
        const currentDate = new Date();
        const activePolls = await Polls.findAll({
            where: {
                start_date: { [Op.lte]: currentDate },
                end_date: { [Op.gte]: currentDate }
            }
        });

        if (!activePolls.length) {
            return res.status(404).json({
                message: "No active polls found"
            });
        }
        
        // Get parties participated in active polls
        const votingStats = await Parties.findAll({
            attributes: [
                'id',
                'name',
                'logo',
                'state_id',
                [sequelize.fn('COUNT', sequelize.col('voters.id')), 'votes']
            ],
            include: [
                {
                    model: Voters,
                    attributes: [],
                    as: 'voters',
                    required: false
                },
                {
                    model: States,
                    attributes: ['name'],
                    as: 'state',
                    required: true
                },
                {
                    model: Polls,
                    as: 'polls',
                    attributes: [],
                    through: {
                        model: PollParties,
                        as: 'poll_parties',
                        attributes: [],
                        where: {
                            poll_id: { [Op.in]: activePolls.map(poll => poll.id) }
                        }
                    },
                    where: {
                        id: { [Op.in]: activePolls.map(poll => poll.id) }
                    }
                }
            ],
            group: ['parties.id', 'parties.name', 'parties.logo', 'parties.state_id', 'state.id', 'state.name'],
            raw: true,
            nest: true
        });

        // Get total number of voters eligible for this poll
        const totalVotersCount = await Voters.count({
            where: {
                state_id: { [Op.in]: activePolls.map(poll => poll.state_id) }
            }
        });

        // Calculate total votes cast
        const totalVotesCast = votingStats.reduce((sum, party) => sum + parseInt(party.votes || 0), 0);

        // Calculate percentages and format response
        const formattedStats = votingStats.map(party => ({
            id: party.id,
            name: party.name,
            logo: party.logo,
            state_id: party.state_id,
            state_name: party.state.name,
            votes: parseInt(party.votes || 0),
            percentage: totalVotesCast ? ((parseInt(party.votes || 0) / totalVotesCast) * 100).toFixed(2) : "0.00"
        }));

        // Sort by votes in descending order
        formattedStats.sort((a, b) => b.votes - a.votes);

        res.status(200).json({
            message: "Party-wise voting statistics fetched successfully",
            totalVoters: totalVotersCount,
            totalVotesCast,
            votingPercentage: totalVotersCount ? ((totalVotesCast / totalVotersCount) * 100).toFixed(2) : "0.00",
            statistics: formattedStats
        });

    } catch (error) {
        console.error('Error in getPartyWiseVotingCount:', error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    getAllParties,
    createParty,
    getPartyWiseVotingCount
};


