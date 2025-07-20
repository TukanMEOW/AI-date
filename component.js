// <stdin>
import React, { useState, useEffect, useCallback } from "https://esm.sh/react@18.2.0";
var getTelegramWebApp = () => {
  return window.Telegram?.WebApp;
};
var ChatInput = React.memo(({ matchId, onSendMessage }) => {
  const [message, setMessage] = useState("");
  const handleSend = useCallback(() => {
    const messageText = message.trim();
    console.log("\u{1F504} ChatInput handleSend:", { matchId, message: messageText });
    if (messageText) {
      console.log("\u2705 \u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435:", messageText);
      onSendMessage(matchId, messageText);
      setMessage("");
      console.log("\u{1F9F9} \u041E\u0447\u0438\u0449\u0435\u043D input");
    } else {
      console.log("\u274C \u041F\u0443\u0441\u0442\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435, \u043D\u0435 \u043E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C");
    }
  }, [matchId, message, onSendMessage]);
  const handleKeyPress = useCallback((e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);
  const handleChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);
  return /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 border-t border-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: message,
      onChange: handleChange,
      onKeyPress: handleKeyPress,
      placeholder: "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...",
      className: "flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500",
      autoComplete: "off"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleSend,
      className: "p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
    },
    /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }))
  )));
});
var DatingApp = () => {
  const [currentView, setCurrentView] = useState("discover");
  const [currentProfile, setCurrentProfile] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const loadTelegramScript = useCallback(() => {
    return new Promise((resolve) => {
      if (window.Telegram?.WebApp) {
        console.log("\u2705 Telegram WebApp \u0443\u0436\u0435 \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D");
        resolve(window.Telegram.WebApp);
        return;
      }
      const url = window.location.href;
      const hasTelegramParams = url.includes("tgWebAppData=") || url.includes("tgWebAppVersion=");
      if (hasTelegramParams) {
        console.log("\u{1F50D} \u041E\u0431\u043D\u0430\u0440\u0443\u0436\u0435\u043D\u044B \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u044B Telegram \u0432 URL, \u043F\u0430\u0440\u0441\u0438\u043C \u0434\u0430\u043D\u043D\u044B\u0435...");
        try {
          const urlParams = new URLSearchParams(window.location.search);
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          let tgWebAppData = urlParams.get("tgWebAppData") || hashParams.get("tgWebAppData");
          let tgWebAppVersion = urlParams.get("tgWebAppVersion") || hashParams.get("tgWebAppVersion");
          let tgWebAppPlatform = urlParams.get("tgWebAppPlatform") || hashParams.get("tgWebAppPlatform");
          if (tgWebAppData) {
            console.log("\u2705 \u041D\u0430\u0439\u0434\u0435\u043D\u044B \u0434\u0430\u043D\u043D\u044B\u0435 Telegram \u0432 URL");
            const decodedData = decodeURIComponent(tgWebAppData);
            const params = new URLSearchParams(decodedData);
            const userData = JSON.parse(params.get("user") || "{}");
            console.log("\u{1F464} \u0414\u0430\u043D\u043D\u044B\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F \u0438\u0437 URL:", userData);
            const mockTelegram = {
              WebApp: {
                platform: tgWebAppPlatform || "web",
                version: tgWebAppVersion || "6.0",
                initData: tgWebAppData,
                initDataUnsafe: { user: userData },
                ready: () => console.log("\u{1F916} Mock Telegram ready"),
                expand: () => console.log("\u{1F916} Mock Telegram expand"),
                setHeaderColor: (color) => console.log("\u{1F916} Mock setHeaderColor:", color),
                setBackgroundColor: (color) => console.log("\u{1F916} Mock setBackgroundColor:", color),
                MainButton: {
                  setText: (text) => console.log("\u{1F916} Mock MainButton setText:", text),
                  color: "#FF69B4",
                  textColor: "#FFFFFF"
                },
                HapticFeedback: {
                  impactOccurred: (style) => console.log("\u{1F916} Mock HapticFeedback:", style)
                }
              }
            };
            window.Telegram = mockTelegram;
            console.log("\u2705 \u0421\u043E\u0437\u0434\u0430\u043D \u043C\u043E\u043A Telegram WebApp \u0441 \u0440\u0435\u0430\u043B\u044C\u043D\u044B\u043C\u0438 \u0434\u0430\u043D\u043D\u044B\u043C\u0438");
            resolve(mockTelegram.WebApp);
            return;
          }
        } catch (error) {
          console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0430\u0440\u0441\u0438\u043D\u0433\u0430 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438\u0437 URL:", error);
        }
      }
      let existingScript = document.querySelector('script[src*="telegram-web-app.js"]');
      if (existingScript) {
        console.log("\u{1F504} \u0421\u043A\u0440\u0438\u043F\u0442 Telegram \u0443\u0436\u0435 \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D, \u0436\u0434\u0435\u043C \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438...");
        let attempts = 0;
        const checkInterval = setInterval(() => {
          attempts++;
          if (window.Telegram?.WebApp) {
            clearInterval(checkInterval);
            console.log("\u2705 Telegram WebApp \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0438\u0440\u043E\u0432\u0430\u043D \u043F\u043E\u0441\u043B\u0435 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F");
            resolve(window.Telegram.WebApp);
          } else if (attempts > 50) {
            clearInterval(checkInterval);
            console.log("\u23F0 \u0422\u0430\u0439\u043C\u0430\u0443\u0442 \u043E\u0436\u0438\u0434\u0430\u043D\u0438\u044F Telegram WebApp");
            resolve(null);
          }
        }, 100);
        return;
      }
      console.log("\u{1F4E5} \u0414\u0438\u043D\u0430\u043C\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430 Telegram WebApp \u0441\u043A\u0440\u0438\u043F\u0442\u0430...");
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-web-app.js";
      script.async = true;
      script.onload = () => {
        console.log("\u2705 \u0421\u043A\u0440\u0438\u043F\u0442 Telegram \u0437\u0430\u0433\u0440\u0443\u0436\u0435\u043D");
        setTimeout(() => {
          if (window.Telegram?.WebApp) {
            console.log("\u2705 Telegram WebApp \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u043A\u0440\u0438\u043F\u0442\u0430");
            resolve(window.Telegram.WebApp);
          } else {
            console.log("\u274C Telegram WebApp \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D \u0434\u0430\u0436\u0435 \u043F\u043E\u0441\u043B\u0435 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u043A\u0440\u0438\u043F\u0442\u0430");
            resolve(null);
          }
        }, 500);
      };
      script.onerror = () => {
        console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0438 \u0441\u043A\u0440\u0438\u043F\u0442\u0430 Telegram");
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }, []);
  useEffect(() => {
    const initializeApp = async () => {
      console.log("\u{1F680} \u041D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u044E \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F...");
      console.log("\u{1F50D} \u0422\u0435\u043A\u0443\u0449\u0438\u0439 URL:", window.location.href);
      console.log("\u{1F50D} User Agent:", navigator.userAgent);
      try {
        const tg = await loadTelegramScript();
        if (tg) {
          console.log("\u2705 Telegram WebApp \u043D\u0430\u0439\u0434\u0435\u043D!");
          console.log("\u{1F4F1} Platform:", tg.platform);
          console.log("\u{1F4F1} Version:", tg.version);
          console.log("\u{1F4F1} InitData \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B:", !!tg.initData);
          console.log("\u{1F464} User \u0434\u0430\u043D\u043D\u044B\u0435:", tg.initDataUnsafe?.user);
          try {
            tg.ready?.();
            tg.expand?.();
            tg.setHeaderColor?.("#FF69B4");
            tg.setBackgroundColor?.("#FFFFFF");
            if (tg.MainButton) {
              tg.MainButton.setText("\u041D\u0430\u0439\u0442\u0438 \u043F\u0430\u0440\u0443");
              tg.MainButton.color = "#FF69B4";
              tg.MainButton.textColor = "#FFFFFF";
            }
            console.log("\u2705 Telegram WebApp \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D");
          } catch (setupError) {
            console.warn("\u26A0\uFE0F \u041E\u0448\u0438\u0431\u043A\u0430 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 Telegram WebApp:", setupError);
          }
          await authenticateUser(tg);
        } else {
          console.log("\u274C Telegram WebApp \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D");
          const isTestMode = window.confirm("\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0435 \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u043E \u0432 Telegram. \u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0432 \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u043C \u0440\u0435\u0436\u0438\u043C\u0435?");
          if (isTestMode) {
            console.log("\u{1F680} \u0417\u0430\u043F\u0443\u0441\u043A \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
            await authenticateUser(null);
          } else {
            setAuthError("\u041F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0434\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0437\u0430\u043F\u0443\u0449\u0435\u043D\u043E \u0432 Telegram");
          }
        }
      } catch (error) {
        console.error("\u274C \u041A\u0440\u0438\u0442\u0438\u0447\u0435\u0441\u043A\u0430\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438:", error);
        setAuthError(`\u041E\u0448\u0438\u0431\u043A\u0430 \u0438\u043D\u0438\u0446\u0438\u0430\u043B\u0438\u0437\u0430\u0446\u0438\u0438: ${error.message}`);
        const isTestMode = window.confirm("\u041F\u0440\u043E\u0438\u0437\u043E\u0448\u043B\u0430 \u043E\u0448\u0438\u0431\u043A\u0430. \u0417\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u044C \u0432 \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u043C \u0440\u0435\u0436\u0438\u043C\u0435?");
        if (isTestMode) {
          await authenticateUser(null);
        }
      }
    };
    initializeApp();
  }, [loadTelegramScript]);
  const authenticateUser = async (tg) => {
    try {
      console.log("\u{1F510} \u041D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F...");
      let initDataRaw = "";
      if (tg && tg.initData) {
        initDataRaw = tg.initData;
        console.log("\u{1F4F1} InitData \u043F\u043E\u043B\u0443\u0447\u0435\u043D\u044B \u0438\u0437 WebApp API");
      } else {
        console.log("\u26A0\uFE0F InitData \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B");
      }
      if (initDataRaw) {
        console.log("\u{1F4E4} \u041E\u0442\u043F\u0440\u0430\u0432\u043B\u044F\u0435\u043C \u0437\u0430\u043F\u0440\u043E\u0441 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440...");
        const response = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Authorization": `tma ${initDataRaw}`,
            "Content-Type": "application/json"
          }
        });
        if (response.ok) {
          const userData = await response.json();
          console.log("\u2705 \u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D \u0447\u0435\u0440\u0435\u0437 \u0441\u0435\u0440\u0432\u0435\u0440:", userData);
          setIsAuthenticated(true);
          setUserProfile(userData);
          setAuthError(null);
          if (userData.token) {
            setAuthToken(userData.token);
            localStorage.setItem("authToken", userData.token);
          }
          return;
        } else {
          const errorData = await response.json().catch(() => ({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430" }));
          console.warn("\u26A0\uFE0F \u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438 \u043D\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0435:", errorData.error);
        }
      }
      if (tg && tg.initDataUnsafe?.user) {
        console.log("\u{1F504} \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C fallback \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044E \u0441 \u0434\u0430\u043D\u043D\u044B\u043C\u0438 Telegram");
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
        setAuthError("\u0420\u0435\u0436\u0438\u043C \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u043A\u0438 (\u0431\u0435\u0437 \u0431\u044D\u043A\u0435\u043D\u0434\u0430)");
      } else {
        console.log("\u{1F504} \u041F\u043E\u043B\u043D\u044B\u0439 fallback - \u0441\u043E\u0437\u0434\u0430\u0435\u043C \u0442\u0435\u0441\u0442\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
        const testUser = {
          id: Date.now(),
          first_name: "\u041A\u0438\u0440\u0438\u043B\u043B",
          last_name: "\u041B\u0443\u043A\u0438\u0447\u0435\u0432",
          username: "kirill_test",
          language_code: "ru",
          is_premium: false
        };
        setUserProfile(testUser);
        setIsAuthenticated(true);
        setAuthError("\u0422\u0435\u0441\u0442\u043E\u0432\u044B\u0439 \u0440\u0435\u0436\u0438\u043C (\u0431\u0435\u0437 Telegram)");
      }
    } catch (error) {
      console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438:", error);
      setAuthError(error.message);
      setIsAuthenticated(false);
    }
  };
  const [likedProfiles, setLikedProfiles] = useState([]);
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [chatMessages, setChatMessages] = useState({});
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [deletingChat, setDeletingChat] = useState(null);
  const [messageUpdate, setMessageUpdate] = useState(0);
  const [showFullScreenMatch, setShowFullScreenMatch] = useState(null);
  const [matchPhotoIndex, setMatchPhotoIndex] = useState(0);
  const [showProfileView, setShowProfileView] = useState(null);
  const [profilePhotoIndex, setProfilePhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dragDistance, setDragDistance] = useState(0);
  const [isClick, setIsClick] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const currentUser = userProfile ? {
    name: userProfile.first_name || "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C",
    telegramId: userProfile.id,
    username: userProfile.username,
    firstName: userProfile.first_name,
    lastName: userProfile.last_name,
    languageCode: userProfile.language_code,
    isPremium: userProfile.is_premium || false,
    age: 28,
    // Будет заполнено пользователем
    bio: "Frontend \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0447\u0438\u043A, \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0438\u043A, \u043B\u044E\u0431\u0438\u0442\u0435\u043B\u044C \u043A\u043E\u0444\u0435 \u0438 \u0445\u043E\u0440\u043E\u0448\u0435\u0439 \u043C\u0443\u0437\u044B\u043A\u0438",
    interests: ["\u041F\u0440\u043E\u0433\u0440\u0430\u043C\u043C\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435", "\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F", "\u041A\u043E\u0444\u0435", "\u041C\u0443\u0437\u044B\u043A\u0430", "\u0421\u043F\u043E\u0440\u0442"],
    photos: [
      "assets/user_photo1.png?prompt=Young%20professional%20man%20portrait%20casual%20style",
      "assets/user_photo2.png?prompt=Man%20working%20on%20laptop%20modern%20office",
      "assets/user_photo3.png?prompt=Man%20traveling%20mountain%20landscape"
    ]
  } : null;
  const profiles = [
    {
      id: 1,
      name: "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430",
      age: 23,
      city: "\u041C\u043E\u0441\u043A\u0432\u0430",
      distance: 2,
      bio: "\u0418\u0449\u0443 \u0440\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u0434\u0443\u0448\u0443 \u{1F4AB}",
      interests: ["\u041F\u0440\u0430\u0432\u043E\u0441\u043B\u0430\u0432\u0438\u0435", "\u0420\u044B\u0431\u044B", "162\u0441\u043C", "\u0421\u0440\u0435\u0434\u043D\u0435\u0435", "\u041D\u0435\u0442", "\u041D\u0435\u0439\u0442\u0440\u0430\u043B\u044C\u043D\u043E"],
      photos: [
        "assets/ekaterina_1.png?prompt=Beautiful%20young%20brunette%20woman%2023%20years%20old%20elegant%20portrait%20natural%20makeup%20soft%20lighting",
        "assets/ekaterina_2.png?prompt=Young%20brunette%20woman%20in%20orthodox%20church%20praying%20peaceful%20spiritual%20atmosphere",
        "assets/ekaterina_3.png?prompt=Portrait%20young%20woman%20reading%20book%20cozy%20cafe%20intellectual%20style",
        "assets/ekaterina_4.png?prompt=Young%20woman%20in%20nature%20park%20casual%20dress%20gentle%20smile%20golden%20hour"
      ],
      job: "\u0414\u0438\u0437\u0430\u0439\u043D\u0435\u0440",
      education: "\u041C\u0413\u0423",
      height: "162 \u0441\u043C"
    },
    {
      id: 2,
      name: "\u0410\u043D\u043D\u0430",
      age: 25,
      city: "\u041C\u043E\u0441\u043A\u0432\u0430",
      distance: 5,
      bio: "\u041B\u044E\u0431\u043B\u044E \u0436\u0438\u0437\u043D\u044C \u0432\u043E \u0432\u0441\u0435\u0445 \u0435\u0451 \u043F\u0440\u043E\u044F\u0432\u043B\u0435\u043D\u0438\u044F\u0445 \u2728",
      interests: ["\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u044F", "\u0419\u043E\u0433\u0430", "\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F", "\u041C\u043E\u0434\u0430", "\u0418\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u043E"],
      photos: [
        "assets/anna_1.png?prompt=Beautiful%20young%20blonde%20woman%2025%20years%20old%20bohemian%20style%20photographer%20creative%20portrait",
        "assets/anna_2.png?prompt=Young%20blonde%20woman%20doing%20yoga%20pose%20peaceful%20studio%20athletic%20wear",
        "assets/anna_3.png?prompt=Young%20woman%20traveling%20mountain%20landscape%20backpack%20adventure%20style",
        "assets/anna_4.png?prompt=Portrait%20young%20woman%20fashion%20photography%20artistic%20lighting%20modern%20style"
      ],
      job: "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444",
      education: "\u0428\u043A\u043E\u043B\u0430 \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438",
      height: "165 \u0441\u043C"
    },
    {
      id: 3,
      name: "\u041C\u0430\u0440\u0438\u044F",
      age: 26,
      city: "\u041C\u043E\u0441\u043A\u0432\u0430",
      distance: 12,
      bio: "\u0422\u0432\u043E\u0440\u0447\u0435\u0441\u043A\u0430\u044F \u043D\u0430\u0442\u0443\u0440\u0430 \u0432 \u043F\u043E\u0438\u0441\u043A\u0430\u0445 \u0432\u0434\u043E\u0445\u043D\u043E\u0432\u0435\u043D\u0438\u044F \u{1F3A8}",
      interests: ["\u0418\u0441\u043A\u0443\u0441\u0441\u0442\u0432\u043E", "\u0414\u0438\u0437\u0430\u0439\u043D", "\u041A\u0438\u043D\u043E", "\u0416\u0438\u0432\u043E\u043F\u0438\u0441\u044C", "\u041C\u0443\u0437\u044B\u043A\u0430"],
      photos: [
        "assets/maria_1.png?prompt=Beautiful%20young%20redhead%20woman%2026%20years%20old%20artistic%20creative%20style%20warm%20lighting",
        "assets/maria_2.png?prompt=Young%20redhead%20woman%20in%20art%20studio%20painting%20canvas%20creative%20workspace",
        "assets/maria_3.png?prompt=Creative%20young%20woman%20graphic%20design%20workspace%20modern%20office%20artistic",
        "assets/maria_4.png?prompt=Portrait%20young%20artist%20woman%20gallery%20setting%20sophisticated%20artistic%20atmosphere"
      ],
      job: "\u0425\u0443\u0434\u043E\u0436\u043D\u0438\u0446\u0430",
      education: "\u0425\u0443\u0434\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u0430\u044F \u0430\u043A\u0430\u0434\u0435\u043C\u0438\u044F",
      height: "168 \u0441\u043C"
    }
  ];
  const sendMessage = useCallback(async (matchId, message) => {
    console.log("\u{1F4E4} \u041E\u0442\u043F\u0440\u0430\u0432\u043A\u0430 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F:", { matchId, message });
    if (!message.trim()) {
      console.log("\u274C \u041F\u0443\u0441\u0442\u043E\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435, \u043E\u0442\u043C\u0435\u043D\u0430");
      return;
    }
    const userMessage = message.trim();
    const newMsg = {
      id: Date.now(),
      text: userMessage,
      sender: "user",
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    console.log("\u{1F4DD} \u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F:", newMsg);
    setChatMessages((prev) => {
      const existingMessages = prev[matchId] || [];
      const updatedMessages = [...existingMessages, newMsg];
      const updated = {
        ...prev,
        [matchId]: updatedMessages
      };
      console.log("\u{1F4BE} \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F. \u0411\u044B\u043B\u043E:", existingMessages.length, "\u0421\u0442\u0430\u043B\u043E:", updatedMessages.length);
      return updated;
    });
    setMessageUpdate((prev) => prev + 1);
    setForceUpdate((prev) => prev + 1);
    const match = profiles.find((p) => p.id === matchId);
    setTimeout(() => {
      console.log("\u{1F916} \u041D\u0430\u0447\u0438\u043D\u0430\u0435\u043C \u0433\u0435\u043D\u0435\u0440\u0430\u0446\u0438\u044E \u0430\u0432\u0442\u043E\u043E\u0442\u0432\u0435\u0442\u0430 \u0434\u043B\u044F:", userMessage);
      setChatMessages((currentChatMessages) => {
        const currentMessages = currentChatMessages[matchId] || [];
        console.log("\u{1F50D} \u0422\u0435\u043A\u0443\u0449\u0438\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0434\u043B\u044F \u0430\u0432\u0442\u043E\u043E\u0442\u0432\u0435\u0442\u0430:", currentMessages.length);
        const smartResponse = generateSmartResponse(userMessage, currentMessages, match);
        const autoReply = {
          id: Date.now() + Math.random(),
          text: smartResponse,
          sender: "match",
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        };
        console.log("\u{1F916} \u0421\u043E\u0437\u0434\u0430\u043D \u0430\u0432\u0442\u043E\u043E\u0442\u0432\u0435\u0442:", autoReply.text);
        const finalMessages = [...currentMessages, autoReply];
        const updated = {
          ...currentChatMessages,
          [matchId]: finalMessages
        };
        console.log("\u{1F4BE} \u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0430\u0432\u0442\u043E\u043E\u0442\u0432\u0435\u0442. \u0418\u0442\u043E\u0433\u043E \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439:", finalMessages.length);
        console.log("\u{1F4CA} \u0424\u0438\u043D\u0430\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430: \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C =", finalMessages.filter((m) => m.sender === "user").length, "\u0434\u0435\u0432\u0443\u0448\u043A\u0430 =", finalMessages.filter((m) => m.sender === "match").length);
        return updated;
      });
      setMessageUpdate((prev) => prev + 1);
      setForceUpdate((prev) => prev + 1);
    }, 2e3);
  }, []);
  const generateSmartResponse = (userMessage, messageHistory, match) => {
    const msg = userMessage.toLowerCase();
    const isFirstMessage = messageHistory.length <= 1;
    const patterns = {
      greeting: ["\u043F\u0440\u0438\u0432\u0435\u0442", "\u0437\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439", "\u0434\u043E\u0431\u0440\u043E \u0443\u0442\u0440\u043E", "\u0434\u043E\u0431\u0440\u044B\u0439 \u0434\u0435\u043D\u044C", "\u0434\u043E\u0431\u0440\u044B\u0439 \u0432\u0435\u0447\u0435\u0440", "\u0445\u0430\u0439", "\u043F\u0440\u0438\u0432\u0435\u0442\u0438\u043A"],
      questions: ["\u043A\u0430\u043A \u0434\u0435\u043B\u0430", "\u0447\u0442\u043E \u0434\u0435\u043B\u0430\u0435\u0448\u044C", "\u043A\u0430\u043A \u0436\u0438\u0437\u043D\u044C", "\u0447\u0442\u043E \u043D\u043E\u0432\u043E\u0433\u043E", "\u043A\u0430\u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435"],
      compliments: ["\u043A\u0440\u0430\u0441\u0438\u0432\u0430\u044F", "\u043F\u0440\u0435\u043A\u0440\u0430\u0441\u043D\u0430\u044F", "\u043A\u0440\u0430\u0441\u043E\u0442\u0430", "\u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0430\u0441\u044C", "\u0441\u0438\u043C\u043F\u0430\u0442\u0438\u0447\u043D\u0430\u044F"],
      interests: ["\u0445\u043E\u0431\u0431\u0438", "\u0443\u0432\u043B\u0435\u0447\u0435\u043D\u0438\u044F", "\u0438\u043D\u0442\u0435\u0440\u0435\u0441\u044B", "\u0441\u0432\u043E\u0431\u043E\u0434\u043D\u043E\u0435 \u0432\u0440\u0435\u043C\u044F", "\u043B\u044E\u0431\u0438\u0448\u044C"],
      work: ["\u0440\u0430\u0431\u043E\u0442\u0430", "\u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u044F", "\u043A\u0430\u0440\u044C\u0435\u0440\u0430", "\u0434\u0435\u043B\u0430", "\u0442\u0440\u0443\u0434"],
      weekend: ["\u0432\u044B\u0445\u043E\u0434\u043D\u044B\u0435", "\u0441\u0443\u0431\u0431\u043E\u0442\u0430", "\u0432\u043E\u0441\u043A\u0440\u0435\u0441\u0435\u043D\u044C\u0435", "\u043F\u043B\u0430\u043D\u044B", "\u043E\u0442\u0434\u044B\u0445"],
      meeting: ["\u0432\u0441\u0442\u0440\u0435\u0447\u0430", "\u0432\u0441\u0442\u0440\u0435\u0442\u0438\u0442\u044C\u0441\u044F", "\u0443\u0432\u0438\u0434\u0435\u0442\u044C\u0441\u044F", "\u0441\u0432\u0438\u0434\u0430\u043D\u0438\u0435", "\u043A\u043E\u0444\u0435", "\u043F\u043E\u0433\u0443\u043B\u044F\u0442\u044C"],
      travel: ["\u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u0435", "\u043F\u043E\u0435\u0437\u0434\u043A\u0430", "\u043E\u0442\u043F\u0443\u0441\u043A", "\u0441\u0442\u0440\u0430\u043D\u0430", "\u0433\u043E\u0440\u043E\u0434"]
    };
    let responseType = "general";
    for (const [type, words] of Object.entries(patterns)) {
      if (words.some((word) => msg.includes(word))) {
        responseType = type;
        break;
      }
    }
    let responses = [];
    if (isFirstMessage) {
      responses = [
        `\u041F\u0440\u0438\u0432\u0435\u0442! \u041E\u0447\u0435\u043D\u044C \u043F\u0440\u0438\u044F\u0442\u043D\u043E \u043F\u043E\u0437\u043D\u0430\u043A\u043E\u043C\u0438\u0442\u044C\u0441\u044F! \u{1F60A}`,
        `\u041F\u0440\u0438\u0432\u0435\u0442! \u0420\u0430\u0434\u0430, \u0447\u0442\u043E \u043C\u044B \u0441\u043E\u0432\u043F\u0430\u043B\u0438! \u2728`,
        `\u041F\u0440\u0438\u0432\u0435\u0442\u0438\u043A! \u0421\u043F\u0430\u0441\u0438\u0431\u043E \u0437\u0430 \u043B\u0430\u0439\u043A, \u0442\u0432\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0442\u043E\u0436\u0435 \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0441\u044F! \u{1F495}`,
        `\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439! \u041A\u0430\u043A \u0434\u0435\u043B\u0430? \u{1F60A}`
      ];
    } else {
      switch (responseType) {
        case "greeting":
          responses = [
            `\u041F\u0440\u0438\u0432\u0435\u0442! \u0425\u043E\u0440\u043E\u0448\u043E, \u0447\u0442\u043E \u043F\u0438\u0448\u0435\u0448\u044C! \u{1F60A}`,
            `\u041F\u0440\u0438\u0432\u0435\u0442\u0438\u043A! \u0420\u0430\u0434\u0430 \u0442\u0435\u0431\u044F \u0432\u0438\u0434\u0435\u0442\u044C! \u2728`,
            `\u0417\u0434\u0440\u0430\u0432\u0441\u0442\u0432\u0443\u0439! \u041A\u0430\u043A \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D\u0438\u0435? \u{1F60A}`
          ];
          break;
        case "questions":
          responses = [
            `\u041E\u0442\u043B\u0438\u0447\u043D\u043E! \u0422\u043E\u043B\u044C\u043A\u043E \u0447\u0442\u043E ${match.name === "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430" ? "\u0438\u0437 \u0446\u0435\u0440\u043A\u0432\u0438 \u0432\u0435\u0440\u043D\u0443\u043B\u0430\u0441\u044C" : match.name === "\u0410\u043D\u043D\u0430" ? "\u0441 \u0439\u043E\u0433\u0438 \u043F\u0440\u0438\u0448\u043B\u0430" : "\u0440\u0438\u0441\u043E\u0432\u0430\u043B\u0430"} \u{1F60A} \u0410 \u0443 \u0442\u0435\u0431\u044F \u043A\u0430\u043A \u0434\u0435\u043B\u0430?`,
            `\u0425\u043E\u0440\u043E\u0448\u043E! \u0420\u0430\u0431\u043E\u0442\u0430\u044E ${match.job === "\u0414\u0438\u0437\u0430\u0439\u043D\u0435\u0440" ? "\u043D\u0430\u0434 \u043D\u043E\u0432\u044B\u043C \u043F\u0440\u043E\u0435\u043A\u0442\u043E\u043C" : match.job === "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444" ? "\u043D\u0430\u0434 \u0444\u043E\u0442\u043E\u0441\u0435\u0441\u0441\u0438\u0435\u0439" : "\u043D\u0430\u0434 \u043A\u0430\u0440\u0442\u0438\u043D\u043E\u0439"} \u{1F3A8} \u041A\u0430\u043A \u0442\u0432\u043E\u0438 \u0434\u0435\u043B\u0430?`,
            `\u0417\u0430\u043C\u0435\u0447\u0430\u0442\u0435\u043B\u044C\u043D\u043E! \u0414\u0443\u043C\u0430\u044E \u043E ${match.interests[0].toLowerCase()} \u{1F60A} \u0410 \u0447\u0442\u043E \u0443 \u0442\u0435\u0431\u044F \u043D\u043E\u0432\u043E\u0433\u043E?`
          ];
          break;
        case "compliments":
          responses = [
            `\u0421\u043F\u0430\u0441\u0438\u0431\u043E! \u041E\u0447\u0435\u043D\u044C \u043F\u0440\u0438\u044F\u0442\u043D\u043E! \u{1F60A} \u0422\u044B \u0442\u043E\u0436\u0435 \u0441\u0438\u043C\u043F\u0430\u0442\u0438\u0447\u043D\u044B\u0439!`,
            `\u041E\u0439, \u0441\u043F\u0430\u0441\u0438\u0431\u043E! \u0421\u043C\u0443\u0449\u0430\u0435\u0448\u044C \u043C\u0435\u043D\u044F! \u{1F60A}\u2728`,
            `\u0411\u043B\u0430\u0433\u043E\u0434\u0430\u0440\u044E! \u041C\u043D\u0435 \u0442\u043E\u0436\u0435 \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0441\u044F \u0442\u0432\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C! \u{1F495}`
          ];
          break;
        case "interests":
          const mainInterest = match.interests[0];
          responses = [
            `\u041E\u0447\u0435\u043D\u044C \u043B\u044E\u0431\u043B\u044E ${mainInterest.toLowerCase()}! ${match.name === "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430" ? "\u042D\u0442\u043E \u0434\u0430\u0435\u0442 \u043C\u043D\u0435 \u0443\u043C\u0438\u0440\u043E\u0442\u0432\u043E\u0440\u0435\u043D\u0438\u0435" : match.name === "\u0410\u043D\u043D\u0430" ? "\u041F\u043E\u043C\u043E\u0433\u0430\u0435\u0442 \u043D\u0430\u0439\u0442\u0438 \u0431\u0430\u043B\u0430\u043D\u0441" : "\u042D\u0442\u043E \u043C\u043E\u044F \u0441\u0442\u0440\u0430\u0441\u0442\u044C!"} \u{1F60A} \u0410 \u0442\u044B \u0447\u0435\u043C \u0443\u0432\u043B\u0435\u043A\u0430\u0435\u0448\u044C\u0441\u044F?`,
            `\u041C\u043E\u0438 \u043E\u0441\u043D\u043E\u0432\u043D\u044B\u0435 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u044B - ${match.interests.slice(0, 2).map((i) => i.toLowerCase()).join(" \u0438 ")} \u{1F3A8} \u0410 \u0447\u0442\u043E \u0442\u0435\u0431\u0435 \u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F?`,
            `\u041E\u0431\u043E\u0436\u0430\u044E ${mainInterest.toLowerCase()}! \u0410 \u0443 \u0442\u0435\u0431\u044F \u0435\u0441\u0442\u044C \u0445\u043E\u0431\u0431\u0438? \u{1F60A}`
          ];
          break;
        case "work":
          responses = [
            `\u0420\u0430\u0431\u043E\u0442\u0430\u044E ${match.job === "\u0414\u0438\u0437\u0430\u0439\u043D\u0435\u0440" ? "\u0434\u0438\u0437\u0430\u0439\u043D\u0435\u0440\u043E\u043C - \u0441\u043E\u0437\u0434\u0430\u044E \u043A\u0440\u0430\u0441\u043E\u0442\u0443" : match.job === "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444" ? "\u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u043E\u043C - \u043B\u043E\u0432\u043B\u044E \u043C\u043E\u043C\u0435\u043D\u0442\u044B" : "\u0445\u0443\u0434\u043E\u0436\u043D\u0438\u0446\u0435\u0439 - \u0440\u0438\u0441\u0443\u044E \u043C\u0438\u0440"} \u{1F3A8} \u0410 \u0442\u044B \u0447\u0435\u043C \u0437\u0430\u043D\u0438\u043C\u0430\u0435\u0448\u044C\u0441\u044F?`,
            `\u041C\u043E\u044F \u0440\u0430\u0431\u043E\u0442\u0430 - ${match.job.toLowerCase()}, \u043E\u0447\u0435\u043D\u044C \u043B\u044E\u0431\u043B\u044E \u0442\u043E, \u0447\u0442\u043E \u0434\u0435\u043B\u0430\u044E! \u{1F60A} \u0410 \u0442\u0432\u043E\u044F \u043F\u0440\u043E\u0444\u0435\u0441\u0441\u0438\u044F?`,
            `${match.job} - \u044D\u0442\u043E \u043C\u043E\u044F \u0441\u0442\u0440\u0430\u0441\u0442\u044C! \u{1F495} \u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438 \u043E \u0441\u0432\u043E\u0435\u0439 \u0440\u0430\u0431\u043E\u0442\u0435!`
          ];
          break;
        case "weekend":
          responses = [
            `\u041F\u043B\u0430\u043D\u0438\u0440\u0443\u044E ${match.name === "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430" ? "\u0441\u0445\u043E\u0434\u0438\u0442\u044C \u0432 \u0446\u0435\u0440\u043A\u043E\u0432\u044C \u0438 \u043F\u043E\u0447\u0438\u0442\u0430\u0442\u044C" : match.name === "\u0410\u043D\u043D\u0430" ? "\u0439\u043E\u0433\u0443 \u0438 \u0444\u043E\u0442\u043E\u043F\u0440\u043E\u0433\u0443\u043B\u043A\u0443" : "\u0440\u0438\u0441\u043E\u0432\u0430\u0442\u044C \u0438 \u0441\u0445\u043E\u0434\u0438\u0442\u044C \u0432 \u0433\u0430\u043B\u0435\u0440\u0435\u044E"} \u{1F60A} \u0410 \u0442\u0432\u043E\u0438 \u043F\u043B\u0430\u043D\u044B?`,
            `\u0425\u043E\u0447\u0443 \u0437\u0430\u043D\u044F\u0442\u044C\u0441\u044F ${match.interests[0].toLowerCase()} \u0438 \u043E\u0442\u0434\u043E\u0445\u043D\u0443\u0442\u044C! \u0410 \u0442\u044B \u043A\u0430\u043A \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0448\u044C \u0432\u044B\u0445\u043E\u0434\u043D\u044B\u0435? \u{1F389}`,
            `\u0414\u0443\u043C\u0430\u044E \u043F\u043E\u0441\u0432\u044F\u0442\u0438\u0442\u044C \u0432\u0440\u0435\u043C\u044F ${match.interests[0].toLowerCase()} \u{1F60A} \u0410 \u0443 \u0442\u0435\u0431\u044F \u0435\u0441\u0442\u044C \u043F\u043B\u0430\u043D\u044B?`
          ];
          break;
        case "meeting":
          responses = [
            `\u0411\u044B\u043B\u043E \u0431\u044B \u0437\u0434\u043E\u0440\u043E\u0432\u043E \u0432\u0441\u0442\u0440\u0435\u0442\u0438\u0442\u044C\u0441\u044F! \u2615 \u041C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C, ${match.name === "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430" ? "\u043F\u0440\u043E\u0433\u0443\u043B\u044F\u0435\u043C\u0441\u044F \u043F\u043E \u043F\u0430\u0440\u043A\u0443" : match.name === "\u0410\u043D\u043D\u0430" ? "\u0441\u0445\u043E\u0434\u0438\u043C \u043D\u0430 \u0432\u044B\u0441\u0442\u0430\u0432\u043A\u0443" : "\u043F\u043E\u0441\u0435\u0442\u0438\u043C \u0430\u0440\u0442-\u043F\u0440\u043E\u0441\u0442\u0440\u0430\u043D\u0441\u0442\u0432\u043E"}? \u{1F60A}`,
            `\u041C\u043D\u0435 \u0442\u043E\u0436\u0435 \u0445\u043E\u0442\u0435\u043B\u043E\u0441\u044C \u0431\u044B \u0432\u0441\u0442\u0440\u0435\u0442\u0438\u0442\u044C\u0441\u044F! \u{1F495} \u0413\u0434\u0435 \u043B\u044E\u0431\u0438\u0448\u044C \u043F\u0440\u043E\u0432\u043E\u0434\u0438\u0442\u044C \u0432\u0440\u0435\u043C\u044F?`,
            `\u041E\u0442\u043B\u0438\u0447\u043D\u0430\u044F \u0438\u0434\u0435\u044F! ${match.name === "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430" ? "\u041C\u043E\u0436\u0435\u0442, \u0432 \u0443\u044E\u0442\u043D\u043E\u043C \u043A\u0430\u0444\u0435?" : match.name === "\u0410\u043D\u043D\u0430" ? "\u041C\u043E\u0436\u0435\u0442, \u043D\u0430 \u043F\u0440\u0438\u0440\u043E\u0434\u0435?" : "\u0412 \u043A\u0430\u043A\u043E\u043C-\u0442\u043E \u0442\u0432\u043E\u0440\u0447\u0435\u0441\u043A\u043E\u043C \u043C\u0435\u0441\u0442\u0435?"} \u2728`
          ];
          break;
        case "travel":
          responses = [
            `\u041E\u0431\u043E\u0436\u0430\u044E \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F! ${match.name === "\u0410\u043D\u043D\u0430" ? "\u041D\u0435\u0434\u0430\u0432\u043D\u043E \u0431\u044B\u043B\u0430 \u0432 \u0433\u043E\u0440\u0430\u0445 - \u043F\u043E\u0442\u0440\u044F\u0441\u0430\u044E\u0449\u0438\u0435 \u0432\u0438\u0434\u044B!" : "\u041C\u0435\u0447\u0442\u0430\u044E \u043F\u043E\u0441\u0435\u0442\u0438\u0442\u044C \u0415\u0432\u0440\u043E\u043F\u0443"} \u{1F5FA}\uFE0F \u0410 \u0442\u044B \u043A\u0443\u0434\u0430 \u043B\u044E\u0431\u0438\u0448\u044C \u0435\u0437\u0434\u0438\u0442\u044C?`,
            `\u041F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0438\u044F - \u044D\u0442\u043E \u0442\u0430\u043A \u0432\u0434\u043E\u0445\u043D\u043E\u0432\u043B\u044F\u0435\u0442! \u041E\u0441\u043E\u0431\u0435\u043D\u043D\u043E \u0434\u043B\u044F ${match.job.toLowerCase()} \u{1F60A} \u041A\u0430\u043A\u0438\u0435 \u0441\u0442\u0440\u0430\u043D\u044B \u0442\u0435\u0431\u0435 \u043D\u0440\u0430\u0432\u044F\u0442\u0441\u044F?`,
            `\u0414\u0430, \u043B\u044E\u0431\u043B\u044E \u043E\u0442\u043A\u0440\u044B\u0432\u0430\u0442\u044C \u043D\u043E\u0432\u044B\u0435 \u043C\u0435\u0441\u0442\u0430! \u0410 \u0442\u044B \u0447\u0430\u0441\u0442\u043E \u043F\u0443\u0442\u0435\u0448\u0435\u0441\u0442\u0432\u0443\u0435\u0448\u044C? \u2708\uFE0F`
          ];
          break;
        default:
          responses = [
            `\u0418\u043D\u0442\u0435\u0440\u0435\u0441\u043D\u043E! \u0420\u0430\u0441\u0441\u043A\u0430\u0436\u0438 \u0431\u043E\u043B\u044C\u0448\u0435 \u{1F60A}`,
            `\u041F\u043E\u043D\u0438\u043C\u0430\u044E \u0442\u0435\u0431\u044F! ${match.name === "\u0415\u043A\u0430\u0442\u0435\u0440\u0438\u043D\u0430" ? "\u042F \u0442\u043E\u0436\u0435 \u0438\u043D\u043E\u0433\u0434\u0430 \u0442\u0430\u043A \u0434\u0443\u043C\u0430\u044E" : match.name === "\u0410\u043D\u043D\u0430" ? "\u041C\u043D\u0435 \u0431\u043B\u0438\u0437\u043A\u0430 \u044D\u0442\u0430 \u0442\u0435\u043C\u0430" : "\u0417\u0432\u0443\u0447\u0438\u0442 \u0437\u0430\u0445\u0432\u0430\u0442\u044B\u0432\u0430\u044E\u0449\u0435"} \u2728`,
            `\u0421\u043E\u0433\u043B\u0430\u0441\u043D\u0430! \u0410 \u043A\u0430\u043A \u0442\u044B \u043A \u044D\u0442\u043E\u043C\u0443 \u043F\u0440\u0438\u0448\u0435\u043B? \u{1F914}`,
            `\u041C\u043D\u0435 \u043D\u0440\u0430\u0432\u0438\u0442\u0441\u044F \u0442\u0432\u043E\u0439 \u0432\u0437\u0433\u043B\u044F\u0434 \u043D\u0430 \u0432\u0435\u0449\u0438! \u{1F495}`,
            `\u041A\u043B\u0430\u0441\u0441\u043D\u043E! ${match.interests[0]} \u0442\u043E\u0436\u0435 \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C \u0441\u0432\u044F\u0437\u0430\u043D\u043E \u0441 \u044D\u0442\u0438\u043C \u{1F60A}`
          ];
      }
    }
    return responses[Math.floor(Math.random() * responses.length)];
  };
  const clearAllChats = useCallback(() => {
    console.log("\u{1F9F9} \u041E\u0447\u0438\u0441\u0442\u043A\u0430 \u0432\u0441\u0435\u0445 \u0447\u0430\u0442\u043E\u0432");
    setSelectedMatch(null);
    setDeletingChat(null);
    setShowFullScreenMatch(null);
    setShowProfileView(null);
    setMatches([]);
    setChatMessages({});
    setLikedProfiles([]);
    console.log("\u2705 \u0412\u0441\u0435 \u0447\u0430\u0442\u044B \u043E\u0447\u0438\u0449\u0435\u043D\u044B");
  }, []);
  const makeAuthenticatedRequest = useCallback(async (url, options = {}) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        ...options.headers
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      } else {
        const tg = getTelegramWebApp();
        if (tg && tg.initData) {
          headers["Authorization"] = `tma ${tg.initData}`;
        }
      }
      const response = await fetch(url, {
        ...options,
        headers
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "\u041E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430" }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 API \u0437\u0430\u043F\u0440\u043E\u0441\u0430:", error);
      throw error;
    }
  }, [authToken]);
  const deleteChat = useCallback((matchId) => {
    console.log("\u{1F5D1}\uFE0F \u0423\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0447\u0430\u0442\u0430:", matchId);
    if (selectedMatch && selectedMatch.id === matchId) {
      setSelectedMatch(null);
    }
    setMatches((prev) => prev.filter((match) => match.id !== matchId));
    setLikedProfiles((prev) => prev.filter((id) => id !== matchId));
    setChatMessages((prev) => {
      const updated = { ...prev };
      delete updated[matchId];
      return updated;
    });
    console.log("\u2705 \u0427\u0430\u0442 \u0443\u0434\u0430\u043B\u0435\u043D:", matchId);
  }, [selectedMatch]);
  const handleLike = () => {
    const tg = getTelegramWebApp();
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("light");
    }
    const profile = profiles[currentProfile];
    if (!likedProfiles.includes(profile.id)) {
      setLikedProfiles([...likedProfiles, profile.id]);
      if (Math.random() > 0.3) {
        const existingMatch = matches.find((m) => m.id === profile.id);
        if (!existingMatch) {
          setChatMessages((prevMessages) => {
            console.log("\u{1F9F9} \u041F\u0420\u0418\u041D\u0423\u0414\u0418\u0422\u0415\u041B\u042C\u041D\u0410\u042F \u043E\u0447\u0438\u0441\u0442\u043A\u0430 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0434\u043B\u044F", profile.name, "ID:", profile.id);
            console.log("\u{1F50D} \u0422\u0435\u043A\u0443\u0449\u0438\u0435 \u043A\u043B\u044E\u0447\u0438 \u0432 chatMessages:", Object.keys(prevMessages));
            console.log("\u{1F50D} \u0421\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u043B\u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044F \u0434\u043B\u044F ID", profile.id, ":", !!prevMessages[profile.id]);
            if (prevMessages[profile.id]) {
              console.log("\u{1F5D1}\uFE0F \u041D\u0410\u0419\u0414\u0415\u041D\u0410 \u0441\u0442\u0430\u0440\u0430\u044F \u0438\u0441\u0442\u043E\u0440\u0438\u044F! \u0423\u0434\u0430\u043B\u044F\u0435\u043C", (prevMessages[profile.id] || []).length, "\u0441\u0442\u0430\u0440\u044B\u0445 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439");
            }
            const cleanMessages = {};
            Object.keys(prevMessages).forEach((key) => {
              if (key !== profile.id.toString()) {
                cleanMessages[key] = prevMessages[key];
              }
            });
            console.log("\u2705 \u0427\u0418\u0421\u0422\u042B\u0415 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u043E\u0447\u0438\u0441\u0442\u043A\u0438:", Object.keys(cleanMessages));
            console.log("\u{1F525} \u0413\u0410\u0420\u0410\u041D\u0422\u0418\u042F: \u0434\u043B\u044F ID", profile.id, "\u0438\u0441\u0442\u043E\u0440\u0438\u044F \u041F\u041E\u041B\u041D\u041E\u0421\u0422\u042C\u042E \u0423\u0414\u0410\u041B\u0415\u041D\u0410");
            return cleanMessages;
          });
          setMatches((prevMatches) => {
            const doubleCheck = prevMatches.find((m) => m.id === profile.id);
            if (doubleCheck) {
              console.log("\u26A0\uFE0F \u0414\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0435\u0434\u043E\u0442\u0432\u0440\u0430\u0449\u0435\u043D\u043E - \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442");
              return prevMatches;
            }
            const newMatches = [...prevMatches, profile];
            console.log("\u{1F495} \u0421\u043E\u0437\u0434\u0430\u043D\u043E \u041D\u041E\u0412\u041E\u0415 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0441 \u0427\u0418\u0421\u0422\u041E\u0419 \u0438\u0441\u0442\u043E\u0440\u0438\u0435\u0439:", profile.name);
            console.log("\u{1F50D} \u041D\u043E\u0432\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A matches:", newMatches);
            console.log("\u{1F4CA} DEBUG - \u0420\u0430\u0437\u043C\u0435\u0440 \u043D\u043E\u0432\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430:", newMatches.length);
            return newMatches;
          });
          setForceUpdate((prev) => {
            const newValue = prev + 1;
            console.log("\u{1F504} ForceUpdate \u0432 Like:", newValue);
            return newValue;
          });
          setMessageUpdate((prev) => {
            const newValue = prev + 1;
            console.log("\u{1F504} MessageUpdate \u0432 Like:", newValue);
            return newValue;
          });
          setShowFullScreenMatch(profile);
          setMatchPhotoIndex(0);
          console.log("\u{1F389} \u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0435 \u043E\u043A\u043D\u043E \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F");
          return;
        }
      }
    }
    nextProfile();
  };
  const handleSuperLike = () => {
    const tg = getTelegramWebApp();
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("medium");
    }
    const profile = profiles[currentProfile];
    console.log("\u2B50 \u0421\u0443\u043F\u0435\u0440 \u043B\u0430\u0439\u043A \u043D\u0430\u0436\u0430\u0442 \u0434\u043B\u044F:", profile.name);
    console.log("\u{1F50D} DEBUG - \u0422\u0435\u043A\u0443\u0449\u0438\u0435 matches:", matches);
    console.log("\u{1F50D} DEBUG - \u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F:", matches.find((m) => m.id === profile.id));
    console.log("\u{1F50D} DEBUG - \u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0443\u0436\u0435 \u043B\u0430\u0439\u043A\u043D\u0443\u0442?", likedProfiles.includes(profile.id));
    if (!likedProfiles.includes(profile.id)) {
      setLikedProfiles([...likedProfiles, profile.id]);
      console.log("\u2705 \u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D \u0432 \u043B\u0430\u0439\u043A\u043D\u0443\u0442\u044B\u0435");
    }
    const existingMatch = matches.find((m) => m.id === profile.id);
    console.log("\u{1F50D} DEBUG - \u0421\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0435\u0435 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435:", existingMatch);
    if (!existingMatch) {
      setChatMessages((prevMessages) => {
        console.log("\u{1F9F9} \u0421\u0423\u041F\u0415\u0420 \u041B\u0410\u0419\u041A: \u041F\u0420\u0418\u041D\u0423\u0414\u0418\u0422\u0415\u041B\u042C\u041D\u0410\u042F \u043E\u0447\u0438\u0441\u0442\u043A\u0430 \u0438\u0441\u0442\u043E\u0440\u0438\u0438 \u0434\u043B\u044F", profile.name, "ID:", profile.id);
        console.log("\u{1F50D} \u0422\u0435\u043A\u0443\u0449\u0438\u0435 \u043A\u043B\u044E\u0447\u0438 \u0432 chatMessages:", Object.keys(prevMessages));
        console.log("\u{1F50D} \u0421\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u043B\u0438 \u0438\u0441\u0442\u043E\u0440\u0438\u044F \u0434\u043B\u044F ID", profile.id, ":", !!prevMessages[profile.id]);
        if (prevMessages[profile.id]) {
          console.log("\u{1F5D1}\uFE0F \u041D\u0410\u0419\u0414\u0415\u041D\u0410 \u0441\u0442\u0430\u0440\u0430\u044F \u0438\u0441\u0442\u043E\u0440\u0438\u044F! \u0423\u0434\u0430\u043B\u044F\u0435\u043C", (prevMessages[profile.id] || []).length, "\u0441\u0442\u0430\u0440\u044B\u0445 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439");
        }
        const cleanMessages = {};
        Object.keys(prevMessages).forEach((key) => {
          if (key !== profile.id.toString()) {
            cleanMessages[key] = prevMessages[key];
          }
        });
        console.log("\u2705 \u0427\u0418\u0421\u0422\u042B\u0415 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u043F\u043E\u0441\u043B\u0435 \u0421\u0423\u041F\u0415\u0420 \u043E\u0447\u0438\u0441\u0442\u043A\u0438:", Object.keys(cleanMessages));
        console.log("\u{1F525} \u0413\u0410\u0420\u0410\u041D\u0422\u0418\u042F: \u0434\u043B\u044F \u0421\u0423\u041F\u0415\u0420 \u041B\u0410\u0419\u041A\u0410 ID", profile.id, "\u0438\u0441\u0442\u043E\u0440\u0438\u044F \u041F\u041E\u041B\u041D\u041E\u0421\u0422\u042C\u042E \u0423\u0414\u0410\u041B\u0415\u041D\u0410");
        return cleanMessages;
      });
      setMatches((prevMatches) => {
        const doubleCheck = prevMatches.find((m) => m.id === profile.id);
        if (doubleCheck) {
          console.log("\u26A0\uFE0F \u0414\u0443\u0431\u043B\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u0435 \u043F\u0440\u0435\u0434\u043E\u0442\u0432\u0440\u0430\u0449\u0435\u043D\u043E - \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442");
          return prevMatches;
        }
        const newMatches = [...prevMatches, profile];
        console.log("\u{1F495} \u0421\u043E\u0437\u0434\u0430\u043D\u043E \u0421\u0423\u041F\u0415\u0420 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0441 \u0427\u0418\u0421\u0422\u041E\u0419 \u0438\u0441\u0442\u043E\u0440\u0438\u0435\u0439:", profile.name);
        console.log("\u{1F50D} DEBUG - \u041D\u043E\u0432\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A matches:", newMatches);
        console.log("\u{1F4CA} DEBUG - \u0420\u0430\u0437\u043C\u0435\u0440 \u043D\u043E\u0432\u043E\u0433\u043E \u0441\u043F\u0438\u0441\u043A\u0430:", newMatches.length);
        return newMatches;
      });
      setForceUpdate((prev) => {
        const newValue = prev + 1;
        console.log("\u{1F504} ForceUpdate \u0432 SuperLike:", newValue);
        return newValue;
      });
      setMessageUpdate((prev) => {
        const newValue = prev + 1;
        console.log("\u{1F504} MessageUpdate \u0432 SuperLike:", newValue);
        return newValue;
      });
    } else {
      console.log("\u26A0\uFE0F \u0421\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442, \u043D\u043E \u0432\u0441\u0435 \u0440\u0430\u0432\u043D\u043E \u043F\u043E\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C \u043E\u043A\u043D\u043E");
    }
    setShowFullScreenMatch(profile);
    setMatchPhotoIndex(0);
    console.log("\u{1F389} \u041F\u043E\u043A\u0430\u0437\u0430\u043D\u043E \u043F\u043E\u043B\u043D\u043E\u044D\u043A\u0440\u0430\u043D\u043D\u043E\u0435 \u043E\u043A\u043D\u043E \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F");
    console.log("\u{1F50D} Debug - showFullScreenMatch:", profile);
    console.log("\u{1F50D} Debug - matchPhotoIndex:", 0);
    return;
  };
  const handleDislike = () => {
    const tg = getTelegramWebApp();
    if (tg && tg.HapticFeedback) {
      tg.HapticFeedback.impactOccurred("light");
    }
    nextProfile();
  };
  const nextProfile = () => {
    setCurrentProfile((prev) => (prev + 1) % profiles.length);
    setCurrentPhotoIndex(0);
  };
  const handleStart = (clientX, clientY) => {
    console.log("\u{1F3AF} \u041D\u0430\u0447\u0430\u043B\u043E \u043A\u0430\u0441\u0430\u043D\u0438\u044F \u0434\u043B\u044F \u0441\u0432\u0430\u0439\u043F\u0430");
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
    setDragDistance(0);
    setDragOffset({ x: 0, y: 0 });
    setIsClick(true);
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
    if (distance > 5) {
      setIsClick(false);
    }
    setDragOffset({ x: deltaX, y: deltaY });
    setDragDistance(distance);
    console.log("\u{1F4F1} \u0421\u0432\u0430\u0439\u043F \u0434\u0432\u0438\u0436\u0435\u043D\u0438\u0435:", { deltaX, deltaY, distance });
  };
  const handleEnd = () => {
    if (!isDragging) return;
    console.log("\u{1F6D1} \u041A\u043E\u043D\u0435\u0446 \u043A\u0430\u0441\u0430\u043D\u0438\u044F", { dragDistance, dragOffset, isClick });
    const threshold = 60;
    if (!isClick && dragDistance > 20 && Math.abs(dragOffset.x) > threshold) {
      console.log("\u2705 \u0421\u0432\u0430\u0439\u043F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D:", dragOffset.x > 0 ? "LIKE" : "DISLIKE");
      if (dragOffset.x > 0) {
        handleLike();
      } else {
        handleDislike();
      }
    }
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
    setDragDistance(0);
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
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, startPos, dragOffset]);
  useEffect(() => {
    try {
      localStorage.setItem("matches", JSON.stringify(matches));
      console.log("\u{1F4BE} \u0410\u0432\u0442\u043E\u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 matches:", matches.length);
    } catch (e) {
      console.log("\u26A0\uFE0F \u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F matches:", e);
    }
  }, [matches]);
  useEffect(() => {
    try {
      localStorage.setItem("likedProfiles", JSON.stringify(likedProfiles));
      console.log("\u{1F4BE} \u0410\u0432\u0442\u043E\u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u0435 likedProfiles:", likedProfiles.length);
    } catch (e) {
      console.log("\u26A0\uFE0F \u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F likedProfiles:", e);
    }
  }, [likedProfiles]);
  useEffect(() => {
    console.log("\u{1F504} \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439 \u0432 \u0440\u0435\u0430\u043B\u044C\u043D\u043E\u043C \u0432\u0440\u0435\u043C\u0435\u043D\u0438:", messageUpdate);
  }, [messageUpdate, chatMessages]);
  useEffect(() => {
    console.log("\u{1F50D} useEffect - showFullScreenMatch:", !!showFullScreenMatch, showFullScreenMatch?.name);
    if (showFullScreenMatch && showFullScreenMatch.photos && showFullScreenMatch.photos.length > 1) {
      console.log("\u{1F504} \u0417\u0430\u043F\u0443\u0441\u043A \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0439");
      const interval = setInterval(() => {
        setMatchPhotoIndex((prev) => {
          const newIndex = (prev + 1) % showFullScreenMatch.photos.length;
          console.log("\u{1F4F8} \u041F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0444\u043E\u0442\u043E:", prev, "->", newIndex);
          return newIndex;
        });
      }, 3e3);
      return () => {
        console.log("\u23F9\uFE0F \u041E\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0430\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0433\u043E \u043F\u0435\u0440\u0435\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F");
        clearInterval(interval);
      };
    }
  }, [showFullScreenMatch]);
  useEffect(() => {
    if (showProfileView && showProfileView.photos && showProfileView.photos.length > 1) {
      const interval = setInterval(() => {
        setProfilePhotoIndex((prev) => {
          const newIndex = (prev + 1) % showProfileView.photos.length;
          return newIndex;
        });
      }, 4e3);
      return () => clearInterval(interval);
    }
  }, [showProfileView]);
  const DiscoverView = () => {
    const profile = profiles[currentProfile];
    const rotation = dragOffset.x * 0.05;
    const opacity = Math.max(0.8, 1 - Math.abs(dragOffset.x) * 1e-3);
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-full bg-white relative overflow-hidden" }, /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "flex-1 relative bg-cover bg-center",
        style: {
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url('${profile.photos[currentPhotoIndex]}')`,
          transform: `translateX(${isDragging ? dragOffset.x : 0}px) rotate(${isDragging ? rotation : 0}deg)`,
          opacity: isDragging ? opacity : 1,
          transition: isDragging ? "none" : "transform 0.3s ease-out, opacity 0.3s ease-out"
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "absolute top-4 left-4 right-4 flex space-x-1" }, profile.photos.map((_, index) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: index,
          className: "flex-1 h-1 bg-black/30 rounded-full overflow-hidden"
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            className: `h-full transition-all duration-300 rounded-full ${index === currentPhotoIndex ? "bg-white" : index < currentPhotoIndex ? "bg-white" : "bg-transparent"}`
          }
        )
      ))),
      /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 flex z-30" }, /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "cursor-grab",
          style: { width: "7%" },
          onMouseDown: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("\u{1F534} \u041B\u0415\u0412\u0410\u042F \u0421\u0412\u0410\u0419\u041F \u0417\u041E\u041D\u0410 (7%) \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430");
            handleMouseDown(e);
          },
          onTouchStart: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("\u{1F534} \u041B\u0415\u0412\u0410\u042F \u0421\u0412\u0410\u0419\u041F \u0417\u041E\u041D\u0410 (7%) (touch) \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430");
            handleTouchStart(e);
          }
        }
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "cursor-pointer",
          style: { width: "25%" },
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentPhotoIndex(
              (prev) => prev > 0 ? prev - 1 : profile.photos.length - 1
            );
            console.log("\u{1F7E0} \u041B\u0415\u0412\u0410\u042F \u0424\u041E\u0422\u041E \u0417\u041E\u041D\u0410 (25%) - \u043F\u0440\u0435\u0434\u044B\u0434\u0443\u0449\u0435\u0435 \u0444\u043E\u0442\u043E");
          }
        }
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "cursor-pointer",
          style: { width: "36%" },
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("\u{1F535} \u0426\u0415\u041D\u0422\u0420\u0410\u041B\u042C\u041D\u0410\u042F \u0417\u041E\u041D\u0410 (36%) - \u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F");
            console.log("\u{1F464} \u041F\u0440\u043E\u0444\u0438\u043B\u044C \u0434\u043B\u044F \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u044F:", profile.name);
            setShowProfileView(profile);
            setProfilePhotoIndex(0);
            console.log("\u2705 setShowProfileView \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D \u0434\u043B\u044F:", profile.name);
          }
        }
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "cursor-pointer",
          style: { width: "25%" },
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setCurrentPhotoIndex(
              (prev) => prev < profile.photos.length - 1 ? prev + 1 : 0
            );
            console.log("\u{1F7E1} \u041F\u0420\u0410\u0412\u0410\u042F \u0424\u041E\u0422\u041E \u0417\u041E\u041D\u0410 (25%) - \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0435 \u0444\u043E\u0442\u043E");
          }
        }
      ), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "cursor-grab",
          style: { width: "7%" },
          onMouseDown: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("\u{1F7E2} \u041F\u0420\u0410\u0412\u0410\u042F \u0421\u0412\u0410\u0419\u041F \u0417\u041E\u041D\u0410 (7%) \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430");
            handleMouseDown(e);
          },
          onTouchStart: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("\u{1F7E2} \u041F\u0420\u0410\u0412\u0410\u042F \u0421\u0412\u0410\u0419\u041F \u0417\u041E\u041D\u0410 (7%) (touch) \u0430\u043A\u0442\u0438\u0432\u0438\u0440\u043E\u0432\u0430\u043D\u0430");
            handleTouchStart(e);
          }
        }
      )),
      isDragging && !isClick && dragOffset.x > 50 && /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "absolute top-1/2 left-8 transform -translate-y-1/2 rotate-12 transition-opacity duration-200",
          style: { opacity: Math.min(1, (dragOffset.x - 50) / 100) }
        },
        /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-pink-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold text-2xl border-4 border-pink-300 shadow-2xl backdrop-blur-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("svg", { className: "w-6 h-6", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 4.318c-1.754-1.753-4.596-1.753-6.35 0-1.753 1.754-1.753 4.596 0 6.35L12 17.018l6.35-6.35c1.753-1.754 1.753-4.596 0-6.35-1.754-1.753-4.596-1.753-6.35 0z" })), /* @__PURE__ */ React.createElement("span", null, "LIKE")))
      ),
      isDragging && !isClick && dragOffset.x < -50 && /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "absolute top-1/2 right-8 transform -translate-y-1/2 -rotate-12 transition-opacity duration-200",
          style: { opacity: Math.min(1, (Math.abs(dragOffset.x) - 50) / 100) }
        },
        /* @__PURE__ */ React.createElement("div", { className: "bg-gradient-to-r from-gray-700 to-gray-800 text-white px-6 py-3 rounded-2xl font-bold text-2xl border-4 border-gray-500 shadow-2xl backdrop-blur-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 3, d: "M6 18L18 6M6 6l12 12" })), /* @__PURE__ */ React.createElement("span", null, "NOPE")))
      ),
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "absolute bottom-0 left-0 right-0 p-6 text-white cursor-pointer z-40",
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("\u{1F4CB} \u041A\u041B\u0418\u041A \u041F\u041E \u0418\u041D\u0424\u041E\u0420\u041C\u0410\u0426\u0418\u041E\u041D\u041D\u041E\u0419 \u0417\u041E\u041D\u0415 - \u041E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F:", profile.name);
            setShowProfileView(profile);
            setProfilePhotoIndex(0);
          }
        },
        /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-3" }, /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 mr-2 text-white/70", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }), /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })), /* @__PURE__ */ React.createElement("span", { className: "text-white/70 text-sm" }, profile.distance, " \u043A\u043C"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center ml-3" }, /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 mr-1 text-white/70", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" })), /* @__PURE__ */ React.createElement("span", { className: "text-white/70 text-sm" }, "\u0418\u0449\u0443 \u0440\u043E\u0434\u0441\u0442\u0432\u0435\u043D\u043D\u0443\u044E \u0434\u0443\u0448\u0443"))),
        /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-bold mb-2 flex items-center" }, profile.name, ", ", profile.age, /* @__PURE__ */ React.createElement("svg", { className: "w-6 h-6 ml-2 text-blue-500", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }))),
        /* @__PURE__ */ React.createElement("p", { className: "text-white/90 text-sm mb-4" }, profile.bio),
        /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 mb-4" }, profile.interests.slice(0, 6).map((interest, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "flex items-center bg-black/30 backdrop-blur-sm rounded-full px-3 py-1" }, index === 0 && /* @__PURE__ */ React.createElement("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" })), index === 1 && /* @__PURE__ */ React.createElement("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })), index === 2 && /* @__PURE__ */ React.createElement("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" })), index === 3 && /* @__PURE__ */ React.createElement("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })), index === 4 && /* @__PURE__ */ React.createElement("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" })), index === 5 && /* @__PURE__ */ React.createElement("svg", { className: "w-3 h-3 mr-1", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-white" }, interest))))
      )
    ), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center space-x-4" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleDislike,
        className: "w-14 h-14 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:scale-105 transition-transform"
      },
      /* @__PURE__ */ React.createElement("svg", { className: "w-7 h-7 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleSuperLike,
        className: "w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-transform relative"
      },
      /* @__PURE__ */ React.createElement("svg", { className: "w-8 h-8 text-white", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" }))
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleLike,
        className: "w-14 h-14 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:scale-105 transition-transform"
      },
      /* @__PURE__ */ React.createElement("svg", { className: "w-7 h-7 text-pink-500", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 4.318c-1.754-1.753-4.596-1.753-6.35 0-1.753 1.754-1.753 4.596 0 6.35L12 17.018l6.35-6.35c1.753-1.754 1.753-4.596 0-6.35-1.754-1.753-4.596-1.753-6.35 0z" }))
    ))));
  };
  const ChatView = () => {
    console.log("\u{1F4AC} ChatView render - selectedMatch:", selectedMatch);
    const [message, setMessage] = useState("");
    if (selectedMatch) {
      const messages = chatMessages[selectedMatch.id] || [];
      console.log("\u{1F4AC} ChatView render:", {
        selectedMatch: selectedMatch.id,
        selectedMatchName: selectedMatch.name,
        messagesCount: messages.length,
        messageUpdate,
        forceUpdate
      });
      if (messages.length > 0) {
        console.log("\u{1F4CB} \u0412\u0441\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0432 \u0447\u0430\u0442\u0435:");
        messages.forEach((msg, index) => {
          console.log(`  ${index + 1}. [${msg.sender}] "${msg.text}" (ID: ${msg.id}, \u0432\u0440\u0435\u043C\u044F: ${new Date(msg.timestamp).toLocaleTimeString()})`);
        });
        const userMessages = messages.filter((m) => m.sender === "user");
        const matchMessages = messages.filter((m) => m.sender === "match");
        console.log("\u{1F4CA} \u0421\u0422\u0410\u0422\u0418\u0421\u0422\u0418\u041A\u0410: \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C -", userMessages.length, "\u0434\u0435\u0432\u0443\u0448\u043A\u0430 -", matchMessages.length);
      } else {
        console.log("\u{1F4ED} \u0421\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0439 \u0432 \u0447\u0430\u0442\u0435 \u043D\u0435\u0442 (\u0447\u0438\u0441\u0442\u0430\u044F \u0438\u0441\u0442\u043E\u0440\u0438\u044F)");
      }
      return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-full bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 shadow-sm border-b border-gray-100 flex items-center" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedMatch(null);
            console.log("\u{1F519} \u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0447\u0430\u0442\u043E\u0432");
          },
          className: "mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        },
        /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }))
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowProfileView(selectedMatch);
            setProfilePhotoIndex(0);
            console.log("\u{1F464} \u041A\u043B\u0438\u043A \u043D\u0430 \u0430\u0432\u0430\u0442\u0430\u0440 \u0432 \u0445\u0435\u0434\u0435\u0440\u0435 - \u043E\u0442\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F:", selectedMatch.name);
          },
          className: "flex items-center flex-1 hover:bg-gray-50 p-2 rounded-lg transition-colors"
        },
        /* @__PURE__ */ React.createElement(
          "img",
          {
            src: selectedMatch.photos && selectedMatch.photos[0] ? selectedMatch.photos[0] : "assets/default_avatar.png?prompt=Beautiful%20young%20woman%20portrait%20default%20avatar",
            alt: selectedMatch.name,
            className: "w-10 h-10 rounded-full object-cover border-2 border-pink-200 mr-3"
          }
        ),
        /* @__PURE__ */ React.createElement("div", { className: "flex-1 text-left" }, /* @__PURE__ */ React.createElement("h3", { className: "font-semibold text-gray-800" }, selectedMatch.name), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, "\u041E\u043D\u043B\u0430\u0439\u043D"))
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            const chatIdToDelete = selectedMatch.id;
            console.log("\u{1F5D1}\uFE0F \u041A\u043B\u0438\u043A \u043D\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0447\u0430\u0442\u0430 \u0438\u0437 \u0445\u0435\u0434\u0435\u0440\u0430:", chatIdToDelete);
            setDeletingChat(chatIdToDelete);
          },
          className: "p-2 hover:bg-gray-100 rounded-full transition-colors",
          title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0447\u0430\u0442",
          disabled: deletingChat !== null
        },
        /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }))
      )), /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "flex-1 overflow-y-auto p-4 space-y-3",
          ref: (el) => {
            if (el) {
              setTimeout(() => {
                el.scrollTop = el.scrollHeight;
              }, 100);
            }
          }
        },
        messages.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-full" }, /* @__PURE__ */ React.createElement("div", { className: "text-4xl mb-4" }, "\u{1F49D}"), /* @__PURE__ */ React.createElement("h4", { className: "text-lg font-semibold text-gray-800 mb-2" }, "\u0421\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0435!"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-center" }, "\u0412\u044B \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443! \u041D\u0430\u0447\u043D\u0438\u0442\u0435 \u0440\u0430\u0437\u0433\u043E\u0432\u043E\u0440")) : messages.map((msg, index) => /* @__PURE__ */ React.createElement(
          "div",
          {
            key: `msg-${msg.id}-${index}-${messageUpdate}`,
            className: `flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              className: `max-w-xs px-4 py-2 rounded-2xl ${msg.sender === "user" ? "bg-pink-500 text-white ml-12" : "bg-gray-100 text-gray-800 mr-12"}`
            },
            /* @__PURE__ */ React.createElement("p", { className: "text-sm" }, msg.text)
          )
        ))
      ), /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 border-t border-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center space-x-2" }, /* @__PURE__ */ React.createElement(
        "input",
        {
          type: "text",
          value: message,
          onChange: (e) => setMessage(e.target.value),
          onKeyPress: (e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              const messageText = message.trim();
              if (messageText) {
                sendMessage(selectedMatch.id, messageText);
                setMessage("");
              }
            }
          },
          placeholder: "\u041D\u0430\u043F\u0438\u0448\u0438\u0442\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u0435...",
          className: "flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-pink-500",
          autoComplete: "off"
        }
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            const messageText = message.trim();
            if (messageText) {
              sendMessage(selectedMatch.id, messageText);
              setMessage("");
            }
          },
          className: "p-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors"
        },
        /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 19l9 2-9-18-9 18 9-2zm0 0v-8" }))
      ))), deletingChat === selectedMatch.id && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-lg max-w-sm mx-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-3" }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0447\u0430\u0442?"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mb-6" }, "\u0412\u0441\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0441 ", selectedMatch.name, " \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B. \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C."), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-3" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => setDeletingChat(null),
          className: "flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        },
        "\u041E\u0442\u043C\u0435\u043D\u0430"
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            const matchIdToDelete = deletingChat;
            console.log("\u{1F5D1}\uFE0F \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0447\u0430\u0442\u0430 \u0438\u0437 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0433\u043E \u043E\u043A\u043D\u0430:", matchIdToDelete);
            setDeletingChat(null);
            setTimeout(() => {
              deleteChat(matchIdToDelete);
            }, 100);
          },
          className: "flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors",
          disabled: !deletingChat
        },
        "\u0423\u0434\u0430\u043B\u0438\u0442\u044C"
      )))));
    }
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-full bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 shadow-sm border-b border-gray-100" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-gray-800" }, "\u0427\u0430\u0442\u044B"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-sm" }, matches.length, " \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439"), /* @__PURE__ */ React.createElement("div", { style: { display: "none" } }, forceUpdate, "-", messageUpdate, "-", matches.length, "-", JSON.stringify(matches.map((m) => m.id))), /* @__PURE__ */ React.createElement("div", { style: { display: "none" } }, "DEBUG: matches=", JSON.stringify(matches.map((m) => ({ id: m.id, name: m.name }))), ", forceUpdate=", forceUpdate, ", messageUpdate=", messageUpdate, ", timestamp=", Date.now())), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto" }, matches.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-full p-8" }, /* @__PURE__ */ React.createElement("div", { className: "text-6xl mb-4" }, "\u{1F4AC}"), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-2" }, "\u041F\u043E\u043A\u0430 \u043D\u0435\u0442 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u0439"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-center" }, "\u041A\u043E\u0433\u0434\u0430 \u0432\u044B \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u0442\u0435\u0441\u044C \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443, \u0437\u0434\u0435\u0441\u044C \u043F\u043E\u044F\u0432\u044F\u0442\u0441\u044F \u0432\u0430\u0448\u0438 \u0441\u043E\u0432\u043F\u0430\u0434\u0435\u043D\u0438\u044F")) : /* @__PURE__ */ React.createElement("div", { className: "p-4 space-y-3", key: `matches-list-${matches.length}-${forceUpdate}-${messageUpdate}-${JSON.stringify(matches.map((m) => m.id))}` }, matches.map((match, index) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: `match-${match.id}-${index}-${forceUpdate}-${messageUpdate}`,
        className: "flex items-center p-3 bg-white rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer group"
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          onClick: () => setSelectedMatch(match),
          className: "flex items-center flex-1"
        },
        /* @__PURE__ */ React.createElement(
          "img",
          {
            src: match.photos && match.photos[0] ? match.photos[0] : "assets/default_avatar.png?prompt=Beautiful%20young%20woman%20portrait%20default%20avatar",
            alt: match.name,
            className: "w-14 h-14 rounded-full object-cover border-2 border-pink-200"
          }
        ),
        /* @__PURE__ */ React.createElement("div", { className: "ml-3 flex-1" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-gray-800" }, match.name), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, chatMessages[match.id] && chatMessages[match.id].length > 0 ? chatMessages[match.id][chatMessages[match.id].length - 1].text : "\u0412\u044B \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443!")),
        /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 bg-pink-500 rounded-full" })
      ),
      /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            const chatIdToDelete = match.id;
            console.log("\u{1F5D1}\uFE0F \u041A\u043B\u0438\u043A \u043D\u0430 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u0435 \u0447\u0430\u0442\u0430 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430:", chatIdToDelete);
            setDeletingChat(chatIdToDelete);
          },
          className: "ml-2 p-2 hover:bg-red-100 rounded-full transition-colors opacity-0 group-hover:opacity-100",
          title: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0447\u0430\u0442",
          disabled: deletingChat !== null
        },
        /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }))
      )
    )))));
  };
  const GirlProfileView = ({ profile, onClose }) => {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "fixed inset-0 bg-white flex flex-col",
        style: {
          zIndex: 999999,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh"
        }
      },
      /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 shadow-sm border-b border-gray-100 flex items-center" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: onClose,
          className: "mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        },
        /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5 text-gray-600", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }))
      ), /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-gray-800" }, profile.name)),
      /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "relative h-96 bg-gray-200" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-4 left-4 right-4 flex space-x-1 z-10" }, profile.photos.map((_, index) => /* @__PURE__ */ React.createElement(
        "div",
        {
          key: index,
          className: "flex-1 h-1 bg-black/30 rounded-full overflow-hidden"
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            className: `h-full transition-all duration-300 rounded-full ${index === profilePhotoIndex ? "bg-white" : index < profilePhotoIndex ? "bg-white" : "bg-transparent"}`
          }
        )
      ))), /* @__PURE__ */ React.createElement(
        "img",
        {
          src: profile.photos[profilePhotoIndex],
          alt: profile.name,
          className: "w-full h-full object-cover"
        }
      ), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 flex" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          className: "flex-1",
          onClick: () => setProfilePhotoIndex(
            (prev) => prev > 0 ? prev - 1 : profile.photos.length - 1
          )
        }
      ), /* @__PURE__ */ React.createElement(
        "button",
        {
          className: "flex-1",
          onClick: () => setProfilePhotoIndex(
            (prev) => prev < profile.photos.length - 1 ? prev + 1 : 0
          )
        }
      ))), /* @__PURE__ */ React.createElement("div", { className: "p-6 space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-3" }, /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold text-gray-800" }, profile.name, ", ", profile.age), /* @__PURE__ */ React.createElement("svg", { className: "w-6 h-6 ml-2 text-blue-500", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-gray-600 mb-3" }, /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }), /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })), /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, profile.distance, " \u043A\u043C \u043E\u0442 \u0432\u0430\u0441 \u2022 ", profile.city)), profile.job && /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-gray-600 mb-3" }, /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" })), /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, profile.job)), profile.education && /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-gray-600 mb-3" }, /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 14l9-5-9-5-9 5 9 5z" }), /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" })), /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, profile.education)), profile.height && /* @__PURE__ */ React.createElement("div", { className: "flex items-center text-gray-600 mb-4" }, /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 mr-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 21l3-3-3-3M14 3l3 3-3 3M4 12h16" })), /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, profile.height))), profile.bio && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-2" }, "\u041E \u0441\u0435\u0431\u0435"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 leading-relaxed" }, profile.bio)), profile.interests && profile.interests.length > 0 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-3" }, "\u0418\u043D\u0442\u0435\u0440\u0435\u0441\u044B"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, profile.interests.map((interest, index) => /* @__PURE__ */ React.createElement(
        "span",
        {
          key: index,
          className: "bg-pink-100 text-pink-700 px-3 py-2 rounded-full text-sm border border-pink-200"
        },
        interest
      )))), profile.photos && profile.photos.length > 1 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-3" }, "\u0424\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, profile.photos.map((photo, index) => /* @__PURE__ */ React.createElement(
        "button",
        {
          key: index,
          onClick: () => setProfilePhotoIndex(index),
          className: `aspect-square rounded-lg overflow-hidden border-2 transition-all ${index === profilePhotoIndex ? "border-pink-500 scale-95" : "border-gray-200 hover:border-gray-300"}`
        },
        /* @__PURE__ */ React.createElement(
          "img",
          {
            src: photo,
            alt: `${profile.name} \u0444\u043E\u0442\u043E ${index + 1}`,
            className: "w-full h-full object-cover"
          }
        )
      )))))),
      /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 border-t border-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "flex space-x-3" }, /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: onClose,
          className: "flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
        },
        "\u0417\u0430\u043A\u0440\u044B\u0442\u044C"
      ), matches.find((m) => m.id === profile.id) ? /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            setSelectedMatch(profile);
            setCurrentView("chats");
            onClose();
          },
          className: "flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
        },
        "\u041F\u0435\u0440\u0435\u0439\u0442\u0438 \u043A \u0447\u0430\u0442\u0443"
      ) : /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: () => {
            if (!likedProfiles.includes(profile.id)) {
              setLikedProfiles([...likedProfiles, profile.id]);
              if (Math.random() > 0.3) {
                setMatches((prev) => {
                  if (prev.find((m) => m.id === profile.id)) return prev;
                  return [...prev, profile];
                });
                setShowFullScreenMatch(profile);
              }
            }
            onClose();
          },
          className: "flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center justify-center"
        },
        /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5 mr-2", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 4.318c-1.754-1.753-4.596-1.753-6.35 0-1.753 1.754-1.753 4.596 0 6.35L12 17.018l6.35-6.35c1.753-1.754 1.753-4.596 0-6.35-1.754-1.753-4.596-1.753-6.35 0z" })),
        "\u041B\u0430\u0439\u043A"
      )))
    );
  };
  const ProfileView = () => {
    return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col h-full bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-4 shadow-sm border-b border-gray-100" }, /* @__PURE__ */ React.createElement("h2", { className: "text-xl font-bold text-gray-800" }, "\u041C\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, "ID: ", currentUser.telegramId)), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-6" }, /* @__PURE__ */ React.createElement("div", { className: "mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-2" }, /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5 text-blue-600 mr-2", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" })), /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-blue-800" }, "\u041E\u0442\u043B\u0430\u0434\u043E\u0447\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F")), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-blue-700 space-y-1" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Telegram \u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D:"), " ", getTelegramWebApp() ? "\u0414\u0430 \u2705" : "\u041D\u0435\u0442 \u274C"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Platform:"), " ", getTelegramWebApp()?.platform || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Version:"), " ", getTelegramWebApp()?.version || "\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "InitData \u0435\u0441\u0442\u044C:"), " ", getTelegramWebApp()?.initData ? "\u0414\u0430 \u2705" : "\u041D\u0435\u0442 \u274C"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "User \u0434\u0430\u043D\u043D\u044B\u0435:"), " ", getTelegramWebApp()?.initDataUnsafe?.user ? "\u0415\u0441\u0442\u044C \u2705" : "\u041D\u0435\u0442 \u274C"), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "\u041E\u0448\u0438\u0431\u043A\u0430 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438:"), " ", authError || "\u041D\u0435\u0442")), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
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
          console.log("\u{1F50D} \u041F\u041E\u041B\u041D\u0410\u042F \u041E\u0422\u041B\u0410\u0414\u041E\u0427\u041D\u0410\u042F \u0418\u041D\u0424\u041E\u0420\u041C\u0410\u0426\u0418\u042F:", debugInfo);
          navigator.clipboard?.writeText(JSON.stringify(debugInfo, null, 2));
          alert("\u041E\u0442\u043B\u0430\u0434\u043E\u0447\u043D\u0430\u044F \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u0430 \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u044C \u0438 \u0431\u0443\u0444\u0435\u0440 \u043E\u0431\u043C\u0435\u043D\u0430");
        },
        className: "mt-2 px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 transition-colors"
      },
      "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043E\u0442\u043B\u0430\u0434\u043E\u0447\u043D\u0443\u044E \u0438\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044E"
    )), /* @__PURE__ */ React.createElement("div", { className: "mb-6 p-4 bg-green-50 rounded-lg border border-green-200" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center mb-2" }, /* @__PURE__ */ React.createElement("svg", { className: "w-5 h-5 text-green-600 mr-2", fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" })), /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-green-800" }, "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u043E\u0432\u0430\u043D \u0447\u0435\u0440\u0435\u0437 Telegram")), /* @__PURE__ */ React.createElement("div", { className: "text-sm text-green-700 space-y-1" }, /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "\u0418\u043C\u044F:"), " ", currentUser.firstName, " ", currentUser.lastName), currentUser.username && /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "Username:"), " @", currentUser.username), /* @__PURE__ */ React.createElement("p", null, /* @__PURE__ */ React.createElement("strong", null, "\u042F\u0437\u044B\u043A:"), " ", currentUser.languageCode?.toUpperCase() || "RU"), currentUser.isPremium && /* @__PURE__ */ React.createElement("p", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-yellow-600 mr-1" }, "\u2B50"), /* @__PURE__ */ React.createElement("strong", null, "Telegram Premium")))), /* @__PURE__ */ React.createElement("div", { className: "text-center mb-6" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: currentUser.photos[0],
        alt: currentUser.name,
        className: "w-32 h-32 rounded-full mx-auto object-cover border-4 border-pink-200 mb-4"
      }
    ), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-gray-800" }, currentUser.name, ", ", currentUser.age), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mt-2" }, currentUser.bio)), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-gray-800 mb-3" }, "\u041C\u043E\u0438 \u0438\u043D\u0442\u0435\u0440\u0435\u0441\u044B"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, currentUser.interests.map((interest, index) => /* @__PURE__ */ React.createElement(
      "span",
      {
        key: index,
        className: "bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm border border-pink-200"
      },
      interest
    )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-gray-800 mb-3" }, "\u041C\u043E\u0438 \u0444\u043E\u0442\u043E\u0433\u0440\u0430\u0444\u0438\u0438"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-2" }, currentUser.photos.map((photo, index) => /* @__PURE__ */ React.createElement(
      "img",
      {
        key: index,
        src: photo,
        alt: `\u0424\u043E\u0442\u043E ${index + 1}`,
        className: "aspect-square rounded-lg object-cover border border-gray-200"
      }
    )))), /* @__PURE__ */ React.createElement("button", { className: "w-full bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors mb-3" }, "\u0420\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u043F\u0440\u043E\u0444\u0438\u043B\u044C"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (window.confirm("\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u0443\u0434\u0430\u043B\u0438\u0442\u044C \u0412\u0421\u0415 \u0447\u0430\u0442\u044B \u0438 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F? \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C.")) {
            clearAllChats();
            alert("\u0412\u0441\u0435 \u0447\u0430\u0442\u044B \u0438 \u0434\u0430\u043D\u043D\u044B\u0435 \u043E\u0447\u0438\u0449\u0435\u043D\u044B");
          }
        },
        className: "w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition-colors"
      },
      "\u{1F9F9} \u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435 \u0447\u0430\u0442\u044B"
    ))));
  };
  const LoadingView = () => /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center h-full bg-gradient-to-br from-pink-500 to-purple-600" }, /* @__PURE__ */ React.createElement("div", { className: "text-white text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-6xl mb-6" }, "\u{1F495}"), /* @__PURE__ */ React.createElement("h1", { className: "text-3xl font-bold mb-4" }, "True Love"), /* @__PURE__ */ React.createElement("div", { className: "animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "text-white/80" }, !isAuthenticated && !authError ? "\u0410\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044F..." : "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u044F..."), authError && /* @__PURE__ */ React.createElement("div", { className: "mt-4 p-3 bg-red-500/20 rounded-lg" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-red-100" }, "\u26A0\uFE0F ", authError), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => authenticateUser(),
      className: "w-full px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition-colors"
    },
    "\u041F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u044C \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u044E"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        console.log("\u{1F504} \u041F\u0440\u0438\u043D\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u0430\u044F \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 Telegram \u0434\u0430\u043D\u043D\u044B\u0445:");
        const tg = getTelegramWebApp();
        if (tg) {
          console.log("\u2705 WebApp \u043D\u0430\u0439\u0434\u0435\u043D:", tg);
          console.log("\u{1F4F1} initDataUnsafe:", tg.initDataUnsafe);
          console.log("\u{1F464} User:", tg.initDataUnsafe?.user);
          if (tg.initDataUnsafe?.user) {
            alert(`\u041D\u0430\u0439\u0434\u0435\u043D \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C: ${tg.initDataUnsafe.user.first_name} (ID: ${tg.initDataUnsafe.user.id})`);
          } else {
            alert("\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u0447\u0435\u0440\u0435\u0437 Telegram \u0431\u043E\u0442\u0430.");
          }
        } else {
          alert("Telegram WebApp \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0432 Telegram.");
        }
      },
      className: "w-full px-4 py-2 bg-blue-500/20 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
    },
    "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C Telegram"
  )))));
  if (!isAuthenticated || !currentUser) {
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "w-full h-full max-w-md mx-auto flex flex-col relative",
        style: {
          backgroundColor: getTelegramWebApp()?.themeParams?.bg_color || "#FFFFFF",
          color: getTelegramWebApp()?.themeParams?.text_color || "#000000"
        }
      },
      /* @__PURE__ */ React.createElement(LoadingView, null)
    );
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "w-full h-full max-w-md mx-auto flex flex-col relative",
      style: {
        backgroundColor: getTelegramWebApp()?.themeParams?.bg_color || "#FFFFFF",
        color: getTelegramWebApp()?.themeParams?.text_color || "#000000"
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-hidden" }, currentView === "discover" && /* @__PURE__ */ React.createElement(DiscoverView, null), currentView === "chats" && /* @__PURE__ */ React.createElement(ChatView, null), currentView === "profile" && /* @__PURE__ */ React.createElement(ProfileView, null)),
    /* @__PURE__ */ React.createElement("div", { className: "bg-white border-t border-gray-200 flex shrink-0" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          console.log("\u{1F4F1} \u041A\u043B\u0438\u043A \u043D\u0430 \u0432\u043A\u043B\u0430\u0434\u043A\u0443 \u0447\u0430\u0442\u043E\u0432 - currentView:", currentView, "selectedMatch:", selectedMatch);
          if (currentView === "chats" && selectedMatch) {
            setSelectedMatch(null);
            console.log("\u{1F519} \u0412\u043E\u0437\u0432\u0440\u0430\u0442 \u043A \u0441\u043F\u0438\u0441\u043A\u0443 \u0447\u0430\u0442\u043E\u0432 \u0438\u0437 \u043E\u0442\u043A\u0440\u044B\u0442\u043E\u0433\u043E \u0447\u0430\u0442\u0430");
          } else {
            setCurrentView("chats");
            console.log("\u{1F4F1} \u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u0432 \u0440\u0430\u0437\u0434\u0435\u043B \u0447\u0430\u0442\u043E\u0432");
          }
        },
        className: `flex-1 py-3 px-4 text-center transition-colors ${currentView === "chats" ? "text-pink-500" : "text-gray-400"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 mx-auto mb-1" }, /* @__PURE__ */ React.createElement("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" })))
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentView("discover"),
        className: `flex-1 py-3 px-4 text-center transition-colors ${currentView === "discover" ? "text-pink-500" : "text-gray-400"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 mx-auto mb-1" }, /* @__PURE__ */ React.createElement("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" })))
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setCurrentView("profile"),
        className: `flex-1 py-3 px-4 text-center transition-colors ${currentView === "profile" ? "text-pink-500" : "text-gray-400"}`
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 mx-auto mb-1" }, /* @__PURE__ */ React.createElement("svg", { fill: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { d: "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" })))
    )),
    showFullScreenMatch && /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "fixed inset-0 bg-black flex flex-col",
        style: { zIndex: 9999 }
      },
      /* @__PURE__ */ React.createElement(
        "div",
        {
          className: "flex-1 relative bg-cover bg-center",
          style: {
            backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.8) 100%), url('${showFullScreenMatch.photos[matchPhotoIndex]}')`
          }
        },
        /* @__PURE__ */ React.createElement("div", { className: "absolute top-8 left-4 right-4 flex space-x-1" }, showFullScreenMatch.photos.map((_, index) => /* @__PURE__ */ React.createElement(
          "div",
          {
            key: index,
            className: "flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
          },
          /* @__PURE__ */ React.createElement(
            "div",
            {
              className: `h-full transition-all duration-300 rounded-full ${index === matchPhotoIndex ? "bg-white" : index < matchPhotoIndex ? "bg-white" : "bg-transparent"}`
            }
          )
        ))),
        /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: (e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log("\u274C \u041E\u043A\u043D\u043E \u0437\u0430\u043A\u0440\u044B\u0442\u043E \u0447\u0435\u0440\u0435\u0437 \u043A\u043D\u043E\u043F\u043A\u0443 X - \u0447\u0430\u0442 \u0434\u043E\u043B\u0436\u0435\u043D \u043E\u0441\u0442\u0430\u0442\u044C\u0441\u044F \u0432 \u0441\u043F\u0438\u0441\u043A\u0435");
              const currentMatch = showFullScreenMatch;
              console.log("\u{1F50D} \u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u043C\u0430\u0442\u0447 \u0434\u043B\u044F \u0441\u043E\u0445\u0440\u0430\u043D\u0435\u043D\u0438\u044F:", currentMatch);
              setMatches((prevMatches) => {
                const existingMatch = prevMatches.find((m) => m.id === currentMatch.id);
                console.log("\u{1F50D} \u0421\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u043C\u0430\u0442\u0447 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435:", existingMatch);
                console.log("\u{1F4CA} \u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0441\u043F\u0438\u0441\u043A\u0430 matches:", prevMatches.length);
                if (!existingMatch) {
                  console.log("\u2705 \u0414\u043E\u0431\u0430\u0432\u043B\u044F\u0435\u043C \u043C\u0430\u0442\u0447 \u0432 \u0441\u043F\u0438\u0441\u043E\u043A");
                  const updatedMatches = [...prevMatches, currentMatch];
                  console.log("\u{1F4CB} \u041E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u043D\u044B\u0439 \u0441\u043F\u0438\u0441\u043E\u043A matches:", updatedMatches);
                  console.log("\u{1F4CA} \u041D\u043E\u0432\u044B\u0439 \u0440\u0430\u0437\u043C\u0435\u0440 \u0441\u043F\u0438\u0441\u043A\u0430:", updatedMatches.length);
                  return updatedMatches;
                } else {
                  console.log("\u2139\uFE0F \u041C\u0430\u0442\u0447 \u0443\u0436\u0435 \u0441\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u0435\u0442 \u0432 \u0441\u043F\u0438\u0441\u043A\u0435");
                  return prevMatches;
                }
              });
              setForceUpdate((prev) => {
                const newValue = prev + 1;
                console.log("\u{1F504} ForceUpdate \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D:", newValue);
                return newValue;
              });
              setMessageUpdate((prev) => {
                const newValue = prev + 1;
                console.log("\u{1F504} MessageUpdate \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D:", newValue);
                return newValue;
              });
              setShowFullScreenMatch(null);
              nextProfile();
              setTimeout(() => {
                setForceUpdate((prev) => prev + 1);
                setMessageUpdate((prev) => prev + 1);
                console.log("\u{1F504} \u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u0438\u043D\u0443\u0434\u0438\u0442\u0435\u043B\u044C\u043D\u043E\u0435 \u043E\u0431\u043D\u043E\u0432\u043B\u0435\u043D\u0438\u0435 \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u043E");
              }, 200);
            },
            className: "absolute top-8 right-4 p-3 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors z-10"
          },
          /* @__PURE__ */ React.createElement("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }))
        ),
        /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 flex" }, /* @__PURE__ */ React.createElement(
          "button",
          {
            className: "flex-1",
            onClick: () => setMatchPhotoIndex(
              (prev) => prev > 0 ? prev - 1 : showFullScreenMatch.photos.length - 1
            )
          }
        ), /* @__PURE__ */ React.createElement(
          "button",
          {
            className: "flex-1",
            onClick: () => setMatchPhotoIndex(
              (prev) => prev < showFullScreenMatch.photos.length - 1 ? prev + 1 : 0
            )
          }
        )),
        /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-center" }, /* @__PURE__ */ React.createElement("div", { className: "text-8xl mb-4 animate-pulse" }, "\u{1F495}"), /* @__PURE__ */ React.createElement("h2", { className: "text-4xl font-bold text-white mb-2 animate-bounce" }, "It's a Match!"), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-bold text-white mb-1" }, "\u0412\u0437\u0430\u0438\u043C\u043D\u0430\u044F \u0441\u0438\u043C\u043F\u0430\u0442\u0438\u044F"), /* @__PURE__ */ React.createElement("p", { className: "text-white/90 text-lg" }, "\u0412\u044B \u043F\u043E\u043D\u0440\u0430\u0432\u0438\u043B\u0438\u0441\u044C \u0434\u0440\u0443\u0433 \u0434\u0440\u0443\u0433\u0443!"))),
        /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 right-0 p-6 text-white" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-bold mb-2" }, showFullScreenMatch.name, ", ", showFullScreenMatch.age), /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center mb-3" }, /* @__PURE__ */ React.createElement("svg", { className: "w-4 h-4 mr-2 text-white/70", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" }), /* @__PURE__ */ React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z" })), /* @__PURE__ */ React.createElement("span", { className: "text-white/90" }, showFullScreenMatch.distance, " \u043A\u043C \u2022 ", showFullScreenMatch.city)), /* @__PURE__ */ React.createElement("p", { className: "text-white/80 text-sm mb-4" }, showFullScreenMatch.bio), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-2 mb-6" }, showFullScreenMatch.interests.slice(0, 4).map((interest, index) => /* @__PURE__ */ React.createElement(
          "span",
          {
            key: index,
            className: "bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs text-white"
          },
          interest
        )))), /* @__PURE__ */ React.createElement("div", { className: "px-4" }, /* @__PURE__ */ React.createElement(
          "button",
          {
            onClick: () => {
              const currentMatch = showFullScreenMatch;
              console.log("\u{1F4AC} \u041D\u0430\u0447\u0430\u0442\u044C \u0447\u0430\u0442 - \u043F\u0435\u0440\u0435\u0445\u043E\u0434 \u043A \u0447\u0430\u0442\u0430\u043C \u0441:", currentMatch.name);
              setSelectedMatch(currentMatch);
              console.log("\u2705 \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D selectedMatch:", currentMatch.name);
              setCurrentView("chats");
              console.log("\u2705 \u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u043A chats view");
              setShowFullScreenMatch(null);
              nextProfile();
              console.log("\u2705 \u041F\u0435\u0440\u0435\u0445\u043E\u0434 \u043A \u0447\u0430\u0442\u0443 \u0441:", currentMatch.name);
            },
            className: "w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-4 px-6 rounded-2xl hover:from-pink-600 hover:to-purple-700 transition-colors shadow-2xl"
          },
          "\u041D\u0430\u0447\u0430\u0442\u044C \u0447\u0430\u0442"
        )))
      )
    ),
    deletingChat && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white p-6 rounded-lg max-w-sm mx-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-semibold text-gray-800 mb-3" }, "\u0423\u0434\u0430\u043B\u0438\u0442\u044C \u0447\u0430\u0442?"), /* @__PURE__ */ React.createElement("p", { className: "text-gray-600 mb-6" }, "\u0412\u0441\u0435 \u0441\u043E\u043E\u0431\u0449\u0435\u043D\u0438\u044F \u0441 ", matches.find((m) => m.id === deletingChat)?.name || "\u044D\u0442\u0438\u043C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u0435\u043C", " \u0431\u0443\u0434\u0443\u0442 \u0443\u0434\u0430\u043B\u0435\u043D\u044B. \u042D\u0442\u043E \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0435 \u043D\u0435\u043B\u044C\u0437\u044F \u043E\u0442\u043C\u0435\u043D\u0438\u0442\u044C."), /* @__PURE__ */ React.createElement("div", { className: "flex space-x-3" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setDeletingChat(null),
        className: "flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
      },
      "\u041E\u0442\u043C\u0435\u043D\u0430"
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: (e) => {
          e.preventDefault();
          e.stopPropagation();
          const matchIdToDelete = deletingChat;
          console.log("\u{1F5D1}\uFE0F \u041F\u043E\u0434\u0442\u0432\u0435\u0440\u0436\u0434\u0435\u043D\u0438\u0435 \u0443\u0434\u0430\u043B\u0435\u043D\u0438\u044F \u0447\u0430\u0442\u0430 \u0438\u0437 \u0441\u043F\u0438\u0441\u043A\u0430:", matchIdToDelete);
          setDeletingChat(null);
          setTimeout(() => {
            deleteChat(matchIdToDelete);
          }, 100);
        },
        className: "flex-1 py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors",
        disabled: !deletingChat
      },
      "\u0423\u0434\u0430\u043B\u0438\u0442\u044C"
    ))))
  ), showProfileView && /* @__PURE__ */ React.createElement(
    GirlProfileView,
    {
      profile: showProfileView,
      onClose: () => {
        setShowProfileView(null);
        setProfilePhotoIndex(0);
        console.log("\u274C \u0417\u0430\u043A\u0440\u044B\u0442\u0438\u0435 \u043F\u0440\u043E\u0444\u0438\u043B\u044F \u0434\u0435\u0432\u0443\u0448\u043A\u0438");
      }
    }
  ));
};
var stdin_default = DatingApp;
export {
  stdin_default as default
};
