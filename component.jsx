import React, { useState, useEffect, useCallback } from 'react';

// Telegram WebApp API integration
const getTelegramWebApp = () => {
  return window.Telegram?.WebApp;
};

// Вынесем ChatInput полностью за пределы основного компонента
const ChatInput = React.memo(({ matchId, onSendMessage }) => {
  const [message, setMessage] = useState('');
  
  const handleSend = useCallback(() => {
    const messageText = message.trim();
    console.log('🔄 ChatInput handleSend:', { matchId, message: messageText });
    
    if (messageText) {
      console.log('✅ Отправляем сообщение:', messageText);
      onSendMessage(matchId, messageText);
      setMessage('');
      console.log('🧹 Очищен input');
    } else {
      console.log('❌ Пустое сообщение, не отправляем');
    }
  }, [matchId, message, onSendMessage]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  const handleChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  return (
    <div className="bg-white p-4 border-t border-gray-100">
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Напишите сообщение..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500"
          autoComplete="off"
        />
        <button
          onClick={handleSend}
          className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
});

// Основной компонент
const DatingApp = () => {
  const [currentView, setCurrentView] = useState('discover');
  const [currentProfile, setCurrentProfile] = useState(0);

  // Состояния для авторизации
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  // Инициализация Telegram WebApp и авторизация
  useEffect(() => {
    const initializeApp = async () => {
      // Ждем загрузки Telegram WebApp скрипта
      let attempts = 0;
      const maxAttempts = 20;
      
      const waitForTelegram = () => {
        return new Promise((resolve) => {
          const checkTelegram = () => {
            attempts++;
            const tg = getTelegramWebApp();
            
            if (tg || attempts >= maxAttempts) {
              resolve(tg);
            } else {
              setTimeout(checkTelegram, 100);
            }
          };
          
          checkTelegram();
        });
      };
      
      console.log('🔄 Ожидание загрузки Telegram WebApp...');
      const tg = await waitForTelegram();
      
      if (tg) {
        console.log('✅ Telegram WebApp найден');
        console.log('🔍 Полная отладка Telegram объекта:');
        console.log('- window.Telegram:', window.Telegram);
        console.log('- WebApp объект:', tg);
        console.log('- initData:', tg.initData);
        console.log('- initDataUnsafe:', tg.initDataUnsafe);
        console.log('- platform:', tg.platform);
        console.log('- version:', tg.version);
        console.log('- user данные:', tg.initDataUnsafe?.user);
        
        try {
          tg.ready();
          tg.expand();
          
          // Настройка темы
          if (tg.setHeaderColor) tg.setHeaderColor('#FF69B4');
          if (tg.setBackgroundColor) tg.setBackgroundColor('#FFFFFF');
          
          // Отключаем вертикальные свайпы для закрытия
          if (tg.disableVerticalSwipes) tg.disableVerticalSwipes();
          
          // Показываем главную кнопку при необходимости
          if (tg.MainButton) {
            tg.MainButton.setText('Найти пару');
            tg.MainButton.color = '#FF69B4';
            tg.MainButton.textColor = '#FFFFFF';
          }
          
          console.log('✅ Telegram WebApp инициализирован');
          
          // ДЕТАЛЬНАЯ ОТЛАДКА ПОЛЬЗОВАТЕЛЯ
          if (tg.initDataUnsafe?.user) {
            console.log('🎉 РЕАЛЬНЫЙ ПОЛЬЗОВАТЕЛЬ НАЙДЕН:');
            console.log('- ID:', tg.initDataUnsafe.user.id);
            console.log('- Имя:', tg.initDataUnsafe.user.first_name);
            console.log('- Фамилия:', tg.initDataUnsafe.user.last_name);
            console.log('- Username:', tg.initDataUnsafe.user.username);
            console.log('- Язык:', tg.initDataUnsafe.user.language_code);
            console.log('- Premium:', tg.initDataUnsafe.user.is_premium);
          } else {
            console.log('❌ ПОЛЬЗОВАТЕЛЬ НЕ НАЙДЕН в initDataUnsafe');
            console.log('🔍 Возможные причины:');
            console.log('1. Приложение открыто не через Telegram бота');
            console.log('2. Неправильно настроен Web App в BotFather'); 
            console.log('3. Проблемы с доменом или HTTPS');
          }
          
        } catch (error) {
          console.log('⚠️ Ошибка настройки Telegram WebApp:', error);
        }
        
        // Авторизация пользователя
        await authenticateUser(tg);
      } else {
        console.log('⚠️ Telegram WebApp недоступен, используем fallback');
        await authenticateUser(null);
      }
    };

    initializeApp();
  }, []);

  // Функция авторизации пользователя через бэкенд
  const authenticateUser = async (tg) => {
    try {
      console.log('🔐 Начинаем авторизацию пользователя...');

      // Получаем initData из Telegram SDK
      let initDataRaw = '';
      
      try {
        const { retrieveRawInitData } = await import('@telegram-apps/sdk');
        initDataRaw = retrieveRawInitData();
        console.log('📱 Raw init data получены из SDK');
      } catch (sdkError) {
        console.log('⚠️ SDK недоступен, получаем initData из WebApp API');
        // Fallback: получаем из WebApp API
        if (tg && tg.initData) {
          initDataRaw = tg.initData;
        } else {
          throw new Error('InitData недоступны');
        }
      }

      if (!initDataRaw) {
        throw new Error('Не удалось получить initData');
      }

      console.log('📤 Отправляем запрос авторизации на сервер...');

      // Отправляем запрос на сервер для авторизации
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Authorization': `tma ${initDataRaw}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const userData = await response.json();
      console.log('✅ Пользователь авторизован:', userData);

      // Сохраняем данные пользователя
      setIsAuthenticated(true);
      setUserProfile(userData);
      setAuthError(null);

      // Создаем токен для дальнейших запросов (если сервер его предоставляет)
      if (userData.token) {
        setAuthToken(userData.token);
        localStorage.setItem('authToken', userData.token);
      }

    } catch (error) {
      console.error('❌ Ошибка авторизации:', error);
      setAuthError(error.message);
      setIsAuthenticated(false);

      // Fallback: используем данные из Telegram напрямую для разработки
      if (tg && tg.initDataUnsafe?.user) {
        console.log('🔄 Используем fallback авторизацию для разработки');
        const fallbackUser = {
          id: tg.initDataUnsafe.user.id,
          first_name: tg.initDataUnsafe.user.first_name,
          last_name: tg.initDataUnsafe.user.last_name,
          username: tg.initDataUnsafe.user.username,
          language_code: tg.initDataUnsafe.user.language_code,
          is_premium: tg.initDataUnsafe.user.is_premium || false
        };
        
        setUserProfile(fallbackUser);
        setIsAuthenticated(true);
        setAuthError('Режим разработки (без бэкенда)');
      } else {
        // Полный fallback для тестирования без Telegram
        console.log('🔄 Полный fallback - создаем тестового пользователя');
        const testUser = {
          id: Date.now(),
          first_name: 'Кирилл',
          last_name: 'Лукичев',
          username: 'kirill_test',
          language_code: 'ru',
          is_premium: false
        };
        
        setUserProfile(testUser);
        setIsAuthenticated(true);
        setAuthError('Тестовый режим (без Telegram)');
      }
    }
  };
  const [likedProfiles, setLikedProfiles] = useStoredState('likedProfiles', []);
  const [matches, setMatches] = useStoredState('matches', []);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [chatMessages, setChatMessages] = useStoredState('chatMessages', {});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [deletingChat, setDeletingChat] = useState(null);
  
  // Состояние для реального времени
  const [messageUpdate, setMessageUpdate] = useStoredState('messageUpdate', 0);
  
  // Состояние для полноэкранного окна совпадения
  const [showFullScreenMatch, setShowFullScreenMatch] = useState(null);
  const [matchPhotoIndex, setMatchPhotoIndex] = useState(0);
  
  // Состояние для просмотра профиля девушки
  const [showProfileView, setShowProfileView] = useState(null);
  const [profilePhotoIndex, setProfilePhotoIndex] = useState(0);
  
  // Состояние для зонального свайпа
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const [isClick, setIsClick] = useState(false);
  const [isHolding, setIsHolding] = useState(false);

  // Пользователь из авторизованных данных
  const currentUser = userProfile ? {
    name: userProfile.first_name || "Пользователь",
    telegramId: userProfile.id,
    username: userProfile.username,
    firstName: userProfile.first_name,
    lastName: userProfile.last_name,
    languageCode: userProfile.language_code,
    isPremium: userProfile.is_premium || false,
    age: 28, // Будет заполнено пользователем
    bio: "Frontend разработчик, путешественник, любитель кофе и хорошей музыки",
    interests: ["Программирование", "Путешествия", "Кофе", "Музыка", "Спорт"],
    photos: [
      "assets/user_photo1.png?prompt=Young%20professional%20man%20portrait%20casual%20style",
      "assets/user_photo2.png?prompt=Man%20working%20on%20laptop%20modern%20office",
      "assets/user_photo3.png?prompt=Man%20traveling%20mountain%20landscape"
    ]
  } : null;

  // Демо-профили с геолокацией
  const profiles = [
    {
      id: 1,
      name: "Екатерина",
      age: 23,
      city: "Москва",
      distance: 2,
      bio: "Ищу родственную душу 💫",
      interests: ["Православие", "Рыбы", "162см", "Среднее", "Нет", "Нейтрально"],
      photos: [
        "assets/ekaterina_1.png?prompt=Beautiful%20young%20brunette%20woman%2023%20years%20old%20elegant%20portrait%20natural%20makeup%20soft%20lighting",
        "assets/ekaterina_2.png?prompt=Young%20brunette%20woman%20in%20orthodox%20church%20praying%20peaceful%20spiritual%20atmosphere",
        "assets/ekaterina_3.png?prompt=Portrait%20young%20woman%20reading%20book%20cozy%20cafe%20intellectual%20style",
        "assets/ekaterina_4.png?prompt=Young%20woman%20in%20nature%20park%20casual%20dress%20gentle%20smile%20golden%20hour"
      ],
      job: "Дизайнер",
      education: "МГУ",
      height: "162 см"
    },
    {
      id: 2,
      name: "Анна",
      age: 25,
      city: "Москва", 
      distance: 5,
      bio: "Люблю жизнь во всех её проявлениях ✨",
      interests: ["Фотография", "Йога", "Путешествия", "Мода", "Искусство"],
      photos: [
        "assets/anna_1.png?prompt=Beautiful%20young%20blonde%20woman%2025%20years%20old%20bohemian%20style%20photographer%20creative%20portrait",
        "assets/anna_2.png?prompt=Young%20blonde%20woman%20doing%20yoga%20pose%20peaceful%20studio%20athletic%20wear",
        "assets/anna_3.png?prompt=Young%20woman%20traveling%20mountain%20landscape%20backpack%20adventure%20style",
        "assets/anna_4.png?prompt=Portrait%20young%20woman%20fashion%20photography%20artistic%20lighting%20modern%20style"
      ],
      job: "Фотограф",
      education: "Школа фотографии",
      height: "165 см"
    },
    {
      id: 3,
      name: "Мария",
      age: 26,
      city: "Москва",
      distance: 12,
      bio: "Творческая натура в поисках вдохновения 🎨",
      interests: ["Искусство", "Дизайн", "Кино", "Живопись", "Музыка"],
      photos: [
        "assets/maria_1.png?prompt=Beautiful%20young%20redhead%20woman%2026%20years%20old%20artistic%20creative%20style%20warm%20lighting",
        "assets/maria_2.png?prompt=Young%20redhead%20woman%20in%20art%20studio%20painting%20canvas%20creative%20workspace",
        "assets/maria_3.png?prompt=Creative%20young%20woman%20graphic%20design%20workspace%20modern%20office%20artistic",
        "assets/maria_4.png?prompt=Portrait%20young%20artist%20woman%20gallery%20setting%20sophisticated%20artistic%20atmosphere"
      ],
      job: "Художница",
      education: "Художественная академия",
      height: "168 см"
    }
  ];

  const sendMessage = useCallback(async (matchId, message) => {
    console.log('📤 Отправка сообщения:', { matchId, message });
    
    if (!message.trim()) {
      console.log('❌ Пустое сообщение, отмена');
      return;
    }
    
    const userMessage = message.trim();
    const newMsg = {
      id: Date.now(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    
    console.log('📝 Создано сообщение пользователя:', newMsg);
    
    // Добавляем сообщение пользователя в состояние
    setChatMessages(prev => {
      const existingMessages = prev[matchId] || [];
      const updatedMessages = [...existingMessages, newMsg];
      
      const updated = {
        ...prev,
        [matchId]: updatedMessages
      };
      
      console.log('💾 Добавлено сообщение пользователя. Было:', existingMessages.length, 'Стало:', updatedMessages.length);
      return updated;
    });
    
    // Обновляем счетчики
    setMessageUpdate(prev => prev + 1);
    setForceUpdate(prev => prev + 1);

    // Автоответ через 2 секунды (для демо)
    const match = profiles.find(p => p.id === matchId);
    setTimeout(() => {
      console.log('🤖 Начинаем генерацию автоответа для:', userMessage);
      
      // Добавляем автоответ
      setChatMessages(currentChatMessages => {
        const currentMessages = currentChatMessages[matchId] || [];
        console.log('🔍 Текущие сообщения для автоответа:', currentMessages.length);
        
        // Генерируем ответ на основе актуальной истории
        const smartResponse = generateSmartResponse(userMessage, currentMessages, match);
        
        const autoReply = {
          id: Date.now() + Math.random(),
          text: smartResponse,
          sender: 'match',
          timestamp: new Date().toISOString()
        };
        
        console.log('🤖 Создан автоответ:', autoReply.text);
        
        // Добавляем автоответ к текущим сообщениям
        const finalMessages = [...currentMessages, autoReply];
        
        const updated = {
          ...currentChatMessages,
          [matchId]: finalMessages
        };
        
        console.log('💾 Добавлен автоответ. Итого сообщений:', finalMessages.length);
        console.log('📊 Финальная проверка: пользователь =', finalMessages.filter(m => m.sender === 'user').length, 'девушка =', finalMessages.filter(m => m.sender === 'match').length);
        
        return updated;
      });
      
      // Обновляем счетчики
      setMessageUpdate(prev => prev + 1);
      setForceUpdate(prev => prev + 1);
      
    }, 2000);
  }, []);

  // Функция для генерации умных ответов
  const generateSmartResponse = (userMessage, messageHistory, match) => {
    const msg = userMessage.toLowerCase();
    const isFirstMessage = messageHistory.length <= 1;
    
    // Паттерны для разных типов сообщений
    const patterns = {
      greeting: ['привет', 'здравствуй', 'добро утро', 'добрый день', 'добрый вечер', 'хай', 'приветик'],
      questions: ['как дела', 'что делаешь', 'как жизнь', 'что нового', 'как настроение'],
      compliments: ['красивая', 'прекрасная', 'красота', 'понравилась', 'симпатичная'],
      interests: ['хобби', 'увлечения', 'интересы', 'свободное время', 'любишь'],
      work: ['работа', 'профессия', 'карьера', 'дела', 'труд'],
      weekend: ['выходные', 'суббота', 'воскресенье', 'планы', 'отдых'],
      meeting: ['встреча', 'встретиться', 'увидеться', 'свидание', 'кофе', 'погулять'],
      travel: ['путешествие', 'поездка', 'отпуск', 'страна', 'город']
    };
    
    // Определяем тип сообщения
    let responseType = 'general';
    for (const [type, words] of Object.entries(patterns)) {
      if (words.some(word => msg.includes(word))) {
        responseType = type;
        break;
      }
    }
    
    // Генерируем ответ в зависимости от типа и контекста
    let responses = [];
    
    if (isFirstMessage) {
      responses = [
        `Привет! Очень приятно познакомиться! 😊`,
        `Привет! Рада, что мы совпали! ✨`,
        `Приветик! Спасибо за лайк, твой профиль тоже понравился! 💕`,
        `Здравствуй! Как дела? 😊`
      ];
    } else {
      switch (responseType) {
        case 'greeting':
          responses = [
            `Привет! Хорошо, что пишешь! 😊`,
            `Приветик! Рада тебя видеть! ✨`,
            `Здравствуй! Как настроение? 😊`
          ];
          break;
          
        case 'questions':
          responses = [
            `Отлично! Только что ${match.name === 'Екатерина' ? 'из церкви вернулась' : match.name === 'Анна' ? 'с йоги пришла' : 'рисовала'} 😊 А у тебя как дела?`,
            `Хорошо! Работаю ${match.job === 'Дизайнер' ? 'над новым проектом' : match.job === 'Фотограф' ? 'над фотосессией' : 'над картиной'} 🎨 Как твои дела?`,
            `Замечательно! Думаю о ${match.interests[0].toLowerCase()} 😊 А что у тебя нового?`
          ];
          break;
          
        case 'compliments':
          responses = [
            `Спасибо! Очень приятно! 😊 Ты тоже симпатичный!`,
            `Ой, спасибо! Смущаешь меня! 😊✨`,
            `Благодарю! Мне тоже понравился твой профиль! 💕`
          ];
          break;
          
        case 'interests':
          const mainInterest = match.interests[0];
          responses = [
            `Очень люблю ${mainInterest.toLowerCase()}! ${match.name === 'Екатерина' ? 'Это дает мне умиротворение' : match.name === 'Анна' ? 'Помогает найти баланс' : 'Это моя страсть!'} 😊 А ты чем увлекаешься?`,
            `Мои основные интересы - ${match.interests.slice(0, 2).map(i => i.toLowerCase()).join(' и ')} 🎨 А что тебе нравится?`,
            `Обожаю ${mainInterest.toLowerCase()}! А у тебя есть хобби? 😊`
          ];
          break;
          
        case 'work':
          responses = [
            `Работаю ${match.job === 'Дизайнер' ? 'дизайнером - создаю красоту' : match.job === 'Фотограф' ? 'фотографом - ловлю моменты' : 'художницей - рисую мир'} 🎨 А ты чем занимаешься?`,
            `Моя работа - ${match.job.toLowerCase()}, очень люблю то, что делаю! 😊 А твоя профессия?`,
            `${match.job} - это моя страсть! 💕 Расскажи о своей работе!`
          ];
          break;
          
        case 'weekend':
          responses = [
            `Планирую ${match.name === 'Екатерина' ? 'сходить в церковь и почитать' : match.name === 'Анна' ? 'йогу и фотопрогулку' : 'рисовать и сходить в галерею'} 😊 А твои планы?`,
            `Хочу заняться ${match.interests[0].toLowerCase()} и отдохнуть! А ты как проводишь выходные? 🎉`,
            `Думаю посвятить время ${match.interests[0].toLowerCase()} 😊 А у тебя есть планы?`
          ];
          break;
          
        case 'meeting':
          responses = [
            `Было бы здорово встретиться! ☕ Может быть, ${match.name === 'Екатерина' ? 'прогуляемся по парку' : match.name === 'Анна' ? 'сходим на выставку' : 'посетим арт-пространство'}? 😊`,
            `Мне тоже хотелось бы встретиться! 💕 Где любишь проводить время?`,
            `Отличная идея! ${match.name === 'Екатерина' ? 'Может, в уютном кафе?' : match.name === 'Анна' ? 'Может, на природе?' : 'В каком-то творческом месте?'} ✨`
          ];
          break;
          
        case 'travel':
          responses = [
            `Обожаю путешествия! ${match.name === 'Анна' ? 'Недавно была в горах - потрясающие виды!' : 'Мечтаю посетить Европу'} 🗺️ А ты куда любишь ездить?`,
            `Путешествия - это так вдохновляет! Особенно для ${match.job.toLowerCase()} 😊 Какие страны тебе нравятся?`,
            `Да, люблю открывать новые места! А ты часто путешествуешь? ✈️`
          ];
          break;
          
        default:
          responses = [
            `Интересно! Расскажи больше 😊`,
            `Понимаю тебя! ${match.name === 'Екатерина' ? 'Я тоже иногда так думаю' : match.name === 'Анна' ? 'Мне близка эта тема' : 'Звучит захватывающе'} ✨`,
            `Согласна! А как ты к этому пришел? 🤔`,
            `Мне нравится твой взгляд на вещи! 💕`,
            `Классно! ${match.interests[0]} тоже может быть связано с этим 😊`
          ];
      }
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // ПРОСТАЯ функция очистки всех чатов
  const clearAllChats = useCallback(() => {
    console.log('🧹 Очистка всех чатов');
    
    // Закрываем все модальные окна
    setSelectedMatch(null);
    setDeletingChat(null);
    setShowFullScreenMatch(null);
    setShowProfileView(null);
    
    // Очищаем все данные
    setMatches([]);
    setChatMessages({});
    setLikedProfiles([]);
    
    console.log('✅ Все чаты очищены');
  }, []);

  // Функция для авторизованных API запросов
  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers
      };

      // Добавляем токен авторизации если есть
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      } else {
        const tg = getTelegramWebApp();
        if (tg) {
          // Альтернативно: используем initData для каждого запроса
          try {
            const { retrieveRawInitData } = await import('@telegram-apps/sdk');
            const initDataRaw = retrieveRawInitData();
            headers['Authorization'] = `tma ${initDataRaw}`;
          } catch (error) {
            console.log('⚠️ Не удалось получить initData для запроса');
          }
        }
      }

      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Ошибка сервера' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ Ошибка API запроса:', error);
      throw error;
    }
  }, [authToken]);

  // Функция для сохранения профиля на сервере
  const saveUserProfile = useCallback(async (profileData) => {
    try {
      console.log('💾 Сохранение профиля пользователя на сервере...');
      
      const result = await makeAuthenticatedRequest('/api/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      });

      console.log('✅ Профиль сохранен на сервере:', result);
      return result;
    } catch (error) {
      console.error('❌ Ошибка сохранения профиля:', error);
      // Fallback: сохраняем локально
      localStorage.setItem(`user_profile_${userProfile.id}`, JSON.stringify(profileData));
      throw error;
    }
  }, [makeAuthenticatedRequest, userProfile]);

  // Функция для получения совпадений с сервера
  const fetchMatches = useCallback(async () => {
    try {
      console.log('🔍 Получение совпадений с сервера...');
      
      const result = await makeAuthenticatedRequest('/api/matches');
      
      console.log('✅ Совпадения получены с сервера:', result);
      return result;
    } catch (error) {
      console.error('❌ Ошибка получения совпадений:', error);
      // Fallback: используем локальные данные
      return [];
    }
  }, [makeAuthenticatedRequest]);

  // Функция для отправки уведомления через сервер
  const sendNotification = useCallback(async (recipientId, message) => {
    try {
      console.log('📤 Отправка уведомления через сервер...');
      
      const result = await makeAuthenticatedRequest('/api/notifications', {
        method: 'POST',
        body: JSON.stringify({
          recipientId,
          message,
          type: 'chat_message'
        })
      });

      console.log('✅ Уведомление отправлено через сервер');
      return result;
    } catch (error) {
      console.error('❌ Ошибка отправки уведомления:', error);
      
      // Fallback: отправляем через WebApp API
      const tg = getTelegramWebApp();
      if (tg && tg.sendData) {
        tg.sendData(JSON.stringify({
          type: 'notification',
          recipientId,
          message,
          from: currentUser
        }));
        console.log('📱 Уведомление отправлено через Telegram WebApp API');
      }
    }
  }, [makeAuthenticatedRequest, currentUser]);

  // ПРОСТАЯ функция удаления чата
  const deleteChat = useCallback((matchId) => {
    console.log('🗑️ Удаление чата:', matchId);
    
    // Закрываем выбранный чат если это он
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(null);
    }
    
    // Удаляем из всех списков
    setMatches(prev => prev.filter(match => match.id !== matchId));
    setLikedProfiles(prev => prev.filter(id => id !== matchId));
    setChatMessages(prev => {
      const updated = { ...prev };
      delete updated[matchId];
      return updated;
    });
    
    console.log('✅ Чат удален:', matchId);
  }, [selectedMatch]);

  const handleLike = () => {
    // Хэптик фидбек для Telegram
    const tg = getTelegramWebApp();
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    
    const profile = profiles[currentProfile];
    if (!likedProfiles.includes(profile.id)) {
      setLikedProfiles([...likedProfiles, profile.id]);
      
      // Создаем совпадение с высокой вероятностью (70%)
      if (Math.random() > 0.3) {
        const existingMatch = matches.find(m => m.id === profile.id);
        if (!existingMatch) {
          // КРИТИЧНО: ПРИНУДИТЕЛЬНО очищаем любую историю сообщений для этого профиля
          setChatMessages(prevMessages => {
            console.log('🧹 ПРИНУДИТЕЛЬНАЯ очистка истории для', profile.name, 'ID:', profile.id);
            console.log('🔍 Текущие ключи в chatMessages:', Object.keys(prevMessages));
            console.log('🔍 Существует ли история для ID', profile.id, ':', !!prevMessages[profile.id]);
            
            if (prevMessages[profile.id]) {
              console.log('🗑️ НАЙДЕНА старая история! Удаляем', (prevMessages[profile.id] || []).length, 'старых сообщений');
            }
            
            // ВСЕГДА создаем новый объект БЕЗ этого ключа
            const cleanMessages = {};
            Object.keys(prevMessages).forEach(key => {
              if (key !== profile.id.toString()) {
                cleanMessages[key] = prevMessages[key];
              }
            });
            
            console.log('✅ ЧИСТЫЕ сообщения после очистки:', Object.keys(cleanMessages));
            console.log('🔥 ГАРАНТИЯ: для ID', profile.id, 'история ПОЛНОСТЬЮ УДАЛЕНА');
            return cleanMessages;
          });
          
          // Дополнительная проверка перед добавлением
          setMatches(prevMatches => {
            const doubleCheck = prevMatches.find(m => m.id === profile.id);
            if (doubleCheck) {
              console.log('⚠️ Дублирование предотвращено - совпадение уже существует');
              return prevMatches;
            }
            
            const newMatches = [...prevMatches, profile];
            console.log('💕 Создано НОВОЕ совпадение с ЧИСТОЙ историей:', profile.name);
            console.log('🔍 Новый список matches:', newMatches);
            console.log('📊 DEBUG - Размер нового списка:', newMatches.length);
            return newMatches;
          });
          
          // Принудительное обновление для реального времени
          setForceUpdate(prev => {
            const newValue = prev + 1;
            console.log('🔄 ForceUpdate в Like:', newValue);
            return newValue;
          });
          setMessageUpdate(prev => {
            const newValue = prev + 1;
            console.log('🔄 MessageUpdate в Like:', newValue);
            return newValue;
          });
          
          // Показываем полноэкранное окно совпадения
          setShowFullScreenMatch(profile);
          setMatchPhotoIndex(0);
          console.log('🎉 Показано полноэкранное окно совпадения');
          return; // Не переключаем профиль сразу
        }
      }
    }
    nextProfile();
  };

  const handleSuperLike = () => {
    // Хэптик фидбек для Telegram
    const tg = getTelegramWebApp();
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('medium');
    }
    
    const profile = profiles[currentProfile];
    console.log('⭐ Супер лайк нажат для:', profile.name);
    console.log('🔍 DEBUG - Текущие matches:', matches);
    console.log('🔍 DEBUG - Проверка существования совпадения:', matches.find(m => m.id === profile.id));
    console.log('🔍 DEBUG - Профиль уже лайкнут?', likedProfiles.includes(profile.id));
    
    // Добавляем в лайкнутые, если еще не добавлен
    if (!likedProfiles.includes(profile.id)) {
      setLikedProfiles([...likedProfiles, profile.id]);
      console.log('✅ Профиль добавлен в лайкнутые');
    }
    
    // СУПЕР ЛАЙК ВСЕГДА СОЗДАЕТ СОВПАДЕНИЕ (100% гарантия)
    const existingMatch = matches.find(m => m.id === profile.id);
    console.log('🔍 DEBUG - Существующее совпадение:', existingMatch);
    
    if (!existingMatch) {
      // КРИТИЧНО: ПРИНУДИТЕЛЬНО очищаем любую историю сообщений для СУПЕР ЛАЙКА
      setChatMessages(prevMessages => {
        console.log('🧹 СУПЕР ЛАЙК: ПРИНУДИТЕЛЬНАЯ очистка истории для', profile.name, 'ID:', profile.id);
        console.log('🔍 Текущие ключи в chatMessages:', Object.keys(prevMessages));
        console.log('🔍 Существует ли история для ID', profile.id, ':', !!prevMessages[profile.id]);
        
        if (prevMessages[profile.id]) {
          console.log('🗑️ НАЙДЕНА старая история! Удаляем', (prevMessages[profile.id] || []).length, 'старых сообщений');
        }
        
        // ВСЕГДА создаем новый объект БЕЗ этого ключа
        const cleanMessages = {};
        Object.keys(prevMessages).forEach(key => {
          if (key !== profile.id.toString()) {
            cleanMessages[key] = prevMessages[key];
          }
        });
        
        console.log('✅ ЧИСТЫЕ сообщения после СУПЕР очистки:', Object.keys(cleanMessages));
        console.log('🔥 ГАРАНТИЯ: для СУПЕР ЛАЙКА ID', profile.id, 'история ПОЛНОСТЬЮ УДАЛЕНА');
        return cleanMessages;
      });
      
      // Дополнительная проверка перед добавлением
      setMatches(prevMatches => {
        const doubleCheck = prevMatches.find(m => m.id === profile.id);
        if (doubleCheck) {
          console.log('⚠️ Дублирование предотвращено - совпадение уже существует');
          return prevMatches;
        }
        
        const newMatches = [...prevMatches, profile];
        console.log('💕 Создано СУПЕР совпадение с ЧИСТОЙ историей:', profile.name);
        console.log('🔍 DEBUG - Новый список matches:', newMatches);
        console.log('📊 DEBUG - Размер нового списка:', newMatches.length);
        return newMatches;
      });
      
      // Принудительное обновление для реального времени
      setForceUpdate(prev => {
        const newValue = prev + 1;
        console.log('🔄 ForceUpdate в SuperLike:', newValue);
        return newValue;
      });
      setMessageUpdate(prev => {
        const newValue = prev + 1;
        console.log('🔄 MessageUpdate в SuperLike:', newValue);
        return newValue;
      });
    } else {
      console.log('⚠️ Совпадение уже существует, но все равно показываем окно');
    }
    
    // ВСЕГДА показываем полноэкранное окно при супер лайке
    setShowFullScreenMatch(profile);
    setMatchPhotoIndex(0);
    console.log('🎉 Показано полноэкранное окно совпадения');
    console.log('🔍 Debug - showFullScreenMatch:', profile);
    console.log('🔍 Debug - matchPhotoIndex:', 0);
    
    // НЕ ПЕРЕКЛЮЧАЕМ профиль сразу - только после закрытия окна
    return;
  };

  const handleDislike = () => {
    // Хэптик фидбек для Telegram
    const tg = getTelegramWebApp();
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred('light');
    }
    
    nextProfile();
  };

  const nextProfile = () => {
    setCurrentProfile((prev) => (prev + 1) % profiles.length);
    setCurrentPhotoIndex(0);
  };

  // Упрощенные обработчики свайпа
  const handleStart = (clientX, clientY) => {
    console.log('🎯 Начало касания для свайпа');
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setDragDistance(0);
    setDragOffset({ x: 0, y: 0 });
    setIsClick(true);
    
    // Отключаем клик через небольшую задержку если началось движение
    setTimeout(() => {
      if (dragDistance > 5) {
        setIsClick(false);
      }
    }, 100);
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    
    // Если есть движение, это не клик
    if (distance > 5) {
      setIsClick(false);
    }
    
    setDragOffset({ x: deltaX, y: deltaY });
    setDragDistance(distance);
    console.log('📱 Свайп движение:', { deltaX, deltaY, distance });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    console.log('🛑 Конец касания', { dragDistance, dragOffset, isClick });
    
    // Если это был свайп (достаточное движение)
    const threshold = 60;
    if (!isClick && dragDistance > 20 && Math.abs(dragOffset.x) > threshold) {
      console.log('✅ Свайп выполнен:', dragOffset.x > 0 ? 'LIKE' : 'DISLIKE');
      if (dragOffset.x > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    }
    
    // Сбрасываем все состояния
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
    
    // Задержка для клика чтобы onClick успел сработать
    setTimeout(() => {
      setIsClick(false);
    }, 50);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };
    const handleMouseUp = (e) => {
      e.preventDefault();
      handleEnd();
    };
    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    };
    const handleTouchEnd = (e) => {
      e.preventDefault();
      handleEnd();
    };

    // Слушаем события только во время свайпа
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [isDragging, startPos, dragOffset]);

  // Используем функциональные обновления состояния вместо ref

  // Автосохранение для matches
  useEffect(() => {
    try {
      localStorage.setItem('matches', JSON.stringify(matches));
      console.log('💾 Автосохранение matches:', matches.length);
    } catch (e) {
      console.log('⚠️ Ошибка автосохранения matches:', e);
    }
  }, [matches]);
  
  // Автосохранение для likedProfiles  
  useEffect(() => {
    try {
      localStorage.setItem('likedProfiles', JSON.stringify(likedProfiles));
      console.log('💾 Автосохранение likedProfiles:', likedProfiles.length);
    } catch (e) {
      console.log('⚠️ Ошибка автосохранения likedProfiles:', e);
    }
  }, [likedProfiles]);

  // Отслеживание изменений сообщений для реального времени
  useEffect(() => {
    console.log('🔄 Обновление сообщений в реальном времени:', messageUpdate);
  }, [messageUpdate, chatMessages]);

  // Автоматическое переключение фотографий в окне совпадения
  useEffect(() => {
    console.log('🔍 useEffect - showFullScreenMatch:', !!showFullScreenMatch, showFullScreenMatch?.name);
    if (showFullScreenMatch && showFullScreenMatch.photos && showFullScreenMatch.photos.length > 1) {
      console.log('🔄 Запуск автоматического переключения фотографий');
      const interval = setInterval(() => {
        setMatchPhotoIndex(prev => {
          const newIndex = (prev + 1) % showFullScreenMatch.photos.length;
          console.log('📸 Переключение фото:', prev, '->', newIndex);
          return newIndex;
        });
      }, 3000);
      
      return () => {
        console.log('⏹️ Остановка автоматического переключения');
        clearInterval(interval);
      };
    }
  }, [showFullScreenMatch]);

  // Автоматическое переключение фотографий в профиле девушки
  useEffect(() => {
    if (showProfileView && showProfileView.photos && showProfileView.photos.length > 1) {
      const interval = setInterval(() => {
        setProfilePhotoIndex(prev => {
          const newIndex = (prev + 1) % showProfileView.photos.length;
          return newIndex;
        });
      }, 4000); // Чуть медленнее чем в окне совпадения
      
      return () => clearInterval(interval);
    }
  }, [showProfileView]);

  // Отладочная информация для состояния полноэкранного окна
  useEffect(() => {
    console.log('🚨 DEBUG - Состояние полноэкранного окна изменилось:', {
      showFullScreenMatch: !!showFullScreenMatch,
      matchName: showFullScreenMatch?.name,
      matchPhotoIndex: matchPhotoIndex
    });
  }, [showFullScreenMatch, matchPhotoIndex]);

  // Отладочная информация для matches
  useEffect(() => {
    console.log('🚨 DEBUG - Matches изменились:', matches);
  }, [matches]);

  // Отладочная информация для likedProfiles
  useEffect(() => {
    console.log('🚨 DEBUG - LikedProfiles изменились:', likedProfiles);
  }, [likedProfiles]);

  const DiscoverView = () => {
    const profile = profiles[currentProfile];
    const rotation = dragOffset.x * 0.05;
    const opacity = Math.max(0.8, 1 - Math.abs(dragOffset.x) * 0.001);
    
    return (
      <div className="flex flex-col h-full bg-white relative overflow-hidden">
        {/* Карточка пользователя */}
        <div 
          className="flex-1 relative bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url('${profile.photos[currentPhotoIndex]}')`,
            transform: `translateX(${isDragging ? dragOffset.x : 0}px) rotate(${isDragging ? rotation : 0}deg)`,
            opacity: isDragging ? opacity : 1,
            transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
          }}
        >
          {/* Stories индикаторы */}
          <div className="absolute top-4 left-4 right-4 flex space-x-1">
            {profile.photos.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden"
              >
                <div 
                  className={`h-full transition-all duration-300 rounded-full ${
                    index === currentPhotoIndex ? 'bg-white' : 
                    index < currentPhotoIndex ? 'bg-white' : 'bg-transparent'
                  }`}
                />
              </div>
            ))}
          </div>

          {/* ОБНОВЛЕННАЯ ЗОНАЛЬНАЯ СИСТЕМА */}
          <div className="absolute inset-0 flex z-30">
            {/* КРАЙНЯЯ ЛЕВАЯ ЗОНА - только свайп (7%) */}
            <div 
              className="cursor-grab"
              style={{ width: '7%' }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔴 ЛЕВАЯ СВАЙП ЗОНА (7%) активирована');
                handleMouseDown(e);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔴 ЛЕВАЯ СВАЙП ЗОНА (7%) (touch) активирована');
                handleTouchStart(e);
              }}
            />
            
            {/* ЛЕВАЯ ЗОНА КЛИКА - предыдущее фото (25%) */}
            <div 
              className="cursor-pointer"
              style={{ width: '25%' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentPhotoIndex(prev => 
                  prev > 0 ? prev - 1 : profile.photos.length - 1
                );
                console.log('🟠 ЛЕВАЯ ФОТО ЗОНА (25%) - предыдущее фото');
              }}
            />
            
            {/* ЦЕНТРАЛЬНАЯ ЗОНА - открытие профиля (36%) */}
            <div 
              className="cursor-pointer"
              style={{ width: '36%' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔵 ЦЕНТРАЛЬНАЯ ЗОНА (36%) - Открытие профиля');
                console.log('👤 Профиль для открытия:', profile.name);
                setShowProfileView(profile);
                setProfilePhotoIndex(0);
                console.log('✅ setShowProfileView выполнен для:', profile.name);
              }}
            />
            
            {/* ПРАВАЯ ЗОНА КЛИКА - следующее фото (25%) */}
            <div 
              className="cursor-pointer"
              style={{ width: '25%' }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentPhotoIndex(prev => 
                  prev < profile.photos.length - 1 ? prev + 1 : 0
                );
                console.log('🟡 ПРАВАЯ ФОТО ЗОНА (25%) - следующее фото');
              }}
            />
            
            {/* КРАЙНЯЯ ПРАВАЯ ЗОНА - только свайп (7%) */}
            <div 
              className="cursor-grab"
              style={{ width: '7%' }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🟢 ПРАВАЯ СВАЙП ЗОНА (7%) активирована');
                handleMouseDown(e);
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🟢 ПРАВАЯ СВАЙП ЗОНА (7%) (touch) активирована');
                handleTouchStart(e);
              }}
            />
          </div>

          {/* Теги при свайпе */}
          {isDragging && !isClick && dragOffset.x > 50 && (
            <div 
              className="absolute top-1/2 left-8 transform -translate-y-1/2 rotate-12 transition-opacity duration-200"
              style={{ opacity: Math.min(1, (dragOffset.x - 50) / 100) }}
            >
              <div className="bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold text-2xl border-4 border-pink-300 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.318c-1.754-1.753-4.596-1.753-6.35 0-1.753 1.754-1.753 4.596 0 6.35L12 17.018l6.35-6.35c1.753-1.754 1.753-4.596 0-6.35-1.754-1.753-4.596-1.753-6.35 0z" />
                  </svg>
                  <span>LIKE</span>
                </div>
              </div>
            </div>
          )}
          {isDragging && !isClick && dragOffset.x < -50 && (
            <div 
              className="absolute top-1/2 right-8 transform -translate-y-1/2 -rotate-12 transition-opacity duration-200"
              style={{ opacity: Math.min(1, (Math.abs(dragOffset.x) - 50) / 100) }}
            >
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-2xl font-bold text-2xl border-4 border-gray-500 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>NOPE</span>
                </div>
              </div>
            </div>
          )}



          {/* Информация внизу карточки - КЛИКАБЕЛЬНАЯ ЗОНА */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-6 text-white cursor-pointer z-40"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('📋 КЛИК ПО ИНФОРМАЦИОННОЙ ЗОНЕ - Открытие профиля:', profile.name);
              setShowProfileView(profile);
              setProfilePhotoIndex(0);
            }}
          >
            {/* Геолокация */}
            <div className="flex items-center mb-3">
              <svg className="w-4 h-4 mr-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-white/70 text-sm">{profile.distance} км</span>
              <div className="flex items-center ml-3">
                <svg className="w-4 h-4 mr-1 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-white/70 text-sm">Ищу родственную душу</span>
              </div>
            </div>

            {/* Имя и возраст */}
            <h2 className="text-3xl font-bold mb-2 flex items-center">
              {profile.name}, {profile.age}
              <svg className="w-6 h-6 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </h2>

            {/* Описание */}
            <p className="text-white/90 text-sm mb-4">{profile.bio}</p>

            {/* Теги интересов */}
            <div className="flex flex-wrap gap-2 mb-4">
              {profile.interests.slice(0, 6).map((interest, index) => (
                <div key={index} className="flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1">
                  {index === 0 && <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>}
                  {index === 1 && <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                  {index === 2 && <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>}
                  {index === 3 && <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                  {index === 4 && <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>}
                  {index === 5 && <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>}
                  <span className="text-xs text-white">{interest}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Кнопки управления */}
        <div className="bg-white p-4">
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={handleDislike}
              className="w-14 h-14 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <button
              onClick={handleSuperLike}
              className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform relative"
            >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>

            <button
              onClick={handleLike}
              className="w-14 h-14 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:scale-105 transition-transform"
            >
              <svg className="w-7 h-7 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.318c-1.754-1.753-4.596-1.753-6.35 0-1.753 1.754-1.753 4.596 0 6.35L12 17.018l6.35-6.35c1.753-1.754 1.753-4.596 0-6.35-1.754-1.753-4.596-1.753-6.35 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ChatView = () => {
    console.log('💬 ChatView render - selectedMatch:', selectedMatch);
    
    const [message, setMessage] = useState('');

    if (selectedMatch) {
      // Загружаем сообщения только из React состояния
      const messages = chatMessages[selectedMatch.id] || [];
      
      console.log('💬 ChatView render:', { 
        selectedMatch: selectedMatch.id, 
        selectedMatchName: selectedMatch.name,
        messagesCount: messages.length,
        messageUpdate: messageUpdate,
        forceUpdate: forceUpdate
      });
      
      // Детальная отладка сообщений
      if (messages.length > 0) {
        console.log('📋 Все сообщения в чате:');
        messages.forEach((msg, index) => {
          console.log(`  ${index + 1}. [${msg.sender}] "${msg.text}" (ID: ${msg.id}, время: ${new Date(msg.timestamp).toLocaleTimeString()})`);
        });
        
        // Проверим распределение по отправителям
        const userMessages = messages.filter(m => m.sender === 'user');
        const matchMessages = messages.filter(m => m.sender === 'match');
        console.log('📊 СТАТИСТИКА: пользователь -', userMessages.length, 'девушка -', matchMessages.length);
      } else {
        console.log('📭 Сообщений в чате нет (чистая история)');
      }
      
      return (
        <div className="flex flex-col h-full bg-white">
          {/* Хедер чата */}
          <div className="bg-white p-4 shadow-sm border-b border-gray-100 flex items-center">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedMatch(null);
                console.log('🔙 Возврат к списку чатов');
              }}
              className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowProfileView(selectedMatch);
                setProfilePhotoIndex(0);
                console.log('👤 Клик на аватар в хедере - открытие профиля:', selectedMatch.name);
              }}
              className="flex items-center flex-1 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <img 
                src={selectedMatch.photos && selectedMatch.photos[0] ? selectedMatch.photos[0] : 'assets/default_avatar.png?prompt=Beautiful%20young%20woman%20portrait%20default%20avatar'}
                alt={selectedMatch.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-pink-200 mr-3"
              />
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-800">{selectedMatch.name}</h3>
                <p className="text-sm text-gray-500">Онлайн</p>
              </div>
            </button>
            
            {/* Кнопка удаления чата */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const chatIdToDelete = selectedMatch.id;
                console.log('🗑️ Клик на удаление чата из хедера:', chatIdToDelete);
                setDeletingChat(chatIdToDelete);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Удалить чат"
              disabled={deletingChat !== null} // Защита от множественных кликов
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          {/* Сообщения */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-3"
            ref={(el) => {
              if (el) {
                // Автоматическая прокрутка к последнему сообщению
                setTimeout(() => {
                  el.scrollTop = el.scrollHeight;
                }, 100);
              }
            }}
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-4">💝</div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Совпадение!</h4>
                <p className="text-gray-500 text-center">Вы понравились друг другу! Начните разговор</p>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={`msg-${msg.id}-${index}-${messageUpdate}`}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-pink-500 text-white ml-12'
                        : 'bg-gray-100 text-gray-800 mr-12'
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Поле ввода */}
          <div className="bg-white p-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const messageText = message.trim();
                    if (messageText) {
                      sendMessage(selectedMatch.id, messageText);
                      setMessage('');
                    }
                  }
                }}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500"
                autoComplete="off"
              />
              <button
                onClick={() => {
                  const messageText = message.trim();
                  if (messageText) {
                    sendMessage(selectedMatch.id, messageText);
                    setMessage('');
                  }
                }}
                className="p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Модальное окно подтверждения удаления */}
          {deletingChat === selectedMatch.id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Удалить чат?</h3>
                <p className="text-gray-600 mb-6">
                  Все сообщения с {selectedMatch.name} будут удалены. Это действие нельзя отменить.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setDeletingChat(null)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Отмена
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      const matchIdToDelete = deletingChat; // Используем ID из состояния
                      console.log('🗑️ Подтверждение удаления чата из открытого окна:', matchIdToDelete);
                      
                      // Закрываем модальное окно
                      setDeletingChat(null);
                      
                      // Удаляем чат с задержкой для избежания конфликтов
                      setTimeout(() => {
                        deleteChat(matchIdToDelete);
                      }, 100);
                    }}
                    className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    disabled={!deletingChat} // Защита от повторного клика
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-white p-4 shadow-sm border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Чаты</h2>
          <p className="text-gray-500 text-sm">{matches.length} совпадений</p>
          {/* Скрытый элемент для принудительного обновления */}
          <div style={{ display: 'none' }}>{forceUpdate}-{messageUpdate}-{matches.length}-{JSON.stringify(matches.map(m => m.id))}</div>
          {/* Отладочная информация */}
          <div style={{ display: 'none' }}>
            DEBUG: matches={JSON.stringify(matches.map(m => ({ id: m.id, name: m.name })))}, forceUpdate={forceUpdate}, messageUpdate={messageUpdate}, timestamp={Date.now()}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Пока нет совпадений</h3>
              <p className="text-gray-500 text-center">Когда вы понравитесь друг другу, здесь появятся ваши совпадения</p>
            </div>
          ) : (
            <div className="p-4 space-y-3" key={`matches-list-${matches.length}-${forceUpdate}-${messageUpdate}-${JSON.stringify(matches.map(m => m.id))}`}>
              {matches.map((match, index) => (
                <div 
                  key={`match-${match.id}-${index}-${forceUpdate}-${messageUpdate}`}
                  className="flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group"
                >
                  <div 
                    onClick={() => setSelectedMatch(match)}
                    className="flex items-center flex-1"
                  >
                    <img 
                      src={match.photos && match.photos[0] ? match.photos[0] : 'assets/default_avatar.png?prompt=Beautiful%20young%20woman%20portrait%20default%20avatar'}
                      alt={match.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-pink-200"
                    />
                    <div className="ml-3 flex-1">
                      <h4 className="font-semibold text-gray-800">{match.name}</h4>
                      <p className="text-sm text-gray-500">
                        {chatMessages[match.id] && chatMessages[match.id].length > 0
                          ? chatMessages[match.id][chatMessages[match.id].length - 1].text
                          : "Вы понравились друг другу!"}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                  </div>
                  
                  {/* Кнопка удаления (появляется при наведении) */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const chatIdToDelete = match.id;
                      console.log('🗑️ Клик на удаление чата из списка:', chatIdToDelete);
                      setDeletingChat(chatIdToDelete);
                    }}
                    className="ml-2 p-2 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                    title="Удалить чат"
                    disabled={deletingChat !== null} // Защита от множественных кликов
                  >
                    <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Компонент для просмотра профиля девушки
  const GirlProfileView = ({ profile, onClose }) => {
    return (
      <div 
        className="fixed inset-0 bg-white flex flex-col"
        style={{ 
          zIndex: 999999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh'
        }}
      >
        {/* Хедер */}
        <div className="bg-white p-4 shadow-sm border-b border-gray-100 flex items-center">
          <button
            onClick={onClose}
            className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="text-xl font-bold text-gray-800">{profile.name}</h2>
        </div>

        {/* Контент */}
        <div className="flex-1 overflow-y-auto">
          {/* Главная фотография */}
          <div className="relative h-96 bg-gray-200">
            {/* Stories индикаторы */}
            <div className="absolute top-4 left-4 right-4 flex space-x-1 z-10">
              {profile.photos.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden"
                >
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${
                      index === profilePhotoIndex ? 'bg-white' : 
                      index < profilePhotoIndex ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>

            <img 
              src={profile.photos[profilePhotoIndex]}
              alt={profile.name}
              className="w-full h-full object-cover"
            />

            {/* Клик области для переключения фото */}
            <div className="absolute inset-0 flex">
              <button 
                className="flex-1"
                onClick={() => setProfilePhotoIndex(prev => 
                  prev > 0 ? prev - 1 : profile.photos.length - 1
                )}
              />
              <button 
                className="flex-1"
                onClick={() => setProfilePhotoIndex(prev => 
                  prev < profile.photos.length - 1 ? prev + 1 : 0
                )}
              />
            </div>
          </div>

          {/* Информация */}
          <div className="p-6 space-y-6">
            {/* Имя и основная информация */}
            <div>
              <div className="flex items-center mb-3">
                <h1 className="text-3xl font-bold text-gray-800">{profile.name}, {profile.age}</h1>
                <svg className="w-6 h-6 ml-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <div className="flex items-center text-gray-600 mb-3">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm">{profile.distance} км от вас • {profile.city}</span>
              </div>

              {profile.job && (
                <div className="flex items-center text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  <span className="text-sm">{profile.job}</span>
                </div>
              )}

              {profile.education && (
                <div className="flex items-center text-gray-600 mb-3">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                  <span className="text-sm">{profile.education}</span>
                </div>
              )}

              {profile.height && (
                <div className="flex items-center text-gray-600 mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l3-3-3-3M14 3l3 3-3 3M4 12h16" />
                  </svg>
                  <span className="text-sm">{profile.height}</span>
                </div>
              )}
            </div>

            {/* Описание */}
            {profile.bio && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">О себе</h3>
                <p className="text-gray-600 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Интересы */}
            {profile.interests && profile.interests.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Интересы</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-pink-100 text-pink-700 px-3 py-2 rounded-full text-sm border border-pink-200"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Все фотографии */}
            {profile.photos && profile.photos.length > 1 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Фотографии</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setProfilePhotoIndex(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        index === profilePhotoIndex ? 'border-pink-500 scale-95' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <img 
                        src={photo}
                        alt={`${profile.name} фото ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="bg-white p-4 border-t border-gray-100">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Закрыть
            </button>
            
            {/* Кнопка лайка или перехода к чату если уже совпадение */}
            {matches.find(m => m.id === profile.id) ? (
              <button
                onClick={() => {
                  setSelectedMatch(profile);
                  setCurrentView('chats');
                  onClose();
                }}
                className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
              >
                Перейти к чату
              </button>
            ) : (
              <button
                onClick={() => {
                  // Если профиль еще не лайкнут, лайкаем
                  if (!likedProfiles.includes(profile.id)) {
                    setLikedProfiles([...likedProfiles, profile.id]);
                    
                    // Создаем совпадение с высокой вероятностью
                    if (Math.random() > 0.3) {
                      setMatches(prev => {
                        if (prev.find(m => m.id === profile.id)) return prev;
                        return [...prev, profile];
                      });
                      
                      // Показываем окно совпадения
                      setShowFullScreenMatch(profile);
                    }
                  }
                  onClose();
                }}
                className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 4.318c-1.754-1.753-4.596-1.753-6.35 0-1.753 1.754-1.753 4.596 0 6.35L12 17.018l6.35-6.35c1.753-1.754 1.753-4.596 0-6.35-1.754-1.753-4.596-1.753-6.35 0z" />
                </svg>
                Лайк
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProfileView = () => {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="bg-white p-4 shadow-sm border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Мой профиль</h2>
          <p className="text-sm text-gray-500">ID: {currentUser.telegramId}</p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {/* Отладочная информация */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-semibold text-blue-800">Отладочная информация</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Telegram доступен:</strong> {getTelegramWebApp() ? 'Да ✅' : 'Нет ❌'}</p>
              <p><strong>Platform:</strong> {getTelegramWebApp()?.platform || 'Неизвестно'}</p>
              <p><strong>Version:</strong> {getTelegramWebApp()?.version || 'Неизвестно'}</p>
              <p><strong>InitData есть:</strong> {getTelegramWebApp()?.initData ? 'Да ✅' : 'Нет ❌'}</p>
              <p><strong>User данные:</strong> {getTelegramWebApp()?.initDataUnsafe?.user ? 'Есть ✅' : 'Нет ❌'}</p>
              <p><strong>Ошибка авторизации:</strong> {authError || 'Нет'}</p>
            </div>
            <button
              onClick={() => {
                const tg = getTelegramWebApp();
                const debugInfo = {
                  telegramAvailable: !!tg,
                  platform: tg?.platform,
                  version: tg?.version,
                  initData: !!tg?.initData,
                  user: tg?.initDataUnsafe?.user,
                  currentURL: window.location.href,
                  userAgent: navigator.userAgent
                };
                console.log('🔍 ПОЛНАЯ ОТЛАДОЧНАЯ ИНФОРМАЦИЯ:', debugInfo);
                navigator.clipboard?.writeText(JSON.stringify(debugInfo, null, 2));
                alert('Отладочная информация скопирована в консоль и буфер обмена');
              }}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
            >
              Скопировать отладочную информацию
            </button>
          </div>

          {/* Информация об авторизации */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center mb-2">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="font-semibold text-green-800">Авторизован через Telegram</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p><strong>Имя:</strong> {currentUser.firstName} {currentUser.lastName}</p>
              {currentUser.username && <p><strong>Username:</strong> @{currentUser.username}</p>}
              <p><strong>Язык:</strong> {currentUser.languageCode?.toUpperCase() || 'RU'}</p>
              {currentUser.isPremium && (
                <p className="flex items-center">
                  <span className="text-yellow-600 mr-1">⭐</span>
                  <strong>Telegram Premium</strong>
                </p>
              )}
            </div>
          </div>

          <div className="text-center mb-6">
            <img 
              src={currentUser.photos[0]}
              alt={currentUser.name}
              className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-pink-200 mb-4"
            />
            <h3 className="text-2xl font-bold text-gray-800">{currentUser.name}, {currentUser.age}</h3>
            <p className="text-gray-600 mt-2">{currentUser.bio}</p>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Мои интересы</h4>
              <div className="flex flex-wrap gap-2">
                {currentUser.interests.map((interest, index) => (
                  <span 
                    key={index}
                    className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm border border-pink-200"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Мои фотографии</h4>
              <div className="grid grid-cols-3 gap-2">
                {currentUser.photos.map((photo, index) => (
                  <img 
                    key={index}
                    src={photo}
                    alt={`Фото ${index + 1}`}
                    className="aspect-square rounded-lg object-cover border border-gray-200"
                  />
                ))}
              </div>
            </div>

            <button className="w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors mb-3">
              Редактировать профиль
            </button>
            
            <button 
              onClick={() => {
                if (window.confirm('Вы уверены, что хотите удалить ВСЕ чаты и сообщения? Это действие нельзя отменить.')) {
                  clearAllChats();
                  alert('Все чаты и данные очищены');
                }
              }}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              🧹 Очистить все чаты
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Компонент загрузки
  const LoadingView = () => (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-pink-500 to-purple-600">
      <div className="text-white text-center">
        <div className="text-6xl mb-6">💕</div>
        <h1 className="text-3xl font-bold mb-4">True Love</h1>
        <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white/80">
          {!isAuthenticated && !authError ? 'Авторизация...' : 'Загрузка приложения...'}
        </p>
        {authError && (
          <div className="mt-4 p-3 bg-red-500/20 rounded-lg">
            <p className="text-sm text-red-100">⚠️ {authError}</p>
            <div className="space-y-2">
              <button
                onClick={() => authenticateUser()}
                className="w-full px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
              >
                Повторить авторизацию
              </button>
              <button
                onClick={() => {
                  console.log('🔄 Принудительная проверка Telegram данных:');
                  const tg = getTelegramWebApp();
                  if (tg) {
                    console.log('✅ WebApp найден:', tg);
                    console.log('📱 initDataUnsafe:', tg.initDataUnsafe);
                    console.log('👤 User:', tg.initDataUnsafe?.user);
                    if (tg.initDataUnsafe?.user) {
                      alert(`Найден пользователь: ${tg.initDataUnsafe.user.first_name} (ID: ${tg.initDataUnsafe.user.id})`);
                    } else {
                      alert('Пользователь не найден. Откройте приложение через Telegram бота.');
                    }
                  } else {
                    alert('Telegram WebApp не найден. Откройте в Telegram.');
                  }
                }}
                className="w-full px-4 py-2 bg-blue-500/20 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
              >
                Проверить Telegram
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Показываем загрузку пока идет авторизация
  if (!isAuthenticated || !currentUser) {
    return (
      <div 
        className="w-full h-full max-w-md mx-auto flex flex-col relative"
        style={{
          backgroundColor: getTelegramWebApp()?.themeParams?.bg_color || '#FFFFFF',
          color: getTelegramWebApp()?.themeParams?.text_color || '#000000'
        }}
      >
        <LoadingView />
      </div>
    );
  }

  return (
    <>
      <div 
        className="w-full h-full max-w-md mx-auto flex flex-col relative"
        style={{
          backgroundColor: getTelegramWebApp()?.themeParams?.bg_color || '#FFFFFF',
          color: getTelegramWebApp()?.themeParams?.text_color || '#000000'
        }}
      >
        {/* Основное содержимое */}
        <div className="flex-1 overflow-hidden">
          {currentView === 'discover' && <DiscoverView />}
          {currentView === 'chats' && <ChatView />}
          {currentView === 'profile' && <ProfileView />}
        </div>
      
      {/* Tab bar */}
      <div className="bg-white border-t border-gray-200 flex shrink-0">
        <button
          onClick={() => {
            console.log('📱 Клик на вкладку чатов - currentView:', currentView, 'selectedMatch:', selectedMatch);
            
            // Если мы уже в чатах и есть выбранный чат, возвращаемся к списку
            if (currentView === 'chats' && selectedMatch) {
              setSelectedMatch(null);
              console.log('🔙 Возврат к списку чатов из открытого чата');
            } else {
              // При переходе из других вкладок - только меняем вид
              setCurrentView('chats');
              console.log('📱 Переход в раздел чатов');
            }
          }}
          className={`flex-1 py-3 px-4 text-center transition-colors ${
            currentView === 'chats' ? 'text-pink-500' : 'text-gray-400'
          }`}
        >
          <div className="w-6 h-6 mx-auto mb-1">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/>
            </svg>
          </div>
        </button>
        
        <button
          onClick={() => setCurrentView('discover')}
          className={`flex-1 py-3 px-4 text-center transition-colors ${
            currentView === 'discover' ? 'text-pink-500' : 'text-gray-400'
          }`}
        >
          <div className="w-6 h-6 mx-auto mb-1">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </button>
        
        <button
          onClick={() => setCurrentView('profile')}
          className={`flex-1 py-3 px-4 text-center transition-colors ${
            currentView === 'profile' ? 'text-pink-500' : 'text-gray-400'
          }`}
        >
          <div className="w-6 h-6 mx-auto mb-1">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </button>
      </div>

      {/* ПОЛНОЭКРАННОЕ ОКНО СОВПАДЕНИЯ */}
      {showFullScreenMatch && (
        <div 
          className="fixed inset-0 bg-black flex flex-col"
          style={{ zIndex: 9999 }}
        >
          {/* Фон с фотографией девушки */}
          <div 
            className="flex-1 relative bg-cover bg-center"
            style={{ 
              backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url('${showFullScreenMatch.photos[matchPhotoIndex]}')` 
            }}
          >
            {/* Индикаторы фотографий */}
            <div className="absolute top-8 left-4 right-4 flex space-x-1">
              {showFullScreenMatch.photos.map((_, index) => (
                <div
                  key={index}
                  className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                >
                  <div 
                    className={`h-full transition-all duration-300 rounded-full ${
                      index === matchPhotoIndex ? 'bg-white' : 
                      index < matchPhotoIndex ? 'bg-white' : 'bg-transparent'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Кнопка закрытия */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('❌ Окно закрыто через кнопку X - чат должен остаться в списке');
                
                const currentMatch = showFullScreenMatch;
                console.log('🔍 Текущий матч для сохранения:', currentMatch);
                
                // Убеждаемся что чат действительно в списке matches с проверкой дублирования
                setMatches(prevMatches => {
                  const existingMatch = prevMatches.find(m => m.id === currentMatch.id);
                  console.log('🔍 Существующий матч в списке:', existingMatch);
                  console.log('📊 Текущий размер списка matches:', prevMatches.length);
                  
                  if (!existingMatch) {
                    console.log('✅ Добавляем матч в список');
                    const updatedMatches = [...prevMatches, currentMatch];
                    console.log('📋 Обновленный список matches:', updatedMatches);
                    console.log('📊 Новый размер списка:', updatedMatches.length);
                    return updatedMatches;
                  } else {
                    console.log('ℹ️ Матч уже существует в списке');
                    return prevMatches;
                  }
                });
                
                // Принудительно обновляем все состояния
                setForceUpdate(prev => {
                  const newValue = prev + 1;
                  console.log('🔄 ForceUpdate обновлен:', newValue);
                  return newValue;
                });
                
                setMessageUpdate(prev => {
                  const newValue = prev + 1;
                  console.log('🔄 MessageUpdate обновлен:', newValue);
                  return newValue;
                });
                
                // Закрываем окно и переключаем профиль
                setShowFullScreenMatch(null);
                nextProfile();
                
                // Дополнительное принудительное обновление через задержку
                setTimeout(() => {
                  setForceUpdate(prev => prev + 1);
                  setMessageUpdate(prev => prev + 1);
                  console.log('🔄 Дополнительное принудительное обновление выполнено');
                }, 200);
              }}
              className="absolute top-8 right-4 p-3 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Области для переключения фотографий */}
            <div className="absolute inset-0 flex">
              <button 
                className="flex-1"
                onClick={() => setMatchPhotoIndex(prev => 
                  prev > 0 ? prev - 1 : showFullScreenMatch.photos.length - 1
                )}
              />
              <button 
                className="flex-1"
                onClick={() => setMatchPhotoIndex(prev => 
                  prev < showFullScreenMatch.photos.length - 1 ? prev + 1 : 0
                )}
              />
            </div>

            {/* Центральная анимация сердец */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4 animate-pulse">💕</div>
                <h2 className="text-4xl font-bold text-white mb-2 animate-bounce">
                  It's a Match!
                </h2>
                <h3 className="text-2xl font-bold text-white mb-1">
                  Взаимная симпатия
                </h3>
                <p className="text-white/90 text-lg">
                  Вы понравились друг другу!
                </p>
              </div>
            </div>

            {/* Информация о девушке внизу */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="text-center mb-6">
                <h3 className="text-3xl font-bold mb-2">
                  {showFullScreenMatch.name}, {showFullScreenMatch.age}
                </h3>
                <div className="flex justify-center items-center mb-3">
                  <svg className="w-4 h-4 mr-2 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white/90">{showFullScreenMatch.distance} км • {showFullScreenMatch.city}</span>
                </div>
                <p className="text-white/80 text-sm mb-4">{showFullScreenMatch.bio}</p>
                
                {/* Интересы */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {showFullScreenMatch.interests.slice(0, 4).map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Кнопка */}
              <div className="px-4">
                <button
                  onClick={() => {
                    const currentMatch = showFullScreenMatch;
                    console.log('💬 Начать чат - переход к чатам с:', currentMatch.name);
                    
                    // Сначала устанавливаем выбранный чат
                    setSelectedMatch(currentMatch);
                    console.log('✅ Установлен selectedMatch:', currentMatch.name);
                    
                    // Переходим к чатам
                    setCurrentView('chats');
                    console.log('✅ Переход к chats view');
                    
                    // Закрываем полноэкранное окно
                    setShowFullScreenMatch(null);
                    
                    // Переключаем профиль
                    nextProfile();
                    
                    console.log('✅ Переход к чату с:', currentMatch.name);
                  }}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-colors shadow-2xl"
                >
                  Начать чат
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Модальное окно подтверждения удаления */}
        {deletingChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Удалить чат?</h3>
            <p className="text-gray-600 mb-6">
              Все сообщения с {matches.find(m => m.id === deletingChat)?.name || 'этим пользователем'} будут удалены. Это действие нельзя отменить.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setDeletingChat(null)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  
                  const matchIdToDelete = deletingChat; // Используем ID из состояния
                  console.log('🗑️ Подтверждение удаления чата из списка:', matchIdToDelete);
                  
                  // Закрываем модальное окно
                  setDeletingChat(null);
                  
                  // Удаляем чат с задержкой для избежания конфликтов
                  setTimeout(() => {
                    deleteChat(matchIdToDelete);
                  }, 100);
                }}
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                disabled={!deletingChat} // Защита от повторного клика
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* ПРОФИЛЬ ДЕВУШКИ - рендерим вне основного контейнера */}
      {showProfileView && (
        <GirlProfileView 
          profile={showProfileView}
          onClose={() => {
            setShowProfileView(null);
            setProfilePhotoIndex(0);
            console.log('❌ Закрытие профиля девушки');
          }}
        />
      )}

    </>
  );
};

export default DatingApp;