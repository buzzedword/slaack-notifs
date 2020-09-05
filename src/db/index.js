  module.exports = sqlite3 => {
    let db = new sqlite3.Database(":memory:", (err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Connected to the in-memory SQlite database.");
      });
      
      db.serialize(() => {
          db.run("CREATE TABLE activity (channel TEXT, message_recieved TEXT)");
      });
      
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Closed the database connection.");
      });

      return db;
  };