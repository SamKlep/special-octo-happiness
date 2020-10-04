const mongoose = require('mongoose');
const slugify = require('slugify');
const geocoder = require('../utils/geocoder');

const StrainSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],

      trim: true,
      maxlength: [50, 'Name can not be more than 50 characters'],
    },
    slug: String,
    type: {
      type: String,
      required: [true, 'Please add a type'],
      trim: true,
      maxlength: [50, 'Type can not be more than 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description can not be more than 500 characters'],
    },
    thc: {
      type: Number,
    },
    terpenes: {
      type: String,
    },
    effects: {
      type: String,
      required: [true, 'Please add some effects'],
      maxlength: [500, 'Effects can not be more than 500 characters'],
    },

    similar: {
      type: String,
      required: [true, 'Please add a similar type'],
      trim: true,
      maxlength: [50, 'Similar type can not be more than 50 characters'],
    },

    photo: {
      type: String,
      default: 'no-photo.jpg',
    },
    parent: {
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {}
);

// Create bootcamp slug from the name
StrainSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model('Strain', StrainSchema);
