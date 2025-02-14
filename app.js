const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Using EJS for templating



app.get('/', (req, res) => {
    res.render('index'); // Render your HTML form
});

app.post('/', (req, res) => {
    const { name, grade, age, school_branch, known_chapters } = req.body;

    // Generate a unique ID for the submission
    const unique_id = uuidv4();
    
    // Send email
    sendEmail(name, grade, age, school_branch, known_chapters, unique_id);
    
    // Write to file
    writeToFile(name, grade, age, school_branch, known_chapters, unique_id);

    // Redirect to thank you page
    res.redirect('/thank_you');
});

app.get('/thank_you', (req, res) => {
    res.send("شكرا لتقديمكم معنا");
});

function sendEmail(name, grade, age, school_branch, known_chapters, unique_id) {
    const user = "opuzum@gmail.com"; // Hard-coded email
    const password = "your_password_here"; // Hard-coded password

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "opuzum@gmail.com",
            pass: "xnga xkcj ypkk sxou",
        }
    });

    const mailOptions = {
        from: user,
        to: ['adiscord91900130@gmail.com', user], // Send a copy to your own email
        subject: `تقديم جديد في المسابقة ${name}`,
        text: `مرحبا, هناك مشترك جديد في المسابقة\n
        الرقم الفريد: ${unique_id}\n
        الاسم: ${name}\n
        الصف: ${grade}\n
        العمر: ${age}\n
        فرع المدرسة: ${school_branch}\n
        الاجزاء المحفوظة: ${known_chapters}\n
        يرجى التسجيل`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log('Error: ' + error);
        }
        console.log('Email sent: ' + info.response);
    });
}

function writeToFile(name, grade, age, school_branch, known_chapters, unique_id) {
    const entry = `الرقم الفريد:\n${unique_id}\nالاسم: ${name}\nالصف: ${grade}\nالعمر: ${age}\nفرع المدرسة: ${school_branch}\nالاجزاء المحفوظة: ${known_chapters}\n` + '-'.repeat(30) + '\n';
    fs.appendFile('in.txt', entry, 'utf8', (err) => {
        if (err) {
            console.log('Error writing to file', err);
        }
    });
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
