const mongoose = require('mongoose');
require('./users.scehma');

const contactSchema = new mongoose.Schema(
  {
    fullname: String,
    address: String,
    description: String,
    email: String,
    phone: Number,
    island: String,
    contact_id: String,
    organization: String,
    is_active: Boolean,
    added_by: String,
    attachments: Array,
  },
  {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

const Contacts = mongoose.model('Contacts', contactSchema);
module.exports = { Contacts };
