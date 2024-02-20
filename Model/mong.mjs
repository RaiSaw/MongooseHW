import { Schema, model } from 'mongoose';

const someotherSchema = new Schema({
  username: {
    required: true,
    type: String,
    unique: true,
  },
  age: {
    required: true,
    type: Number
  },
  email: {
    type: String,
    required: true
  }
  /* password: {
    type: String,
    required: true,
  }, */
})
//middle ware pre post will fire on save like post request
someotherSchema.pre('save', () => console.log('Hello from pre save'));
someotherSchema.post('save', function(doc) {
    console.log('%s has been saved', doc._id);
  });// Compile a model from the schema

export const Sample = model("pony", someotherSchema); // str - collection