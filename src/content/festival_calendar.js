import fs from 'fs';
import path from 'path';
import { logger } from '../utils/logger.js';

// Calendar mapping of major Indian occasions (covering 2025, 2026, 2027, 2028)
export const FESTIVAL_DATES = {
  // --- 2026 ---
  '2026-01-01': {
    name: 'New Year (Fresh Beginnings)',
    slot2: {
      title: 'Surya Dev Blessings 🌅 Divine Light for a Fresh Start | Daily Darshan',
      hindi: 'नए साल के इस पावन प्रभात पर भगवान सूर्य देव की दिव्य किरणों से अपने जीवन को आलोकित करें। प्रभु का आशीर्वाद आपके जीवन में सुख, स्वास्थ्य और असीम शांति लाए। ॐ सूर्याय नमः!',
      english: 'On this auspicious dawn, illuminate your life with the divine grace of Surya Dev. May peace and joy fill your year ahead.',
    },
    slot4: {
      title: 'Bhagavad Gita Wisdom For A Fresh Start 🕉️ Overcoming Fear & Doubts',
      epic: 'Bhagavad Gita (Chapter 2)',
      dialogue: 'Lord Krishna on Rebirth of Mind & Releasing Regrets',
      shlokSanskrit: 'नैनं छिन्दन्ति शस्त्राणि नैनं दहति पावकः। न चैनं क्लेदयन्त्यापो न शोषयति मारुतः॥',
      shlokEnglish: 'Weapons cannot cut the soul, fire cannot burn it, water cannot wet it, nor can wind wither it.',
      hindi: 'नए वर्ष के अवसर पर भगवान श्री कृष्ण हमें सिखाते हैं कि बीती बातों का शोक छोड़कर नए उत्साह के साथ अपने कर्म पथ पर अग्रसर हों। आत्मा अजर-अमर है, इसलिए किसी भी संकट से कभी भयभीत न हों।',
      english: 'Lord Krishna teaches that releasing past regrets and embracing duty with a fresh spirit is the true essence of living. The soul is immortal; fear nothing.',
      moral: 'Release past regrets, master your mind, and step forward with fearless resolve.',
    },
  },
  '2026-01-14': {
    name: 'Makar Sankranti & Pongal',
    slot2: {
      title: 'Makar Sankranti Blessings ☀️ Surya Dev Sacred Transition',
      hindi: 'मकर संक्रांति के पावन पर्व पर भगवान भास्कर आपके जीवन में नई ऊर्जा, सकारात्मकता और संपन्नता भर दें। ॐ आदित्याय नमः!',
      english: 'On Makar Sankranti, may Lord Surya bless your household with radiant energy, health, and prosperity.',
    },
    slot4: {
      title: 'Bhishma Pitamah & The Sun Uttarayan 🏹 Mahabharata Sacred Wisdom',
      epic: 'Mahabharata (Anushasana Parva)',
      dialogue: 'Pitamah Bhishma Awaiting Uttarayan on the Bed of Arrows',
      shlokSanskrit: 'उदगयनं गते सूर्ये त्यक्ष्यामि प्राणमात्मनः।',
      shlokEnglish: 'When the holy Sun enters the northern course, I shall release my mortal breath.',
      hindi: 'पितामह भीष्म ने सूर्य के उत्तरायण होने तक शरशय्या पर रहकर अपने प्राणों को साधे रखा। यह प्रसंग हमें असीम आत्मबल और संकल्प की शक्ति सिखाता है।',
      english: 'Grandfather Bhishma held his vital breath on the bed of arrows until the sacred northern transition of the Sun, exemplifying unmatched willpower and patience.',
      moral: 'Mastery over the mind and senses is the ultimate spiritual victory.',
    },
  },
  '2026-02-15': {
    name: 'Maha Shivratri',
    slot2: {
      title: 'Maha Shivratri Special 🔱 Har Har Mahadev | Sacred Darshan',
      hindi: 'महाशिवरात्रि के परम पावन अवसर पर देवाधिदेव महादेव और माता पार्वती की कृपा आप पर सदा बनी रहे। ॐ नमः शिवाय!',
      english: 'On the sacred night of Maha Shivratri, may the supreme grace of Mahadev and Mata Parvati bring peace and bliss.',
    },
    slot4: {
      title: 'Neelkanth Mahadev: The Supreme Cosmic Sacrifice 🔱 Samudra Manthan',
      epic: 'Shiva Purana / Mahabharata',
      dialogue: 'Lord Shiva Consuming the Halahala Poison for the Universe',
      shlokSanskrit: 'कर्पूरगौरं करुणावतारं संसारसारम् भुजगेन्द्रहारम्। सदावसन्तं हृदयारविन्दे भवं भवानीसहितं नमामि॥',
      shlokEnglish: 'I bow to Lord Shiva, the embodiment of compassion, who holds the universe in his grace.',
      hindi: 'जब समुद्र मंथन से भयंकर कालकूट विष निकला, तो समस्त संसार की रक्षा के लिए भगवान शिव ने उसे अपने कंठ में धारण कर लिया। निस्वार्थ सेवा ही सच्चा धर्म है।',
      english: 'When deadly poison threatened all cosmic existence, Mahadev selflessly held it in his throat to preserve creation. Selfless protection is the highest virtue.',
      moral: 'True strength lies in enduring hardships selflessly for the protection of others.',
    },
  },
  '2026-03-04': {
    name: 'Holi (Holika Dahan & Festival of Colors)',
    slot2: {
      title: 'Holi Mahotsav 🌸 Bhakta Prahlad & Lord Narasimha Protection',
      hindi: 'होली के इस पावन उत्सव पर अधर्म पर धर्म की और अहंकार पर सच्ची भक्ति की विजय का स्मरण करें। जय श्री नरसिंह भगवान!',
      english: 'Celebrate the holy festival of Holi, remembering the divine triumph of righteous devotion over all tyranny.',
    },
    slot4: {
      title: 'Bhakta Prahlad Fearless Faith 🕉️ Lord Narasimha Manifestation',
      epic: 'Srimad Bhagavatam',
      dialogue: 'Prahlad Unshakeable Devotion Defying Tyranny',
      shlokSanskrit: 'प्रह्लादहृदयाह्लादं भक्तानां भयनाशनम्।',
      shlokEnglish: 'The Lord who brings bliss to Prahlad heart and destroys every fear of His devotees.',
      hindi: 'जब हिरण्यकश्यप ने भक्त प्रह्लाद पर अत्याचार किए, तो भगवान नरसिंह ने खंभे से प्रकट होकर सिद्ध किया कि ईश्वर हर कण में विद्यमान हैं।',
      english: 'When tyranny oppressed the young devotee Prahlad, Lord Narasimha appeared from a stone pillar, proving the omnipresence and eternal shield of God.',
      moral: 'Unconditional faith conquers the fiercest earthly arrogance.',
    },
  },
  '2026-03-27': {
    name: 'Ram Navami',
    slot2: {
      title: 'Shri Ram Navami Special 🏹 Maryada Purushottam Bhagwan Ram Avatar',
      hindi: 'श्री राम नवमी के पावन अवसर पर प्रभु श्री राम के दिव्य अवतार का उत्सव मनाएं। जय श्री राम!',
      english: 'Celebrate the auspicious birth of Maryada Purushottam Lord Rama, the embodiment of supreme virtue.',
    },
    slot4: {
      title: 'The Eternal Vow of Shri Ram 🏹 Ramayana Maryada Wisdom',
      epic: 'Valmiki Ramayana (Ayodhya Kanda)',
      dialogue: 'Pran Jaye Par Vachan Na Jaye - Shri Ram Adherence to Dharma',
      shlokSanskrit: 'रामो विग्रहवान् धर्मः साधुः सत्यपराक्रमः।',
      shlokEnglish: 'Lord Rama is the very personification of Dharma, the righteous and truthfully heroic.',
      hindi: 'प्रभु श्री राम ने अपने पिता के वचन और धर्म की मर्यादा के लिए अयोध्या के राजसिंहासन को एक क्षण में त्याग दिया। मर्यादा और वचन की रक्षा ही जीवन का गौरव है।',
      english: 'Lord Rama joyfully renounced the imperial throne to uphold his father vow and righteousness, demonstrating that integrity is above all earthly wealth.',
      moral: 'Integrity, truth, and honoring one word define righteous character.',
    },
  },
  '2026-04-02': {
    name: 'Hanuman Jayanti',
    slot2: {
      title: 'Hanuman Jayanti Mahotsav 🕉️ Sankat Mochan Bajrangbali Darshan',
      hindi: 'हनुमान जयंती के पावन पर्व पर महाबली हनुमान आपके समस्त संकटों का नाश करें। जय बजरंगबली!',
      english: 'On Hanuman Jayanti, may the mighty Bajrangbali remove all obstacles from your path and bless you with strength.',
    },
    slot4: {
      title: 'Hanuman Ji Divine Humility Before Prabhu Ram 🕉️ Purest Bhakti',
      epic: 'Ramayana (Kishkindha & Sundara Kanda)',
      dialogue: 'Lord Hanuman Surrendering Every Triumph to Shri Ram',
      shlokSanskrit: 'मनोजवं मारुततुल्यवेगं जितेन्द्रियं बुद्धिमतां वरिष्ठम्। वातात्मजं वानरयूथमुख्यं श्रीरामदूतं शरणं प्रपद्ये॥',
      shlokEnglish: 'I take refuge in Shri Rama messenger Hanuman, swift as the mind, master of the senses, supreme in wisdom.',
      hindi: 'अतुलित बल के स्वामी होकर भी वीर हनुमान ने कभी अहंकार नहीं किया। वे सदा प्रभु श्री राम के चरणों के अनन्य दास बने रहे। यही सच्ची भक्ति की पराकाष्ठा है।',
      english: 'Possessing infinite strength, Hanuman remained entirely free from pride, attributing every heroic deed to Shri Rama grace. Humility is true greatness.',
      moral: 'Supreme strength shines brightest when wrapped in humble devotion.',
    },
  },
  '2026-09-04': {
    name: 'Krishna Janmashtami',
    slot2: {
      title: 'Shri Krishna Janmashtami 🌸 Bal Gopal Avatar & Divine Leela',
      hindi: 'श्री कृष्ण जन्माष्टमी के पावन अवसर पर कन्हैया आपके घर में प्रेम, आनंद और सुख की वर्षा करें। हरे कृष्णा!',
      english: 'Celebrate the divine appearance of Lord Krishna, who fills the cosmos with eternal love and blissful wisdom.',
    },
    slot4: {
      title: 'The Purpose of Divine Incarnation 🕉️ Yada Yada Hi Dharmasya | Gita',
      epic: 'Bhagavad Gita (Chapter 4)',
      dialogue: 'Lord Krishna on the Restoration of Cosmic Balance',
      shlokSanskrit: 'यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥',
      shlokEnglish: 'Whenever there is a decline in Dharma and a rise of unrighteousness, I manifest Myself.',
      hindi: 'भगवान श्री कृष्ण गीता में वचन देते हैं कि जब भी धर्म की हानि होती है, वे धर्म की पुनर्स्थापना और सज्जनों की रक्षा के लिए अवतरित होते हैं। सत्य कभी पराजित नहीं हो सकता।',
      english: 'Lord Krishna promises that whenever righteousness declines, the Divine descends to restore order and protect the virtuous. Righteousness is invincible.',
      moral: 'Goodness and cosmic balance will always prevail over temporary chaos.',
    },
  },
  '2026-09-14': {
    name: 'Ganesh Chaturthi',
    slot2: {
      title: 'Ganesh Chaturthi Mahotsav 🐘 Vighnaharta Ganpati Bappa Darshan',
      hindi: 'गणेश चतुर्थी के पावन पर्व पर प्रथम पूज्य श्री गणेश आपके जीवन के सभी विघ्नों को हर लें। गणपति बप्पा मोरया!',
      english: 'May Lord Ganesha, the remover of all obstacles, bestow wisdom, peace, and abundance upon your family.',
    },
    slot4: {
      title: 'Ganesha Supreme Wisdom 🕉️ Parents as the Entire Cosmos',
      epic: 'Shiva Purana',
      dialogue: 'Ganesha Circumambulating Lord Shiva and Mata Parvati',
      shlokSanskrit: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      shlokEnglish: 'O Ganesha of magnificent form and radiant brilliance, remove all obstacles from my endeavors forever.',
      hindi: 'जब ब्रह्मांड की परिक्रमा की बात आई, तो श्री गणेश ने अपने माता-पिता की परिक्रमा करके यह सिद्ध किया कि माता-पिता के चरणों में ही संपूर्ण तीर्थ और संसार समाया है।',
      english: 'Ganesha demonstrated unmatched wisdom by honoring his parents as his entire universe, reminding us that filial reverence is the highest worship.',
      moral: 'Loving and serving parents is the highest sacred virtue.',
    },
  },
  '2026-10-20': {
    name: 'Dussehra / Vijayadashami',
    slot2: {
      title: 'Vijayadashami Special 🏹 Victory of Good Over Evil | Jai Shri Ram',
      hindi: 'विजयादशमी के पावन पर्व पर अपने भीतर के अहंकार और बुराइयों का अंत कर सत्य के मार्ग पर चलें। जय श्री राम!',
      english: 'On Vijayadashami, celebrate the triumph of eternal truth and righteousness over arrogance and dark forces.',
    },
    slot4: {
      title: 'The Fall of Ravana & Triumph of Dharma 🏹 Ramayana Epic Climax',
      epic: 'Valmiki Ramayana (Yuddha Kanda)',
      dialogue: 'Shri Ram Defeating the Ten-Headed Demon King',
      shlokSanskrit: 'सत्यमेव जयते नानृतं सत्येन पन्था विततो देवयानः।',
      shlokEnglish: 'Truth alone triumphs, never untruth; through truth is paved the divine path.',
      hindi: 'दशहरा हमें याद दिलाता है कि सोने की लंका और अकूत शक्ति भी अधर्म और अहंकार को विनाश से नहीं बचा सकती। विजय सदा सत्य और धर्म की ही होती है।',
      english: 'Dussehra stands as eternal testimony that immense power and golden wealth cannot save unrighteousness. Victory belongs exclusively to Dharma.',
      moral: 'Ego and injustice bring inevitable destruction; Dharma alone endures.',
    },
  },
  '2026-11-08': {
    name: 'Diwali (Deepavali Mahotsav)',
    slot2: {
      title: 'Shubh Deepavali 🪔 Mata Lakshmi & Shri Ram Ayodhya Return Darshan',
      hindi: 'दीपोत्सव के इस महापर्व पर आपके घर में मां लक्ष्मी और प्रभु श्री राम का आशीर्वाद सदा बना रहे। शुभ दीपावली!',
      english: 'On the festival of lights, may Goddess Lakshmi and Lord Rama illuminate your life with joy and prosperity.',
    },
    slot4: {
      title: 'The Triumphant Return to Ayodhya 🪔 Ramayana Divine Homecoming',
      epic: 'Valmiki Ramayana (Uttara Kanda)',
      dialogue: 'The Lighting of the First Diya Celebrating the Return of Rama',
      shlokSanskrit: 'तमसो मा ज्योतिर्गमय। मृत्योर्मा अमृतं गमय॥',
      shlokEnglish: 'Lead us from darkness unto light, from mortality unto eternal truth.',
      hindi: 'चौदह वर्ष के वनवास के बाद जब प्रभु श्री राम अयोध्या लौटे, तो नगरवासियों ने घी के दीपक जलाकर उनका स्वागत किया। यह प्रकाश हमें अपने भीतर के अज्ञान को मिटाने की प्रेरणा देता है।',
      english: 'When Lord Rama returned to Ayodhya after 14 years, every citizen lit oil lamps to welcome righteousness. Let the light of wisdom conquer all inner darkness.',
      moral: 'Righteousness lights up the world; banish darkness with purity of heart.',
    },
  },
  '2026-12-20': {
    name: 'Gita Jayanti',
    slot2: {
      title: 'Gita Jayanti Special 🕉️ Shrimad Bhagavad Gita Divine Revelation',
      hindi: 'गीता जयंती के पावन अवसर पर भगवान श्री कृष्ण के अमर उपदेशों को अपने जीवन में उतारें। हरे कृष्णा!',
      english: 'Celebrate Gita Jayanti, the sacred day Lord Krishna revealed the ultimate science of self-realization.',
    },
    slot4: {
      title: 'The Ultimate Surrender: Sarva-Dharman Parityajya 🕉️ Bhagavad Gita',
      epic: 'Bhagavad Gita (Chapter 18, Verse 66)',
      dialogue: 'Lord Krishna Final Supreme Teaching to Humanity',
      shlokSanskrit: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥',
      shlokEnglish: 'Abandon all varieties of duties and surrender unto Me alone. I shall deliver you from all fear; do not despair.',
      hindi: 'गीता के अंतिम उपदेश में भगवान श्री कृष्ण कहते हैं कि समस्त चिंताओं और भयों को छोड़कर मेरी शरण में आओ, मैं तुम्हारा कल्याण करूंगा। परमात्मा पर पूर्ण विश्वास ही परम शांति है।',
      english: 'In the grand conclusion of the Gita, Lord Krishna assures that complete surrender to the Supreme eliminates all anxiety and leads to liberation. Trust in God brings peace.',
      moral: 'Surrender all worries to the Supreme; pure faith dissolves every sorrow.',
    },
  },
};

