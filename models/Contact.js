const mongoose = require('mongoose');
const { Schema } = mongoose;

const contactSchema = new Schema({
    phoneNumber: { type: String, required: false },
    email: { type: String, required: false },
    linkedId: { type: mongoose.Schema.Types.ObjectId, ref: 'Contact', required: false },
    linkPrecedence: { type: String, enum: ['primary', 'secondary'], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date, required: false }
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
