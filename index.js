const express = require("express");
const Jimp = require("jimp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const app = express();
const port = 3000;

//middlewares
app.use("/css", express.static(__dirname + "/public/assets/css")); 

//ruta html
app.get("/", (req, res)=>{
    try{
res.sendFile(`${__dirname}/public/main.html`);
    }catch(error){
        res.status(200).send(error.message);
    }
});

//ruta url imagen 
app.get("/image", async (req, res)=>{
    try{
        let urlImagen = req.query.urlImagen;
        
        if(!urlImagen){
            return res.send("<script>alert('Ingresa una URL, por favor'); window.history.back();</script>");
        } 
        res.setHeader("Content-type", "image/png"); 

    const imagen =  await Jimp.read(urlImagen);

    const nombreImagen = uuidv4().slice(0,3) + "-escalaDeGrises.png";

    const rutaImagen = `public/assets/img/${nombreImagen}`;
    await imagen.resize(350, Jimp.AUTO).greyscale().writeAsync(rutaImagen);
    const imagenData = fs.readFileSync(rutaImagen);
    res.send(imagenData);
    }catch(error){
        res.status(200).send(error.message);
    }
});

//servidor
app.listen(port, ()=>{
    console.log("Servidor levantador correctamente")
});