const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Contact = require('../models/Contact');

beforeAll(async () => {
    await mongoose.connect('mongodb://localhost:27017/bitespeed_test', { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('POST /identify', () => {
    beforeEach(async () => {
        await Contact.deleteMany({});
    });

    it('should create a new primary contact', async () => {
        const response = await request(app)
            .post('/identify')
            .send({ email: 'test@example.com', phoneNumber: '123456' });

        expect(response.status).toBe(200);
        expect(response.body.contact.primaryContactId).toBeDefined();
        expect(response.body.contact.emails).toContain('test@example.com');
        expect(response.body.contact.phoneNumbers).toContain('123456');
        expect(response.body.contact.secondaryContactIds).toEqual([]);
    });

    
});
