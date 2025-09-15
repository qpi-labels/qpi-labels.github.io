// 전역 변수
const AUTH_URL = "https://script.google.com/macros/s/AKfycbwJkCkPJTg2AKKVNncedK7r--Txh9iexICytoDg6ajIpA2vYej7fv7AadCCuhRb9Qs9/exec";
const CHAT_URL = "https://script.google.com/macros/s/AKfycbxxXzzaUsogJ1ZwgQwbfs6jUR9MY0iu51do0PWURuNlusx_Vjp0A3eqjZGFuRzMaVTl/exec";
var storage = {};
var aborts = new Set();

// 초기화 시 즉시 로그인 정보 로드
function initializeUserData() {
  try {
    const savedData = localStorage.getItem('chatApp_userData');
    if (savedData) {
      const userData = JSON.parse(savedData);
      // 저장된 데이터가 24시간 이내인 경우에만 복원
      if (userData.timestamp && (Date.now() - userData.timestamp) < 24 * 60 * 60 * 1000) {
        storage = { ...userData }; // 객체 복사
        console.log('로그인 정보 복원됨:', storage.name);
        return true;
      } else {
        console.log('저장된 로그인 정보가 만료됨');
        localStorage.removeItem('chatApp_userData');
      }
    }
  } catch (error) {
    console.error('로그인 정보 로드 실패:', error);
    localStorage.removeItem('chatApp_userData');
  }
  return false;
}

// 페이지 로드 즉시 실행
const hasStoredLogin = initializeUserData();

// 로컬 스토리지에서 로그인 정보 로드 (기존 함수 유지)
function loadUserData() {
  return initializeUserData();
}

// 로컬 스토리지에 로그인 정보 저장
function saveUserData() {
  try {
    const dataToSave = {
      ...storage,
      timestamp: Date.now()
    };
    localStorage.setItem('chatApp_userData', JSON.stringify(dataToSave));
    console.log('로그인 정보 저장됨:', storage.name);
  } catch (error) {
    console.error('로그인 정보 저장 실패:', error);
  }
}

// 로그인 UI 업데이트
function updateLoginUI() {
  const loginButton = document.querySelector(".g_id_signin");
  const loginMockup = document.querySelector("#login-mockup");
  const pfpImg = document.querySelector(".pfp");
  
  if (storage.sub) {
    console.log('로그인 상태로 UI 업데이트');
    if (loginButton) loginButton.style.visibility = "hidden";
    if (loginMockup) loginMockup.style.display = "flex";
    if (pfpImg) {
      pfpImg.style.visibility = "visible";
      if (storage.pfp) {
        pfpImg.src = storage.pfp;
      }
    }
  } else {
    console.log('로그아웃 상태로 UI 업데이트');
    if (loginButton) loginButton.style.visibility = "visible";
    if (loginMockup) loginMockup.style.display = "none";
    if (pfpImg) pfpImg.style.visibility = "hidden";
  }
}

// DOM이 완전히 로드된 후 UI 업데이트
function initializeUI() {
  updateLoginUI();
  // React 컴포넌트에 로그인 상태 변경 알림
  if (window.updateLoginStatus) {
    window.updateLoginStatus(!!storage.sub);
  }
}

// 로그아웃 함수
function logout() {
  console.log('로그아웃 실행');
  storage = {};
  localStorage.removeItem('chatApp_userData');
  updateLoginUI();
  // 페이지 새로고침으로 상태 초기화
  location.reload();
}

// Google 로그인 콜백
async function handleCredentialResponse(response) {
  const idToken = response.credential;
  console.log('Google 로그인 시도');
  
  const loginButton = document.querySelector(".g_id_signin");
  const loginMockup = document.querySelector("#login-mockup");
  
  if (loginButton) loginButton.style.visibility = "hidden";
  if (loginMockup) loginMockup.style.display = "flex";
  
  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ idToken })
    });

    const data = await res.json();
    if (!data.success) {
      console.error(`로그인 실패: ${JSON.stringify(data)}`);
      updateLoginUI(); // 실패 시 UI 복원
      return;
    }
    
    console.log('로그인 성공:', data);
    
    // 로그인 정보 저장
    storage.sub = data.sub;
    storage.name = data.name;
    storage.authdate = data.date;
    storage.auth = data.auth;
    storage.pfp = data.pfp;
    
    // 로컬 스토리지에 저장
    saveUserData();
    
    // UI 업데이트
    updateLoginUI();
    
    // React 컴포넌트에 상태 변경 알림
    if (window.updateLoginStatus) {
      window.updateLoginStatus(true);
    }
    
  } catch (error) {
    console.error('로그인 오류:', error);
    updateLoginUI(); // 실패 시 UI 복원
  }
}

// DOM 로드 완료 시 초기화
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM 로드 완료, UI 초기화');
  initializeUI();
});

