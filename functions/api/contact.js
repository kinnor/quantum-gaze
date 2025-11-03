/**
 * Cloudflare Pages Function for Contact Form
 * Handles form submission and sends email using Cloudflare Email Workers
 */

export async function onRequestPost(context) {
    try {
        // Parse the incoming form data
        const formData = await context.request.json();

        // Validate required fields
        const { firstName, lastName, email, message } = formData;

        if (!firstName || !lastName || !email || !message) {
            return new Response(JSON.stringify({
                success: false,
                error: 'All fields are required'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(JSON.stringify({
                success: false,
                error: 'Invalid email format'
            }), {
                status: 400,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // Prepare email content
        const emailContent = {
            from: {
                email: 'noreply@quantum-gaze.ca',
                name: 'Quantum Gaze Website'
            },
            to: [
                {
                    email: 'service@quantum-gaze.com',
                    name: 'Quantum Gaze Service'
                }
            ],
            subject: `New Contact Form Submission from ${firstName} ${lastName}`,
            html: `
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #147dbf 0%, #10b8ce 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
                        .content { background: #f8f9fa; padding: 20px; border: 1px solid #e0e0e0; }
                        .field { margin-bottom: 15px; }
                        .label { font-weight: bold; color: #147dbf; }
                        .value { margin-top: 5px; padding: 10px; background: white; border-radius: 3px; }
                        .footer { background: #212121; color: white; padding: 15px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>New Contact Form Submission</h2>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">Name:</div>
                                <div class="value">${firstName} ${lastName}</div>
                            </div>
                            <div class="field">
                                <div class="label">Email:</div>
                                <div class="value"><a href="mailto:${email}">${email}</a></div>
                            </div>
                            <div class="field">
                                <div class="label">Message:</div>
                                <div class="value">${message.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>This email was sent from the Quantum Gaze website contact form</p>
                            <p>© 2024 Quantum Gaze Software Inc.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
New Contact Form Submission

Name: ${firstName} ${lastName}
Email: ${email}

Message:
${message}

---
This email was sent from the Quantum Gaze website contact form
© 2024 Quantum Gaze Software Inc.
            `
        };

        // Send email using Cloudflare Email Workers API
        // Note: This requires MailChannels integration or Cloudflare Email Routing
        const emailResponse = await fetch('https://api.mailchannels.net/tx/v1/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: emailContent.to,
                        dkim_domain: 'quantum-gaze.ca',
                        dkim_selector: 'mailchannels',
                        dkim_private_key: context.env.DKIM_PRIVATE_KEY || ''
                    }
                ],
                from: emailContent.from,
                subject: emailContent.subject,
                content: [
                    {
                        type: 'text/html',
                        value: emailContent.html
                    },
                    {
                        type: 'text/plain',
                        value: emailContent.text
                    }
                ]
            })
        });

        if (!emailResponse.ok) {
            throw new Error(`Email API error: ${emailResponse.status} ${emailResponse.statusText}`);
        }

        // Return success response
        return new Response(JSON.stringify({
            success: true,
            message: 'Email sent successfully'
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });

    } catch (error) {
        console.error('Contact form error:', error);

        return new Response(JSON.stringify({
            success: false,
            error: 'Failed to send email. Please try again later.',
            details: error.message
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// Handle CORS preflight requests
export async function onRequestOptions() {
    return new Response(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}
