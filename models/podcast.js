// Define a schema for podcasts that includes fields such as name, description, category, type (audio/video), speaker, and file upload (audio or video podcast).

import mongoose from 'mongoose';
import validator from 'validator';

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please Enter Name'],
    },
    description: {
      type: String,
      required: [true, 'Please Enter Description'],
    },
    category: {
      type: String,
      required: [true, 'Please Enter Category'],
    },
    type: {
      type: String,
      enum: ['audio', 'video'],
      default: 'audio',
    },
    speaker: {
      type: String,
      required: [true, 'Please Enter Speaker'],
    },
    file: {
      public_id: String,
      url: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Podcast = mongoose.model('Podcast', schema);
