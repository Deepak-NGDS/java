// fetch('https://jsonplaceholder.typicode.com/todos')
//   .then(response => response.json())
//   .then(data => {
//     console.log('fetched data', data)
//   })
//   .catch(error => {
//     console.log('error', error)
//   });

  // fetch("https://jsonplaceholder.typicode.com/todos", {
  //   method : "get"
  // })
  // .then(response => response.json())
  // .then(data =>{
  //   console.log("data",data)
  // })
  // .catch(error=>{
  //   console.log("error",error)
  // })


  // async function getData() {
  //   try {
  //     const response = await fetch("https://jsonplaceholder.typicode.com/todos", {method : "get"});
  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  
  // getData();
  

  // const p1 =  fetch("https://jsonplaceholder.typicode.com/todos", {method : "get"});
  // const response = await p1
  // const p2 = response.json()
  // const response2 = await p2
  // console.log(response2)

  const p1 = fetch("https://jsonplaceholder.typicode.com/todos", {method : "get"});
  // p1.then(response=>{response})
  // const p2 = response.json()
  // p2.then(data=>{
  //   console.log("data",data)
  // })
  p1.then((response) =>{
    console.log(response)
   const p2 = response.json()
    p2.then((response2)=>{
      console.log(response2)
    })
  })
  
  const promise2 = new Promise ((resolve,reject) =>
    {
      console.log("promise is pending")
      setTimeout(() => {
        resolve("promise is resolved")
      }, 1000);
    }) 
    promise2.then((response) =>{
      console.log(response)
      console.log(promise2)
    }) 
    // console.log(promise2)


  // async function getData() {
  //   try {
  //     const p1 = fetch("https://jsonplaceholder.typicode.com/todos", {method : "get"});
  //     const response = await p1
  //     console.log(response)
  //     const p2 =  response.json();
  //     const response2 = await p2
  //     console.log(response2);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  
  // getData();