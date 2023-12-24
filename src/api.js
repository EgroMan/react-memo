const route = 'https://wedev-api.sky.pro/api/v2/leaderboard'

let achievementsArr;

export function setVariables(userName, time, achieveA, achieveB, hardReg) {
    const achieveUsed = (achieveA === 'a' || achieveB === 'b') ? 1 : 0;
    const hardRegime = (!hardReg) ? 2 : 0;
    achievementsArr = achieveUsed, hardRegime;
}

export async function getLeaders() {
    const response = await fetch(route, {
        method: "GET",
    });
    return await response.json();
}

export async function postNewLeader(userName, time, handleProzrenie, handleAlohomoa, gameHardRegime) {
    setVariables(userName, time, handleProzrenie, handleAlohomoa, gameHardRegime);
    const response = await fetch(route, {
        method: "POST",
        body: JSON.stringify({
            name: userName,
            time: Number(time),
            achievements: achievementsArr,
        }),
    });
    return await response.json();
}