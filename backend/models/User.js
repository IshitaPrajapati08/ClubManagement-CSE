import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'hod'], default: 'student' },
  department: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Add virtual id and clean JSON output (hide password)
userSchema.virtual('id').get(function () {
  return this._id?.toString();
});

userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id?.toString();
    delete ret._id;
    delete ret.password; // never expose password
  }
});

userSchema.set('toObject', { virtuals: true });

export default mongoose.model('User', userSchema);
