export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, subject, message } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Using Resend API
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer re_QTYRqSPt_B91LzXsdWEWMDgviKyw5rJWb',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: 'Portfolio Contact Form <onboarding@resend.dev>',
                to: ['adamgambari@outlook.com'],
                subject: `Portfolio Contact: ${subject}`,
                text: `
New contact form submission from your portfolio:

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This message was sent from your portfolio contact form.
You can reply directly to this email to respond to ${name}.
                `.trim(),
                reply_to: email,
            })
        });

        if (response.ok) {
            const data = await response.json();
            return res.status(200).json({ 
                success: true, 
                message: 'Email sent successfully',
                data 
            });
        } else {
            const errorData = await response.text();
            console.error('Resend API error:', errorData);
            return res.status(500).json({ 
                error: 'Failed to send email',
                details: errorData 
            });
        }

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({ 
            error: 'Internal server error',
            details: error.message 
        });
    }
}
