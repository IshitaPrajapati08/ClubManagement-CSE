import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  clubId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  participants: {
    type: [
      {
        id: String,
        name: String,
        email: String
      }
    ],
    default: []
  },
  facultyId: String,
  facultyName: String,
  createdAt: { type: Date, default: Date.now }
});

// expose `id` virtual and strip Mongo internals for API responses
eventSchema.virtual('id').get(function () {
  return this._id?.toString();
});

eventSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  }
});

eventSchema.set('toObject', { virtuals: true });

export default mongoose.model('Event', eventSchema);