// 페이지가 완전히 로드된 후에도 한번 더 확인
window.addEventListener('load', () => {
  setTimeout(() => {
    console.log('페이지 로드 완료, UI 재확인');
    initializeUI();
  }, 100);
});

// React 컴포넌트
const { useEffect, useState, useRef } = React;

// --- ✨ 마크다운 라이브러리 설정 ✨ ---
// 링크를 새 탭에서 열도록 marked.js 렌더러 커스터마이징
const renderer = new marked.Renderer();
renderer.link = function(href, title, text) {
  const link = marked.Renderer.prototype.link.call(this, href, title, text);
  return link.replace('<a', '<a target="_blank" rel="noopener noreferrer" ');
};

// marked.js 옵션 설정
marked.setOptions({
  renderer: renderer,
  gfm: true, // GitHub Flavored Markdown 사용
  breaks: true, // 엔터(개행)를 <br> 태그로 변환
  sanitize: false // DOMPurify를 사용할 것이므로 자체 sanitize 기능은 끔
});
// --- ✨ 설정 끝 ✨ ---

function ChatApp() {
  // 유틸리티 함수
  const getSeoulNow = () => new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
  const formatTime = (date) => {
    const d = new Date(date);
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 상태 관리
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [lastReload, setLastReload] = useState(new Date(0));
  const [isLoggedIn, setIsLoggedIn] = useState(hasStoredLogin); // 초기값을 저장된 로그인 상태로 설정
  
  const messagesEndRef = useRef(null);

  // 전역 함수로 로그인 상태 업데이트
  useEffect(() => {
    window.updateLoginStatus = (status) => {
      console.log('React 컴포넌트 로그인 상태 업데이트:', status);
      setIsLoggedIn(status);
    };
    
    return () => {
      window.updateLoginStatus = null;
    };
  }, []);

  // 로그인 상태 체크 (더 자주 확인)
  useEffect(() => {
    const checkLoginStatus = () => {
      const currentLoginState = !!storage.sub;
      if (currentLoginState !== isLoggedIn) {
        console.log('로그인 상태 변경 감지:', currentLoginState);
        setIsLoggedIn(currentLoginState);
      }
    };

    // 초기 체크
    checkLoginStatus();
    
    // 주기적 체크
    const interval = setInterval(checkLoginStatus, 1000);
    return () => clearInterval(interval);
  }, [isLoggedIn]);

  // 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1초마다 새로고침
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isSending && getSeoulNow() - lastReload > 1000) {
        fetchMessages();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastReload, isSending]);

  // 초기 메시지 로드
  useEffect(() => {
    fetchMessages();
  }, []);

  // 메시지 가져오기
  const fetchMessages = async () => {
    if (aborts.size !== 0) return;
    
    const ctrl = new AbortController();
    const signal = ctrl.signal;
    aborts.add(ctrl);

    try {
      const response = await fetch(CHAT_URL, {
        signal,
        method: "GET",
        redirect: "follow"
      });
      
      const data = await response.text();
      const parsedMessages = JSON.parse(data).map((e) => ({
        id: e[0],
        sub: e[1], 
        name: e[2],
        content: e[3],
        timestamp: e[0]
      }));

      setMessages(parsedMessages);
      setIsLoading(false);
      setLastReload(getSeoulNow());
    } catch (error) {
      if (!signal.aborted) {
        console.error('메시지 로드 오류:', error);
      }
    } finally {
      aborts.delete(ctrl);
    }
  };

  // 메시지 전송
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    if (!storage.sub) {
      setError("구글 계정으로 로그인해주세요.");
      return;
    }

    setError("");
    setIsSending(true);

    const data = {
      contents: newMessage.trim(),
      sub: storage.sub,
      name: storage.name,
      authdate: storage.authdate,
      auth: storage.auth
    };

    // 낙관적 업데이트
    const tempMessage = {
      id: Date.now(),
      sub: storage.sub,
      name: storage.name,
      content: newMessage.trim(),
      timestamp: Date.now(),
      isTemp: true
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage("");

    // 메시지 전송 중단
    for (const controller of aborts) {
      controller.abort();
    }

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();
      
      if (result.startsWith("fail")) {
        const msg = result.substring(6).split("\n");
        setError(msg[0]);
        
        // 임시 메시지 제거
        setMessages(prev => prev.filter(m => !m.isTemp));
        
        if (msg.length >= 2) {
          const serverMessages = JSON.parse(msg[1]).map((e) => ({
            id: e[0],
            sub: e[1],
            name: e[2], 
            content: e[3],
            timestamp: e[0]
          }));
          setMessages(serverMessages);
        }
      } else {
        const serverMessages = JSON.parse(result).map((e) => ({
          id: e[0],
          sub: e[1],
          name: e[2],
          content: e[3], 
          timestamp: e[0]
        }));
        setMessages(serverMessages);
      }
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      setError("메시지 전송에 실패했어요.");
      // 임시 메시지 제거
      setMessages(prev => prev.filter(m => !m.isTemp));
    } finally {
      setIsSending(false);
    }
  };

  // 메시지 삭제
  const deleteMessage = async (messageId) => {
    if (!storage.sub) return;

    const data = {
      studentId: "DELETE",
      key: messageId,
      sub: storage.sub,
      authdate: storage.authdate,
      auth: storage.auth
    };

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain;charset=utf-8",
        },
        body: JSON.stringify(data),
      });

      const result = await response.text();

      if (result.startsWith("fail")) {
        const msg = result.substring(6).split("\n");
        setError(msg[0]);
        if (msg.length >= 2) {
          const serverMessages = JSON.parse(msg[1]).map((e) => ({
            id: e[0],
            sub: e[1],
            name: e[2],
            content: e[3],
            timestamp: e[0]
          }));
          setMessages(serverMessages);
        }
      } else {
        const serverMessages = JSON.parse(result).map((e) => ({
          id: e[0],
          sub: e[1],
          name: e[2],
          content: e[3],
          timestamp: e[0]
        }));
        setMessages(serverMessages);
      }
    } catch (error) {
      console.error('메시지 삭제 오류:', error);
      setError("메시지 삭제에 실패했어요.");
    }
  };

  // 렌더링
  return (
    <div className="chat-container flex flex-col">
      {/* 로그인 안내 */}
      {!isLoggedIn && (
        <div className="mx-3 sm:mx-4 mt-3 sm:mt-4 mb-2 px-3 sm:px-4 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-blue-600 dark:text-blue-400 text-xs sm:text-sm text-center">
          구글로 로그인해 채팅을 시작하세요.
        </div>
      )}

      {/* 채팅 메시지 영역 */}
      <div className="chat-messages flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-gray-400 text-sm">메시지를 불러오는 중...</div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <div className="text-3xl sm:text-4xl mb-3">💬</div>
            <div className="text-xs sm:text-sm text-center px-4">
              {isLoggedIn ? "첫 메시지를 보내보세요" : "로그인 후 채팅을 시작할 수 있습니다"}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => {
              const showAvatar = index === 0 || messages[index - 1]?.sub !== message.sub;
              const showTime = index === messages.length - 1 || 
                messages[index + 1]?.sub !== message.sub ||
                (new Date(messages[index + 1]?.timestamp) - new Date(message.timestamp)) > 60000;
              
              return (
                <div key={message.id}>
                  <div className={`flex gap-2 ${message.sub === storage.sub ? 'flex-row-reverse' : 'flex-row'} ${message.isTemp ? 'opacity-60' : ''}`}>
                    {/* 아바타 */}
                    <div className={`flex-shrink-0 ${showAvatar ? '' : 'invisible'}`}>
                      {message.sub !== storage.sub && (
                        <div className="user-avatar">
                          {message.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    
                    {/* 메시지 */}
                    <div className={`flex flex-col flex-message ${message.sub === storage.sub ? 'items-end' : 'items-start'}`}>
                      {showAvatar && message.sub !== storage.sub && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">
                          {message.name}
                        </div>
                      )}
                      
                      <div className="group relative">
                        {message.sub === -1 ? (
                          <div className="text-xs text-gray-400 italic px-3 py-2">
                            메시지가 삭제되었어요.
                          </div>
                        ) : (
                          <div className={`${message.sub === storage.sub ? 'chat-bubble-right' : 'chat-bubble-left'}`}>
                            {/* --- ✨ 마크다운 렌더링으로 변경된 부분 ✨ --- */}
                            <div
                              className="text-sm leading-relaxed break-words"
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(marked.parse(message.content || ''))
                              }}
                            />
                            {/* --- ✨ 변경 끝 ✨ --- */}
                          </div>
                        )}
                        
                        {/* 삭제 버튼 */}
                        {message.sub === storage.sub && message.sub !== -1 && (
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="absolute -top-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-red-500 hover:text-red-600 px-2 py-1 rounded bg-white dark:bg-gray-800 shadow-sm"
                          >
                            삭제
                          </button>
                        )}
                      </div>
                      
                      {showTime && (
                        <div className={`text-xs text-gray-400 mt-1 ${message.sub === storage.sub ? 'mr-1' : 'ml-1'}`}>
                          {formatTime(message.timestamp)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div className="mx-3 sm:mx-4 mb-3 px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* 메시지 입력 영역 */}
      <div className="px-3 sm:px-4 py-3 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <form onSubmit={sendMessage} className="flex items-center gap-2 sm:gap-3">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isLoggedIn ? "메시지를 입력하세요..." : "로그인 후 메시지를 보낼 수 있어요."}
            className="message-input"
            disabled={isSending || !isLoggedIn}
            maxLength="500"
          />
          <button
            type="submit"
            className="send-button"
            disabled={isSending || !newMessage.trim() || !isLoggedIn}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}

// React 앱 렌더링
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ChatApp />);