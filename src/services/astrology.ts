import { ZodiacSign, ZodiacSigns } from '../constants/ZodiacData';

// Western tropical zodiac date ranges
export const getSunSign = (dateString: string): ZodiacSign => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();

  let signId = 'aries';

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) {
    signId = 'aries';
  } else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) {
    signId = 'taurus';
  } else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) {
    signId = 'gemini';
  } else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) {
    signId = 'cancer';
  } else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) {
    signId = 'leo';
  } else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) {
    signId = 'virgo';
  } else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) {
    signId = 'libra';
  } else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) {
    signId = 'scorpio';
  } else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) {
    signId = 'sagittarius';
  } else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
    signId = 'capricorn';
  } else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) {
    signId = 'aquarius';
  } else if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) {
    signId = 'pisces';
  }

  return ZodiacSigns.find(s => s.id === signId) || ZodiacSigns[0];
};

// Approximate Moon Sign using a hash/modulo of the birthdate (reproducible for user)
export const getMoonSign = (dateString: string): ZodiacSign => {
  const date = new Date(dateString);
  const timeVal = date.getTime();
  
  if (isNaN(timeVal)) {
    return ZodiacSigns[0]; // Fallback to Aries
  }

  // Use a pseudo-random hash based on time to pick a sign index (0-11)
  const index = Math.abs(Math.sin(timeVal)) * 1000;
  const signIndex = Math.floor(index) % 12;
  
  return ZodiacSigns[signIndex] || ZodiacSigns[0];
};

/**
 * Calculates Rising Sign (Ascendant) using a realistic astronomical approximation.
 * The Rising Sign is the zodiac sign rising on the eastern horizon at birth time.
 * - At sunrise (approx 6:00 AM), the Rising Sign matches the Sun Sign.
 * - Every 2 hours after sunrise, the Rising Sign advances by 1 sign in zodiac order.
 */
export const getRisingSign = (dateString: string, timeString: string): ZodiacSign => {
  const sunSign = getSunSign(dateString);
  const sunSignIndex = ZodiacSigns.findIndex(s => s.id === sunSign.id);

  if (sunSignIndex === -1) {
    return ZodiacSigns[0];
  }

  // Parse birth time (expected format: "HH:MM")
  const parts = timeString ? timeString.split(':') : [];
  const hour = isNaN(parseInt(parts[0], 10)) ? 12 : parseInt(parts[0], 10);
  const minute = isNaN(parseInt(parts[1], 10)) ? 0 : parseInt(parts[1], 10);
  const decimalHour = hour + minute / 60;

  // Assume sunrise is at 6:00 AM
  const sunriseHour = 6.0;
  const hoursSinceSunrise = (decimalHour - sunriseHour + 24) % 24;

  // The ascendant changes signs roughly every 2 hours
  const signShift = Math.floor(hoursSinceSunrise / 2);

  // Shift Sun Sign index by the shift amount to find Rising Sign
  const risingIndex = (sunSignIndex + signShift) % 12;

  return ZodiacSigns[risingIndex] || ZodiacSigns[0];
};

export interface AstrologicalProfile {
  name: string;
  gender: string;
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
}

export const calculateAstrologicalProfile = (
  name: string,
  gender: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string
): AstrologicalProfile => {
  return {
    name,
    gender,
    sunSign: getSunSign(birthDate),
    moonSign: getMoonSign(birthDate),
    risingSign: getRisingSign(birthDate, birthTime),
    birthDate,
    birthTime,
    birthPlace
  };
};
