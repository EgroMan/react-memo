const route = 'https://wedev-api.sky.pro/api/leaderboard'
const achivka = 'https://wedev-api.sky.pro/api/v2/leaderboard'

let achievementsArr;

export function setVariables(userName, time, achieveA, achieveB, hardReg) {
    const achieveUsed = (achieveA === 'a' || achieveB === 'b') ? 1 : 0;
    const hardRegime = (!hardReg) ? 2 : 0;
    achievementsArr = [achieveUsed, hardRegime];
}


export async function postNewLeader(userName, time, achieveA, achieveB, gameHardRegime) {
    const achieveUsed = (achieveA === 'a' || achieveB === 'b') ? 1 : 0;
    const hardRegime = (!gameHardRegime) ? 2 : 0;
    
    try {
        const response = await fetch(achivka, {
            method: "POST",
            body: JSON.stringify({
                name: userName,
                time: Number(time),
                achievements: [achieveUsed, hardRegime],
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to post new leader');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error posting new leader:', error);
        // Можно добавить обработку ошибки здесь, например, можно сгенерировать специальный объект ошибки, вернуть дефолтное значение или выбросить ошибку дальше
        throw error; // перебросить ошибку для дальнейшей обработки
    }
}

export async function getLeaders() {
    try {
        const response = await fetch(achivka, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leaders');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching leaders:', error);
        throw error;
    }
}



