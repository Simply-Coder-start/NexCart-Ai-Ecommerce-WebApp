const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
      index: true,
    },
    google_id: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    password_hash: {
      type: String,
      minlength: 20,
      select: false,
    },
    profile_image: {
      type: String,
      default: '',
    },
    addresses: [{
      id: { type: String, required: true },
      street: String,
      city: String,
      state: String,
      zipCode: String,
      isDefault: { type: Boolean, default: false }
    }],
    created_at: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
  }
);

UserSchema.set('toJSON', {
  transform: function (_doc, ret) {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.password_hash;
    return ret;
  },
});

module.exports = mongoose.model('User', UserSchema);
