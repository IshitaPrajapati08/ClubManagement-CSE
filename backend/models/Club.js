import mongoose from 'mongoose';

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  facultyId: { type: String },
  facultyName: { type: String },
  department: { type: String },
  activities: { type: [String], default: [] },
  members: {
    type: [
      {
        id: String,
        name: String,
        email: String
      }
    ],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

// expose `id` virtual and strip Mongo internals for API responses
clubSchema.virtual('id').get(function () {
  return this._id?.toString();
});

clubSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  }
});

clubSchema.set('toObject', { virtuals: true });

export default mongoose.model('Club', clubSchema);
