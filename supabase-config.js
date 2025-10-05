// Supabase Configuration
const SUPABASE_URL = 'https://ipyedxfazrpcvulgxipw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlweWVkeGZhenJwY3Z1bGd4aXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk2ODkwMzcsImV4cCI6MjA3NTI2NTAzN30.VDX8hAc4KUtPhHSBu8xuMIdmo41qUkDWRLwokBkvuKc';

// Initialize Supabase client
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js@2';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Contact form submission function
async function submitContactForm(formData) {
    try {
        const { data, error } = await supabase.functions.invoke('send-contact-email', {
            body: {
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                to: 'adamgambari@outlook.com'
            }
        });

        if (error) {
            console.error('Error sending email:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error submitting form:', error);
        return { success: false, error: error.message };
    }
}

// Export for use in other files
window.supabase = supabase;
window.submitContactForm = submitContactForm;
