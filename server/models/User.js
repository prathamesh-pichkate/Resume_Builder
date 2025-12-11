import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compareSync(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
