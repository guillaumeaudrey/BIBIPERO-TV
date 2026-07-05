class GameAnalyzer {

    analyze(context = {}) {

        const players = [...(context.players || [])];

        if (players.length === 0) {

            return {
                leader: null,
                last: null,
                closestToFinish: null,
                averagePosition: 0
            };

        }

        players.sort((a, b) => (b.position || 0) - (a.position || 0));

        const leader = players[0];
        const last = players[players.length - 1];

        const averagePosition =
            players.reduce((sum, p) => sum + (p.position || 0), 0) /
            players.length;

        return {

            leader: leader.name,

            leaderPosition: leader.position || 0,

            last: last.name,

            lastPosition: last.position || 0,

            closestToFinish: 30 - (leader.position || 0),

            averagePosition: Math.round(averagePosition)

        };

    }

}

module.exports = {

    GameAnalyzer

};