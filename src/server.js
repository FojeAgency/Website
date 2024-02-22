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

app.post('/submit', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'media', maxCount: 10 }]), async (req, res) => {
    const postDocument = {
        "cover": [],
        "title": req.body.title,
        "description": req.body.description,
        "date": req.body.date,
        "fields": req.body.fields,
        "keywords": req.body.keywords.split(",").map(keyword => keyword.trim()),
        "context": req.body.context,
        "advised_with": req.body.advised_with,
        "tools": req.body.tools,
        "featured": req.body.featured === 'on', // Convert checkbox value to boolean
        "media": [],
    };

    // Add uploaded files to the postDocument
    if (req.files['cover'] && req.files['cover'].length > 0) {
        const coverFile = req.files['cover'][0];
        let coverFileType = 'unknown';
        if (coverFile.mimetype.startsWith('image')) {
            coverFileType = 'image';
        } else if (coverFile.mimetype.startsWith('video')) {
            coverFileType = 'video';
        }

        postDocument.cover.push({
            url: coverFile.location,
            type: coverFileType
        });
    }

    if (req.files['media'] && req.files['media'].length > 0) {
        req.files['media'].forEach(file => {
            // Determine file type
            let fileType = 'unknown';
            if (file.mimetype.startsWith('image')) {
                fileType = 'image';
            } else if (file.mimetype.startsWith('video')) {
                fileType = 'video';
            }

            postDocument.media.push({
                url: file.location,
                type: fileType
            });
        });
    }

    try {
        // Assuming `client`, `dbName`, and `collectionName` are defined elsewhere
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Insert the postDocument into the collection
        const result = await collection.insertOne(postDocument);

        // Check if insertion was successful
        if (result.insertedCount === 1) {
            console.log(req.body);
            res.send(`<script>alert('Post submitted successfully'); window.location.href='/index.html';</script>`);
        } else {
            throw new Error('Failed to insert post');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send(`<script>alert('There was an error submitting the post');</script>`);
    } finally {
        // Close the database connection
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
        
        const { search, fields, tools } = req.body; // Extracting search, fields, and tools from the request body
        
        console.log("Received request body: ", req.body);
        
        const query = {};
        
        if (fields && fields.length > 0) {
            query.fields = { $in: fields };
        }
        if (tools && tools.length > 0) {
            query.tools = { $in: tools };
        }
        
        // Add other filters as needed
        
        console.log("Built query: ", query);
        
        const cursor = col.find(query);
        
        let results = [];
        cursor.sort({ data: 1 }); 
        await cursor.forEach(doc => results.push(doc));
        console.log("Query results: ", results);
        
        if (search && search.length > 0) {
            // Apply search query if search term is provided
            const fuse = new Fuse(results, {
                keys: ['titulo', 'categoria', 'address'], 
                threshold: 0.3 
            });
            results = fuse.search(search).map(result => result.item);
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