import mongoose from 'mongoose';

const joinRequestSchema = new mongoose.Schema({
  clubId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date }
});

// expose `id` virtual and tidy JSON
joinRequestSchema.virtual('id').get(function () {
  return this._id?.toString();
});

joinRequestSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  }
});

joinRequestSchema.set('toObject', { virtuals: true });

export default mongoose.model('JoinRequest', joinRequestSchema);
