const express=require("express");

const server=express();



server.use("/hello",(req,res)=>{
    res.send("hello from server");
});

server.use((req,res)=>{
    res.send("Default response");
});


server.listen(3333,()=>{
    console.log("server is up and running....");
});