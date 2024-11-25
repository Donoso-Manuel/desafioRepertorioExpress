import express, { json } from "express";
import fs from "fs";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const app = express();

app.use(express.json());
app.use(cors());

app.listen(5000, () => {
    console.log("Servidor Activo");
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "index.html"));
});

const validarCancion = (cancion) => {
    return cancion.id && cancion.titulo && cancion.artista && cancion.tono;
};

const inicializarArchivo = () => {
    if (!fs.existsSync("repertorio.json")) {
        fs.writeFileSync("repertorio.json", JSON.stringify([]));
        console.log("Archivo repertorio.json creado");
    }
};

app.post("/canciones", (req, res) => {
    console.log("estoy aqui")
    const cancion = req.body;
    if (!validarCancion(cancion)) {
        return res.status(400).json({ msg: "Faltan datos en la canción" });
    }
    inicializarArchivo();
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "UTF-8"));
    canciones.push(cancion);
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
    res.json({msg:"Cancion Ingresada"})
});

app.get("/canciones", (req, res) => {
    inicializarArchivo();
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "UTF-8"));
    res.json(canciones);
});

app.put("/canciones/:id", (req, res) => {
    const id = req.params.id;
    const cancion = req.body;
    if (!validarCancion(cancion)) {
        return res.status(400).json({ msg: "Faltan datos en la canción" });
    }
    inicializarArchivo();
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "UTF-8"));
    const index = canciones.findIndex(c => c.id == id);
    if (index === -1) {
        return res.status(404).json({ msg: "cancion no existe" })
    }
    canciones[index] = cancion;
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
    res.json({msg: "Cancion actualizada"})
});

app.delete("/canciones/:id", (req, res) => {
    const id = req.params.id;
    const canciones = JSON.parse(fs.readFileSync("repertorio.json", "UTF-8"));
    const index = canciones.findIndex(c => c.id == id);

    if (index === -1) {
        return res.status(404).json({ msg: "cancion no existe" })
    }
    canciones.splice(index, 1);
    fs.writeFileSync("repertorio.json", JSON.stringify(canciones));
    res.json({msg: "Cancion Eliminada"});
});