import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twittercluster.gcdy5sd.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri)

class DatabaseServices {
  private client: MongoClient

  constructor() {
    this.client = new MongoClient(uri)
  }

  async connect() {
    try {
      await this.client.db('admin').command({ ping: 1 })
      console.log('Connected successfully to server')
    } catch (err) {
      console.dir(err)
    } finally {
      await this.client.close()
    }
  }
}

const databaseServices = new DatabaseServices()

export default databaseServices
