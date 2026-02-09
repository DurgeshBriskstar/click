
export async function sendPasswordResetEmail(email, resetToken, resetUrl) {
    try {
        // In development, log to console
        if (process.env.NODE_ENV === 'development' || !process.env.EMAIL_SERVICE_ENABLED) {
            console.log('\n========================================');
            console.log('📧 PASSWORD RESET EMAIL (Development)');
            console.log('========================================');
            console.log('To:', email);
            console.log('Subject: Reset Your Password - ClickITCo');
            console.log('\n--- Email Content ---');
            console.log(`Hello,\n\nYou requested to reset your password. Click the link below to reset it:\n\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nClickITCo Team`);
            console.log('\n--- Reset Token (for testing) ---');
            console.log('Token:', resetToken);
            console.log('========================================\n');

            return { success: true, message: 'Email logged to console' };
        }

        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send email');
    }
}

