const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MainCategorySchema = new Schema({
    name: {
        type: String
    },
    view: {
        type: Boolean
    }
}
, 
{
    timestamps:true
})


module.exports = mongoose.model.MainCategory || mongoose.model("MainCategory", MainCategorySchema);