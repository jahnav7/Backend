const mongoose = require('mongoose');
const mongoURI='mongodb+srv://goFood:ShieldIndia@cluster0.r6mkkm9.mongodb.net/goFoodmern?retryWrites=true&w=majority'
const mongoDB = async () => {
    try {
      await mongoose.connect(mongoURI);
      console.log('Connected!');
      let fetched_data = mongoose.connection.db.collection("food_items");
      let data=await fetched_data.find({}).toArray() 
      global.food_items=data;
      let foodCategory = mongoose.connection.db.collection("foodCategory");
      let CatData=await foodCategory.find({}).toArray()
      global.foodCategory = CatData;
    } catch (error) {
      console.log('err: ', error);
    }
  };
module.exports=mongoDB;
