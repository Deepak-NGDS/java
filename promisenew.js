function delayPromise(value) {
   return new Promise((resolve,reject) =>
    {
        console.log("pending")
        setTimeout(() => {
            resolve()
        }, value);
    })
} 

// delayPromise(2000).then((result)=>{
//     console.log("resolved",result)
// })
 
const result = await delayPromise(2000)
console.log("resolved",result)
