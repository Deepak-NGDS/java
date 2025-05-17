function delayPromise(url) {
    return new Promise((resolve,reject) =>
     {
         console.log("pending")

        fetch(url)
        .then((response) => 
        { 
            return response.json()})
        .then((response2)=>{  
            resolve(response2)
        
     }).catch((error)=>{
        reject("fetching error", error)
    })
    })
 } 
 
//  delayPromise("https://jsonplaceholder.typicode.com/todos").then((data)=>{
//      console.log("resolved",data)
//  })
try {
 const result = await delayPromise("https://jsonplaceholder.typicode.com/todos")
 console.log("resolved",result)}
catch(error){
    // console.log(error)
    console.log("resolved",error)
 }
 

 // const values = countries.map(c => [
    // c.id,c.cname,c.created_on, null,c.hcode,c.address,c.contact_num,c.fax_num,c.maps_loc,null        
    // ])