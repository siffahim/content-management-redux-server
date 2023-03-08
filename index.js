require("dotenv").config()
const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors")
const { MongoClient, ObjectId } = require("mongodb")


//middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lyhqa.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri)

const run = async () => {
    try {
        await client.connect()

        const database = client.db('content-management')
        const contentCollection = database.collection('contents')

        app.get('/contents', async (req, res) => {
            const cursor = contentCollection.find({})
            const content = await cursor.toArray()
            res.send(content)
        })

        app.get('/contents/:id', async (req, res) => {
            const id = req.params.id;
            const result = await contentCollection.findOne({ _id: ObjectId(id) })
            res.send(result)
        })

        app.post('/contents', async (req, res) => {
            const doc = req.body
            const result = await contentCollection.insertOne(doc)
            res.send(result)
        })

        app.delete('/contents/:id', async (req, res) => {
            const id = req.params.id;
            const result = await contentCollection.deleteOne({ _id: ObjectId(id) })

            res.send(result)
        })

    }
    finally {
        //await client.close()
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send("Doc Community")
})

app.listen(PORT, () => {
    console.log(`Doc community app listening on port ${PORT}`)
})