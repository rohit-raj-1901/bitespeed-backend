require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const Contact = require('./models/Contact');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/identify', async (req, res) => {
    const { email, phoneNumber } = req.body;
    try {
        const primaryContact = await findOrCreateContact(email, phoneNumber);
        const consolidatedContact = await consolidateContact(primaryContact);
        res.json({ contact: consolidatedContact });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const findOrCreateContact = async (email, phoneNumber) => {
    let existingContacts = [];
    if (email) {
        existingContacts = await Contact.find({ email });
    }

    if (!existingContacts.length && phoneNumber) {
        existingContacts = await Contact.find({ phoneNumber });
    }

    let primaryContact = existingContacts.find(contact => contact.linkPrecedence === 'primary');

    if (!primaryContact) {
        primaryContact = await Contact.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary',
        });
    } else {
        let secondaryContact = existingContacts.find(contact =>
            (contact.email === email && contact.phoneNumber === phoneNumber) ||
            (contact.email === email && !contact.phoneNumber) ||
            (!contact.email && contact.phoneNumber === phoneNumber)
        );

        if (!secondaryContact) {
            secondaryContact = await Contact.create({
                email,
                phoneNumber,
                linkedId: primaryContact._id,
                linkPrecedence: 'secondary',
            });
        }
    }

    return primaryContact;
};

const consolidateContact = async (primaryContact) => {
    const contacts = await Contact.find({
        $or: [{ email: primaryContact.email }, { phoneNumber: primaryContact.phoneNumber }],
        deletedAt: null,
    });

    const emails = new Set();
    const phoneNumbers = new Set();
    const secondaryContactIds = [];

    contacts.forEach(contact => {
        if (contact._id.toString() !== primaryContact._id.toString()) {
            secondaryContactIds.push(contact._id);
            if (contact.email) emails.add(contact.email);
            if (contact.phoneNumber) phoneNumbers.add(contact.phoneNumber);
        }
    });

    return {
        primaryContactId: primaryContact._id,
        emails: [primaryContact.email, ...emails],
        phoneNumbers: [primaryContact.phoneNumber, ...phoneNumbers],
        secondaryContactIds,
    };
};

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
