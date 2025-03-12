const axios = require('axios');

async function sendSMS(mobile, username, otp) {
	try {
		const apiUrl = `https://api.voicensms.in/SMSAPI/webresources/CreateSMSCampaignGet?ukey=IfbQrsFvMJV51oHPJwbTUOsph&msisdn=${mobile}&language=0&credittype=2&senderid=THDAMC&templateid=0&message=Dear ${username}, Your OTP for registration is ${otp}. The OTP is valid for 10 minutes. Do not share it with anyone. You will never receive any calls during for your OTP, Please be conscious. First Second Third Apple..&filetype=2`;
		// const apiUrl = `http://colourmoontraining.com/otp_sms/sendsms?user_id=invtechnologies&mobile=${mobile}&message=Dear ${username} your one time password (OTP) ${otp} Regards CMTOTP`;
		// Send the HTTP GET request to the SMS service
		const response = await axios.get(apiUrl);

		// Check the response status from the SMS service
		if (response.status === 200) {
			return { success: true, message: 'SMS sent successfully' };
		} else {
			return { success: false, message: 'SMS sending failed' };
		}
	} catch (error) {
		console.error('An error occurred:', error);
		return { success: false, message: 'SMS sending failed' };
	}
}

module.exports = { sendSMS };