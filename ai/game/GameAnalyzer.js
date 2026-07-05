class GameAnalyzer {
  analyze(context = {}) {
    const players = [...(context.players || [])];
    if (!players.length) return { leader: null, last: null, closestToFinish: null, averagePosition: 0, drinker: null };
    const byPosition = [...players].sort((a,b)=>(b.position||0)-(a.position||0));
    const byDrinks = [...players].sort((a,b)=>(b.totalDrinks||0)-(a.totalDrinks||0));
    const leader = byPosition[0];
    const last = byPosition[byPosition.length - 1];
    const avg = players.reduce((s,p)=>s+(p.position||0),0)/players.length;
    return {
      leader: leader.name,
      leaderPosition: leader.position || 0,
      last: last.name,
      lastPosition: last.position || 0,
      closestToFinish: 30 - (leader.position || 0),
      averagePosition: Math.round(avg),
      drinker: byDrinks[0]?.name || null,
      drinkerCount: byDrinks[0]?.totalDrinks || 0
    };
  }
}
module.exports = { GameAnalyzer };
