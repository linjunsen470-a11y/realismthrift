import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  
  const resend = new Resend(apiKey);
  try {
    const { name, email, whatsapp, country, product, quantity, message } = await request.json();

    const data = await resend.emails.send({
      from: 'RealismThrift <onboarding@resend.dev>', // You should verify your domain in Resend
      to: [process.env.CONTACT_EMAIL || 'sales@realismthrift.com'],
      subject: `New Lead: ${name} from ${country}`,
      html: `
        <h2>New Inquiry from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${whatsapp}</p>
        <p><strong>Country:</strong> ${country}</p>
        <p><strong>Product Interest:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
