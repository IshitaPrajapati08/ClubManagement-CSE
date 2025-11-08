import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  studentId: { type: String, required: true },
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// expose `id` virtual and tidy JSON
registrationSchema.virtual('id').get(function () {
  return this._id?.toString();
});

registrationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
  }
});

registrationSchema.set('toObject', { virtuals: true });

export default mongoose.model('Registration', registrationSchema);
