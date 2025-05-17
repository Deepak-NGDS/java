// const promisecb = (resolve,reject)=>{
//     const a=10
//     if(a==1){
//         resolve("success")

//     } else {
//         reject("error")
//     }
// }
// const p1= new Promise(promisecb)

// p1.then((result)=>{
//     console.log("success",result)
// }).catch((error)=>{
//     console.log("failed",error)
// })

// const p = new Promise ((resolve ,reject) => {
//     const a=10
//     if(a==1){
//         resolve("success")

//     } else {
//         reject("error")
//     }
// })

// p.then((result)=>{
//     console.log("success",result)
// }).catch((error)=>{
//     console.log("failed",error)
// })

const p2 = new Promise((resolve,reject) =>{
    console.log("promise is pending")

    setTimeout(() => {
        resolve("promise is resolved ")
    }, 1000);
})

try {
    const result = await p2 
    console.log(result)
}
catch(error) {
    console.log("failed",error)
}



const p1 = fetch("")

function delayedResolve(value) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value);
      }, value * 1000); // convert seconds to milliseconds
    });
   }