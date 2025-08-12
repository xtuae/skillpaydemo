import CryptoJS from 'crypto-js';

export class SkillPayCrypto {
  private static authKey = process.env.NEXT_PUBLIC_SKILLPAY_AUTH_KEY || '';
  private static iv = this.authKey.substring(0, 16); // First 16 characters as IV

  static encrypt(data: object): string {
    try {
      const jsonString = JSON.stringify(data);
      const key = CryptoJS.enc.Utf8.parse(this.authKey);
      const iv = CryptoJS.enc.Utf8.parse(this.iv);
      
      const encrypted = CryptoJS.AES.encrypt(jsonString, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      return encrypted.toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedData: string): unknown {
    try {
      const key = CryptoJS.enc.Utf8.parse(this.authKey);
      const iv = CryptoJS.enc.Utf8.parse(this.iv);
      
      const decrypted = CryptoJS.AES.decrypt(encryptedData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }
}

// Generate unique customer reference number
export function generateCustRefNum(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8);
  return `${timestamp}${random}`;
}

// Format date for SkillPay API
export function formatPaymentDate(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