/**
 * Returns today's festival override if today is a recognized Indian occasion
 * @param {Date} [date] - Target date (defaults to current date)
 */
export function getTodayOccasion(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const dateKey = `${year}-${month}-${day}`;

  if (FESTIVAL_DATES[dateKey]) {
    const festival = FESTIVAL_DATES[dateKey];
    logger.info(`✨ TODAY IS A SPECIAL OCCASION: "${festival.name}"! Applying dynamic festival override.`);
    return {
      isFestival: true,
      name: festival.name,
      slot2: festival.slot2,
      slot4: festival.slot4,
    };
  }

  // Also check recurring yearly fixed dates (e.g. MM-DD)
  const monthDayKey = `${month}-${day}`;
  if (monthDayKey === '01-01' && !FESTIVAL_DATES[dateKey]) {
    return { isFestival: true, name: 'New Year Day', ...FESTIVAL_DATES['2026-01-01'] };
  }

  return { isFestival: false };
}

/**
 * Rotation tracker file to ensure non-festival days rotate through Mahabharata, Ramayana, and Gita episodes with zero repeats
 */
const TRACKER_PATH = path.resolve('assets', 'history_tracker.json');

export function getRotationIndex(totalItems, slotName = 'slot4') {
  let tracker = {};
  try {
    if (fs.existsSync(TRACKER_PATH)) {
      tracker = JSON.parse(fs.readFileSync(TRACKER_PATH, 'utf8'));
    }
  } catch (e) {}

  const currentIndex = tracker[slotName] || 0;
  const nextIndex = (currentIndex + 1) % totalItems;

  tracker[slotName] = nextIndex;
  try {
    fs.mkdirSync(path.dirname(TRACKER_PATH), { recursive: true });
    fs.writeFileSync(TRACKER_PATH, JSON.stringify(tracker, null, 2), 'utf8');
  } catch (e) {}

  return currentIndex;
}
