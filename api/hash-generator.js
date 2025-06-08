const bcrypt = require('bcryptjs');

const passwordToHash = 'password123'; // Or any password you want

bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(passwordToHash, salt, (err, hash) => {
        if (err) throw err;
        console.log('--- YOUR NEW HASHED PASSWORD ---');
        console.log(hash);
        console.log('--- COPY THE LINE ABOVE ---');
    });
});