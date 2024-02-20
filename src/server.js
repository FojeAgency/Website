require('dotenv').config();
const AWS = require('aws-sdk');
const { ObjectId } = require('mongodb');
const { MongoClient } = require("mongodb");
const url = process.env.MONGO_URL;

const client = new MongoClient(url);
const dbName = "database";
const Fuse = require('fuse.js');
const express = require('express');
const sgMail = require('@sendgrid/mail');
const app = express();
const port = 3000;

const path = require('path');

app.use(express.static(path.join(__dirname, 'src/data')));

const upload = require('./s3Upload');

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.json());

const apiKey = process.env.SG_EMAIL_API_KEY;
sgMail.setApiKey(apiKey);


   

app.post('/sendmail', (req, res) => {
    const msg = {
        to: 'jgsantos@live.com.pt',
        from: 'arquivograficodecoimbra@gmail.com', // use your own verified email address here
        replyTo: req.body.email, // set the replyTo field to the visitor's email address
        subject: req.body.assunto,
        text: `${req.body.autorRegisto} escreveu: ${req.body.mensagem}`
    };

    sgMail.send(msg).then(() => {
        res.send(`
            <script>
                alert('Email Enviado com Sucesso');
                window.location.href = '/index.html';
            </script>
        `);
    }).catch((error) => {
        console.error(error);
        res.send('Error sending email');
    });
});


const indexSpec = {
    "titulo": "text",
    "categoria": "text"
};
app.get('/createIndex', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);

        // Create the text index
        await col.createIndex(indexSpec);

        res.send('Text index created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while creating the text index');
    } finally {
        await client.close();
    }
});

var albumBucketName = "arquivograficodecoimbra";
var bucketRegion = "eu-north-1";
var IdentityPoolId = "eu-north-1:0bc4790a-8353-43fb-bea8-a6b2502e9ae8";

AWS.config.update({
    region: bucketRegion,
    credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: IdentityPoolId
    })
});

var s3 = new AWS.S3({
    apiVersion: "2006-03-01",
    params: { Bucket: albumBucketName }
});



const collectionName = "registo";

/* app.post('/submit', upload.single('image'), async (req, res) => {
    const artefactDocument = {
        "titulo": req.body.titulo,
        "autor": req.body.autor,
        "suporte": req.body.suporte,
        "tecnica": req.body.tecnica,
        "material": req.body.material,
        "categoria": req.body.categoria,
        "estado": req.body.estado,
        "data": new Date(req.body.data),
        "estilo": req.body.estilo,
        "geografia": req.body.geografia,
        "location": {
            type: "Point",
            coordinates: [parseFloat(req.body.longitude), parseFloat(req.body.latitude)]
        },
        "nomeAutor": req.body.nomeAutor,
        "email": req.body.email,
        "dataRegisto": new Date(req.body.dataRegisto)
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne({
            ...artefactDocument,
            imageUrl: req.file.location
        });
        console.log(req.body);
        res.send(`<script>alert('Artefacto Submetido com sucesso'); window.location.href='/index.html';</script>`);
    } catch (err) {
        console.error(err); // log the error object to the console
        res.status(500).send(`<script>alert('Houve um erro ao subtmeter a imagem');</script>`);
    } finally {
        await client.close();
    }
}); */

app.post('/submit', upload.fields([{ name: 'image', maxCount: 10 }, { name: 'video', maxCount: 10 }]), async (req, res) => {
    const postDocument = {
        "title": req.body.title,
        "subtitle": req.body.subtitle,
        "description": req.body.description,
        "texts": req.body.texts,
        "tags": req.body.tags,
        "media": [],
    };

    // Add uploaded images to the postDocument
    if (req.files['image'] && req.files['image'].length > 0) {
        req.files['image'].forEach(file => {
            postDocument.media.push({
                url: file.location,
                type: 'image'
            });
        });
    }

    // Add uploaded videos to the postDocument
    if (req.files['video'] && req.files['video'].length > 0) {
        req.files['video'].forEach(file => {
            postDocument.media.push({
                url: file.location,
                type: 'video'
            });
        });
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        await collection.insertOne(postDocument);
        console.log(req.body);
        res.send(`<script>alert('Post submitted successfully'); window.location.href='/index.html';</script>`);
    } catch (err) {
        console.error(err);
        res.status(500).send(`<script>alert('There was an error submitting the post');</script>`);
    } finally {
        await client.close();
    }
});





app.post('/submit2', async (req, res) => {
    try {
        console.log("Connecting to the client...");
        await client.connect();
        console.log("Connected successfully!");
        const db = client.db(dbName);
        const col = db.collection(collectionName);
        const {searchValue, minYear, maxYear } = req.body;
        console.log("Received request body: ", req.body);
        const query = {};
        if (req.body.tecnica && req.body.tecnica.length > 0) {
            query.tecnica = { $in: req.body.tecnica };
        }
        if (req.body.autor && req.body.autor.length > 0) {
            query.autor = { $in: req.body.autor };
        }
        if (req.body.suporte && req.body.suporte.length > 0) {
            query.suporte = { $in: req.body.suporte };
        }
        if (req.body.categoria && req.body.categoria.length > 0) {
            query.categoria = { $in: req.body.categoria };
        }

        if (req.body.estilo && req.body.estilo.length > 0) {
            query.estilo = { $in: req.body.estilo };
        }
        if (req.body.geografia && req.body.geografia.length > 0) {
            query.geografia = { $in: req.body.geografia };
        }
        if (req.body.material && req.body.material.length > 0) {
            query.material = { $in: req.body.material };
        }

        if (req.body.coordinates && req.body.coordinates.length > 0) {
            query.location = {
                $geoWithin: {
                    $geometry: {
                        type: 'Polygon',
                        coordinates: [req.body.coordinates]
                    }
                }
            };
        }

        console.log("Built query: ", query);
        if (minYear && maxYear) {
            query.data = {
                $gte: new Date(minYear, 0, 1),
                $lte: new Date(maxYear + 1, 0, 1)
            };
        }

        
        const cursor = col.find(query);

        let results = [];
        cursor.sort({ data: 1 }); 
        await cursor.forEach(doc => results.push(doc));
        console.log("Query results: ", results);
        if (searchValue && searchValue.length > 0) {
            const fuse = new Fuse(results, {
                keys: ['titulo', 'categoria', 'address'], 
                threshold: 0.3 
            });
            results = fuse.search(searchValue).map(result => result.item);
        }

        res.send(results);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving data from the database');
    } finally {
        console.log("Closing the client...");
        await client.close();
        console.log("Client closed!");
    }
});



app.get('/object/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);

        // Find the document with the specified ID
        const object = await col.findOne({ _id: new ObjectId(req.params.id) });
        console.log('Object data:', object.data);
        console.log('Object data type:', typeof object.data);
        object.data = new Date(object.data);
        res.send(object);
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while retrieving data from the database');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`listening on port ${port} at ${Date.now()}`)
});

app.post('/object/:id/suggest', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);

        // Find the document with the specified ID
        const object = await col.findOne({ _id: new ObjectId(req.params.id) });

        // Update the object with the suggested changes
        await col.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });

        res.send('Suggestion submitted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while submitting the suggestion');
    } finally {
        await client.close();
    }
});

app.delete('/object/:id', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(collectionName);

        // Delete the document with the specified ID
        await col.deleteOne({ _id: new ObjectId(req.params.id) });

        res.send('Object deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred while deleting the object');
    } finally {
        await client.close();
    }
});