const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const objectId = require("mongodb").ObjectId;
    
const app = express();
const jsonParser = express.json();
  
const mongoClient = new MongoClient("mongodb+srv://polykate:polykate@cluster0.usiiv.mongodb.net/booksdb?retryWrites=true&w=majority");
 
//app.use(express.static(__dirname + "/public"));
 
 
(async () => {
     try {
        await mongoClient.connect();
        app.locals.collection = mongoClient.db("booksdb").collection("books");
        await app.listen("https://poly-kate.github.io/");
        console.log("Сервер ожидает подключения...");
    }catch(err) {
        return console.log(err);
    } 
})();
 
 
app.get("/", async(req, res) => {
         
    const collection = req.app.locals.collection;
    try{
        const books = await collection.find({}).toArray();
        res.send(books);
    }
    catch(err){return console.log(err);}
      
});
app.get("/:id", async(req, res) => {
         
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    try{
        const book = await collection.findOne({_id: id});
        res.send(book);
    }
    catch(err){return console.log(err);}
});
    
app.post("/", jsonParser, async(req, res)=> {
        
    if(!req.body) return res.sendStatus(400);
        
    const bookName = req.body.name;
    const bookAutor = req.body.autor;
    let book = {name: bookName, autor: bookAutor};
        
    const collection = req.app.locals.collection;
     
    try{
        await collection.insertOne(book);
        res.send(book);
    }
    catch(err){return console.log(err);}
});
     
app.delete("/:id", async(req, res)=>{
         
    const id = new objectId(req.params.id);
    const collection = req.app.locals.collection;
    try{
        const result = await collection.findOneAndDelete({_id: id});
        const book = result.value;
        res.send(book);
    }
    catch(err){return console.log(err);}
});
    

  
// прослушиваем прерывание работы программы (ctrl-c)
process.on("SIGINT", async() => {
     
    await mongoClient.close();
    console.log("Приложение завершило работу");
    process.exit();
});

