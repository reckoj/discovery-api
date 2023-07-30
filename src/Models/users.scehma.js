const mongoose = require('mongoose');
require('./notes.schema');
require('./organizations.schema');

const userSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    fullname: String,
    phone: Number,
    address: String,
    description: String,
    island: String,
    user_type: String,
    organization: String,
    notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'notes' }],
    attachments: Array,
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

const User = mongoose.model('User', userSchema);
module.exports = { User };
