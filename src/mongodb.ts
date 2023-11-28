// MongoDb
// Exercice: MongoDb request (3 points)

// MongoDb collection users with schema
/* 
 {
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
    last_connection_date: Date;
  }
*/

// Complete the query, you have a variable that contains a piece of text to search for. Search by exact email, starts with first or last name and only users logged in for 6 months

const searchText = "example";

const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

db.users.find({
  $or: [
    { email: searchText },
    { first_name: { $regex: `^${searchText}`, $options: "i" } },
    { last_name: { $regex: `^${searchText}`, $options: "i" } }
  ],
  last_connection_date: { $gte: sixMonthsAgo }
});

// What should be added to the collection so that the query is not slow?

db.users.createIndex({ email: 1 });
db.users.createIndex({ first_name: 1 });
db.users.createIndex({ last_name: 1 });
db.users.createIndex({ last_connection_date: 1 });


// Exercice: MongoDb aggregate (5 points)
// Complete the aggregation so that it sends user emails by role ({_id: 'role', users: [email,...]})

db.users.aggregate([
    {
      $group: {
        _id: "$roles",
        users: { $push: "$email" }
      }
    },
    {
      $project: {
        _id: 0,
        role: "$_id",
        users: 1
      }
    }
  ]);

// Exercice: MongoDb update (5 points)
// MongoDb collection users with schema
/*
  {
    email: string;
    first_name: string;
    last_name: string;
    roles: string[];
    last_connection_date: Date;
    addresses: {
        zip: number;
        city: string;
    }[]:
  }
*/

// Update document ObjectId("5cd96d3ed5d3e20029627d4a"), modify only last_connection_date with current date

db.users.updateOne(
    { _id: ObjectId("5cd96d3ed5d3e20029627d4a") },
    { $set: { last_connection_date: new Date() } }
  );

// Update document ObjectId("5cd96d3ed5d3e20029627d4a"), add a role admin

db.users.updateOne(
    { _id: ObjectId("5cd96d3ed5d3e20029627d4a") },
    { $addToSet: { roles: "admin" } }
  );

// Update document ObjectId("5cd96d3ed5d3e20029627d4a"), modify addresses with zip 75001 and replace city with Paris 1

db.users.updateOne(
    { _id: ObjectId("5cd96d3ed5d3e20029627d4a"), "addresses.zip": 75001 },
    { $set: { "addresses.$.city": "Paris 1" } }
  );