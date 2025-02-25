class OTP {
  static otps = {};

  static generateOTP(phone) {
    const otp = +Math.floor(1000 + Math.random() * 9000);
    OTP.otps[phone] = otp.toString();
    return otp;
  }

  static verifyOTP(phone) {
    return OTP.otps[phone];
  }

  static removeOTP(phone) {
    delete OTP.otps[phone];
  }
}

module.exports = OTP;
