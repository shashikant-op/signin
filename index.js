const mysql=require("mysql2");
const {faker}=require("@faker-js/faker");
const express=require("express");
const app=express();
const path = require("path");
const methodoverride=require("method-override");

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended:true}));


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection=mysql.createConnection(
    {
        host:"localhost",
        user:"root",
        database:"app",
        password:"Mysql12"

    }
);
//fake data generator

 generator=()=>{
  return {
id: faker.string.uuid(),
   
  };
}
let id =generator().id;
console.log(id);


let q=`select*from users`;
connection.query(q,(err,result)=>{
    if (err) throw err;
    console.log("sucess");
    
});


//making route
app.get("/",(req,res)=>{
    res.render("home.ejs");
})
app.get("/login",(req,res)=>{
    res.render("signin.ejs");
})

app.patch("/",(req,res)=>{
   let{mail:email,password:password,username:name,id:id}=req.body;
    console.log(id);
    let q=`insert into users values( "${id}","${name}","${email}","${password}")`;
    connection.query(q,(err,result)=>{
        if (err) {
            res.send("something wrong in database: your id is to long");
        }
        res.render("signin.ejs");  
        
    })
})




app.patch("/login/profile",(req,res)=>{
    let{gmail:usermail,userpassword:loginpassword}=req.body;
    let q2=`select*from users where email="${usermail}" `;
   
    connection.query(q2,(err,result)=>{
      
    let user=result[0];
       // cheking password 
       
       let rpassword=result[0].password;
       console.log(rpassword);
       console.log(loginpassword);
                    if(rpassword===loginpassword){
                        res.render("welcome.ejs",{user});
                    }else{
                        res.render("wrongpass.ejs");
                    }
       
        console.log(user);
       
        
  })

 })

 //edit profile route


app.get("/:id",(req,res)=>{
    let {id}=req.params;
console.log(id);
   let sq=`select*from users where id="${id}"`;
   connection.query(sq,(err,result)=>{
    let user=result[0];
    console.log(user);
     res.render("edit.ejs",{user});
   })
 })

app.patch("/:id",(req,res)=>{

  let {id}=req.params;
  let {username:newusername}=req.body;
 let q1=`UPDATE users SET name="${newusername}" where id="${id}"`;
 connection.query(q1,(err,result)=>{
    console.log(result);
    res.render("done.ejs");
 })
    
}) 


app.listen("8080",()=>{
    console.log("app is listening on port 8080");
})