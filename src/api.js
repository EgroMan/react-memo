const route = 'https://wedev-api.sky.pro/api/leaderboard'

export async function getLeaders(){
const response = await fetch(route,   
    {
    method: "GET",
})
const data = await response.json()
return data
}

export async function postNewLeader(userName,time){
    console.log(userName)
    console.log(time)
    const response = await fetch(route,   
        {
        method: "POST",
        body: JSON.stringify({
            name: `${userName}`,
            time: `${time}`,
        }),
    })
    const data = await response.json()
    console.log(data)
    return data
    }